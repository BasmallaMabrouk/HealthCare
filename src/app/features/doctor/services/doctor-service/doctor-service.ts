import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Doctor } from '../../../../core/models/doctor';
import {
  Appointment,
  Medicine,
  MedicalHistory,
  Prescription,
} from '../../../../core/models/appointment';
import { User } from '../../../../core/models/user';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // ─── Doctor ───────────────────────────────────────────────
  getDoctorProfile(id: string): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.baseUrl}/users/${id}`);
  }

  updateDoctorProfile(id: string, data: Partial<Doctor>): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.baseUrl}/users/${id}`, data);
  }

  // ─── Appointments ─────────────────────────────────────────
  getDoctorAppointments(doctorId: string): Observable<Appointment[]> {
    // json-server v1 workaround: filter on client side
    return this.http
      .get<Appointment[]>(`${this.baseUrl}/appointments`)
      .pipe(
        map((appts) =>
          appts.filter((a) => String(a.doctorId) === String(doctorId)),
        ),
      );
  }

  getAppointmentById(id: string): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.baseUrl}/appointments/${id}`);
  }

  updateAppointmentStatus(id: string, status: string): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.baseUrl}/appointments/${id}`, {
      status,
    });
  }

  // ─── Medical History ──────────────────────────────────────
  updateMedicalHistory(
    appointmentId: string,
    medicalHistory: MedicalHistory,
  ): Observable<Appointment> {
    return this.http.patch<Appointment>(
      `${this.baseUrl}/appointments/${appointmentId}`,
      { medicalHistory },
    );
  }

  // ─── Prescription ─────────────────────────────────────────
  getPrescription(appointmentId: string): Observable<Prescription | undefined> {
    return this.getAppointmentById(appointmentId).pipe(
      map((appt) => appt.prescription),
    );
  }

  updatePrescription(
    appointmentId: string,
    prescription: Prescription,
  ): Observable<Appointment> {
    return this.http.patch<Appointment>(
      `${this.baseUrl}/appointments/${appointmentId}`,
      { prescription },
    );
  }

  addMedicine(
    appointmentId: string,
    medicine: Medicine,
  ): Observable<Appointment> {
    return this.getAppointmentById(appointmentId).pipe(
      map((appt) => {
        const existing = appt.prescription?.medicines || [];
        const updated: Prescription = {
          notes: appt.prescription?.notes || '',
          medicines: [...existing, medicine],
        };
        return updated;
      }),
      // switchMap to patch
    ) as any;
    // نستخدم الـ updatePrescription مباشرة من الـ component
  }

  deleteMedicine(
    appointmentId: string,
    medicineId: string,
    currentPrescription: Prescription,
  ): Observable<Appointment> {
    const updated: Prescription = {
      ...currentPrescription,
      medicines: currentPrescription.medicines.filter(
        (m) => m.id !== medicineId,
      ),
    };
    return this.updatePrescription(appointmentId, updated);
  }

  // ─── Patients ─────────────────────────────────────────────
  getPatient(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${id}`);
  }

  getAllPatients(): Observable<User[]> {
    return this.http
      .get<User[]>(`${this.baseUrl}/users`)
      .pipe(map((users) => users.filter((u) => u.role === 'patient')));
  }
}
