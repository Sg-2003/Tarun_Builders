import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { DepartmentService } from '../../../core/services/department.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-departments',
  standalone: true,
  imports: [RouterLink, NgClass, NgIf, FormsModule],
  templateUrl: './departments.html',
  styleUrl: './departments.scss',
})
export class AdminDepartmentsComponent implements OnInit {
  departments = signal<any[]>([]);
  loading = signal(true);

  constructor(private departmentService: DepartmentService) {}

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments() {
    this.loading.set(true);
    this.departmentService.getAll().subscribe({
      next: res => { this.departments.set(res.data || []); this.loading.set(false); },
      error: () => { this.departments.set(this.getMockDepartments()); this.loading.set(false); }
    });
  }

  getMockDepartments() {
    return [
      { _id: '1', name: 'Civil Engineering Department', code: 'CED', headName: 'Dr. Ramesh Nair', headDesignation: 'Chief Engineer (Civil)' }
    ];
  }
}
