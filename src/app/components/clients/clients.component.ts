import { Component, inject, OnInit, WritableSignal, signal, ViewChild, ElementRef, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewClientComponent } from './new-client/new-client.component';
import { Client } from '../../models/client';
import { ClientService } from '../../services/client.service';
import { catchError, of, finalize } from 'rxjs';
import { AdvancedSearchComponent } from "../advanced-search/advanced-search.component";
import { NgxPaginationModule } from 'ngx-pagination';
import { Papa } from 'ngx-papaparse';
import { Utility } from '../../utils/utility';

@Component({
  selector: 'app-clients',
  imports: [CommonModule, NgxPaginationModule, NewClientComponent, AdvancedSearchComponent],
  providers: [Papa],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent implements OnInit {
  @ViewChild('newClient') clientModal!: NewClientComponent;
  @ViewChild('advancedSearch') searchModal!: AdvancedSearchComponent;
  @ViewChild('inputKey') inputElement!: ElementRef<HTMLInputElement>;

  clientService: ClientService = inject(ClientService);
  signalClients: WritableSignal<Client[]> = signal<Client[]>([]);
  sharedKey = signal<string>('');
  loading = signal<boolean>(false);
  page = signal(1);
  papa = inject(Papa);

  dynamicTitle = signal('');

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients() {
    this.clientService.getClients().subscribe(clients => {
      this.signalClients.update(() => clients);
    });
  }

  openClientModal(title: string, client?: Client) {
    this.dynamicTitle.set(title);
    this.clientModal.clientForm.get('sharedKey')?.enable();
    let isNewClient = true;
    if (client) {
      isNewClient = false;
      this.clientModal.clientForm.get('sharedKey')?.disable();
      this.clientModal.clientForm.patchValue({
        sharedKey: client?.sharedKey,
        businessId: client?.businessId,
        phone: client?.phone,
        email: client?.email,
        startDate: client?.dataAdded.split('|')[0],
        endDate: client?.dataAdded.split('|')[1],
      });
    }
    this.clientModal.openModal(isNewClient);
  }

  openSearchModal() {
    this.searchModal.openModal();
  }

  handleNewClient(client: Client) {
    let existingClient = this.signalClients().find(c => c.sharedKey === client.sharedKey);
    if (existingClient) {
      this.clientModal.clientForm.get('sharedKey')?.setErrors({ duplicate: true });
      return;
    }

    this.clientService.createClient(client).subscribe((newClient: Client) => {
      this.clientModal.closeModal();
      this.refreshClients();
    });
  }

  handleUpdateClient(client: Client) {
    this.clientService.updateClient(client.sharedKey, client).subscribe(() => {
      this.clientModal.closeModal();
      this.refreshClients();
    });
  }

  handleData(data: any) {
    this.inputElement.nativeElement.value = '';
    this.loading.set(true); 
    this.clientService.getClientByAnyFields(data.field, data.value).pipe(
    ).subscribe((clients) => {
        this.searchModal.closeModal();
        this.loading.set(false); 
        this.signalClients.update(() => clients);
    });
  }

  refreshClients() {
    this.inputElement.nativeElement.value = '';
    this.clientService.refreshClients();
  }

  keyUp(sharedKey: string) {
    if ((!sharedKey || sharedKey.trim() === '') && this.signalClients().length < 2) {
      this.refreshClients();
    }
  }

  searchByKey(sharedKey: string) {
    if (!sharedKey || sharedKey.trim() === '' || sharedKey.length < 3) {
      return;
    }

    this.loading.set(true); 
    this.clientService.getClientById(sharedKey).pipe(
      catchError((error) => {
        this.signalClients.update(() => []);
        return of(null);
      }),
      finalize(() => {
        this.loading.set(false); 
      })
    ).subscribe((client) => {
      if (client) {
        this.signalClients.update(() => [client]);
      }
    });
  }

  removeClient(sharedKey: string) {
    this.loading.set(true); 
    this.clientService.deleteClient(sharedKey).pipe(
      finalize(() => {
        this.loading.set(false); 
      })
    ).subscribe(() => {
      this.signalClients.update(() => this.signalClients().filter(c => c.sharedKey !== sharedKey));
    });
  }

  updateClient(client: Client) {
    this.clientService.updateClient(client.sharedKey, client).subscribe(() => {
      this.clientModal.closeModal();
      this.refreshClients();
    });
  }

  downloadCSV() {
    const clients = this.signalClients();
    if (!clients || clients.length === 0) {
      return;
    }
    
    const csv = this.papa.unparse(clients.map(client => ({
      sharedKey: client.sharedKey,
      businessId: client.businessId,
      email: client.email,
      phone: client.phone,
      dataAdded: client.dataAdded,
    })));
    Utility.exportToCSV('clients.csv', csv);
  }

  trackByClient(index: number, client: Client) {
    return client.sharedKey;
  }

}
