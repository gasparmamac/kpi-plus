import { Routes } from '@angular/router';
import { NAVIGATION_ROUTES } from './navigation/navigation.routes';
import { LOGIN_ROUTES } from './auth/login/login.routes';
import { DASHBOARD_ROUTES } from './dashboard/dashboard.routes';

export const routes: Routes = [
  LOGIN_ROUTES,
  NAVIGATION_ROUTES,
  DASHBOARD_ROUTES,
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./page-not-found/page-not-found.component').then(
        (m) => m.PageNotFoundComponent
      ),
  },
];
