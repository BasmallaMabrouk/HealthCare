import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
} from '@angular/forms';
import { switchMap } from 'rxjs';
import { DoctorService } from '../../../doctor/services/doctor-service/doctor-service';
import {
  Appointment,
  Medicine,
  MedicalHistory,
  Prescription,
} from '../../../../core/models/appointment';
import { User } from '../../../../core/models/user';

@Component({
  selector: 'app-appointment-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './appointment-detail.html',
  styleUrls: ['./appointment-detail.css'],
})
export class AppointmentDetailComponent implements OnInit {
  appointment: Appointment | null = null;
  patient: User | null = null;
  activeTab: 'history' | 'prescription' = 'history';
  saving = false;
  saveSuccess = false;
  saveError = false;

  // doctorId يجي من الـ URL أو fallback لـ '2' لحد ما يجي auth
  doctorId = '2';

  historyForm!: FormGroup;
  prescriptionForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private doctorService: DoctorService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    // جيب الـ doctorId من الـ URL لو موجود
    this.route.queryParams.subscribe((params) => {
      if (params['doctorId']) {
        this.doctorId = params['doctorId'];
      }
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.loadAppointment(id);
  }

  loadAppointment(id: string): void {
    this.doctorService.getAppointmentById(id).subscribe({
      next: (appt) => {
        this.appointment = appt;
        this.initForms(appt);
        this.doctorService.getPatient(appt.patientId).subscribe((p) => {
          this.patient = p;
        });
      },
      error: () => this.router.navigate(['/doctor/appointments']),
    });
  }

  initForms(appt: Appointment): void {
    // Medical History Form
    const h = appt.medicalHistory;
    this.historyForm = this.fb.group({
      symptoms: [h?.symptoms || ''],
      allergies: [h?.allergies || ''],
      chronicDiseases: [h?.chronicDiseases || ''],
      previousSurgeries: [h?.previousSurgeries || ''],
      currentMedications: [h?.currentMedications || ''],
    });

    // Prescription Form
    const p = appt.prescription;
    this.prescriptionForm = this.fb.group({
      notes: [p?.notes || ''],
      medicines: this.fb.array(
        (p?.medicines || []).map((m) => this.buildMedicineGroup(m)),
      ),
    });
  }

  // ─── Medicine FormArray Helpers ───────────────────────────

  buildMedicineGroup(m?: Partial<Medicine>): FormGroup {
    return this.fb.group({
      id: [m?.id || this.genId()],
      name: [m?.name || '', Validators.required],
      dose: [m?.dose || '', Validators.required],
      frequency: [m?.frequency || '', Validators.required],
      duration: [m?.duration || '', Validators.required],
    });
  }

  get medicines(): FormArray {
    return this.prescriptionForm.get('medicines') as FormArray;
  }

  addMedicine(): void {
    this.medicines.push(this.buildMedicineGroup());
  }

  removeMedicine(index: number): void {
    this.medicines.removeAt(index);
  }

  // ─── Save Medical History ─────────────────────────────────

  saveHistory(): void {
    if (!this.appointment) return;
    this.saving = true;
    const history: MedicalHistory = this.historyForm.value;

    this.doctorService
      .updateMedicalHistory(this.appointment.id, history)
      .subscribe({
        next: (updated) => {
          this.appointment = updated;
          this.saving = false;
          this.showFeedback('success');
        },
        error: () => {
          this.saving = false;
          this.showFeedback('error');
        },
      });
  }

  // ─── Save Prescription ────────────────────────────────────

  savePrescription(): void {
    if (!this.appointment) return;
    this.saving = true;
    const prescription: Prescription = this.prescriptionForm.value;

    this.doctorService
      .updatePrescription(this.appointment.id, prescription)
      .subscribe({
        next: (updated) => {
          this.appointment = updated;
          this.saving = false;
          this.showFeedback('success');
        },
        error: () => {
          this.saving = false;
          this.showFeedback('error');
        },
      });
  }

  // ─── Feedback ─────────────────────────────────────────────

  showFeedback(type: 'success' | 'error'): void {
    if (type === 'success') {
      this.saveSuccess = true;
      setTimeout(() => (this.saveSuccess = false), 2500);
    } else {
      this.saveError = true;
      setTimeout(() => (this.saveError = false), 2500);
    }
  }

  // ─── Helpers ──────────────────────────────────────────────

  genId(): string {
    return 'm' + Date.now() + Math.random().toString(36).slice(2, 5);
  }

  getInitials(name: string): string {
    if (!name) return '??';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  goBack(): void {
    this.router.navigate(['/doctor/appointments']);
  }
}
