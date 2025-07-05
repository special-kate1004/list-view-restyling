import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventListComponent } from './event-list';
import { FirestoreService } from '../../services/firestore/firestore.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('EventListComponent', () => {
  let component: EventListComponent;
  let fixture: ComponentFixture<EventListComponent>;
  let firestoreService: FirestoreService;

  const mockEvents = [
    {
      id: '1',
      title: 'Test Event 1',
      date: new Date(),
      description: 'Test Description 1',
    },
    {
      id: '2',
      title: 'Test Event 2',
      date: new Date(),
      description: 'Test Description 2',
    },
  ];

  beforeEach(async () => {
    const spy = {
      getEvents: jasmine.createSpy('getEvents').and.returnValue(of(mockEvents)),
      deleteEvent: jasmine.createSpy('deleteEvent').and.returnValue(Promise.resolve()),
    };

    await TestBed.configureTestingModule({
      imports: [EventListComponent, NoopAnimationsModule, RouterTestingModule],
      providers: [{ provide: FirestoreService, useValue: spy }],
    }).compileComponents();

    firestoreService = TestBed.inject(FirestoreService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load events on init', () => {
    expect(firestoreService.getEvents).toHaveBeenCalled();
    expect(component.events$).toBeTruthy();
  });

  it('should display events in the table', () => {
    const compiled = fixture.nativeElement;
    const rows = compiled.querySelectorAll('tr.mat-row');
    expect(rows.length).toBe(mockEvents.length);
  });
});
