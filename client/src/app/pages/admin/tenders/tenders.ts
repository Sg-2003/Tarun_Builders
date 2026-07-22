import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass, NgIf, DatePipe } from '@angular/common';
import { TenderService } from '../../../core/services/tender.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-tenders',
  standalone: true,
  imports: [RouterLink, NgClass, NgIf, DatePipe, FormsModule],
  templateUrl: './tenders.html',
  styleUrl: './tenders.scss',
})
export class AdminTendersComponent implements OnInit {
  tenders = signal<any[]>([]);
  loading = signal(true);
  isModalOpen = signal(false);

  tenderForm = {
    tenderNo: '',
    title: '',
    departmentName: '',
    category: 'Works',
    estimatedValue: '',
    bidSubmissionDate: '',
    status: 'Active'
  };

  constructor(private tenderService: TenderService) {}

  ngOnInit() {
    this.loadTenders();
  }

  loadTenders() {
    this.loading.set(true);
    this.tenderService.getAll().subscribe({
      next: res => { this.tenders.set(res.data || []); this.loading.set(false); },
      error: () => { this.tenders.set(this.getMockTenders()); this.loading.set(false); }
    });
  }

  openAddModal() {
    this.resetForm();
    this.isModalOpen.set(true);
  }

  closeModal() { this.isModalOpen.set(false); }

  saveTender() {
    if (!this.tenderForm.tenderNo || !this.tenderForm.title) return;
    const data = { ...this.tenderForm, bidSubmissionDate: new Date(this.tenderForm.bidSubmissionDate) };
    
    // Fallback simulation
    const newTender = { _id: Date.now().toString(), ...data };
    this.tenders.update(list => [newTender, ...list]);
    this.closeModal();
  }

  deleteTender(id: string) {
    if (confirm('Are you sure you want to delete this tender?')) {
      this.tenders.update(list => list.filter(t => t._id !== id));
    }
  }

  resetForm() {
    this.tenderForm = {
      tenderNo: '',
      title: '',
      departmentName: '',
      category: 'Works',
      estimatedValue: '',
      bidSubmissionDate: '',
      status: 'Active'
    };
  }

  getMockTenders() {
    return [
      { _id: '1', tenderNo: 'TB/MUM/HW-092/2025', title: 'Asphalt Pavement Relaying', departmentName: 'NHAI / Road Works', category: 'Works', estimatedValue: 'Rs. 45.20 Cr', bidSubmissionDate: new Date('2025-08-30'), status: 'Active' }
    ];
  }
}
