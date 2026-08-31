/*
  # Create services table

  1. New Tables
    - `services`
      - `id` (text, primary key)
      - `title` (text)
      - `description` (text)
      - `imageUrl` (text)
      - `categories` (json)
      - `location` (text)
      - `city` (text)
      - `duration.days` (bigint)
      - `duration.nights` (bigint)
      - `price.adult` (bigint)
      - `price.child` (bigint)
      - `price.amount` (bigint)
      - `price.currency` (text)
      - `included` (json)
      - `notIncluded` (json)
      - `requirements` (json)
      - `itinerary` (json)

  2. Security
    - Enable RLS on `services` table
    - Add policy for public read access
*/

CREATE TABLE IF NOT EXISTS services (
  "id" text PRIMARY KEY,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "imageUrl" text NOT NULL,
  "categories" json NOT NULL,
  "location" text NOT NULL,
  "city" text NOT NULL,
  "duration.days" bigint NOT NULL,
  "duration.nights" bigint NOT NULL,
  "price.adult" bigint NOT NULL,
  "price.child" bigint NOT NULL,
  "price.amount" bigint NOT NULL,
  "price.currency" text NOT NULL,
  "included" json NOT NULL,
  "notIncluded" json NOT NULL,
  "requirements" json NOT NULL,
  "itinerary" json NOT NULL
);

-- Enable Row Level Security
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access"
  ON services
  FOR SELECT
  TO public
  USING (true);