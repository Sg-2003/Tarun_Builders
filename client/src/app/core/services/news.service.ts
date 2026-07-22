import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NewsService {
  private readonly API = `${environment.apiUrl}/news`;
  constructor(private http: HttpClient) {}
  getAll(params?: any) { return this.http.get<any>(this.API, { params }); }
  getById(id: string) { return this.http.get<any>(`${this.API}/${id}`); }
  create(data: FormData) { return this.http.post<any>(this.API, data); }
  update(id: string, data: FormData) { return this.http.put<any>(`${this.API}/${id}`, data); }
  delete(id: string) { return this.http.delete<any>(`${this.API}/${id}`); }
}
