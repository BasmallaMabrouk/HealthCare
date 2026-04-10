import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Doctor } from '../../../../core/models/doctor';
import { Appointment } from '../../../../core/models/appointment';
import { User } from '../../../../core/models/user';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getDoctorProfile(id: string): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.baseUrl}/users/${id}`);
  }

  getDoctorAppointments(doctorId: string): Observable<Appointment[]> {
    // json-server v1 filtering workaround - filter on client side
    return this.http
      .get<Appointment[]>(`${this.baseUrl}/appointments`)
      .pipe(
        map((appointments) =>
          appointments.filter((a) => String(a.doctorId) === String(doctorId)),
        ),
      );
  }

  getPatient(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${id}`);
  }

  updateAppointmentStatus(id: string, status: string): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.baseUrl}/appointments/${id}`, {
      status,
    });
  }

  updateDoctorProfile(id: string, data: Partial<Doctor>): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.baseUrl}/users/${id}`, data);
  }
}
