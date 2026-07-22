import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgClass, NgIf, DatePipe, CurrencyPipe } from '@angular/common';
import { ProjectService } from '../../../../core/services/project.service';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [RouterLink, NgClass, NgIf, DatePipe, CurrencyPipe],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss'
})
export class ProjectDetailComponent implements OnInit {
  project = signal<any | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(private route: ActivatedRoute, private projectService: ProjectService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) this.loadProject(id);
    });
  }

  loadProject(id: string) {
    this.loading.set(true);
    this.projectService.getById(id).subscribe({
      next: res => {
        this.project.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        // Fallback to mock project
        const mock = this.getMockProject(id);
        if (mock) {
          this.project.set(mock);
          this.error.set(null);
        } else {
          this.error.set('Project not found');
        }
        this.loading.set(false);
      }
    });
  }

  getMockProject(id: string) {
    const mocks = [
      {
        _id: '1',
        title: 'Mumbai Coastal Highway Project',
        category: 'Road',
        status: 'Running',
        location: 'Mumbai, Maharashtra',
        progress: 65,
        budget: 'Rs. 450 Cr',
        area: '29.2 km',
        duration: '36 Months',
        clientName: 'MSRDC (Govt of Maharashtra)',
        startDate: new Date('2023-01-15'),
        expectedEndDate: new Date('2025-12-15'),
        governmentOrderNo: 'MSRDC/2022/HW-4091',
        tenderNo: 'TND-2022-MUM-09',
        description: 'Design and construction of 29.2 km coastal highway link including high-speed lanes, toll systems, storm drainage, pre-stressed flyover sections, and safety barricading. Built to handle heavy oceanic winds and salinity.',
        features: ['8 High-Speed Lanes', 'Marine-Grade Concrete', 'Integrated Toll Plaza', 'Anti-Saline Coating', 'Seawall Protection'],
        engineer: { name: 'M. K. Sharma', designation: 'Superintending Engineer', avatar: '' }
      },
      {
        _id: '2',
        title: 'Integrated Government Secretariat Building',
        category: 'Government',
        status: 'Completed',
        location: 'New Delhi, Delhi NCR',
        progress: 100,
        budget: 'Rs. 180 Cr',
        area: '120,000 sq.ft',
        duration: '24 Months',
        clientName: 'CPWD (Central Public Works Department)',
        startDate: new Date('2022-03-01'),
        completionDate: new Date('2024-03-01'),
        governmentOrderNo: 'CPWD/DEL/BLD-0921',
        tenderNo: 'CPWD-T-2021-088',
        description: 'Construction of a premium, state-of-the-art office building complex for central administrative ministries. Built using local materials, highly energy-efficient parameters, and advanced fire-safety structures.',
        features: ['Green Building Certified', 'Seismic Zone 5 Resistant', '100% Solar Powered', 'Centralized HVAC System', 'VDF Flooring'],
        engineer: { name: 'Rajeev Verma', designation: 'Project Executive Engineer', avatar: '' }
      },
      {
        _id: '3',
        title: 'Ganga River Mega-Bridge Link',
        category: 'Bridge',
        status: 'Running',
        location: 'Patna, Bihar',
        progress: 35,
        budget: 'Rs. 720 Cr',
        area: '4.5 km',
        duration: '48 Months',
        clientName: 'NHAI (National Highways Authority of India)',
        startDate: new Date('2023-08-01'),
        expectedEndDate: new Date('2027-08-01'),
        governmentOrderNo: 'NHAI/BR/BRG-012',
        tenderNo: 'NH-BR-2023-04',
        description: 'Construction of a 4.5 km long, four-lane pre-stressed box girder bridge over the River Ganga. Designed with deep well foundations to survive strong currents and flooding.',
        features: ['Well Foundation (45m Depth)', 'Pre-Stressed Box Girders', 'Four Lanes with Footpath', 'River Navigation Span'],
        engineer: { name: 'A. K. Yadav', designation: 'Project Manager / Bridge Expert', avatar: '' }
      }
    ];
    return mocks.find(m => m._id === id) || mocks[0];
  }
}
