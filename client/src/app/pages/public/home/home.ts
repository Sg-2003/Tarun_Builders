import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass, DatePipe } from '@angular/common';
import { ProjectService } from '../../../core/services/project.service';
import { NewsService } from '../../../core/services/news.service';
import { ContactService } from '../../../core/services/contact.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NgClass, FormsModule, DatePipe],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {
  featuredProjects = signal<any[]>([]);
  latestNews = signal<any[]>([]);
  heroSlide = signal(0);
  countersVisible = signal(false);

  heroSlides = [
    { title: "Building India's Future", subtitle: "Quality. Trust. Excellence.", tag: "Government Registered Contractor", bg: 'slide-1' },
    { title: "Infrastructure Excellence", subtitle: "Over 200+ Projects Delivered Across India", tag: "ISO 9001:2015 Certified", bg: 'slide-2' },
    { title: "Smart City Solutions", subtitle: "Modern Infrastructure for Modern India", tag: "Class A Contractor", bg: 'slide-3' },
  ];

  stats = [
    { label: 'Projects Completed', value: 200, suffix: '+', icon: 'domain' },
    { label: 'Years of Experience', value: 20, suffix: '+', icon: 'history' },
    { label: 'States Covered', value: 15, suffix: '', icon: 'map' },
    { label: 'Happy Clients', value: 150, suffix: '+', icon: 'groups' },
  ];

  services = [
    { title: 'Civil Construction', desc: 'Residential & commercial building construction with highest quality standards.', icon: 'construction' },
    { title: 'Road & Highway', desc: 'National & state highway construction, bridges, flyovers and underpasses.', icon: 'add_road' },
    { title: 'Government Projects', desc: 'CPWD, PWD, NHAI projects with full compliance and transparency.', icon: 'account_balance' },
    { title: 'Metro & Railway', desc: 'Metro rail civil works, stations, viaducts and tunneling projects.', icon: 'train' },
    { title: 'Smart City', desc: 'Smart infrastructure, utilities, drainage and urban development works.', icon: 'location_city' },
    { title: 'Project Management', desc: 'End-to-end PMC services with digital monitoring and real-time reporting.', icon: 'manage_accounts' },
  ];

  // Quick contact form
  quickForm = { name: '', email: '', phone: '', message: '' };
  formSubmitting = signal(false);
  formSuccess = signal(false);

  private slideInterval: any;

  constructor(private projectService: ProjectService, private newsService: NewsService, private contactService: ContactService) {}

  ngOnInit() {
    this.loadFeaturedProjects();
    this.loadLatestNews();
    this.startSlider();
    this.initCounters();
  }

  loadFeaturedProjects() {
    this.projectService.getAll({ featured: true, limit: 6 }).subscribe({
      next: res => this.featuredProjects.set(res.data || []),
      error: () => this.featuredProjects.set(this.getMockProjects())
    });
  }

  loadLatestNews() {
    this.newsService.getAll({ limit: 3 }).subscribe({
      next: res => this.latestNews.set(res.data || []),
      error: () => this.latestNews.set(this.getMockNews())
    });
  }

  startSlider() {
    this.slideInterval = setInterval(() => {
      this.heroSlide.update(i => (i + 1) % this.heroSlides.length);
    }, 5000);
  }

  setSlide(i: number) { this.heroSlide.set(i); clearInterval(this.slideInterval); this.startSlider(); }

  initCounters() {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !this.countersVisible()) {
        this.countersVisible.set(true);
        this.animateCounters();
      }
    }, { threshold: 0.3 });
    setTimeout(() => {
      const el = document.getElementById('stats-section');
      if (el) observer.observe(el);
    }, 500);
  }

  animateCounters() {
    this.stats.forEach((stat, i) => {
      let start = 0;
      const end = stat.value;
      const duration = 2000;
      const step = Math.ceil(end / (duration / 16));
      const timer = setInterval(() => {
        start = Math.min(start + step, end);
        const el = document.getElementById(`counter-${i}`);
        if (el) el.textContent = start + stat.suffix;
        if (start >= end) clearInterval(timer);
      }, 16);
    });
  }

  submitQuickForm() {
    if (!this.quickForm.name || !this.quickForm.email || !this.quickForm.message) return;
    this.formSubmitting.set(true);
    this.contactService.submit({ ...this.quickForm, type: 'General' }).subscribe({
      next: () => { this.formSuccess.set(true); this.formSubmitting.set(false); this.quickForm = { name: '', email: '', phone: '', message: '' }; },
      error: () => { this.formSubmitting.set(false); }
    });
  }

  getMockProjects() {
    return [
      { _id: '1', title: 'Mumbai Coastal Road', category: 'Road', status: 'Running', location: 'Mumbai, MH', progress: 65, images: [] },
      { _id: '2', title: 'CPWD Office Complex', category: 'Government', status: 'Completed', location: 'Delhi', progress: 100, images: [] },
      { _id: '3', title: 'Smart City Drainage', category: 'SmartCity', status: 'Running', location: 'Pune, MH', progress: 40, images: [] },
    ];
  }

  getMockNews() {
    return [
      { _id: '1', title: 'Tarun Builders wins National Construction Award 2024', category: 'Award', createdAt: new Date() },
      { _id: '2', title: 'New Tender Floated for Smart City Phase II', category: 'Announcement', createdAt: new Date() },
      { _id: '3', title: 'Company achieves ISO 14001 Environmental Certification', category: 'Announcement', createdAt: new Date() },
    ];
  }
}
