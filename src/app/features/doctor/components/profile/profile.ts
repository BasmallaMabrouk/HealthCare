import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DoctorService } from '../../services/doctor-service/doctor-service';
import { Doctor } from '../../../../core/models/doctor';

@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: 'profile.html',
  styleUrls: ['profile.css'],
})
export class DoctorProfileComponent implements OnInit {
  doctor: Doctor | null = null;
  profileForm!: FormGroup;
  slotForm!: FormGroup;
  doctorId = '2';
  showSlotForm = false;

  constructor(
    private doctorService: DoctorService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.slotForm = this.fb.group({
      day: ['Sunday', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
    });
  }

  loadProfile() {
    this.doctorService.getDoctorProfile(this.doctorId).subscribe((data) => {
      this.doctor = data;
      this.profileForm = this.fb.group({
        name: [data.name, Validators.required],
        specialization: [data.specialization, Validators.required],
        bio: [data.bio, Validators.required],
        experience: [data.experience, [Validators.required, Validators.min(0)]],
      });
    });
  }

  saveProfile() {
    if (this.profileForm.valid) {
      this.doctorService
        .updateDoctorProfile(this.doctorId, this.profileForm.value)
        .subscribe(() => {
          this.loadProfile();
          alert('Profile updated successfully!');
        });
    }
  }

  addSlot() {
    if (this.slotForm.valid && this.doctor) {
      const newSlot = { ...this.slotForm.value, isBooked: false };
      const updatedSlots = [...(this.doctor.availableSlots || []), newSlot];

      this.doctorService
        .updateDoctorProfile(this.doctorId, { availableSlots: updatedSlots })
        .subscribe(() => {
          this.loadProfile();
          this.showSlotForm = false;
          this.slotForm.reset({ day: 'Sunday' });
        });
    }
  }

  removeSlot(index: number) {
    if (this.doctor) {
      const updatedSlots = this.doctor.availableSlots.filter((_, i) => i !== index);
      this.doctorService
        .updateDoctorProfile(this.doctorId, { availableSlots: updatedSlots })
        .subscribe(() => {
          this.loadProfile();
        });
    }
  }
}
