import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  DocumentData,
  limit,
  startAfter,
  orderBy,
  getCountFromServer,
  QueryDocumentSnapshot,
} from '@angular/fire/firestore';
import { AppConstants } from '@app/app.constants';
import { Observable, map, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private readonly firestore = inject(Firestore);

  // Generic collection methods
  private getCollection<T>(path: string): Observable<T[]> {
    const collectionRef = collection(this.firestore, path);
    return collectionData(collectionRef, { idField: 'id' }) as Observable<T[]>;
  }

  private getDocument<T>(path: string, id: string): Observable<T> {
    const docRef = doc(this.firestore, `${path}/${id}`);
    return docData(docRef, { idField: 'id' }) as Observable<T>;
  }

  private async createDocument<T>(path: string, data: T): Promise<string> {
    const collectionRef = collection(this.firestore, path);
    const docRef = await addDoc(collectionRef, data as DocumentData);
    return docRef.id;
  }

  private async updateDocument<T>(path: string, id: string, data: Partial<T>): Promise<void> {
    const docRef = doc(this.firestore, `${path}/${id}`);
    await updateDoc(docRef, data as DocumentData);
  }

  private async deleteDocument(path: string, id: string): Promise<void> {
    const docRef = doc(this.firestore, `${path}/${id}`);
    await deleteDoc(docRef);
  }

  // Events
  getEvents(): Observable<any[]> {
    return this.getCollection(AppConstants.collections.events);
  }

  getEventsPaginated(
    pageSize: number,
    lastDoc?: QueryDocumentSnapshot,
    visibility: number = AppConstants.visibility.EXTERNAL,
  ): Observable<any[]> {
    const collectionRef = collection(this.firestore, AppConstants.collections.events);
    let q = query(
      collectionRef,
      where('visibility', '>=', visibility),
      orderBy('visibility'),
      orderBy('work_from'),
      limit(pageSize),
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    return collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }

  getEventsCount(visibility: number = AppConstants.visibility.EXTERNAL): Observable<number> {
    const collectionRef = collection(this.firestore, AppConstants.collections.events);
    const q = query(collectionRef, where('visibility', '>=', visibility));
    return from(getCountFromServer(q)).pipe(map((snapshot) => snapshot.data().count));
  }

  getEvent(id: string): Observable<any> {
    return this.getDocument(AppConstants.collections.events, id);
  }

  createEvent(event: any): Promise<string> {
    return this.createDocument(AppConstants.collections.events, event);
  }

  updateEvent(id: string, event: Partial<any>): Promise<void> {
    return this.updateDocument(AppConstants.collections.events, id, event);
  }

  deleteEvent(id: string): Promise<void> {
    return this.deleteDocument(AppConstants.collections.events, id);
  }

  // Tasks
  getTasks(): Observable<any[]> {
    return this.getCollection('tasks');
  }

  getTask(id: string): Observable<any> {
    return this.getDocument('tasks', id);
  }

  createTask(task: any): Promise<string> {
    return this.createDocument('tasks', task);
  }

  updateTask(id: string, task: Partial<any>): Promise<void> {
    return this.updateDocument('tasks', id, task);
  }

  deleteTask(id: string): Promise<void> {
    return this.deleteDocument('tasks', id);
  }

  // Organizations
  getOrganizations(): Observable<any[]> {
    return this.getCollection(AppConstants.collections.organization);
  }

  getOrganization(id: string): Observable<any> {
    return this.getDocument(AppConstants.collections.organization, id);
  }

  createOrganization(org: any): Promise<string> {
    return this.createDocument(AppConstants.collections.organization, org);
  }

  updateOrganization(id: string, org: Partial<any>): Promise<void> {
    return this.updateDocument(AppConstants.collections.organization, id, org);
  }

  deleteOrganization(id: string): Promise<void> {
    return this.deleteDocument(AppConstants.collections.organization, id);
  }

  // Query methods
  queryEvents(filters: { field: string; operator: any; value: any }[]): Observable<any[]> {
    const collectionRef = collection(this.firestore, AppConstants.collections.events);
    const constraints = filters.map((f) => where(f.field, f.operator, f.value));
    const q = query(collectionRef, ...constraints);
    return collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }

  queryTasks(filters: { field: string; operator: any; value: any }[]): Observable<any[]> {
    const collectionRef = collection(this.firestore, 'tasks');
    const constraints = filters.map((f) => where(f.field, f.operator, f.value));
    const q = query(collectionRef, ...constraints);
    return collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }

  queryOrganizations(filters: { field: string; operator: any; value: any }[]): Observable<any[]> {
    const collectionRef = collection(this.firestore, AppConstants.collections.organization);
    const constraints = filters.map((f) => where(f.field, f.operator, f.value));
    const q = query(collectionRef, ...constraints);
    return collectionData(q, { idField: 'id' }) as Observable<any[]>;
  }
}
