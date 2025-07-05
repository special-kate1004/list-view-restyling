import { Event } from './event';

/**
 * Event interface extended with organization information for display
 * This interface is used when we need to show organization names in event lists
 */
export interface EventWithOrganization extends Event {
  /**
   * Organization name for display purposes
   * This is populated by joining with organization data
   */
  organization_name?: string;
}
