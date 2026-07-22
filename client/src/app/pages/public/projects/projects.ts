import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { ProjectService } from '../../../core/services/project.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [RouterLink, NgClass, FormsModule],
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class Projects implements OnInit {
  projects = signal<any[]>([]);
  loading = signal(true);
  
  // Filter settings
  selectedCategory = signal<string>('');
  selectedStatus = signal<string>('');
  searchQuery = signal<string>('');

  categories = ['Residential', 'Commercial', 'Government', 'Road', 'Bridge', 'Metro', 'SmartCity'];
  statuses = ['Running', 'Completed', 'Upcoming'];

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.loading.set(true);
    const params: any = {};
    if (this.selectedCategory()) params.category = this.selectedCategory();
    if (this.selectedStatus()) params.status = this.selectedStatus();

    this.projectService.getAll(params).subscribe({
      next: res => {
        let list = res.data || [];
        if (this.searchQuery()) {
          const q = this.searchQuery().toLowerCase();
          list = list.filter((p: any) => p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q));
        }
        this.projects.set(list);
        this.loading.set(false);
      },
      error: () => {
        let list = this.getMockProjects();
        if (this.selectedCategory()) list = list.filter(p => p.category === this.selectedCategory());
        if (this.selectedStatus()) list = list.filter(p => p.status === this.selectedStatus());
        if (this.searchQuery()) {
          const q = this.searchQuery().toLowerCase();
          list = list.filter(p => p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q));
        }
        this.projects.set(list);
        this.loading.set(false);
      }
    });
  }

  filterCategory(cat: string) {
    this.selectedCategory.set(cat);
    this.loadProjects();
  }

  filterStatus(status: string) {
    this.selectedStatus.set(status);
    this.loadProjects();
  }

  clearFilters() {
    this.selectedCategory.set('');
    this.selectedStatus.set('');
    this.searchQuery.set('');
    this.loadProjects();
  }

  getMockProjects() {
    return [
      { _id: '1', title: 'Mumbai Coastal Highway Project', category: 'Road', status: 'Running', location: 'Mumbai, MH', progress: 65, budget: 'Rs. 450 Cr', area: '29.2 km', duration: '36 Months' },
      { _id: '2', title: 'Integrated Government Secretariat Building', category: 'Government', status: 'Completed', location: 'Delhi NCR', progress: 100, budget: 'Rs. 180 Cr', area: '120,000 sq.ft', duration: '24 Months' },
      { _id: '3', title: 'Ganga River Mega-Bridge Link', category: 'Bridge', status: 'Running', location: 'Patna, BR', progress: 35, budget: 'Rs. 720 Cr', area: '4.5 km', duration: '48 Months' },
      { _id: '4', title: 'Metro Line Elevates Viaduct & 4 Stations', category: 'Metro', status: 'Running', location: 'Pune, MH', progress: 75, budget: 'Rs. 280 Cr', area: '8.2 km', duration: '30 Months' },
      { _id: '5', title: 'Smart City Sewerage & Stormwater Drainage', category: 'SmartCity', status: 'Completed', location: 'Indore, MP', progress: 100, budget: 'Rs. 125 Cr', area: 'All Zones', duration: '18 Months' },
      { _id: '6', title: 'Civil Aviation Terminal Expansion', category: 'Government', status: 'Upcoming', location: 'Nagpur, MH', progress: 0, budget: 'Rs. 95 Cr', area: '45,000 sq.ft', duration: '12 Months' },
      { _id: '7', title: 'Tarun Greenview Premium Residential Towers', category: 'Residential', status: 'Completed', location: 'Thane, MH', progress: 100, budget: 'Rs. 150 Cr', area: '3 Towers', duration: '30 Months' },
      { _id: '8', title: 'Grand Central Commercial Business Park', category: 'Commercial', status: 'Running', location: 'Navi Mumbai, MH', progress: 55, budget: 'Rs. 320 Cr', area: '250,000 sq.ft', duration: '36 Months' }
    ];
  }
}
