import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly API = `${environment.apiUrl}/contact`;
  constructor(private http: HttpClient) {}
  submit(data: any) { return this.http.post<any>(this.API, data); }
  getAll(params?: any) { return this.http.get<any>(this.API, { params }); }
  update(id: string, data: any) { return this.http.put<any>(`${this.API}/${id}`, data); }
  delete(id: string) { return this.http.delete<any>(`${this.API}/${id}`); }
}
