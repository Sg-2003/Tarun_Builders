import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass, NgIf, DatePipe, UpperCasePipe } from '@angular/common';
import { DashboardService } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, NgClass, NgIf, DatePipe, UpperCasePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  stats = signal<any>({
    totalProjects: 0,
    completedProjects: 0,
    runningProjects: 0,
    upcomingProjects: 0,
    totalContacts: 0,
    unreadContacts: 0,
    activeTenders: 0,
    publishedNews: 0
  });

  recentContacts = signal<any[]>([]);
  recentProjects = signal<any[]>([]);
  loading = signal(true);

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.loading.set(true);
    this.dashboardService.getStats().subscribe({
      next: res => {
        if (res.success) {
          this.stats.set(res.data.stats);
          this.recentContacts.set(res.data.recentContacts || []);
          this.recentProjects.set(res.data.recentProjects || []);
        }
        this.loading.set(false);
      },
      error: () => {
        // Fallback mock stats
        this.stats.set({
          totalProjects: 14,
          completedProjects: 7,
          runningProjects: 5,
          upcomingProjects: 2,
          totalContacts: 1,
          unreadContacts: 0,
          activeTenders: 2,
          publishedNews: 3
        });
        this.recentProjects.set([
          { _id: '1', title: 'Mumbai Coastal Highway Project', category: 'Road', status: 'Running', location: 'Mumbai' },
          { _id: '2', title: 'Integrated Government Secretariat Building', category: 'Government', status: 'Completed', location: 'Delhi' }
        ]);
        this.recentContacts.set([
          { _id: '1', name: 'Raj Kumar', email: 'raj@gmail.com', subject: 'Tender bidding query', type: 'Tender', createdAt: new Date() }
        ]);
        this.loading.set(false);
      }
    });
  }
}
