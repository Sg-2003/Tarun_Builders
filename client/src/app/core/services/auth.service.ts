import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  designation?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = `${environment.apiUrl}/auth`;
  currentUser = signal<User | null>(null);
  isLoggedIn = signal(false);

  constructor(private http: HttpClient, private router: Router) {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const token = localStorage.getItem('tb_token');
    const user = localStorage.getItem('tb_user');
    if (token && user) {
      this.currentUser.set(JSON.parse(user));
      this.isLoggedIn.set(true);
    }
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${this.API}/login`, { email, password }).pipe(
      tap(res => {
        if (res.success) {
          localStorage.setItem('tb_token', res.token);
          localStorage.setItem('tb_refresh_token', res.refreshToken);
          localStorage.setItem('tb_user', JSON.stringify(res.user));
          this.currentUser.set(res.user);
          this.isLoggedIn.set(true);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('tb_token');
    localStorage.removeItem('tb_refresh_token');
    localStorage.removeItem('tb_user');
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

  getToken() { return localStorage.getItem('tb_token'); }

  getMe() { return this.http.get<any>(`${this.API}/me`); }

  hasRole(...roles: string[]) {
    const user = this.currentUser();
    return user ? roles.includes(user.role) : false;
  }

  isAdmin() { return this.hasRole('superadmin', 'admin'); }
}
