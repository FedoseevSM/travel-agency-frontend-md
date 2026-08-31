import React from 'react';

export type ServiceTab = 'excursions' | 'transfer' | 'rent' | 'yacht';

interface CategoryTabsProps {
  activeTab: ServiceTab;
  onTabChange: (tab: ServiceTab) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: ServiceTab; label: string }[] = [
    { id: 'excursions', label: 'Экскурсии' },
    { id: 'transfer', label: 'Трансфер' },
    { id: 'rent', label: 'Аренда' },
    { id: 'yacht', label: 'Яхты' },
  ];

  return (
    <div className="mb-8">
      <div className="border-b border-ocean-deep/20">
        <nav className="-mb-px flex space-x-8" aria-label="Категории">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-ocean-deep text-white'
                  : 'border-transparent text-ocean-light hover:text-ocean-lighter hover:border-ocean-deep/50'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};