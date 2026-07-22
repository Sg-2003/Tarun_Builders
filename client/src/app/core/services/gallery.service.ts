import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GalleryService {
  private readonly API = `${environment.apiUrl}/gallery`;
  constructor(private http: HttpClient) {}
  getAll(params?: any) { return this.http.get<any>(this.API, { params }); }
  create(data: any) { return this.http.post<any>(this.API, data); }
  update(id: string, data: any) { return this.http.put<any>(`${this.API}/${id}`, data); }
  delete(id: string) { return this.http.delete<any>(`${this.API}/${id}`); }
}
