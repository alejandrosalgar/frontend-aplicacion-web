import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { TipoCuentaCreate, TipoCuentaRead, TipoCuentaUpdate } from '../../models/api.models';

@Injectable({ providedIn: 'root' })
export class TipoCuentaService {
  private readonly base = `${environment.apiUrl}/tipos-cuenta`; 

  constructor(private readonly http: HttpClient) {}

  list(): Observable<TipoCuentaRead[]> {
    const params = new HttpParams().set('skip', '0').set('limit', '500');
    return this.http.get<TipoCuentaRead[]>(this.base, { params });
  }

  get(id: string): Observable<TipoCuentaRead> {
    return this.http.get<TipoCuentaRead>(`${this.base}/${id}`);
  }

  create(body: TipoCuentaCreate): Observable<TipoCuentaRead> {
    return this.http.post<TipoCuentaRead>(this.base, body);
  }

  update(id: string, body: TipoCuentaUpdate): Observable<TipoCuentaRead> {
    return this.http.put<TipoCuentaRead>(`${this.base}/${id}`, body);
  }

  delete(id: string): Observable<void> {
    return this.http.delete(`${this.base}/${id}`, { observe: 'response' }).pipe(map(() => undefined));
  }
}