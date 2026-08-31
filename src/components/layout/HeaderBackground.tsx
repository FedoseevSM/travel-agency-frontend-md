import React from 'react';

interface HeaderBackgroundProps {
  height?: string;
}

export const HeaderBackground: React.FC<HeaderBackgroundProps> = ({ height = '20vh' }) => {
  return (
    <div className="absolute top-0 left-0 right-0" style={{ height }}>
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&q=80"
          alt="Phuket"
          className="w-full h-full object-cover object-bottom"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-ocean-darkest/40 to-ocean-darker/60" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-ocean-darkest to-transparent" />
      </div>
    </div>
  );
};