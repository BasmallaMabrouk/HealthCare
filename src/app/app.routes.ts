import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'doctor',
    loadChildren: () =>
      import('./features/doctor/components/doctor-dashboard/doctor.routes').then(
        (m) => m.DOCTOR_ROUTES,
      ),
  },
  { path: '', redirectTo: 'doctor', pathMatch: 'full' },
];
