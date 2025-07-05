import { Address } from './address';

/**
 * Organization interface representing an organization in the system
 *
 * @property id - Unique identifier for the organization
 * @property name - Name of the organization
 * @property description - Optional description
 * @property org_type - Organization type: 0=Team, 1=Verein, 2=Firma, 3=Gemeinde, 4=blaulicht Org.
 * @property join_type - Join type identifier
 * @property visibility - Visibility level
 * @property contact_person - Primary contact person
 * @property email - Contact email
 * @property phone_number - Contact phone number
 * @property webpage - Organization website
 * @property address - Physical address (street, city, plz)
 * @property coordinates - GPS coordinates [latitude, longitude]
 * @property custom_location - Whether location is custom
 * @property photo_url - URL of uploaded photo
 * @property industry_sectors - Array of industry sector IDs from Firebase Remote Config
 * @property focus_sections - Array of focus section IDs from Firebase Remote Config
 * @property opening_times - Opening hours information
 * @property created_date - Creation timestamp
 * @property modified_date - Last modification timestamp
 * @property creator_id - ID of user who created the organization
 * @property creator_name - Name of user who created the organization
 * @property rewards_given - Rewards distribution statistics
 * @property additional_info - Additional information
 */
export interface Organization {
  id: string;
  name: string;
  description?: string;
  org_type: number; // 0=Team, 1=Verein, 2=Firma, 3=Gemeinde, 4=blaulicht Org.
  join_type: number;
  visibility: number;

  // Contact Information
  contact_person?: string;
  email?: string;
  phone_number?: string;
  webpage?: string;

  // Location
  address?: Address;
  coordinates?: [number, number]; // [latitude, longitude]
  custom_location?: boolean;

  // Media
  photo_url?: string;

  // Business Information
  industry_sectors?: number[]; // IDs from Firebase Remote Config (fields_en/fields_de)
  focus_sections?: number[]; // IDs from Firebase Remote Config (sections_en/sections_de)
  opening_times?: string;

  // Metadata
  created_date: Date;
  modified_date: Date;
  creator_id: string;
  creator_name?: string;

  // Rewards
  rewards_given?: RewardsGiven;

  // Additional
  additional_info?: string;
}

/**
 * Rewards distribution statistics for an organization
 */
export interface RewardsGiven {
  inmojo_coins_distributed: number;
  loyalty_distributed: number;
  xp_distributed: number;
}
