import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Phone, Mail, Facebook, Instagram } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-teal-900/80 backdrop-blur-l fixed w-full z-9">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-white text-xl font-bold">Phuket Plus</span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link to="/services" className="text-white hover:text-teal-200">
              Наши Услуги
            </Link>
            <Link to="/about" className="text-white hover:text-teal-200">
              О нас
            </Link>
            <Link to="/blog" className="text-white hover:text-teal-200">
              Блог
            </Link>
            <Link to="/contacts" className="text-white hover:text-teal-200">
              Контакты
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <a href="tel:+66123456789" className="text-white hover:text-teal-200">
              <Phone className="h-5 w-5" />
            </a>
            <a href="mailto:info@phuketplus.com" className="text-white hover:text-teal-200">
              <Mail className="h-5 w-5" />
            </a>
            <a href="#" className="text-white hover:text-teal-200">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-white hover:text-teal-200">
              <Instagram className="h-5 w-5" />
            </a>
          </div>

          <button className="md:hidden text-white">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
};