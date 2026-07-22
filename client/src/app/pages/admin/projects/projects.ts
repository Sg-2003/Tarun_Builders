import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { ProjectService } from '../../../core/services/project.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-projects',
  standalone: true,
  imports: [RouterLink, NgClass, NgIf, FormsModule],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class AdminProjectsComponent implements OnInit {
  projects = signal<any[]>([]);
  loading = signal(true);

  // Modal control
  isModalOpen = signal(false);
  modalTitle = signal('Add New Project');
  editingProjectId = signal<string | null>(null);

  // Form Model
  projectForm = {
    title: '',
    category: 'Government',
    status: 'Running',
    location: '',
    budget: '',
    area: '',
    duration: '',
    progress: 0,
    description: '',
    featuresInput: '',
    governmentOrderNo: '',
    tenderNo: '',
  };

  categories = ['Residential', 'Commercial', 'Government', 'Road', 'Bridge', 'Metro', 'SmartCity'];
  statuses = ['Running', 'Completed', 'Upcoming', 'OnHold'];

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.loading.set(true);
    this.projectService.getAll().subscribe({
      next: res => {
        this.projects.set(res.data || []);
        this.loading.set(false);
      },
      error: () => {
        this.projects.set(this.getMockProjects());
        this.loading.set(false);
      }
    });
  }

  openAddModal() {
    this.editingProjectId.set(null);
    this.modalTitle.set('Add New Project');
    this.resetForm();
    this.isModalOpen.set(true);
  }

  openEditModal(p: any) {
    this.editingProjectId.set(p._id);
    this.modalTitle.set('Edit Project');
    this.projectForm = {
      title: p.title,
      category: p.category,
      status: p.status,
      location: p.location,
      budget: p.budget || '',
      area: p.area || '',
      duration: p.duration || '',
      progress: p.progress || 0,
      description: p.description || '',
      featuresInput: p.features ? p.features.join(', ') : '',
      governmentOrderNo: p.governmentOrderNo || '',
      tenderNo: p.tenderNo || '',
    };
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  saveProject() {
    if (!this.projectForm.title || !this.projectForm.location) return;

    const data: any = {
      ...this.projectForm,
      features: this.projectForm.featuresInput.split(',').map(f => f.trim()).filter(Boolean)
    };

    if (this.editingProjectId()) {
      this.projectService.update(this.editingProjectId()!, data).subscribe({
        next: () => {
          this.loadProjects();
          this.closeModal();
        },
        error: () => {
          // Local fallback update for demo
          this.projects.update(list => list.map(item => item._id === this.editingProjectId() ? { ...item, ...data } : item));
          this.closeModal();
        }
      });
    } else {
      // Simulate multipart body or simple json
      const formData = new FormData();
      Object.keys(data).forEach(k => {
        if (k !== 'features') formData.append(k, data[k]);
      });
      data.features.forEach((f: string) => formData.append('features[]', f));

      this.projectService.create(formData).subscribe({
        next: () => {
          this.loadProjects();
          this.closeModal();
        },
        error: () => {
          // Local fallback creation for demo
          const newProj = { _id: Date.now().toString(), ...data };
          this.projects.update(list => [newProj, ...list]);
          this.closeModal();
        }
      });
    }
  }

  deleteProject(id: string) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    this.projectService.delete(id).subscribe({
      next: () => this.loadProjects(),
      error: () => {
        this.projects.update(list => list.filter(item => item._id !== id));
      }
    });
  }

  resetForm() {
    this.projectForm = {
      title: '',
      category: 'Government',
      status: 'Running',
      location: '',
      budget: '',
      area: '',
      duration: '',
      progress: 0,
      description: '',
      featuresInput: '',
      governmentOrderNo: '',
      tenderNo: '',
    };
  }

  getMockProjects() {
    return [
      { _id: '1', title: 'Mumbai Coastal Highway Project', category: 'Road', status: 'Running', location: 'Mumbai', progress: 65, budget: 'Rs. 450 Cr' },
      { _id: '2', title: 'Integrated Government Secretariat Building', category: 'Government', status: 'Completed', location: 'Delhi', progress: 100, budget: 'Rs. 180 Cr' }
    ];
  }
}
