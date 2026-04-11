import { Routes } from '@angular/router';
import { DoctorDashboardComponent } from './doctor-dashboard';
import { DoctorAppointmentsComponent } from '../appointments/appointments';
import { AppointmentDetailComponent } from '../appointment-detail/appointment-detail';
import { DoctorProfileComponent } from '../profile/profile';
import { DoctorLayoutComponent } from '../../layout/doctor-layout/doctor-layout';

export const DOCTOR_ROUTES: Routes = [
  {
    path: '',
    component: DoctorLayoutComponent,
    children: [
      { path: 'dashboard', component: DoctorDashboardComponent },
      { path: 'appointments', component: DoctorAppointmentsComponent },
      { path: 'appointments/:id', component: AppointmentDetailComponent },
      { path: 'profile', component: DoctorProfileComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
