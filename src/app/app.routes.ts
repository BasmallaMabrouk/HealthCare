import { Routes } from '@angular/router';

export const routes: Routes = [
{
    path: 'patient',
    loadChildren: () => import('./features/routes').then(m => m.PATIENT_ROUTES)
  }

];
