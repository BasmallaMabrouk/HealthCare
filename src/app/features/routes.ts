import { Routes } from '@angular/router';
import { PatientDashboard } from './patient/patient-dashboard/patient-dashboard';
import { AppointmentsList } from './patient/appointments-list/appointments-list';
import { PatientProfile } from './patient/patient-profile/patient-profile';

export const PATIENT_ROUTES: Routes = [
  { path: '', component: PatientDashboard },
  { path: 'appointments', component: AppointmentsList },
  { path: 'profile', component: PatientProfile },
];