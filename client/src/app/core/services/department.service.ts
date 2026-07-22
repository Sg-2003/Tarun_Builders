import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private readonly API = `${environment.apiUrl}/departments`;
  constructor(private http: HttpClient) {}
  getAll() { return this.http.get<any>(this.API); }
  getById(id: string) { return this.http.get<any>(`${this.API}/${id}`); }
  create(data: any) { return this.http.post<any>(this.API, data); }
  update(id: string, data: any) { return this.http.put<any>(`${this.API}/${id}`, data); }
  delete(id: string) { return this.http.delete<any>(`${this.API}/${id}`); }
}
