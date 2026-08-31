/*
  # Add contact fields to contacts table

  1. New Fields
    - `contact_method` (text) - Preferred contact method (telegram/whatsapp)
    - `service` (text) - Service of interest
    - `location` (text) - Hotel/beach location
    - `status` (text) - Already in Phuket or planning to come
*/

ALTER TABLE contacts 
ADD COLUMN IF NOT EXISTS contact_method text,
ADD COLUMN IF NOT EXISTS service text,
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS status text;