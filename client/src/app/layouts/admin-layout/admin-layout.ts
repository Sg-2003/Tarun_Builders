import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass, NgIf, UpperCasePipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgClass, NgIf, UpperCasePipe],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayoutComponent {
  sidebarOpen = true;

  menuItems = [
    { label: 'Overview', path: '/admin/dashboard', icon: 'dashboard' },
    { label: 'Projects', path: '/admin/projects', icon: 'domain' },
    { label: 'Tenders', path: '/admin/tenders', icon: 'description' },
    { label: 'Careers', path: '/admin/careers', icon: 'work' },
    { label: 'Announcements', path: '/admin/news', icon: 'campaign' },
    { label: 'Media Gallery', path: '/admin/gallery', icon: 'photo_library' },
    { label: 'Enquiries', path: '/admin/contacts', icon: 'email' },
    { label: 'Departments', path: '/admin/departments', icon: 'engineering' },
  ];

  constructor(public auth: AuthService) {}

  toggleSidebar() { this.sidebarOpen = !this.sidebarOpen; }
  logout() { this.auth.logout(); }
  getUserAvatar(): string | null {
    const user = this.auth.currentUser();
    if (!user) return null;
    if (user.avatar) return user.avatar;
    if (user.name === 'Tarun' || user.role === 'superadmin') {
      return 'assets/images/owner.png';
    }
    return null;
  }
}
