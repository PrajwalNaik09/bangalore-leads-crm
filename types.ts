export type LeadStatus = 'New Lead' | 'Called' | 'Contacted' | 'Not Received' | 'Follow Up' | 'Closed';
export type PropertyType = 'Residential' | 'Commercial' | 'Land';

export interface Lead {
  id: string;
  name: string;
  status: LeadStatus;
  phone: string;
  location: string;
  city: string;
  propertyType: PropertyType;
  category: string; // Dynamic from Google Sheet
  website?: string;
  linkedin?: string;
}

