import path from 'path';
import { DashboardComponent } from '../dashboard/dashboard.component';

export const NAVIGATION_ROUTES = {
  path: 'menu',
  loadComponent: () =>
    import('../navigation/navigation.component').then(
      (m) => m.NavigationComponent
    ),
  children: [
    {
      path: 'dashboard',
      component: DashboardComponent,
    },

    {
      path: 'dispatch',
      loadComponent: () =>
        import('../dispatch/dispatch.component').then(
          (m) => m.DispatchComponent
        ),
      children: [
        {
          path: 'table',
          loadComponent: () =>
            import('../dispatch/dispatch-table/dispatch-table.component').then(
              (m) => m.DispatchTableComponent
            ),
        },
        {
          path: 'add',
          loadComponent: () =>
            import('../dispatch/add-dispatch/add-dispatch.component').then(
              (m) => m.AddDispatchComponent
            ),
        },
        {
          path: 'edit/:id',
          loadComponent: () =>
            import('../dispatch/edit-dispatch/edit-dispatch.component').then(
              (m) => m.EditDispatchComponent
            ),
        },
      ],
    },

    {
      path: 'invoice',
      loadComponent: () =>
        import('../invoice/invoice.component').then((m) => m.InvoiceComponent),
    },
  ],
};
