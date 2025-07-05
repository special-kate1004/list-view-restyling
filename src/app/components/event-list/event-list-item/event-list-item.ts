import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { EventWithOrganization } from '@interfaces/event-with-organization';

@Component({
  selector: 'app-event-list-item',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule, MatButtonModule, MatChipsModule],
  templateUrl: './event-list-item.html',
  styleUrls: ['./event-list-item.scss'],
})
export class EventListItemComponent {
  event = input.required<EventWithOrganization>();
  eventClick = output<EventWithOrganization>();

  public onEventClick(event: EventWithOrganization): void {
    this.eventClick.emit(event);
  }
}
