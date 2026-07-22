import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, NgClass, NgIf, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  loginForm = { email: '', password: '' };
  formSubmitting = signal(false);
  formError = signal<string | null>(null);

  constructor(private authService: AuthService, private router: Router) {}

  submitLogin() {
    if (!this.loginForm.email || !this.loginForm.password) {
      this.formError.set('Please fill in all fields.');
      return;
    }

    this.formSubmitting.set(true);
    this.formError.set(null);

    this.authService.login(this.loginForm.email, this.loginForm.password).subscribe({
      next: () => {
        this.formSubmitting.set(false);
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        this.formError.set(err.error?.message || 'Invalid credentials or connection error.');
        this.formSubmitting.set(false);
      }
    });
  }
}
