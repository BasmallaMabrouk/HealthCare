import { Routes } from '@angular/router';
import { DoctorDashboardComponent } from './doctor-dashboard';
import { DoctorAppointmentsComponent } from '../appointments/appointments';
import { DoctorProfileComponent } from '../profile/profile';
import { DoctorLayoutComponent } from '../../layout/doctor-layout/doctor-layout';

export const DOCTOR_ROUTES: Routes = [
  {
    path: '',
    component: DoctorLayoutComponent,
    children: [
      { path: 'dashboard', component: DoctorDashboardComponent },
      { path: 'appointments', component: DoctorAppointmentsComponent },
      { path: 'profile', component: DoctorProfileComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
