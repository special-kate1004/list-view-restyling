import { registerWebComponents } from './app/app.config';
import { createApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import 'zone.js';

// Production mode - register web components
createApplication(appConfig)
  .then((appRef) => {
    // Register web components with the injector
    registerWebComponents(appRef.injector);

    // Export a function to initialize the components
    (window as any).initializeEmbeddedComponents = () => {
      console.log('Embedded components initialized');
    };

    // Auto-initialize if loaded directly
    if (typeof window !== 'undefined') {
      (window as any).initializeEmbeddedComponents();
    }
  })
  .catch((err) => console.error(err));
