import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass, DatePipe, NgIf } from '@angular/common';
import { CareerService } from '../../../core/services/career.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-careers',
  standalone: true,
  imports: [RouterLink, NgClass, DatePipe, NgIf, FormsModule],
  templateUrl: './careers.html',
  styleUrl: './careers.scss',
})
export class Careers implements OnInit {
  jobs = signal<any[]>([]);
  loading = signal(true);
  
  // Selection
  selectedJob = signal<any | null>(null);

  // Form
  applicationForm = { name: '', email: '', phone: '', coverLetter: '' };
  resumeFile: File | null = null;
  formSubmitting = signal(false);
  formSuccess = signal(false);
  formError = signal<string | null>(null);

  constructor(private careerService: CareerService) {}

  ngOnInit() {
    this.loadJobs();
  }

  loadJobs() {
    this.loading.set(true);
    this.careerService.getAll().subscribe({
      next: res => {
        this.jobs.set(res.data || []);
        this.loading.set(false);
      },
      error: () => {
        this.jobs.set(this.getMockJobs());
        this.loading.set(false);
      }
    });
  }

  selectJob(job: any) {
    this.selectedJob.set(job);
    this.formSuccess.set(false);
    this.formError.set(null);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.resumeFile = file;
    }
  }

  submitApplication() {
    const job = this.selectedJob();
    if (!job) return;
    if (!this.applicationForm.name || !this.applicationForm.email || !this.resumeFile) {
      this.formError.set('Name, email, and resume file are required.');
      return;
    }

    this.formSubmitting.set(true);
    this.formError.set(null);

    const formData = new FormData();
    formData.append('name', this.applicationForm.name);
    formData.append('email', this.applicationForm.email);
    formData.append('phone', this.applicationForm.phone);
    formData.append('coverLetter', this.applicationForm.coverLetter);
    formData.append('resume', this.resumeFile);

    this.careerService.apply(job._id, formData).subscribe({
      next: () => {
        this.formSuccess.set(true);
        this.formSubmitting.set(false);
        this.applicationForm = { name: '', email: '', phone: '', coverLetter: '' };
        this.resumeFile = null;
      },
      error: (err) => {
        this.formError.set(err.error?.message || 'Error submitting application. Please try again.');
        this.formSubmitting.set(false);
      }
    });
  }

  getMockJobs() {
    return [
      {
        _id: '1',
        title: 'Senior Civil Engineer (Highways)',
        department: 'Highways Division',
        location: 'Mumbai, MH',
        type: 'Full-time',
        experience: '8-10 Years',
        qualification: 'B.Tech / M.Tech in Civil Engineering',
        salary: 'Rs. 12 - 15 LPA',
        vacancies: 2,
        description: 'Supervision and technical control of asphalt/rigid pavement highways. Experience in well foundation bridges and flyovers is highly preferred.',
        lastDate: new Date('2025-08-30')
      },
      {
        _id: '2',
        title: 'Site Safety Supervisor',
        department: 'Quality & Safety',
        location: 'Pune, MH',
        type: 'Full-time',
        experience: '3-5 Years',
        qualification: 'Diploma in Civil / Certificate in Construction Safety',
        salary: 'Rs. 4.5 - 6 LPA',
        vacancies: 4,
        description: 'Implementing and monitoring strict OHSAS safety compliance parameters across elevated metro station sites. Audits daily safety drills.',
        lastDate: new Date('2025-09-10')
      }
    ];
  }
}
