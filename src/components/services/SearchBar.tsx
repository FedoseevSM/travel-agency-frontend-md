import React, { useCallback } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-ocean-light" />
      </div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Поиск экскурсий..."
        className="block w-full pl-10 pr-4 py-3 bg-white/10 border border-ocean-deep/20 rounded-lg 
                 text-white placeholder-ocean-light/70
                 focus:outline-none focus:ring-2 focus:ring-ocean-deep focus:border-transparent
                 transition-colors text-lg"
      />
    </div>
  );
};