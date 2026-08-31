/*
  # Add Related Services Support

  1. Changes
    - Add related_services column to services table to store arrays of related service IDs
    - Update existing services to have empty related_services arrays

  2. Notes
    - Using JSONB array to store related service IDs
    - Adding with a default empty array
*/

ALTER TABLE services
ADD COLUMN IF NOT EXISTS related_services text[] DEFAULT '{}';

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_services_related_services ON services USING GIN (related_services);