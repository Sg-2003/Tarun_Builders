import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-rti',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './rti.html',
  styleUrl: './rti.scss'
})
export class RtiComponent {
  officers = [
    { name: 'Dr. Ramesh Nair', designation: 'Public Information Officer (PIO)', email: 'pio@tarunbuilders.in', phone: '+91-22-1234-5601', avatar: 'assets/images/officer_ramesh.png' },
    { name: 'Amit Trivedi', designation: 'Assistant PIO (APIO)', email: 'apio@tarunbuilders.in', phone: '+91-22-1234-5602', avatar: 'assets/images/officer_amit.png' },
    { name: 'Tarun', designation: 'Appellate Authority (MD)', email: 'appellate@tarunbuilders.in', phone: '+91-22-1234-5600', avatar: 'assets/images/owner.png' }
  ];
}
