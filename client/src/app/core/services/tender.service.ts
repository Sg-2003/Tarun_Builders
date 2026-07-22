import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TenderService {
  private readonly API = `${environment.apiUrl}/tenders`;
  constructor(private http: HttpClient) {}
  getAll(params?: any) { return this.http.get<any>(this.API, { params }); }
  getById(id: string) { return this.http.get<any>(`${this.API}/${id}`); }
  create(data: FormData) { return this.http.post<any>(this.API, data); }
  update(id: string, data: any) { return this.http.put<any>(`${this.API}/${id}`, data); }
  delete(id: string) { return this.http.delete<any>(`${this.API}/${id}`); }
}
