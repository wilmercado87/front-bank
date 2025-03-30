import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, catchError, of } from 'rxjs';
import { Client } from '../models/client';
import { environment } from '../../environments/environment';

const headers = (user: string, password: string) =>
  new HttpHeaders({
    Authorization: 'Basic ' + btoa(user + ':' + password),
  });

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl = environment.apiUrl;
  private refreshTrigger = new BehaviorSubject<void>(null as any);
  http = inject(HttpClient);

  constructor() {}

  getClients(): Observable<Client[]> {
    return this.refreshTrigger.pipe(
      switchMap(() =>
        this.http.get<Client[]>(this.apiUrl, {
          headers: headers(environment.user, environment.password),
        }).pipe(
          catchError((error) => {
            console.error('Error en getClients:', error);
            return of([]);
          })
        )
      )
    );
  }

  getClientByAnyFields(fieldName: string, value: string): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/${fieldName}/${value}`, {
      headers: headers(environment.user, environment.password),
    }).pipe(
      catchError((error) => {
        console.error(`Error en getClientByAnyFields(${fieldName}, ${value}):`, error);
        return of([]);
      })
    );
  }

  refreshClients() {
    this.refreshTrigger.next();
  }

  getClientById(id: string): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`, {
      headers: headers(environment.user, environment.password),
    });
  }

  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client, {
      headers: headers(environment.admin, environment.adminPassword),
    }).pipe(
      catchError((error) => {
        console.error('Error en createClient:', error);
        return of();
      })
    );
  }

  updateClient(id: string, client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${id}`, client, {
      headers: headers(environment.admin, environment.adminPassword),
    }).pipe(
      catchError((error) => {
        console.error(`Error en updateClient(${id}):`, error);
        return of();
      })
    );
  }

  deleteClient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: headers(environment.admin, environment.adminPassword),
    }).pipe(
      catchError((error) => {
        console.error(`Error en deleteClient(${id}):`, error);
        return of();
      })
    );
  }
}