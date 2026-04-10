import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorService } from './doctor-service';

describe('DoctorService', () => {
  let component: DoctorService;
  let fixture: ComponentFixture<DoctorService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
