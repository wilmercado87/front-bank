import { Route } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Route[] = [
    
    {
      path: 'clients',
      loadComponent: () => import('../app/components/clients/clients.component').then(m => m.ClientsComponent),
      outlet: 'main'
    },
    {
      path: '**',
      component: NotFoundComponent,
    }
  ];
