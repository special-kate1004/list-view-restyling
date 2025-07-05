import { registerLocaleData } from '@angular/common';
import localeDeAt from '@angular/common/locales/de-AT';
import { ApplicationConfig, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAnimations } from '@angular/platform-browser/animations';
import { EventListComponent } from '@components/event-list/event-list';
import { EventsService } from '@services/events/events.service';
import { FirestoreService } from '@services/firestore/firestore.service';
import { initializeApp } from 'firebase/app';
import { environment } from '../environments/environment';

// Register the German (Austria) locale
registerLocaleData(localeDeAt, 'de-AT');

const providers = [
  provideAnimations(),
  provideFirebaseApp(() => initializeApp(environment.firebase)),
  provideFirestore(() => getFirestore()),
  { provide: 'LOCALE_ID', useValue: 'de-AT' },
  EventsService,
  FirestoreService,
];

export const appConfig: ApplicationConfig = {
  providers,
};

// Function to register web components
export function registerWebComponents(injector: Injector) {
  const components = [
    { tag: 'inmojo-events', component: EventListComponent },
    // add more here in future
  ];

  for (const { tag, component } of components) {
    if (!customElements.get(tag)) {
      const el = createCustomElement(component, { injector });
      customElements.define(tag, el);
      console.log(`✅ Registered component <${tag}>`);
    }
  }
}
