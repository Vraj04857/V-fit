-- V-Fit Database Initialization Script
-- This script creates extensions and sets up initial schema

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create schemas for modular organization (optional, but good practice)
CREATE SCHEMA IF NOT EXISTS vfit;

-- Set default schema
SET search_path TO vfit, public;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE vfit_db TO vfit_user;
GRANT ALL PRIVILEGES ON SCHEMA vfit TO vfit_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA vfit TO vfit_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA vfit TO vfit_user;

-- Log initialization
DO $$
BEGIN
    RAISE NOTICE 'V-Fit Database initialized successfully!';
END $$;