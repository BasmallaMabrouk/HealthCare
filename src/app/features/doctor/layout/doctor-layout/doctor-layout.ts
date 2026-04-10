import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doctor-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: 'doctor-layout.html',
  styleUrl: 'doctor-layout.css',
  encapsulation: ViewEncapsulation.None,
})
export class DoctorLayoutComponent {
  navItems = [
    { path: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: 'appointments', label: 'Appointments', icon: 'calendar_today' },
    { path: 'profile', label: 'Profile', icon: 'person' },
  ];
}
