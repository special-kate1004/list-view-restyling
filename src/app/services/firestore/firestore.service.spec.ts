import { TestBed } from '@angular/core/testing';
import { FirestoreService } from './firestore.service';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from '@angular/fire/firestore';
import { of } from 'rxjs';

// Mock Firestore
const mockFirestore = {
  collection: jest.fn(),
  doc: jest.fn(),
};

// Mock Firestore functions
jest.mock('@angular/fire/firestore', () => ({
  collection: jest.fn(),
  collectionData: jest.fn(),
  doc: jest.fn(),
  docData: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
}));

describe('FirestoreService', () => {
  let service: FirestoreService;
  let mockCollectionRef: any;
  let mockDocRef: any;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup mock collection and document references
    mockCollectionRef = { id: 'test-collection' };
    mockDocRef = { id: 'test-doc' };

    // Setup mock implementations
    (collection as jest.Mock).mockReturnValue(mockCollectionRef);
    (doc as jest.Mock).mockReturnValue(mockDocRef);
    (collectionData as jest.Mock).mockReturnValue(of([]));
    (docData as jest.Mock).mockReturnValue(of({}));
    (addDoc as jest.Mock).mockResolvedValue({ id: 'new-doc-id' });
    (updateDoc as jest.Mock).mockResolvedValue(undefined);
    (deleteDoc as jest.Mock).mockResolvedValue(undefined);
    (query as jest.Mock).mockReturnValue(mockCollectionRef);
    (where as jest.Mock).mockReturnValue({});

    TestBed.configureTestingModule({
      providers: [FirestoreService, { provide: Firestore, useValue: mockFirestore }],
    });

    service = TestBed.inject(FirestoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Events', () => {
    const mockEvent = { title: 'Test Event', date: new Date() };

    it('should get all events', (done) => {
      service.getEvents().subscribe((events) => {
        expect(collection).toHaveBeenCalledWith(mockFirestore, 'events');
        expect(collectionData).toHaveBeenCalledWith(mockCollectionRef, { idField: 'id' });
        expect(events).toEqual([]);
        done();
      });
    });

    it('should get paginated events with visibility filter', (done) => {
      service.getEventsPaginated(10, undefined, 1).subscribe((events) => {
        expect(collection).toHaveBeenCalledWith(mockFirestore, 'events');
        expect(query).toHaveBeenCalledWith(
          mockCollectionRef,
          expect.any(Object),
          expect.any(Object),
          expect.any(Object),
          expect.any(Object),
        );
        expect(where).toHaveBeenCalledWith('visibility', '>=', 1);
        expect(events).toEqual([]);
        done();
      });
    });

    it('should get events count with visibility filter', (done) => {
      // Mock getCountFromServer
      const mockGetCountFromServer = jest.fn().mockResolvedValue({ data: () => ({ count: 5 }) });
      jest.doMock('@angular/fire/firestore', () => ({
        ...jest.requireActual('@angular/fire/firestore'),
        getCountFromServer: mockGetCountFromServer,
      }));

      service.getEventsCount(0).subscribe((count) => {
        expect(collection).toHaveBeenCalledWith(mockFirestore, 'events');
        expect(query).toHaveBeenCalledWith(mockCollectionRef, expect.any(Object));
        expect(where).toHaveBeenCalledWith('visibility', '>=', 0);
        expect(count).toBe(5);
        done();
      });
    });

    it('should get a single event', (done) => {
      service.getEvent('test-id').subscribe((event) => {
        expect(doc).toHaveBeenCalledWith(mockFirestore, 'events/test-id');
        expect(docData).toHaveBeenCalledWith(mockDocRef, { idField: 'id' });
        expect(event).toEqual({});
        done();
      });
    });
  });

  describe('Tasks', () => {
    const mockTask = { title: 'Test Task', completed: false };

    it('should get all tasks', (done) => {
      service.getTasks().subscribe((tasks) => {
        expect(collection).toHaveBeenCalledWith(mockFirestore, 'tasks');
        expect(collectionData).toHaveBeenCalledWith(mockCollectionRef, { idField: 'id' });
        expect(tasks).toEqual([]);
        done();
      });
    });

    it('should get a single task', (done) => {
      service.getTask('test-id').subscribe((task) => {
        expect(doc).toHaveBeenCalledWith(mockFirestore, 'tasks/test-id');
        expect(docData).toHaveBeenCalledWith(mockDocRef, { idField: 'id' });
        expect(task).toEqual({});
        done();
      });
    });
  });

  describe('Organizations', () => {
    const mockOrg = { name: 'Test Org', type: 'company' };

    it('should get all organizations', (done) => {
      service.getOrganizations().subscribe((orgs) => {
        expect(collection).toHaveBeenCalledWith(mockFirestore, 'organizations');
        expect(collectionData).toHaveBeenCalledWith(mockCollectionRef, { idField: 'id' });
        expect(orgs).toEqual([]);
        done();
      });
    });

    it('should get a single organization', (done) => {
      service.getOrganization('test-id').subscribe((org) => {
        expect(doc).toHaveBeenCalledWith(mockFirestore, 'organizations/test-id');
        expect(docData).toHaveBeenCalledWith(mockDocRef, { idField: 'id' });
        expect(org).toEqual({});
        done();
      });
    });
  });

  describe('Query methods', () => {
    const mockFilters = [{ field: 'status', operator: '==', value: 'active' }];

    it('should query events', (done) => {
      service.queryEvents(mockFilters).subscribe((events) => {
        expect(collection).toHaveBeenCalledWith(mockFirestore, 'events');
        expect(query).toHaveBeenCalledWith(mockCollectionRef, expect.any(Object));
        expect(where).toHaveBeenCalledWith('status', '==', 'active');
        expect(events).toEqual([]);
        done();
      });
    });

    it('should query tasks', (done) => {
      service.queryTasks(mockFilters).subscribe((tasks) => {
        expect(collection).toHaveBeenCalledWith(mockFirestore, 'tasks');
        expect(query).toHaveBeenCalledWith(mockCollectionRef, expect.any(Object));
        expect(where).toHaveBeenCalledWith('status', '==', 'active');
        expect(tasks).toEqual([]);
        done();
      });
    });

    it('should query organizations', (done) => {
      service.queryOrganizations(mockFilters).subscribe((orgs) => {
        expect(collection).toHaveBeenCalledWith(mockFirestore, 'organizations');
        expect(query).toHaveBeenCalledWith(mockCollectionRef, expect.any(Object));
        expect(where).toHaveBeenCalledWith('status', '==', 'active');
        expect(orgs).toEqual([]);
        done();
      });
    });
  });
});
