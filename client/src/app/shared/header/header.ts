import { Component, HostListener, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  children?: { label: string; path: string }[];
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass, NgIf],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent implements OnInit {
  isScrolled = signal(false);
  mobileMenuOpen = signal(false);
  darkMode = signal(false);
  activeDropdown = signal<string | null>(null);
  currentTime = signal('');

  navItems: NavItem[] = [
    { label: 'Home', path: '/', icon: 'home' },
    { label: 'About', path: '/about', icon: 'info', children: [
      { label: 'About Us', path: '/about' },
      { label: "Chairman's Message", path: '/chairman-message' },
      { label: 'Departments', path: '/departments' },
    ]},
    { label: 'Services', path: '/services', icon: 'construction' },
    { label: 'Projects', path: '/projects', icon: 'domain' },
    { label: 'Tender', path: '/tender', icon: 'description' },
    { label: 'Media', path: '/gallery', icon: 'photo_library', children: [
      { label: 'Gallery', path: '/gallery' },
      { label: 'News & Media', path: '/news' },
    ]},
    { label: 'Careers', path: '/careers', icon: 'work' },
    { label: 'RTI', path: '/rti', icon: 'policy' },
    { label: 'Contact', path: '/contact', icon: 'contact_mail' },
  ];

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.updateTime();
    setInterval(() => this.updateTime(), 60000);
    const saved = localStorage.getItem('tb_dark_mode');
    if (saved === 'true') { this.darkMode.set(true); document.body.classList.add('dark-mode'); }
  }

  updateTime() {
    const now = new Date();
    this.currentTime.set(now.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }));
  }

  @HostListener('window:scroll')
  onScroll() { this.isScrolled.set(window.scrollY > 50); }

  toggleMobile() { this.mobileMenuOpen.update(v => !v); }
  closeMobile() { this.mobileMenuOpen.set(false); }

  toggleDropdown(label: string) {
    this.activeDropdown.update(v => v === label ? null : label);
  }

  toggleDarkMode() {
    this.darkMode.update(v => !v);
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('tb_dark_mode', String(this.darkMode()));
  }

  skipToMain() { document.getElementById('main-content')?.focus(); }
}
