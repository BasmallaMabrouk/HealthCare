import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DoctorDashboard } from './components/doctor-dashboard/doctor-dashboard';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DoctorDashboard, HttpClientModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Healthcare_Appointment_System');
}
