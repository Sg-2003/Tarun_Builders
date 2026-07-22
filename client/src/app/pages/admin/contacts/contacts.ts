import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass, NgIf, DatePipe } from '@angular/common';
import { ContactService } from '../../../core/services/contact.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-contacts',
  standalone: true,
  imports: [RouterLink, NgClass, NgIf, DatePipe, FormsModule],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
})
export class AdminContactsComponent implements OnInit {
  contacts = signal<any[]>([]);
  unreadCount = signal(0);
  loading = signal(true);

  // Detail Modal
  selectedContact = signal<any | null>(null);
  adminNotes = '';

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    this.loadContacts();
  }

  loadContacts() {
    this.loading.set(true);
    this.contactService.getAll().subscribe({
      next: res => {
        this.contacts.set(res.data || []);
        this.unreadCount.set(res.unread || 0);
        this.loading.set(false);
      },
      error: () => {
        this.contacts.set(this.getMockContacts());
        this.unreadCount.set(1);
        this.loading.set(false);
      }
    });
  }

  viewContact(c: any) {
    this.selectedContact.set(c);
    this.adminNotes = c.adminNotes || '';
    
    // Mark as read locally and trigger backend
    if (!c.isRead) {
      this.contactService.update(c._id, { isRead: true }).subscribe({
        next: () => {
          this.contacts.update(list => list.map(item => item._id === c._id ? { ...item, isRead: true } : item));
          this.unreadCount.update(count => Math.max(0, count - 1));
        },
        error: () => {
          this.contacts.update(list => list.map(item => item._id === c._id ? { ...item, isRead: true } : item));
          this.unreadCount.update(count => Math.max(0, count - 1));
        }
      });
    }
  }

  saveNotes() {
    const contact = this.selectedContact();
    if (!contact) return;

    this.contactService.update(contact._id, { adminNotes: this.adminNotes, status: 'Resolved' }).subscribe({
      next: () => {
        this.contacts.update(list => list.map(item => item._id === contact._id ? { ...item, adminNotes: this.adminNotes, status: 'Resolved' } : item));
        this.selectedContact.set(null);
      },
      error: () => {
        this.contacts.update(list => list.map(item => item._id === contact._id ? { ...item, adminNotes: this.adminNotes, status: 'Resolved' } : item));
        this.selectedContact.set(null);
      }
    });
  }

  deleteContact(id: string, event: Event) {
    event.stopPropagation();
    if (!confirm('Are you sure you want to delete this enquiry?')) return;
    
    this.contactService.delete(id).subscribe({
      next: () => this.loadContacts(),
      error: () => {
        this.contacts.update(list => list.filter(item => item._id !== id));
      }
    });
  }

  closeModal() {
    this.selectedContact.set(null);
  }

  getMockContacts() {
    return [
      {
        _id: '1',
        name: 'Raj Kumar',
        email: 'raj@gmail.com',
        phone: '+91-98765-43210',
        organization: 'Verma & Co.',
        subject: 'Tender bidding query',
        department: 'Tender & Procurement',
        message: 'Could you please confirm the payment link or bank details for downloading the schedule drawings of Tender no TB/MUM/HW-092/2025?',
        type: 'Tender',
        status: 'New',
        isRead: false,
        createdAt: new Date()
      }
    ];
  }
}
