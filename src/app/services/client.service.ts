import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, catchError, of } from 'rxjs';
import { Client } from '../models/client';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  refreshTrigger = new BehaviorSubject<void>(null as any);
  http = inject(HttpClient);

  constructor() {}

  getClients(): Observable<Client[]> {
    return this.refreshTrigger.pipe(
      switchMap(() =>
        this.http.get<Client[]>(`https://${environment.host}/api/v1`).pipe(
          catchError((error) => {
            console.error('Error en getClients:', error);
            return of([]);
          })
        )
      )
    );
  }

  getAdvancedSearch<T extends keyof Client>(
    clients: Client[],
    field: T,
    value: Client[T]
  ): Client[] {
    return clients.filter(client => 
      typeof client[field] === 'string' && 
      client[field].toLocaleLowerCase().includes(value?.toLocaleLowerCase() as string));
  }

  refreshClients() {
    this.refreshTrigger.next();
  }

  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(`https://${environment.host}/api/v1`, client).pipe(
      catchError((error) => {
        console.error('Error en createClient:', error);
        return of();
      })
    );
  }

  updateClient(client: Client): Observable<Client> {
    return this.http.patch<Client>(`https://${environment.host}/api/v1/${client.id}`, client).pipe(
      catchError((error) => {
        console.error(`Error en updateClient(${client.id}):`, error);
        return of();
      })
    );
  }

  deleteClient(id: string): Observable<void> {
    return this.http.delete<void>(`https://${environment.host}/api/v1/${id}`).pipe(
      catchError((error) => {
        console.error(`Error en deleteClient(${id}):`, error);
        return of();
      })
    );
  }
}