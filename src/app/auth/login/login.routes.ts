export const LOGIN_ROUTES = {
  path: 'login',
  loadComponent: () =>
    import('./login.component').then((m) => m.LoginComponent),
};
