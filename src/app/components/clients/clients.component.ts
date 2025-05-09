import { Component, inject, OnInit, WritableSignal, signal, ViewChild, ElementRef, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewClientComponent } from './new-client/new-client.component';
import { Client } from '../../models/client';
import { ClientService } from '../../services/client.service';
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
  columns = Utility.columns;
  @ViewChild('newClient') clientModal!: NewClientComponent;
  @ViewChild('advancedSearch') searchModal!: AdvancedSearchComponent;

  clientService: ClientService = inject(ClientService);
  papa = inject(Papa);

  signalClients: WritableSignal<Client[]> = signal<Client[]>([]);
  loading = signal<boolean>(false);
  page = signal(1);

  dynamicTitle: WritableSignal<string> = signal('');

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients() {
    this.loading.set(true);
    const storedClients = localStorage.getItem('clients');
    if (storedClients) {
      const clients = JSON.parse(storedClients);
      this.signalClients.update(() => clients);
      this.loading.set(false);
      return;
    }

    this.clientService.getClients()
      .subscribe(clients => {
        this.signalClients.update(() => clients);
        localStorage.setItem('clients', JSON.stringify(clients));
        this.loading.set(false);
    });
  }

  openClientModal(title: string, client?: Client) {
    let isNewClient = true;
    this.dynamicTitle.set(title);
    this.clientModal.title = title;
    
    if (client) {
      isNewClient = false;
      this.clientModal.clientForm.get('id')?.enable();
      this.clientModal.clientForm.patchValue({
        id: client?.id,
        document: client?.document,
        name: client?.name,
        phone: client?.phone,
        email: client?.email,
        startDate: client?.dataDates.split(' ')[0],
        endDate: client?.dataDates.split(' ')[1],
      });
    }
    this.clientModal.openModal(isNewClient);
  }

  openSearchModal() {
    this.searchModal.openModal();
  }

  handleNewClient(client: Client) {
    let existingClient = this.signalClients().find(c => c.document === client.document);
    if (existingClient) {
      this.clientModal.clientForm.get('document')?.setErrors({ duplicate: true });
      return;
    }

    this.clientService.createClient(client).subscribe(() => {
      this.clientModal.closeModal();
      this.refreshClients();
    });
  }

  handleUpdateClient(client: Client) {
    this.clientService.updateClient(client).subscribe(() => {
      this.clientModal.closeModal();
      this.refreshClients();
    });
  }

  handleData(data: any) {
    this.signalClients.update(() => 
      this.clientService.getAdvancedSearch(this.signalClients(), data.field, data.value)
    );
    this.searchModal.closeModal();
  }

  removeClient(id: string) {
    this.clientService.deleteClient(id).subscribe(() => {
      this.signalClients.update(() => this.signalClients().filter(c => c.id !== id));
      this.refreshClients();
    });
  }

  updateClient(client: Client) {
    this.clientService.updateClient(client).subscribe(() => {
      this.clientModal.closeModal();
      this.refreshClients();
    });
  }

  refreshClients() {
    this.clientService.refreshClients();
  }

  downloadCSV() {
    const clients = this.signalClients();
    if (!clients || clients.length === 0) {
      return;
    }
    
    const csv = this.papa.unparse(clients.map(client => [
          client.id || '',
          client.document,
          client.name,
          client.email,
          client.phone,
          client.dataDates,
        ]), {
          quotes: false,
          delimiter: ",",
          header: true,
          columns: ['id', 'document', 'name', 'email', 'phone', 'dataDates']
        });
    Utility.exportToCSV('clients.csv', csv);
  }

  trackByClient(index: number, client: Client) {
    return client.id;
  }

}
