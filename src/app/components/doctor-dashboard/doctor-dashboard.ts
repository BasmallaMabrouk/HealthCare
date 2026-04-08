import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs'; // ← ضيف الـ import ده
import { DoctorService } from '../../services/doctor-service/doctor-service';
import { Appointment } from '../../Models/appointment';
import { Doctor } from '../../Models/doctor';

@Component({
  selector: 'app-doctor-dashboard',
  imports: [CommonModule],
  templateUrl: './doctor-dashboard.html',
  styleUrl: './doctor-dashboard.css',
})
export class DoctorDashboard implements OnInit {
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

      if (appts.length === 0) return; // ← لو مفيش appointments وقف

      const requests = appts.map(
        (a) => this.doctorService.getPatient(a.patientId), // ← جيب بيانات كل مريض
      );

      forkJoin(requests).subscribe({
        next: (patients) => {
          patients.forEach((p) => {
            this.patientNames[p.id] = p.name; // ← احفظ الاسم في الـ map
          });
        },
        error: (err) => console.error(err),
      });
    });
  }

  changeStatus(id: string, newStatus: string) {
    this.doctorService.updateAppointmentStatus(id, newStatus).subscribe(() => {
      this.ngOnInit();
    });
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

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  // جوه كلاس الـ Component
  addSlot(day: string, start: string, end: string) {
    if (!day || !start || !end) {
      alert('برجاء إدخال كافة تفاصيل الموعد');
      return;
    }

    const newSlot = {
      day: day,
      startTime: start,
      endTime: end,
      isBooked: false, // الموعد الجديد بيبقى متاح طبعاً
    };

    // إضافة الموعد الجديد لمصفوفة الدكتور
    this.doctor?.availableSlots.push(newSlot);

    // ملحوظة: لو الداتا جاية من JSON Server، هتحتاجي تبعتي POST request هنا
  }
}
