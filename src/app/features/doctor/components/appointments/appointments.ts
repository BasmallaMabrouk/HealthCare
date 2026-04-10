import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../../doctor/services/doctor-service/doctor-service';
import { Appointment } from '../../../../core/models/appointment';

@Component({
  selector: 'app-doctor-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointments.html',
  styleUrls: ['./appointments.css'],
})
export class DoctorAppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  patientNames: { [id: string]: string } = {};
  doctorId = '2';

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments() {
    this.doctorService.getDoctorAppointments(this.doctorId).subscribe((appts) => {
      this.appointments = appts;
      appts.forEach((a) => {
        this.doctorService.getPatient(a.patientId).subscribe((p) => {
          this.patientNames[p.id] = p.name;
        });
      });
    });
  }

  changeStatus(id: string, status: string) {
    this.doctorService.updateAppointmentStatus(id, status).subscribe(() => {
      this.loadAppointments();
    });
  }

  getPatientName(id: string) {
    return this.patientNames[id] || '...';
  }
}
