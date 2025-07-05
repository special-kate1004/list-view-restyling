import { Injectable, inject } from '@angular/core';
import { Observable, map, shareReplay, BehaviorSubject } from 'rxjs';
import { FirestoreService } from '@services/firestore/firestore.service';
import { Organization } from '@interfaces/organization';

@Injectable({
  providedIn: 'root',
})
export class OrganizationsService {
  private firestoreService = inject(FirestoreService);

  // Cache for organizations with shareReplay to avoid multiple requests
  private organizationsCache$ = this.firestoreService.getOrganizations().pipe(shareReplay(1));

  // BehaviorSubject to track loading state
  private loadingSubject = new BehaviorSubject<boolean>(true);
  public loading$ = this.loadingSubject.asObservable();

  // BehaviorSubject to track error state
  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor() {
    // Initialize loading state
    this.organizationsCache$.subscribe({
      next: () => this.loadingSubject.next(false),
      error: (error) => {
        this.loadingSubject.next(false);
        this.errorSubject.next(error.message);
      },
    });
  }

  /**
   * Get all organizations
   */
  getOrganizations(): Observable<Organization[]> {
    return this.organizationsCache$;
  }

  /**
   * Get a specific organization by ID
   */
  getOrganization(id: string): Observable<Organization | undefined> {
    return this.organizationsCache$.pipe(map((organizations) => organizations.find((org) => org.id === id)));
  }

  /**
   * Create a lookup map for fast organization name retrieval
   * @returns Observable of Map<string, string> where key is org_id and value is org_name
   */
  getOrganizationNameMap(): Observable<Map<string, string>> {
    return this.organizationsCache$.pipe(
      map((organizations) => {
        const nameMap = new Map<string, string>();
        organizations.forEach((org) => {
          nameMap.set(org.id, org.name);
        });
        return nameMap;
      }),
    );
  }

  /**
   * Get organization name by ID
   */
  getOrganizationName(id: string): Observable<string | undefined> {
    return this.getOrganization(id).pipe(map((org) => org?.name));
  }

  /**
   * Refresh the organizations cache
   */
  refreshOrganizations(): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);
    // The cache will automatically refresh due to shareReplay
  }
}
