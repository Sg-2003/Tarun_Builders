import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // ── Public layout
  {
    path: '',
    loadComponent: () => import('./layouts/public-layout/public-layout').then(m => m.PublicLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./pages/public/home/home').then(m => m.HomeComponent) },
      { path: 'about', loadComponent: () => import('./pages/public/about/about').then(m => m.About) },
      { path: 'chairman-message', loadComponent: () => import('./pages/public/chairman/chairman').then(m => m.Chairman) },
      { path: 'services', loadComponent: () => import('./pages/public/services/services').then(m => m.Services) },
      { path: 'projects', loadComponent: () => import('./pages/public/projects/projects').then(m => m.Projects) },
      { path: 'projects/:id', loadComponent: () => import('./pages/public/projects/project-detail/project-detail').then(m => m.ProjectDetailComponent) },
      { path: 'departments', loadComponent: () => import('./pages/public/departments/departments').then(m => m.Departments) },
      { path: 'tender', loadComponent: () => import('./pages/public/tender/tender').then(m => m.Tender) },
      { path: 'gallery', loadComponent: () => import('./pages/public/gallery/gallery').then(m => m.Gallery) },
      { path: 'news', loadComponent: () => import('./pages/public/news/news').then(m => m.News) },
      { path: 'news/:id', loadComponent: () => import('./pages/public/news/news-detail/news-detail').then(m => m.NewsDetailComponent) },
      { path: 'careers', loadComponent: () => import('./pages/public/careers/careers').then(m => m.Careers) },
      { path: 'rti', loadComponent: () => import('./pages/public/rti/rti').then(m => m.RtiComponent) },
      { path: 'contact', loadComponent: () => import('./pages/public/contact/contact').then(m => m.ContactComponent) },
    ]
  },

  // ── Auth
  { path: 'login', canActivate: [publicGuard], loadComponent: () => import('./pages/auth/login/login').then(m => m.LoginComponent) },

  // ── Admin layout
  {
    path: 'admin',
    canActivate: [authGuard],
    data: { roles: ['superadmin', 'admin', 'engineer', 'projectmanager', 'hr'] },
    loadComponent: () => import('./layouts/admin-layout/admin-layout').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./pages/admin/dashboard/dashboard').then(m => m.DashboardComponent) },
      { path: 'projects', loadComponent: () => import('./pages/admin/projects/projects').then(m => m.AdminProjectsComponent) },
      { path: 'news', loadComponent: () => import('./pages/admin/news/news').then(m => m.AdminNewsComponent) },
      { path: 'tenders', loadComponent: () => import('./pages/admin/tenders/tenders').then(m => m.AdminTendersComponent) },
      { path: 'careers', loadComponent: () => import('./pages/admin/careers/careers').then(m => m.AdminCareersComponent) },
      { path: 'gallery', loadComponent: () => import('./pages/admin/gallery/gallery').then(m => m.AdminGalleryComponent) },
      { path: 'contacts', loadComponent: () => import('./pages/admin/contacts/contacts').then(m => m.AdminContactsComponent) },
      { path: 'departments', loadComponent: () => import('./pages/admin/departments/departments').then(m => m.AdminDepartmentsComponent) },
    ]
  },

  // ── 404
  { path: '**', loadComponent: () => import('./pages/not-found/not-found').then(m => m.NotFoundComponent) },
];
