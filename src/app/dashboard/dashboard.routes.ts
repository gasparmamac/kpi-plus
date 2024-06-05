export const DASHBOARD_ROUTES = {
  path: 'dashboard',
  loadComponent: () =>
    import('../dashboard/dashboard.component').then(
      (m) => m.DashboardComponent
    ),
};
