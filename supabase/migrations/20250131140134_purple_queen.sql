/*
  # Create contacts table

  1. New Tables
    - `contacts`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `message` (text)
      - `service_title` (text)
      - `date` (date)
      - `adults` (integer)
      - `children` (integer)
      - `total_price` (numeric)
      - `currency` (text)
      - `created_at` (timestamptz)
  2. Security
    - Enable RLS on `contacts` table
    - Add policy for authenticated users to read their own data
*/

CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text,
  service_title text,
  date date,
  adults integer,
  children integer,
  total_price numeric,
  currency text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert access"
  ON contacts
  FOR INSERT
  TO public
  WITH CHECK (true);