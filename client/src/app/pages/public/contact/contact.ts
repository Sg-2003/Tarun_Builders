import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { ContactService } from '../../../core/services/contact.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RouterLink, NgClass, NgIf, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class ContactComponent {
  contactForm = {
    name: '',
    email: '',
    phone: '',
    organization: '',
    subject: '',
    department: '',
    message: '',
    type: 'General'
  };

  departments = ['Administration', 'Civil Works Division', 'Roads & Highways', 'Tender & Procurement', 'Human Resources', 'Right to Information'];
  enquiryTypes = ['General', 'Project', 'Tender', 'Career', 'RTI', 'Grievance'];

  formSubmitting = signal(false);
  formSuccess = signal(false);
  formError = signal<string | null>(null);

  constructor(private contactService: ContactService) {}

  submitForm() {
    if (!this.contactForm.name || !this.contactForm.email || !this.contactForm.message) {
      this.formError.set('Name, email, and message are required.');
      return;
    }

    this.formSubmitting.set(true);
    this.formError.set(null);

    this.contactService.submit(this.contactForm).subscribe({
      next: () => {
        this.formSuccess.set(true);
        this.formSubmitting.set(false);
        this.resetForm();
      },
      error: (err) => {
        this.formError.set(err.error?.message || 'Something went wrong. Please try again.');
        this.formSubmitting.set(false);
      }
    });
  }

  resetForm() {
    this.contactForm = {
      name: '',
      email: '',
      phone: '',
      organization: '',
      subject: '',
      department: '',
      message: '',
      type: 'General'
    };
  }
}
