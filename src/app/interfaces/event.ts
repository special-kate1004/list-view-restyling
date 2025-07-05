import { Address } from './address';

export interface Event {
  id: string;
  type: number; // 1 = Task, 2 = Event
  org_id: string;
  org_type: number;
  status: number; // 0 = Draft, 1 = Published, 2 = Completed
  visibility: number; // -1 = Draft, 0 = Internal, 1 = External
  title: string;
  photo_url?: string;
  address?: Address;
  visible_from: Date;
  visible_to: Date;
  work_from: Date;
  work_to: Date;
  industry_sectors?: number[];
  focus_sections?: number[];
  // Task specific fields
  slots_available?: number;
  slots_free?: number;
  duration_hours?: number;
}
