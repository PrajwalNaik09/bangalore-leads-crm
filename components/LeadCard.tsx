import React from 'react';
import { Lead, LeadStatus } from '../types';

interface LeadCardProps {
  lead: Lead;
  onUpdateStatus: (id: string, status: LeadStatus) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, onUpdateStatus }) => {

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'New Lead':
        return 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-100 dark:border-green-800';
      case 'Called':
        return 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-800';
      case 'Follow Up':
        return 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-100 dark:border-yellow-800';
      case 'Closed':
        return 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-600';
      case 'Contacted':
        return 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800';
      case 'Not Received':
        return 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-100 dark:border-orange-800';
      default:
        return 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800';
    }
  };

  const isClosed = lead.status === 'Closed';
  const isCalled = lead.status === 'Called';
  const opacityClass = isClosed ? 'opacity-80 hover:opacity-100' : '';

  const handleCallClick = () => {
    // Sanitize phone number: remove all non-numeric characters
    let phoneDigits = lead.phone.replace(/\D/g, '');

    // If the number starts with '91' and is longer than 10 digits (likely 12 digits), strip the '91'
    if (phoneDigits.startsWith('91') && phoneDigits.length > 10) {
      phoneDigits = phoneDigits.substring(2);
    }

    // Pass the cleaned number to the native dialer
    window.location.href = `tel:${phoneDigits}`;

    // Move lead to "Called" status - waiting for outcome
    onUpdateStatus(lead.id, 'Called');
  };

  const handleStatusSelect = (status: LeadStatus) => {
    onUpdateStatus(lead.id, status);
  };

  // Action buttons for "Called" status
  const callOutcomeButtons: { status: LeadStatus; label: string; icon: string; bgClass: string }[] = [
    {
      status: 'Contacted',
      label: 'Contacted',
      icon: 'check_circle',
      bgClass: 'bg-blue-500 hover:bg-blue-600 text-white',
    },
    {
      status: 'Not Received',
      label: 'Not Received',
      icon: 'phone_missed',
      bgClass: 'bg-orange-500 hover:bg-orange-600 text-white',
    },
    {
      status: 'Closed',
      label: 'Closed',
      icon: 'cancel',
      bgClass: 'bg-slate-500 hover:bg-slate-600 text-white',
    },
  ];

  return (
    <div className={`group relative flex flex-col md:flex-row gap-4 p-5 bg-white dark:bg-slate-800 rounded-lg border ${isCalled ? 'border-amber-300 dark:border-amber-700 ring-2 ring-amber-100 dark:ring-amber-900/30' : 'border-slate-200 dark:border-slate-700'} shadow-sm hover:shadow-md transition-all hover:border-primary/30 ${opacityClass}`}>

      {/* Left Section: Main Info */}
      <div className="flex-1 flex flex-col gap-3 min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className={`text-lg font-bold truncate cursor-pointer hover:underline ${isClosed ? 'text-slate-700 dark:text-slate-300' : 'text-primary dark:text-blue-400'}`}>
            {lead.name}
          </h3>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide border ${getStatusStyles(lead.status)}`}>
            {lead.status}
          </span>
          {lead.category && lead.category !== 'Other' && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 border border-purple-100 dark:border-purple-800">
              {lead.category}
            </span>
          )}
        </div>
        <div className={`flex items-center gap-2 font-medium group/phone cursor-pointer w-fit ${isClosed ? 'text-slate-500 dark:text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
          <div className={`rounded-full p-1 transition-colors ${isClosed ? 'bg-slate-100 dark:bg-slate-700 text-slate-500 group-hover/phone:bg-slate-200' : 'bg-primary/10 text-primary group-hover/phone:bg-primary group-hover/phone:text-white'}`}>
            <span className="material-symbols-outlined text-[16px] block">call</span>
          </div>
          <span className="hover:text-primary transition-colors">{lead.phone}</span>
        </div>
        <div className="flex items-start gap-2.5 mt-1">
          <span className="material-symbols-outlined text-slate-400 text-[20px] shrink-0 mt-0.5">location_on</span>
          <div className="flex flex-col">
            <span className="text-slate-900 dark:text-white font-medium text-sm">{lead.location}</span>
            <span className="text-slate-500 dark:text-slate-400 text-sm">{lead.city}</span>
          </div>
        </div>
      </div>

      {/* Middle Section: Links */}
      <div className="w-full md:w-64 flex flex-col gap-2.5 justify-center border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-700 md:pl-6 pt-4 md:pt-0 shrink-0">
        {lead.website ? (
          <a className={`flex items-center gap-3 text-sm hover:text-primary dark:hover:text-primary transition-colors group/link truncate ${isClosed ? 'text-slate-500 dark:text-slate-400' : 'text-slate-600 dark:text-slate-300'}`} href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} target="_blank" rel="noopener noreferrer">
            <span className={`material-symbols-outlined text-[18px] group-hover/link:text-primary ${isClosed ? 'text-slate-300' : 'text-slate-400'}`}>language</span>
            <span className="truncate">{lead.website}</span>
            <span className="material-symbols-outlined text-[14px] opacity-0 group-hover/link:opacity-100 transition-opacity ml-auto">open_in_new</span>
          </a>
        ) : (
          <div className="h-[28px] hidden md:block"></div>
        )}

        {lead.linkedin && (
          <a className={`flex items-center gap-3 text-sm hover:text-[#0077b5] transition-colors group/link truncate ${isClosed ? 'text-slate-500 dark:text-slate-400' : 'text-slate-600 dark:text-slate-300'}`} href={lead.linkedin.startsWith('http') ? lead.linkedin : `https://${lead.linkedin}`} target="_blank" rel="noopener noreferrer">
            <span className={`material-symbols-outlined text-[18px] group-hover/link:text-[#0077b5] ${isClosed ? 'text-slate-300' : 'text-slate-400'}`}>link</span>
            <span className="truncate">{lead.linkedin}</span>
            <span className="material-symbols-outlined text-[14px] opacity-0 group-hover/link:opacity-100 transition-opacity ml-auto">open_in_new</span>
          </a>
        )}
      </div>

      {/* Right Section: Actions */}
      <div className="flex md:flex-col items-center justify-end md:justify-center gap-2 md:pl-2 border-t md:border-t-0 border-slate-100 dark:border-slate-700 pt-4 md:pt-0 shrink-0">

        {/* Show Call Outcome Buttons when status is "Called" */}
        {isCalled ? (
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <p className="text-xs font-medium text-amber-600 dark:text-amber-400 text-center mb-1">
              Choose outcome:
            </p>
            {callOutcomeButtons.map((btn) => (
              <button
                key={btn.status}
                onClick={() => handleStatusSelect(btn.status)}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all shadow-sm ${btn.bgClass}`}
              >
                <span className="material-symbols-outlined text-[18px]">{btn.icon}</span>
                {btn.label}
              </button>
            ))}
          </div>
        ) : (
          /* Normal action buttons */
          <div className="flex items-center gap-2">
            <button
              onClick={handleCallClick}
              className={`flex items-center justify-center size-10 rounded-full transition-all shadow-sm tooltip-trigger ${isClosed ? 'bg-slate-50 dark:bg-slate-700 hover:bg-slate-200 text-slate-400' : 'bg-primary/5 hover:bg-primary hover:text-white text-primary'}`}
              title="Call Lead"
            >
              <span className={`material-symbols-outlined text-[20px] ${!isClosed && 'filled'}`}>call</span>
            </button>
            <button
              className="flex items-center justify-center size-10 rounded-full bg-slate-50 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition-all shadow-sm tooltip-trigger"
              title="Email Lead"
            >
              <span className="material-symbols-outlined text-[20px]">mail</span>
            </button>
            <button className="flex items-center justify-center size-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors ml-1">
              <span className="material-symbols-outlined text-[20px]">more_vert</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
