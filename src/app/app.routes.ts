import { Routes } from '@angular/router';
import { DoctorDashboard } from './components/doctor-dashboard/doctor-dashboard';

export const routes: Routes = [
  { path: 'doctor-dashboard', component: DoctorDashboard },
  { path: '', redirectTo: 'doctor-dashboard', pathMatch: 'full' },
];
