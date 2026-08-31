import React, { useState } from 'react';
import { Logo } from './Logo';
import { Navigation } from './Navigation';
import { SocialLinks } from './SocialLinks';
import { RequestButton } from './RequestButton';
import { MobileMenuButton } from './MobileMenuButton';
import { MobileMenuOverlay } from './MobileMenuOverlay';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed w-full z-40 bg-gradient-to-b from-black/80 via-ocean-darkest/75 to-transparent backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-8">
            <Logo />
            <Navigation />
          </div>
          <div className="hidden md:flex items-center gap-8">
            <LanguageSwitcher />
            <SocialLinks />
            <RequestButton />
          </div>
          <MobileMenuButton onClick={() => setIsMobileMenuOpen(true)} />
        </div>
      </div>
      
      <MobileMenuOverlay 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </header>
  );
};