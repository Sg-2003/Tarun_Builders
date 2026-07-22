import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  quickLinks = [
    { label: 'Home', path: '/' }, { label: 'About Us', path: '/about' },
    { label: "Chairman's Message", path: '/chairman-message' },
    { label: 'Services', path: '/services' }, { label: 'Projects', path: '/projects' },
    { label: 'Departments', path: '/departments' },
  ];

  usefulLinks = [
    { label: 'Tender Portal', path: '/tender' }, { label: 'Gallery', path: '/gallery' },
    { label: 'News & Media', path: '/news' }, { label: 'Career Opportunities', path: '/careers' },
    { label: 'RTI', path: '/rti' }, { label: 'Contact Us', path: '/contact' },
  ];

  certifications = ['ISO 9001:2015', 'ISO 14001:2015', 'OHSAS 18001', 'Class A Contractor', 'GST Registered', 'MSME Certified'];
}
