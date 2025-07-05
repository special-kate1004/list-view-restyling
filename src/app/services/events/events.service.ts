import { Injectable, inject } from '@angular/core';
import { Observable, map, combineLatest, switchMap, BehaviorSubject } from 'rxjs';
import { FirestoreService } from '@services/firestore/firestore.service';
import { OrganizationsService } from '@services/organizations/organizations.service';
import { Event } from '@interfaces/event';
import { EventWithOrganization } from '@interfaces/event-with-organization';
import { Timestamp } from '@angular/fire/firestore';
import { AppConstants } from '@app/app.constants';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private firestoreService = inject(FirestoreService);
  private organizationsService = inject(OrganizationsService);

  private convertTimestamp(timestamp: Timestamp | Date): Date {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
    }
    return timestamp;
  }

  private convertTimestampsToDates(event: Event): Event {
    return {
      ...event,
      visible_from: this.convertTimestamp(event.visible_from),
      visible_to: this.convertTimestamp(event.visible_to),
      work_from: this.convertTimestamp(event.work_from),
      work_to: this.convertTimestamp(event.work_to),
    };
  }

  /**
   * Join events with organization names
   */
  private joinEventsWithOrganizations(events: Event[]): Observable<EventWithOrganization[]> {
    return this.organizationsService.getOrganizationNameMap().pipe(
      map((orgNameMap) => {
        return events.map((event) => ({
          ...event,
          organization_name: orgNameMap.get(event.org_id) || 'Unbekannte Organisation',
        }));
      }),
    );
  }

  /**
   * Get events with pagination and total count
   */
  getEventsWithPagination(
    pageIndex: number = 0,
    pageSize: number = 10,
    visibility: number = AppConstants.visibility.EXTERNAL,
  ): Observable<{ events: EventWithOrganization[]; total: number }> {
    // Filter by visibility: -1 = Draft, 0 = Internal, 1 = External
    // Default to visibility >= 1 to show only external events
    return combineLatest([this.firestoreService.getEvents(), this.firestoreService.getEventsCount(visibility)]).pipe(
      map(([allEvents, total]) => {
        const start = pageIndex * pageSize;
        const end = start + pageSize;
        const paginatedEvents = (allEvents || [])
          .filter((event) => event.visibility >= visibility) // Show events with visibility >= specified level
          .slice(start, end)
          .map((event) => this.convertTimestampsToDates(event));

        return { events: paginatedEvents, total };
      }),
      switchMap(({ events, total }) =>
        this.joinEventsWithOrganizations(events).pipe(map((eventsWithOrgs) => ({ events: eventsWithOrgs, total }))),
      ),
    );
  }

  getEvents(
    pageIndex: number = 0,
    pageSize: number = 10,
    visibility: number = AppConstants.visibility.EXTERNAL,
  ): Observable<EventWithOrganization[]> {
    return this.getEventsWithPagination(pageIndex, pageSize, visibility).pipe(map((result) => result.events));
  }

  getEvent(id: string): Observable<EventWithOrganization | null> {
    return this.firestoreService.getEvent(id).pipe(
      map((event) => (event ? this.convertTimestampsToDates(event) : null)),
      switchMap((event) => {
        if (!event) return [null];
        return this.joinEventsWithOrganizations([event]).pipe(map((events) => events[0]));
      }),
    );
  }

  queryEvents(filters: { field: string; operator: any; value: any }[]): Observable<EventWithOrganization[]> {
    return this.firestoreService.queryEvents(filters).pipe(
      map((events) => (events || []).map((event) => this.convertTimestampsToDates(event))),
      switchMap((events) => this.joinEventsWithOrganizations(events)),
    );
  }

  createEvent(event: Omit<Event, 'id'>): Promise<string> {
    return this.firestoreService.createEvent(event);
  }

  updateEvent(id: string, event: Partial<Event>): Promise<void> {
    return this.firestoreService.updateEvent(id, event);
  }

  deleteEvent(id: string): Promise<void> {
    return this.firestoreService.deleteEvent(id);
  }
}
