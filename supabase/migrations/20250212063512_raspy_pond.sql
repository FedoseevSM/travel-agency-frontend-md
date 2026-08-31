/*
  # Car Rental Tables

  1. New Tables
    - `car_categories`
      - `id` (text, primary key) - Идентификатор категории
      - `name` (text) - Название категории
      - `description` (text) - Описание категории
      - `created_at` (timestamptz) - Дата создания
      - `updated_at` (timestamptz) - Дата обновления

    - `cars`
      - `id` (text, primary key) - Идентификатор автомобиля
      - `category_id` (text, foreign key) - Ссылка на категорию
      - `brand` (text) - Марка автомобиля
      - `year` (integer) - Год выпуска
      - `seats` (integer) - Количество мест
      - `features` (text[]) - Особенности и характеристики
      - `pricing` (jsonb) - Структура цен (день/неделя/месяц)
      - `gallery` (text[]) - Массив URL изображений
      - `active` (boolean) - Статус активности
      - `created_at` (timestamptz) - Дата создания
      - `updated_at` (timestamptz) - Дата обновления

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
*/

-- Create car_categories table
CREATE TABLE IF NOT EXISTS car_categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create cars table
CREATE TABLE IF NOT EXISTS cars (
  id text PRIMARY KEY,
  category_id text REFERENCES car_categories(id),
  brand text NOT NULL,
  year integer NOT NULL,
  seats integer NOT NULL,
  features text[] NOT NULL DEFAULT '{}',
  pricing jsonb NOT NULL,
  gallery text[] NOT NULL DEFAULT '{}',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE car_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on car_categories"
  ON car_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access on cars"
  ON cars
  FOR SELECT
  TO public
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cars_category_id ON cars(category_id);
CREATE INDEX IF NOT EXISTS idx_cars_active ON cars(active);

-- Insert initial data
INSERT INTO car_categories (id, name, description) VALUES
('economy', 'Эконом класс', 'Компактные и экономичные автомобили для городских поездок'),
('comfort', 'Комфорт класс', 'Просторные седаны с расширенным набором опций'),
('premium', 'Премиум класс', 'Автомобили премиум-класса с максимальным уровнем комфорта');

-- Insert sample cars
INSERT INTO cars (id, category_id, brand, year, seats, features, pricing, gallery) VALUES
('toyota-yaris', 'economy', 'Toyota Yaris', 2023, 5, 
  ARRAY['Кондиционер', 'ABS', 'Подушки безопасности', 'Bluetooth'],
  '{"day": 1200, "week": 1000, "month": 900}',
  ARRAY[
    'https://images.unsplash.com/photo-1675703236989-f4d9ed354e56?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80'
  ]
),
('honda-jazz', 'economy', 'Honda Jazz', 2022, 5,
  ARRAY['Кондиционер', 'ABS', 'Подушки безопасности', 'USB'],
  '{"day": 1300, "week": 1100, "month": 1000}',
  ARRAY[
    'https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80'
  ]
),
('toyota-camry', 'comfort', 'Toyota Camry', 2023, 5,
  ARRAY['Кожаный салон', 'Климат-контроль', 'Камера заднего вида', 'Круиз-контроль'],
  '{"day": 2500, "week": 2200, "month": 2000}',
  ARRAY[
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?auto=format&fit=crop&q=80'
  ]
),
('bmw-5', 'premium', 'BMW 5 Series', 2023, 5,
  ARRAY['Премиум аудио', 'Панорамная крыша', 'Массаж сидений', 'Полный автопилот'],
  '{"day": 5000, "week": 4500, "month": 4000}',
  ARRAY[
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?auto=format&fit=crop&q=80'
  ]
);