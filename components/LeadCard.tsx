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
              onClick={() => {
                let phoneDigits = lead.phone.replace(/\D/g, '');
                if (phoneDigits.length === 10) {
                  phoneDigits = '91' + phoneDigits;
                }
                window.open(`https://wa.me/${phoneDigits}`, '_blank');
              }}
              className={`flex items-center justify-center size-10 rounded-full transition-all shadow-sm tooltip-trigger ${isClosed ? 'bg-slate-50 dark:bg-slate-700 hover:bg-slate-200 text-slate-400' : 'bg-[#25D366]/10 hover:bg-[#25D366] hover:text-white text-[#25D366]'}`}
              title="Chat on WhatsApp"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
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
