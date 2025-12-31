-- Social Scheduler Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom enum types
CREATE TYPE platform AS ENUM ('twitter', 'facebook', 'instagram', 'linkedin');
CREATE TYPE post_status AS ENUM ('pending', 'published', 'failed');
CREATE TYPE connection_status AS ENUM ('active', 'reconnect_needed', 'inactive');

-- Social Connections Table
CREATE TABLE IF NOT EXISTS social_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    platform platform NOT NULL,
    encrypted_access_token TEXT NOT NULL,
    platform_username TEXT,
    platform_user_id TEXT,
    status connection_status DEFAULT 'active',
    last_synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    UNIQUE(user_id, platform)
);

-- Scheduled Posts Table
CREATE TABLE IF NOT EXISTS scheduled_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    media_urls TEXT[] DEFAULT '{}',
    scheduled_at TIMESTAMPTZ NOT NULL,
    platform platform NOT NULL,
    status post_status DEFAULT 'pending',
    published_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- Create indexes for better query performance
CREATE INDEX idx_social_connections_user_id ON social_connections(user_id);
CREATE INDEX idx_social_connections_platform ON social_connections(platform);
CREATE INDEX idx_social_connections_status ON social_connections(status);

CREATE INDEX idx_scheduled_posts_user_id ON scheduled_posts(user_id);
CREATE INDEX idx_scheduled_posts_scheduled_at ON scheduled_posts(scheduled_at);
CREATE INDEX idx_scheduled_posts_status ON scheduled_posts(status);
CREATE INDEX idx_scheduled_posts_platform ON scheduled_posts(platform);

-- Enable Row Level Security
ALTER TABLE social_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for social_connections
-- Users can only see their own connections
CREATE POLICY "Users can view their own connections"
    ON social_connections
    FOR SELECT
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Users can insert their own connections
CREATE POLICY "Users can insert their own connections"
    ON social_connections
    FOR INSERT
    WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Users can update their own connections
CREATE POLICY "Users can update their own connections"
    ON social_connections
    FOR UPDATE
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Users can delete their own connections
CREATE POLICY "Users can delete their own connections"
    ON social_connections
    FOR DELETE
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- RLS Policies for scheduled_posts
-- Users can only see their own posts
CREATE POLICY "Users can view their own posts"
    ON scheduled_posts
    FOR SELECT
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Users can insert their own posts
CREATE POLICY "Users can insert their own posts"
    ON scheduled_posts
    FOR INSERT
    WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Users can update their own posts
CREATE POLICY "Users can update their own posts"
    ON scheduled_posts
    FOR UPDATE
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Users can delete their own posts
CREATE POLICY "Users can delete their own posts"
    ON scheduled_posts
    FOR DELETE
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_social_connections_updated_at
    BEFORE UPDATE ON social_connections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scheduled_posts_updated_at
    BEFORE UPDATE ON scheduled_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (adjust based on your setup)
-- These may not be needed depending on your Supabase configuration
-- GRANT ALL ON social_connections TO authenticated;
-- GRANT ALL ON scheduled_posts TO authenticated;
