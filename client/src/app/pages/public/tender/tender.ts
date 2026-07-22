import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass, DatePipe } from '@angular/common';
import { TenderService } from '../../../core/services/tender.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tender',
  standalone: true,
  imports: [RouterLink, NgClass, DatePipe, FormsModule],
  templateUrl: './tender.html',
  styleUrl: './tender.scss',
})
export class Tender implements OnInit {
  tenders = signal<any[]>([]);
  loading = signal(true);

  searchQuery = signal('');
  selectedStatus = signal('');

  constructor(private tenderService: TenderService) {}

  ngOnInit() {
    this.loadTenders();
  }

  loadTenders() {
    this.loading.set(true);
    const params: any = {};
    if (this.selectedStatus()) params.status = this.selectedStatus();

    this.tenderService.getAll(params).subscribe({
      next: res => {
        let list = res.data || [];
        if (this.searchQuery()) {
          const q = this.searchQuery().toLowerCase();
          list = list.filter((t: any) => t.tenderNo.toLowerCase().includes(q) || t.title.toLowerCase().includes(q));
        }
        this.tenders.set(list);
        this.loading.set(false);
      },
      error: () => {
        let list = this.getMockTenders();
        if (this.selectedStatus()) list = list.filter(t => t.status === this.selectedStatus());
        if (this.searchQuery()) {
          const q = this.searchQuery().toLowerCase();
          list = list.filter(t => t.tenderNo.toLowerCase().includes(q) || t.title.toLowerCase().includes(q));
        }
        this.tenders.set(list);
        this.loading.set(false);
      }
    });
  }

  filterStatus(status: string) {
    this.selectedStatus.set(status);
    this.loadTenders();
  }

  clearFilters() {
    this.searchQuery.set('');
    this.selectedStatus.set('');
    this.loadTenders();
  }

  getMockTenders() {
    return [
      {
        _id: '1',
        tenderNo: 'TB/MUM/HW-092/2025',
        title: 'Asphalt Pavement Relaying & Stormwater Drainage link on NH-48 sector 4',
        departmentName: 'NHAI / Road Works',
        category: 'Works',
        estimatedValue: 'Rs. 45.20 Cr',
        bidSubmissionDate: new Date('2025-08-30'),
        status: 'Active',
        documents: [{ name: 'Tender_Notice.pdf', size: '1.2 MB' }]
      },
      {
        _id: '2',
        tenderNo: 'TB/DEL/SEC-102/2025',
        title: 'Electrical wiring and smart lighting ducting for central secretariat blocks 4-6',
        departmentName: 'CPWD / Electrical Division',
        category: 'Works',
        estimatedValue: 'Rs. 12.80 Cr',
        bidSubmissionDate: new Date('2025-09-15'),
        status: 'Active',
        documents: [{ name: 'Tender_Specs_Electrical.pdf', size: '2.5 MB' }]
      },
      {
        _id: '3',
        tenderNo: 'TB/PNE/WTP-08/2024',
        title: 'Supplying and laying 1200mm dia water distribution main line for Pune Zone-B',
        departmentName: 'Pune Municipal Corporation',
        category: 'Goods',
        estimatedValue: 'Rs. 28.50 Cr',
        bidSubmissionDate: new Date('2024-06-10'),
        status: 'Closed',
        documents: [{ name: 'Water_Main_Tender.pdf', size: '3.1 MB' }]
      },
      {
        _id: '4',
        tenderNo: 'TB/NAG/APT-01/2024',
        title: 'Runway expansion structural PMC consultancy and safety verification audits',
        departmentName: 'AAI / Nagpur Division',
        category: 'Consultancy',
        estimatedValue: 'Rs. 1.95 Cr',
        bidSubmissionDate: new Date('2024-03-20'),
        status: 'Awarded',
        documents: []
      }
    ];
  }
}
