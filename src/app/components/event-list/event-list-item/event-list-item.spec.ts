import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventListItemComponent } from './event-list-item';
import { EventWithOrganization } from '@interfaces/event-with-organization';

describe('EventListItemComponent', () => {
  let component: EventListItemComponent;
  let fixture: ComponentFixture<EventListItemComponent>;

  const mockEvent: EventWithOrganization = {
    id: '1',
    org_id: 'org1',
    org_type: 1,
    title: 'Test Event',
    status: 1,
    type: 1,
    visibility: 1,
    visible_from: new Date('2024-01-01T00:00:00'),
    visible_to: new Date('2024-01-01T23:59:59'),
    work_from: new Date('2024-01-01T10:00:00'),
    work_to: new Date('2024-01-01T18:00:00'),
    duration_hours: 8,
    slots_available: 10,
    slots_free: 5,
    organization_name: 'Test Organization',
    photo_url: 'https://example.com/image.jpg',
    address: {
      street: 'Test Street',
      city: 'Test City',
      plz: 12345,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventListItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventListItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('event', mockEvent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event click', () => {
    spyOn(component.eventClick, 'emit');
    component.onEventClick(mockEvent);
    expect(component.eventClick.emit).toHaveBeenCalledWith(mockEvent);
  });
});
