import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CuentaCreate, CuentaRead, CuentaUpdate } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class CuentaService {
  private readonly base = `${environment.apiUrl}/cuentas`;

  constructor(private readonly http: HttpClient) {}

  list(): Observable<CuentaRead[]> {
    const params = new HttpParams().set('skip', '0').set('limit', '500');
    return this.http.get<CuentaRead[]>(`${this.base}/`, { params });
  }

  get(id: string): Observable<CuentaRead> {
    return this.http.get<CuentaRead>(`${this.base}/${id}`);
  }

  create(body: CuentaCreate): Observable<CuentaRead> {
    return this.http.post<CuentaRead>(this.base, body);
  }

  update(id: string, body: CuentaUpdate): Observable<CuentaRead> {
    return this.http.put<CuentaRead>(`${this.base}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete(`${this.base}/${id}`, { observe: 'response' }).pipe(map(() => undefined));
  }
}