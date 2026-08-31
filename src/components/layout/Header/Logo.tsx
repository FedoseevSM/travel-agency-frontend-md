import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '~/assets/logo.png';

export const Logo = () => (
  <Link to="/" className="flex items-center space-x-2">
    <img src={logoImage} alt="Thai Guru" className="h-12 w-auto" />
  </Link>
);