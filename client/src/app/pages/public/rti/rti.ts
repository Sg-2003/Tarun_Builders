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
    { name: 'Dr. Ramesh Nair', designation: 'Public Information Officer (PIO)', email: 'pio&#64;tarunbuilders.in', phone: '+91-22-1234-5601' },
    { name: 'Amit Trivedi', designation: 'Assistant PIO (APIO)', email: 'apio&#64;tarunbuilders.in', phone: '+91-22-1234-5602' },
    { name: 'Tarun', designation: 'Appellate Authority (MD)', email: 'appellate&#64;tarunbuilders.in', phone: '+91-22-1234-5600' }
  ];
}
