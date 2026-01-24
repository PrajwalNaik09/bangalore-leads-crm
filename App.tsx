import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { LeadCard } from './components/LeadCard';
import { Lead, LeadStatus, PropertyType } from './types';

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1X-i11_6zvQfmfurcq45nnzH1rVhqNUAhVJnQtenuWKk/export?format=csv';

// Helper to parse a single CSV line handling quotes
const parseCSVLine = (line: string): string[] => {
  const values: string[] = [];
  let current = '';
  let inQuote = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuote && line[i + 1] === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuote = !inQuote;
      }
    } else if (char === ',' && !inQuote) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values;
};

// Helper to normalize status from raw text
const normalizeStatus = (status: string): LeadStatus => {
  const s = status.toLowerCase();
  if (s.includes('close')) return 'Closed';
  if (s.includes('contact')) return 'Contacted';
  if (s.includes('follow')) return 'Follow Up';
  return 'New Lead';
};

// Helper to normalize property type from raw text
const normalizePropertyType = (type: string): PropertyType => {
  const t = type.toLowerCase();
  if (t.includes('comm')) return 'Commercial';
  if (t.includes('land') || t.includes('plot')) return 'Land';
  return 'Residential';
};

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'All Leads' | 'New' | 'Called' | 'Contacted' | 'Not Received' | 'Closed'>('All Leads');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const response = await fetch(SHEET_URL);
        if (!response.ok) throw new Error('Failed to fetch data');

        const text = await response.text();
        const lines = text.split('\n').filter(line => line.trim() !== '');

        if (lines.length === 0) {
          setLeads([]);
          return;
        }

        // Parse headers
        const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase());

        // Map header names to column indices
        const getIndex = (keywords: string[]) => headers.findIndex(h => keywords.some(k => h.includes(k)));

        const idxName = getIndex(['name', 'lead', 'client']);
        const idxPhone = getIndex(['phone', 'mobile', 'contact']);
        const idxLocation = getIndex(['location', 'area', 'locality']);
        const idxCity = getIndex(['city']);
        const idxStatus = getIndex(['status', 'stage']);
        const idxType = getIndex(['type', 'property']);
        const idxCategory = getIndex(['category', 'business', 'industry']);
        const idxWeb = getIndex(['website', 'web']);
        const idxLink = getIndex(['linkedin', 'url', 'social']);

        const parsedLeads: Lead[] = lines.slice(1).map((line, index) => {
          const row = parseCSVLine(line);

          // Safe access helper
          const getVal = (idx: number) => (idx >= 0 && idx < row.length ? row[idx] : '');

          // Get category from sheet or use 'Other' as default
          const rawCategory = getVal(idxCategory).trim();
          const category = rawCategory || 'Other';

          return {
            id: `lead-${index}`,
            name: getVal(idxName) || 'Unknown Lead',
            phone: getVal(idxPhone) || 'No Phone',
            location: getVal(idxLocation) || 'Unknown Location',
            city: getVal(idxCity) || 'Bangalore, Karnataka',
            status: normalizeStatus(getVal(idxStatus)),
            propertyType: normalizePropertyType(getVal(idxType)),
            category: category,
            website: getVal(idxWeb),
            linkedin: getVal(idxLink),
          };
        });

        setLeads(parsedLeads);
      } catch (err) {
        console.error('Error fetching leads:', err);
        setError('Failed to load leads from the spreadsheet.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const handleUpdateStatus = (id: string, status: LeadStatus) => {
    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === id ? { ...lead, status } : lead
      )
    );
  };

  // Get unique categories from the data
  const availableCategories = useMemo(() => {
    const categories = [...new Set(leads.map(lead => lead.category))];
    return categories.sort();
  }, [leads]);

  // Filter leads by status, search, and category
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Category Filter
      if (categoryFilter !== 'All' && lead.category !== categoryFilter) return false;

      // Status Filter
      if (filter === 'New' && lead.status !== 'New Lead') return false;
      if (filter === 'Called' && lead.status !== 'Called') return false;
      if (filter === 'Contacted' && lead.status !== 'Follow Up' && lead.status !== 'Contacted') return false;
      if (filter === 'Not Received' && lead.status !== 'Not Received') return false;
      if (filter === 'Closed' && lead.status !== 'Closed') return false;

      // Search Filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          lead.name.toLowerCase().includes(query) ||
          lead.location.toLowerCase().includes(query) ||
          lead.city.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [filter, searchQuery, leads, categoryFilter]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalLeads={leads.length}
        filteredLeads={filteredLeads.length}
      />

      <main className="flex-1 overflow-y-auto w-full relative">
        <div className="layout-container flex flex-col h-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
          <FilterBar
            currentFilter={filter}
            setFilter={setFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            availableCategories={availableCategories}
          />

          <div className="flex flex-col gap-4">
            {loading ? (
              // Skeleton Loading State
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col md:flex-row gap-4 p-5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="flex-1 flex flex-col gap-3">
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mt-2"></div>
                  </div>
                  <div className="w-full md:w-64 flex flex-col gap-2 justify-center">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                  </div>
                </div>
              ))
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-red-500 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/30">
                <span className="material-symbols-outlined text-4xl mb-2">error</span>
                <p className="font-medium">{error}</p>
              </div>
            ) : filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} onUpdateStatus={handleUpdateStatus} />
              ))
            ) : (
              <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                <p>No leads found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="flex items-center justify-center size-14 rounded-full bg-white text-primary shadow-lg hover:shadow-xl hover:bg-primary hover:text-white transition-all transform hover:scale-105 border border-primary/20">
          <span className="material-symbols-outlined text-[32px]">add</span>
        </button>
      </div>
    </div>
  );
};

export default App;
