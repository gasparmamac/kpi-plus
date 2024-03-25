import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideAnimationsAsync(),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'kpi-plus-dev',
          appId: '1:1080894170437:web:fff0e0916a2b2a94334a2c',
          storageBucket: 'kpi-plus-dev.appspot.com',
          apiKey: 'AIzaSyCSXEc-2Oc7vC8_-DWQQkJV9NFPmf8t6Ds',
          authDomain: 'kpi-plus-dev.firebaseapp.com',
          messagingSenderId: '1080894170437',
        })
      )
    ),
    importProvidersFrom(
      provideAuth(() => {
        const auth = getAuth();
        connectAuthEmulator(auth, 'http://localhost:9099', {
          disableWarnings: true,
        });
        return auth;
      })
    ),
    importProvidersFrom(provideFirestore(() => getFirestore())),
  ],
};
