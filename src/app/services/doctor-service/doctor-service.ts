import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Doctor } from '../../Models/doctor';
import { Appointment } from '../../Models/appointment';
import { User } from '../../Models/user';

@Injectable({
  providedIn: 'root', // ده يخليه متاح للمشروع كله
})
export class DoctorService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getDoctorProfile(id: string): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/users/${id}`);
  }

  updateDoctorProfile(id: string, data: Partial<Doctor>): Observable<Doctor> {
    return this.http.put<Doctor>(`${this.apiUrl}/users/${id}`, data);
  }

  getDoctorAppointments(doctorId: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/appointments?doctorId=${doctorId}`);
  }

  updateAppointmentStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/appointments/${id}`, { status });
  }
  getPatient(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }
}
