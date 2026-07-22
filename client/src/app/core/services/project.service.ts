import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly API = `${environment.apiUrl}/projects`;
  constructor(private http: HttpClient) {}

  getAll(params?: any) {
    let p = new HttpParams();
    if (params) Object.keys(params).forEach(k => { if (params[k] != null) p = p.set(k, params[k]); });
    return this.http.get<any>(this.API, { params: p });
  }

  getById(id: string) { return this.http.get<any>(`${this.API}/${id}`); }

  create(data: FormData) { return this.http.post<any>(this.API, data); }

  update(id: string, data: any) { return this.http.put<any>(`${this.API}/${id}`, data); }

  delete(id: string) { return this.http.delete<any>(`${this.API}/${id}`); }
}
