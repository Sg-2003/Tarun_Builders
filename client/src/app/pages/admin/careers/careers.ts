import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass, NgIf, DatePipe, DecimalPipe } from '@angular/common';
import { CareerService } from '../../../core/services/career.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-careers',
  standalone: true,
  imports: [RouterLink, NgClass, NgIf, DatePipe, DecimalPipe, FormsModule],
  templateUrl: './careers.html',
  styleUrl: './careers.scss',
})
export class AdminCareersComponent implements OnInit {
  jobs = signal<any[]>([]);
  loading = signal(true);
  saving = signal(false);
  showForm = signal(false);
  showApplicationsModal = signal(false);
  deleteConfirmId = signal<string | null>(null);

  selectedJob = signal<any | null>(null);
  
  form: any = this.emptyForm();

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
        this.jobs.set([]);
        this.loading.set(false);
      }
    });
  }

  emptyForm() {
    return {
      _id: null,
      title: '',
      department: '',
      location: '',
      type: 'Full-time',
      experience: '',
      qualification: '',
      salary: '',
      vacancies: 1,
      description: '',
      responsibilities: '',
      requirements: '',
      lastDate: '',
      isActive: true
    };
  }

  openAdd() {
    this.form = this.emptyForm();
    this.showForm.set(true);
  }

  openEdit(job: any) {
    this.form = {
      ...job,
      responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join('\n') : (job.responsibilities || ''),
      requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : (job.requirements || ''),
      lastDate: job.lastDate ? new Date(job.lastDate).toISOString().substring(0, 10) : ''
    };
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
  }

  saveJob() {
    if (!this.form.title || !this.form.department) return;
    this.saving.set(true);

    const payload = {
      ...this.form,
      responsibilities: this.form.responsibilities ? this.form.responsibilities.split('\n').map((r: string) => r.trim()).filter(Boolean) : [],
      requirements: this.form.requirements ? this.form.requirements.split('\n').map((r: string) => r.trim()).filter(Boolean) : []
    };

    if (payload._id === null) {
      delete payload._id;
    }

    if (this.form._id) {
      this.careerService.update(this.form._id, payload).subscribe({
        next: res => {
          this.jobs.update(items => items.map(j => j._id === res.data._id ? res.data : j));
          this.saving.set(false);
          this.closeForm();
        },
        error: (err) => {
          console.error('Update job failed:', err);
          this.saving.set(false);
        }
      });
    } else {
      this.careerService.create(payload).subscribe({
        next: res => {
          this.jobs.update(items => [res.data, ...items]);
          this.saving.set(false);
          this.closeForm();
        },
        error: (err) => {
          console.error('Create job failed:', err);
          this.saving.set(false);
        }
      });
    }
  }

  confirmDelete(id: string) {
    this.deleteConfirmId.set(id);
  }

  cancelDelete() {
    this.deleteConfirmId.set(null);
  }

  deleteJob(id: string) {
    this.careerService.delete(id).subscribe({
      next: () => {
        this.jobs.update(items => items.filter(j => j._id !== id));
        this.deleteConfirmId.set(null);
      }
    });
  }

  // Application management
  openApplications(job: any) {
    this.selectedJob.set(job);
    this.showApplicationsModal.set(true);
  }

  closeApplications() {
    this.showApplicationsModal.set(false);
    this.selectedJob.set(null);
  }

  updateApplicationStatus(appIndex: number, newStatus: string) {
    const job = this.selectedJob();
    if (!job) return;

    // Clone the applications array and update the status of the specific index
    const updatedApps = [...job.applications];
    updatedApps[appIndex] = {
      ...updatedApps[appIndex],
      status: newStatus
    };

    this.careerService.update(job._id, { applications: updatedApps }).subscribe({
      next: res => {
        this.selectedJob.set(res.data);
        this.jobs.update(items => items.map(j => j._id === res.data._id ? res.data : j));
      },
      error: err => {
        console.error('Update status failed:', err);
      }
    });
  }

  getResumeFilename(url: string): string {
    if (!url) return 'Resume';
    return url.split('/').pop() || 'Download Resume';
  }

  getApplicationsCount(): number {
    return this.jobs().reduce((acc, job) => acc + (job.applications ? job.applications.length : 0), 0);
  }
}
