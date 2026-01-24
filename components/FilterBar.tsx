import React, { useState, useRef, useEffect } from 'react';

type FilterType = 'All Leads' | 'New' | 'Called' | 'Contacted' | 'Not Received' | 'Closed';

interface FilterBarProps {
  currentFilter: FilterType;
  setFilter: (filter: FilterType) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  availableCategories: string[];
  onRefresh?: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  currentFilter,
  setFilter,
  categoryFilter,
  setCategoryFilter,
  availableCategories,
  onRefresh
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filters: { type: FilterType; icon: string; activeClass: string; inactiveClass: string; iconClass: string; filled?: boolean }[] = [
    {
      type: 'All Leads',
      icon: 'filter_list',
      activeClass: 'bg-slate-800 text-white',
      inactiveClass: 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200',
      iconClass: '',
    },
    {
      type: 'New',
      icon: 'star',
      activeClass: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 border border-green-200 dark:border-green-700',
      inactiveClass: 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200',
      iconClass: 'text-green-600',
      filled: true,
    },
    {
      type: 'Called',
      icon: 'call',
      activeClass: 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100 border border-amber-200 dark:border-amber-700',
      inactiveClass: 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200',
      iconClass: 'text-amber-600',
      filled: true,
    },
    {
      type: 'Contacted',
      icon: 'check_circle',
      activeClass: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 border border-blue-200 dark:border-blue-700',
      inactiveClass: 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200',
      iconClass: 'text-blue-500',
      filled: true,
    },
    {
      type: 'Not Received',
      icon: 'phone_missed',
      activeClass: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-100 border border-orange-200 dark:border-orange-700',
      inactiveClass: 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200',
      iconClass: 'text-orange-500',
      filled: true,
    },
    {
      type: 'Closed',
      icon: 'cancel',
      activeClass: 'bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-500',
      inactiveClass: 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200',
      iconClass: 'text-slate-400',
    },
  ];

  // Get icon for category
  const getCategoryIcon = (category: string): string => {
    const lower = category.toLowerCase();
    if (lower.includes('salon') || lower.includes('beauty')) return 'spa';
    if (lower.includes('dentist') || lower.includes('dental')) return 'dentistry';
    if (lower.includes('real estate') || lower.includes('realty')) return 'home_work';
    if (lower.includes('restaurant')) return 'restaurant';
    if (lower.includes('gym') || lower.includes('fitness')) return 'fitness_center';
    if (lower.includes('clinic') || lower.includes('hospital')) return 'local_hospital';
    return 'category';
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto scrollbar-hide">
        {filters.map((f) => (
          <button
            key={f.type}
            onClick={() => setFilter(f.type)}
            className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full pl-3 pr-4 transition-colors group ${currentFilter === f.type ? f.activeClass : f.inactiveClass
              }`}
          >
            <span className={`material-symbols-outlined text-[18px] ${f.iconClass} ${f.filled ? 'filled' : ''}`}>
              {f.icon}
            </span>
            <p className="text-sm font-medium">{f.type}</p>
          </button>
        ))}
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3 ml-auto sm:ml-0">
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 text-primary font-medium text-sm hover:underline"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          Refresh
        </button>
        <span className="text-slate-300 dark:text-slate-600">|</span>

        {/* Category Filter Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all ${categoryFilter !== 'All'
              ? 'bg-primary/10 text-primary border border-primary/30'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600'
              }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {categoryFilter === 'All' ? 'category' : getCategoryIcon(categoryFilter)}
            </span>
            {categoryFilter === 'All' ? 'All Categories' : categoryFilter}
            <span className={`material-symbols-outlined text-[16px] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Business Category</p>
              </div>

              {/* All Categories Option */}
              <button
                onClick={() => {
                  setCategoryFilter('All');
                  setIsDropdownOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${categoryFilter === 'All'
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${categoryFilter === 'All' ? 'text-primary' : 'text-slate-400'}`}>
                  apps
                </span>
                All Categories
                {categoryFilter === 'All' && (
                  <span className="material-symbols-outlined text-[18px] ml-auto text-primary">check</span>
                )}
              </button>

              {/* Dynamic Categories from Data */}
              {availableCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setCategoryFilter(category);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${categoryFilter === category
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                >
                  <span className={`material-symbols-outlined text-[20px] ${categoryFilter === category ? 'text-primary' : 'text-slate-400'}`}>
                    {getCategoryIcon(category)}
                  </span>
                  {category}
                  {categoryFilter === category && (
                    <span className="material-symbols-outlined text-[18px] ml-auto text-primary">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
