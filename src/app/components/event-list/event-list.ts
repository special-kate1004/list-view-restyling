import { Component, inject, AfterViewInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatPaginatorModule, MatPaginator, PageEvent, MatPaginatorIntl } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { Observable, map, BehaviorSubject, switchMap, shareReplay, combineLatest } from 'rxjs';
import { EventWithOrganization } from '@interfaces/event-with-organization';
import { EventsService } from '@services/events/events.service';
import { OrganizationsService } from '@services/organizations/organizations.service';
import { environment } from '@environment/environment';
import { EventListItemComponent } from './event-list-item/event-list-item';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatListModule,
    EventListItemComponent,
  ],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: class extends MatPaginatorIntl {
        override nextPageLabel = 'Nächste Seite';
        override previousPageLabel = 'Vorherige Seite';
        override firstPageLabel = 'Erste Seite';
        override lastPageLabel = 'Letzte Seite';
        override itemsPerPageLabel = 'Elemente pro Seite:';
        override getRangeLabel = (page: number, pageSize: number, length: number) => {
          if (length === 0 || pageSize === 0) {
            return `0 von ${length}`;
          }
          length = Math.max(length, 0);
          const startIndex = page * pageSize;
          const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
          return `${startIndex + 1} - ${endIndex} von ${length}`;
        };
      },
    },
  ],
  templateUrl: './event-list.html',
  styleUrls: ['./event-list.scss'],
})
export class EventListComponent implements AfterViewInit {
  private eventsService = inject(EventsService);
  private organizationsService = inject(OrganizationsService);

  public paginator = viewChild<MatPaginator>(MatPaginator);
  public pageSize = 5;
  public pageIndex = 0;
  public totalEvents = 0;

  private paginationState = new BehaviorSubject<{ pageIndex: number; pageSize: number }>({
    pageIndex: this.pageIndex,
    pageSize: this.pageSize,
  });

  private paginationResult$ = this.paginationState.pipe(
    switchMap(({ pageIndex, pageSize }) => this.eventsService.getEventsWithPagination(pageIndex, pageSize)),
    shareReplay(1), // Cache and share the last emission
  );

  events$: Observable<EventWithOrganization[]> = this.paginationResult$.pipe(map((result) => result.events));

  totalEvents$: Observable<number> = this.paginationResult$.pipe(map((result) => result.total));

  // Combine loading states from both services
  loading$ = combineLatest([
    this.paginationResult$.pipe(map(() => false)), // TODO: Implement proper loading state
    this.organizationsService.loading$,
  ]).pipe(map(([eventsLoading, orgsLoading]) => eventsLoading || orgsLoading));

  // Combine error states from both services
  error$ = combineLatest([
    this.paginationResult$.pipe(map(() => null)), // TODO: Implement proper error handling
    this.organizationsService.error$,
  ]).pipe(map(([eventsError, orgsError]) => eventsError || orgsError));

  public ngAfterViewInit(): void {
    // Subscribe to total events to update the paginator
    this.totalEvents$.subscribe((total) => {
      this.totalEvents = total;
    });

    if (this.paginator()) {
      this.paginator()?.page.subscribe((event: PageEvent) => {
        this.paginationState.next({
          pageIndex: event.pageIndex,
          pageSize: event.pageSize,
        });
      });
    }
  }

  public onEventClick(event: EventWithOrganization): void {
    window.open(environment.inmojo.url + 'eventDetails/' + event.id, '_blank');
  }

  public onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.paginationState.next({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
    });
  }
}
