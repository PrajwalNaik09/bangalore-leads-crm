import React from 'react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalLeads: number;
  filteredLeads: number;
}

export const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery, totalLeads, filteredLeads }) => {
  return (
    <header className="flex items-center justify-between whitespace-nowrap bg-white dark:bg-slate-800 border-b border-solid border-slate-200 dark:border-slate-700 px-6 py-3 shadow-sm z-20 shrink-0">
      <div className="flex items-center gap-6 w-full max-w-7xl mx-auto">
        {/* Logo & Title */}
        <div className="flex items-center gap-3 text-slate-900 dark:text-white shrink-0 mr-4">
          <div className="flex items-center justify-center size-10 bg-primary/10 rounded-lg text-primary">
            <span className="material-symbols-outlined text-[28px]">apartment</span>
          </div>
          <h2 className="text-xl font-bold leading-tight tracking-tight hidden sm:block">Bangalore Leads</h2>
        </div>

        {/* Search Bar */}
        <label className="hidden md:flex flex-col min-w-40 max-w-xl flex-1 h-11">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-slate-100 dark:bg-slate-700 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:shadow-md transition-all border border-transparent focus-within:border-primary/30">
            <div className="text-slate-500 flex items-center justify-center pl-4 rounded-l-lg">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </div>
            <input
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-500 px-4 text-base font-normal leading-normal focus:ring-0 focus:outline-none"
              placeholder="Search leads by name or locality..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </label>

        {/* Right Actions */}
        <div className="flex flex-1 justify-end gap-3 sm:gap-6 shrink-0 ml-auto">

          {/* Lead Count Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg">
            <span className="material-symbols-outlined text-primary text-[20px]">groups</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-primary">{filteredLeads}</span>
              {filteredLeads !== totalLeads && (
                <span className="text-sm text-slate-500">/ {totalLeads}</span>
              )}
              <span className="text-sm text-slate-500 hidden sm:inline">leads</span>
            </div>
          </div>

          <div className="flex gap-1 items-center">
            <button className="flex items-center justify-center size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors md:hidden">
              <span className="material-symbols-outlined text-[24px]">search</span>
            </button>
          </div>

          {/* Profile Avatar */}
          <div
            className="bg-center bg-no-repeat bg-cover rounded-full size-10 border border-slate-200 dark:border-slate-600 cursor-pointer"
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBMuy8Do7Qs7toxgh3W4JoILuOsNOGpGlmDHuv--ELhh0eIDt6veI5mOytETSgbkrE43TOfSTMi5HFXAQb5NvbpTbeD-IjMbm4QybAcbCVR0-8Y7EswP_Q7mkgHFBCb0py3TaBbvksG2NTpj_yTMdfyUFA5MmFfBjzqcH_a2j19f28CcIhtiX3Ubyy859EjzPZ9sdLXmEm27uzmnkAlEbx5sqTBcHsblNG5I41sNLXEXzBKU6FStQ1-bNhVNIN4cizHJF318k9HDEw")' }}
          ></div>
        </div>
      </div>
    </header>
  );
};
