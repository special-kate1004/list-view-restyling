import { TestBed } from '@angular/core/testing';
import { EventsService } from './events.service';
import { FirestoreService } from '@services/firestore/firestore.service';
import { Event } from '@interfaces/event';
import { Timestamp } from '@angular/fire/firestore';
import { of } from 'rxjs';
import { Address } from '@interfaces/address';
import { AppConstants } from '@app/app.constants';

describe('EventsService', () => {
  let service: EventsService;
  let firestoreServiceSpy: jest.Mocked<FirestoreService>;

  const mockEvent: Event = {
    id: '1',
    type: 1, // Task
    org_id: 'org1',
    org_type: 1, // Company
    status: 1, // Published
    visibility: 1, // External
    title: 'Test Event',
    photo_url: 'https://example.com/photo.jpg',
    address: {
      street: '123 Test St',
      city: 'Test City',
      plz: 12345,
    },
    visible_from: new Date(1748066400000),
    visible_to: new Date(1748152800000),
    work_from: new Date(1748066400000),
    work_to: new Date(1748152800000),
    industry_sectors: [1],
    focus_sections: [1],
    slots_available: 10,
    slots_free: 5,
    duration_hours: 2,
  };

  beforeEach(() => {
    const spy = {
      getEvents: jest.fn(),
      getEventsCount: jest.fn(),
      getEvent: jest.fn(),
      createEvent: jest.fn(),
      updateEvent: jest.fn(),
      deleteEvent: jest.fn(),
      queryEvents: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [EventsService, { provide: FirestoreService, useValue: spy }],
    });

    service = TestBed.inject(EventsService);
    firestoreServiceSpy = TestBed.inject(FirestoreService) as jest.Mocked<FirestoreService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getEvents', () => {
    it('should convert timestamps to dates in events', (done) => {
      firestoreServiceSpy.getEvents.mockReturnValue(of([mockEvent]));
      firestoreServiceSpy.getEventsCount.mockReturnValue(of(1));

      service.getEvents().subscribe((events) => {
        expect(events.length).toBe(1);
        expect(events[0].visible_from instanceof Date).toBe(true);
        expect(events[0].visible_to instanceof Date).toBe(true);
        expect(events[0].work_from instanceof Date).toBe(true);
        expect(events[0].work_to instanceof Date).toBe(true);
        done();
      });
    });

    it('should handle empty events array', (done) => {
      firestoreServiceSpy.getEvents.mockReturnValue(of([]));
      firestoreServiceSpy.getEventsCount.mockReturnValue(of(0));

      service.getEvents().subscribe((events) => {
        expect(events).toEqual([]);
        done();
      });
    });

    it('should filter events by visibility', (done) => {
      const draftEvent = { ...mockEvent, id: '2', visibility: AppConstants.visibility.DRAFT }; // Draft
      const internalEvent = { ...mockEvent, id: '3', visibility: AppConstants.visibility.INTERNAL }; // Internal
      const externalEvent = { ...mockEvent, id: '4', visibility: AppConstants.visibility.EXTERNAL }; // External

      firestoreServiceSpy.getEvents.mockReturnValue(of([draftEvent, internalEvent, externalEvent]));
      firestoreServiceSpy.getEventsCount.mockReturnValue(of(2)); // Only internal and external

      service.getEvents(0, 10, AppConstants.visibility.INTERNAL).subscribe((events) => {
        // Should show internal (0) and external (1) events, but not draft (-1)
        expect(events.length).toBe(2);
        expect(events.find((e) => e.visibility === AppConstants.visibility.DRAFT)).toBeUndefined();
        expect(events.find((e) => e.visibility === AppConstants.visibility.INTERNAL)).toBeDefined();
        expect(events.find((e) => e.visibility === AppConstants.visibility.EXTERNAL)).toBeDefined();
        done();
      });
    });

    it('should only show external events by default', (done) => {
      const draftEvent = { ...mockEvent, id: '2', visibility: AppConstants.visibility.DRAFT }; // Draft
      const internalEvent = { ...mockEvent, id: '3', visibility: AppConstants.visibility.INTERNAL }; // Internal
      const externalEvent = { ...mockEvent, id: '4', visibility: AppConstants.visibility.EXTERNAL }; // External

      firestoreServiceSpy.getEvents.mockReturnValue(of([draftEvent, internalEvent, externalEvent]));
      firestoreServiceSpy.getEventsCount.mockReturnValue(of(1)); // Only external

      service.getEvents().subscribe((events) => {
        // Should only show external (1) events by default
        expect(events.length).toBe(1);
        expect(events[0].visibility).toBe(AppConstants.visibility.EXTERNAL);
        done();
      });
    });
  });

  describe('getEvent', () => {
    it('should convert timestamps to dates in single event', (done) => {
      firestoreServiceSpy.getEvent.mockReturnValue(of(mockEvent));

      service.getEvent('1').subscribe((event) => {
        expect(event).toBeTruthy();
        expect(event?.visible_from instanceof Date).toBe(true);
        expect(event?.visible_to instanceof Date).toBe(true);
        expect(event?.work_from instanceof Date).toBe(true);
        expect(event?.work_to instanceof Date).toBe(true);
        done();
      });
    });

    it('should handle null event', (done) => {
      firestoreServiceSpy.getEvent.mockReturnValue(of(null));

      service.getEvent('1').subscribe((event) => {
        expect(event).toBeNull();
        done();
      });
    });
  });

  describe('createEvent', () => {
    it('should create event and return id', async () => {
      const { id, ...newEvent } = mockEvent;
      firestoreServiceSpy.createEvent.mockResolvedValue('new-id');

      const result = await service.createEvent(newEvent);
      expect(result).toBe('new-id');
      expect(firestoreServiceSpy.createEvent).toHaveBeenCalledWith(newEvent);
    });
  });

  describe('updateEvent', () => {
    it('should update event', async () => {
      const updateData = { title: 'Updated Title' };
      firestoreServiceSpy.updateEvent.mockResolvedValue();

      await service.updateEvent('1', updateData);
      expect(firestoreServiceSpy.updateEvent).toHaveBeenCalledWith('1', updateData);
    });
  });

  describe('deleteEvent', () => {
    it('should delete event', async () => {
      firestoreServiceSpy.deleteEvent.mockResolvedValue();

      await service.deleteEvent('1');
      expect(firestoreServiceSpy.deleteEvent).toHaveBeenCalledWith('1');
    });
  });

  describe('queryEvents', () => {
    it('should convert timestamps to dates in queried events', (done) => {
      const filters = [{ field: 'status', operator: '==', value: 1 }];
      firestoreServiceSpy.queryEvents.mockReturnValue(of([mockEvent]));

      service.queryEvents(filters).subscribe((events) => {
        expect(events.length).toBe(1);
        expect(events[0].visible_from instanceof Date).toBe(true);
        expect(events[0].visible_to instanceof Date).toBe(true);
        expect(events[0].work_from instanceof Date).toBe(true);
        expect(events[0].work_to instanceof Date).toBe(true);
        done();
      });
    });

    it('should handle empty query results', (done) => {
      const filters = [{ field: 'status', operator: '==', value: 0 }];
      firestoreServiceSpy.queryEvents.mockReturnValue(of([]));

      service.queryEvents(filters).subscribe((events) => {
        expect(events).toEqual([]);
        done();
      });
    });
  });
});
