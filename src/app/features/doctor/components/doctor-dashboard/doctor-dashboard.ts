import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DoctorService } from '../../services/doctor-service/doctor-service';
import { Appointment } from '../../../../core/models/appointment';
import { Doctor } from '../../../../core/models/doctor';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './doctor-dashboard.html',
  styleUrls: ['./doctor-dashboard.css'],
})
export class DoctorDashboardComponent implements OnInit {
  appointments: Appointment[] = [];
  patientNames: { [id: string]: string } = {};
  doctor: Doctor | null = null;
  activeFilter = 'all';
  doctorId = '2';

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.doctorService.getDoctorProfile(this.doctorId).subscribe((data) => {
      this.doctor = data;
    });

    this.doctorService.getDoctorAppointments(this.doctorId).subscribe((appts) => {
      this.appointments = appts;
      if (appts.length === 0) return;

      const requests = appts.map((a) => this.doctorService.getPatient(a.patientId));
      forkJoin(requests).subscribe((patients) => {
        patients.forEach((p) => {
          this.patientNames[p.id] = p.name;
        });
      });
    });
  }

  getPatientName(patientId: string): string {
    return this.patientNames[patientId] || '...';
  }

  getInitials(name: string): string {
    if (!name || name === '...') return '??';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  filterAppts(status: string) {
    this.activeFilter = status;
  }

  get filteredAppointments() {
    if (this.activeFilter === 'all') return this.appointments;
    return this.appointments.filter((a) => a.status === this.activeFilter);
  }

  get totalAppointments() {
    return this.appointments.length;
  }
  get confirmedCount() {
    return this.appointments.filter((a) => a.status === 'confirmed').length;
  }
  get pendingCount() {
    return this.appointments.filter((a) => a.status === 'pending').length;
  }
}
