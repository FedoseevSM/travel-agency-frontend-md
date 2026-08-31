import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Navigation = () => {
  const { t } = useTranslation();

  const navItems = [
    { path: '/services', label: t('header.services') },
    { path: '/about', label: t('header.about') },
    { path: '/blog', label: t('header.blog') },
    { path: '/contacts', label: t('header.contacts') }
  ];

  return (
    <nav className="hidden lg:flex items-center ml-auto">
      <ul className="flex items-center space-x-2 xl:space-x-8">
        {navItems.map(item => (
          <li key={item.path}>
            <Link
              to={item.path}
              className="px-3 py-2 text-ocean-light hover:text-ocean-lightest transition-colors font-medium whitespace-nowrap"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};