-- ============================================================================
-- TelecomAtlas: Self-Hosted Worldwide Phone Number Intelligence Platform
-- Reference PostgreSQL 16+ & PostGIS 3.4+ Schema Definition
-- Zero-Cost Open Data Architecture (ITU-T E.164, NANPA, Ofcom, BNetzA, GeoNames)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 1. Continents Lookup Table
CREATE TABLE IF NOT EXISTS continents (
    code        CHAR(2) PRIMARY KEY,              -- AF, AS, EU, NA, OC, SA
    name        VARCHAR(64) NOT NULL UNIQUE,
    itu_zone    VARCHAR(32) NOT NULL
);

-- 2. Countries Lookup Table (ISO 3166-1 alpha-2 + ITU-T E.164 Calling Codes)
CREATE TABLE IF NOT EXISTS countries (
    iso2                CHAR(2) PRIMARY KEY,      -- e.g., 'US', 'GB', 'DE', 'JP'
    iso3                CHAR(3) NOT NULL UNIQUE,  -- e.g., 'USA', 'GBR', 'DEU', 'JPN'
    continent_code      CHAR(2) NOT NULL REFERENCES continents(code) ON DELETE RESTRICT,
    name                VARCHAR(128) NOT NULL,
    calling_code        VARCHAR(8) NOT NULL,      -- ITU-T E.164 country code (digits only, e.g., '1', '44')
    nsn_min_length      SMALLINT NOT NULL,        -- National Significant Number min length
    nsn_max_length      SMALLINT NOT NULL,        -- National Significant Number max length
    regulatory_authority VARCHAR(128) NOT NULL,   -- e.g., 'NANPA / FCC', 'Ofcom', 'BNetzA'
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_countries_continent ON countries(continent_code);
CREATE INDEX IF NOT EXISTS idx_countries_calling_code ON countries(calling_code);

-- 3. Regions / States / Provinces Table
CREATE TABLE IF NOT EXISTS regions (
    id              SERIAL PRIMARY KEY,
    country_iso2    CHAR(2) NOT NULL REFERENCES countries(iso2) ON DELETE CASCADE,
    code            VARCHAR(16) NOT NULL,         -- ISO 3166-2 subdivision code (e.g., 'CA', 'NY', 'ENG')
    name            VARCHAR(128) NOT NULL,        -- e.g., 'California', 'New York', 'England'
    timezone        VARCHAR(64) NOT NULL,
    UNIQUE (country_iso2, code)
);

CREATE INDEX IF NOT EXISTS idx_regions_country ON regions(country_iso2);
CREATE INDEX IF NOT EXISTS idx_regions_name_trgm ON regions USING GIN (name gin_trgm_ops);

-- 4. Postal / Zip Codes Table with PostGIS Open Geographic Boundaries
CREATE TABLE IF NOT EXISTS zip_codes (
    id              BIGSERIAL PRIMARY KEY,
    country_iso2    CHAR(2) NOT NULL REFERENCES countries(iso2) ON DELETE CASCADE,
    region_id       INTEGER NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
    postal_code     VARCHAR(20) NOT NULL,         -- Exact Zip / Postal code (e.g., '90210', 'SW1A 1AA')
    city            VARCHAR(128) NOT NULL,        -- Primary locality / rate center city
    latitude         NUMERIC(9, 6) NOT NULL,
    longitude       NUMERIC(9, 6) NOT NULL,
    centroid        GEOGRAPHY(POINT, 4326) GENERATED ALWAYS AS (
                        ST_SetSRID(ST_MakePoint(longitude::DOUBLE PRECISION, latitude::DOUBLE PRECISION), 4326)::GEOGRAPHY
                    ) STORED,
    boundary_geom   GEOGRAPHY(MULTIPOLYGON, 4326), -- Open census ZCTA / Natural Earth / GeoNames boundary
    UNIQUE (country_iso2, postal_code)
);

CREATE INDEX IF NOT EXISTS idx_zip_codes_postal_exact ON zip_codes(postal_code);
CREATE INDEX IF NOT EXISTS idx_zip_codes_region ON zip_codes(region_id);
CREATE INDEX IF NOT EXISTS idx_zip_codes_country_postal ON zip_codes(country_iso2, postal_code);
CREATE INDEX IF NOT EXISTS idx_zip_codes_centroid_gist ON zip_codes USING GIST (centroid);
CREATE INDEX IF NOT EXISTS idx_zip_codes_boundary_gist ON zip_codes USING GIST (boundary_geom);

-- 5. Deterministic Prefix-to-Carrier Allocation Registry
CREATE TYPE line_classification AS ENUM ('MOBILE', 'LANDLINE', 'VOIP', 'TOLL_FREE');

CREATE TABLE IF NOT EXISTS prefix_carriers (
    id                  BIGSERIAL PRIMARY KEY,
    full_prefix         VARCHAR(15) NOT NULL UNIQUE, -- Digits-only CC + NDC + Block (e.g., '1310271', '447700')
    country_iso2        CHAR(2) NOT NULL REFERENCES countries(iso2) ON DELETE CASCADE,
    calling_code        VARCHAR(8) NOT NULL,
    ndc_prefix          VARCHAR(12) NOT NULL,        -- National Destination Code / NPA-NXX
    carrier_name        VARCHAR(128) NOT NULL,       -- e.g., 'AT&T Mobility', 'Verizon Wireless', 'Vodafone UK'
    carrier_group       VARCHAR(64) NOT NULL,        -- Normalized operator brand (e.g., 'AT&T', 'Verizon', 'Vodafone')
    ocn_code            VARCHAR(24),                 -- Operating Company Number / MNC-MCC / Regulatory ID
    line_type           line_classification NOT NULL,
    default_region_id   INTEGER REFERENCES regions(id) ON DELETE SET NULL,
    default_zip_id      BIGINT REFERENCES zip_codes(id) ON DELETE SET NULL,
    allocation_source   VARCHAR(128) NOT NULL,       -- e.g., 'NANPA CO Code Assignment', 'Ofcom Numbering Data'
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- B-Tree text_pattern_ops enables ultra-fast Longest-Prefix Match (LPM) queries:
-- SELECT * FROM prefix_carriers WHERE '13102714000' LIKE full_prefix || '%' ORDER BY length(full_prefix) DESC LIMIT 1;
CREATE INDEX IF NOT EXISTS idx_prefix_carriers_lpm ON prefix_carriers (full_prefix varchar_pattern_ops);
CREATE INDEX IF NOT EXISTS idx_prefix_carriers_carrier_group ON prefix_carriers (carrier_group);
CREATE INDEX IF NOT EXISTS idx_prefix_carriers_country_type ON prefix_carriers (country_iso2, line_type);

-- 6. Validated E.164 Phone Numbers & Individual Owner Directory Table
CREATE TABLE IF NOT EXISTS phone_numbers (
    id                  BIGSERIAL PRIMARY KEY,
    e164                VARCHAR(16) NOT NULL UNIQUE, -- Canonical E.164 format (e.g., '+13102714820')
    national_format     VARCHAR(32) NOT NULL,        -- Formatted national number (e.g., '(310) 271-4820')
    international_fmt   VARCHAR(32) NOT NULL,        -- Formatted international (e.g., '+1 310-271-4820')
    owner_name          VARCHAR(160) NOT NULL,       -- Individual subscriber / registered owner full name
    owner_title         VARCHAR(128),                -- Optional credential or role
    street_address      VARCHAR(255),                -- Public directory street address when available
    is_live_web_verified BOOLEAN NOT NULL DEFAULT FALSE,
    continent_code      CHAR(2) NOT NULL REFERENCES continents(code),
    country_iso2        CHAR(2) NOT NULL REFERENCES countries(iso2),
    region_id           INTEGER REFERENCES regions(id),
    zip_code_id         BIGINT REFERENCES zip_codes(id),
    prefix_carrier_id   BIGINT NOT NULL REFERENCES prefix_carriers(id),
    carrier_name        VARCHAR(128) NOT NULL,       -- Denormalized for zero-join high-density filtering
    carrier_group       VARCHAR(64) NOT NULL,
    line_type           line_classification NOT NULL,
    ndc_code            VARCHAR(12) NOT NULL,
    is_valid_e164       BOOLEAN NOT NULL DEFAULT TRUE,
    registry_source     VARCHAR(128) NOT NULL,
    indexed_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Composite & GIN Trigram indexes for instant owner name & multi-parameter filtering
CREATE INDEX IF NOT EXISTS idx_phone_owner_name_trgm
    ON phone_numbers USING GIN (owner_name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_phone_hierarchy
    ON phone_numbers (continent_code, country_iso2, region_id, zip_code_id);

CREATE INDEX IF NOT EXISTS idx_phone_country_region_carrier
    ON phone_numbers (country_iso2, region_id, carrier_group, line_type);

CREATE INDEX IF NOT EXISTS idx_phone_zip_carrier
    ON phone_numbers (zip_code_id, carrier_group);

CREATE INDEX IF NOT EXISTS idx_phone_e164_pattern
    ON phone_numbers (e164 varchar_pattern_ops);
