import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { DepartmentService } from '../../../core/services/department.service';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './departments.html',
  styleUrl: './departments.scss'
})
export class Departments implements OnInit {
  departments = signal<any[]>([]);
  loading = signal(true);

  constructor(private departmentService: DepartmentService) {}

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments() {
    this.loading.set(true);
    this.departmentService.getAll().subscribe({
      next: res => {
        this.departments.set(res.data || []);
        this.loading.set(false);
      },
      error: () => {
        this.departments.set(this.getMockDepartments());
        this.loading.set(false);
      }
    });
  }

  getMockDepartments() {
    return [
      {
        _id: '1',
        name: 'Civil Engineering Department',
        code: 'CED',
        description: 'Focuses on the design, structural analysis, foundation works, and main structure construction of all buildings, bridges, and highway concrete components.',
        headName: 'Dr. Ramesh Nair',
        headDesignation: 'Chief Engineer (Civil)',
        icon: 'construction',
        color: '#003580',
        services: ['Structural Analysis', 'High-Rise RCC Design', 'Soil/Geotechnical Testing', 'Foundation Engineering']
      },
      {
        _id: '2',
        name: 'Highways & Pavement Works',
        code: 'HPD',
        description: 'Dedicated to earthwork excavation, sub-base preparation, asphalt mixtures, concrete pavements, highway toll integration, and traffic safety systems.',
        headName: 'Sanjay Deshmukh',
        headDesignation: 'Executive Engineer (Highways)',
        icon: 'add_road',
        color: '#C9A227',
        services: ['Flexible/Asphalt Pavements', 'Rigid Concrete Roads', 'Drainage Design', 'Toll Plaza Infrastructure']
      },
      {
        _id: '3',
        name: 'Electrical & Electrification',
        code: 'EED',
        description: 'Handles high-voltage substation integration, street lighting, smart grids, solar power installations, and indoor electrical routing for multi-story blocks.',
        headName: 'Amit Trivedi',
        headDesignation: 'Superintending Engineer (Elec.)',
        icon: 'bolt',
        color: '#138808',
        services: ['Sub-Station Erection', 'Underground HT/LT Ducting', 'Solar Grid Engineering', 'Smart Lighting Networks']
      },
      {
        _id: '4',
        name: 'Quality Assurance & Control',
        code: 'QAD',
        description: 'Maintains field and lab-testing check routines for concrete cube compression, material purity, compaction densities, and full ISO quality compliance audits.',
        headName: 'K. R. Rao',
        headDesignation: 'Director of QA & Safety',
        icon: 'verified',
        color: '#01579B',
        services: ['Concrete Compression Audits', 'NDT Non-Destructive Testing', 'Material Chemical Verification', 'ISO Compliance Auditing']
      }
    ];
  }
}
