import { Component, OnDestroy, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Client } from '../../models/client';
import { ClientService } from '../../services/client.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { Papa } from 'ngx-papaparse';
import { FORMAT_DD_MM_YYYY, LENGTH_HEXADECIMAL, Utility } from '../../utils/utility';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ClientDialogComponent } from './client-dialog/client-dialog.component';
import { AdvancedSearchComponent } from '../advanced-search/advanced-search.component';

@Component({
  selector: 'app-clients',
  imports: [CommonModule, NgxPaginationModule],
  providers: [Papa, DatePipe],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent implements OnInit, OnDestroy {
  columns = Utility.columns;
  clientService = signal(inject(ClientService));
  papa = inject(Papa);
  signalClients: WritableSignal<Client[]> = signal<Client[]>([]);
  loading = signal<boolean>(false);
  page = signal(1);
  dialogRef!: MatDialogRef<ClientDialogComponent>;

  constructor(private dialog: MatDialog, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.loadClients(true);
  }

  private formatClient(formData: any, isUpdate: boolean = false): Client {
    const client: Client = {
      id: Utility.generateUniqueRandomString(LENGTH_HEXADECIMAL),
      document: formData.document,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      dataDates:
        this.datePipe.transform(formData.startDate, FORMAT_DD_MM_YYYY)! + ' ' +
        this.datePipe.transform(formData.endDate, FORMAT_DD_MM_YYYY)!,
    };

    if (isUpdate) {
      client.id = formData.id;
    }

    return client;
  }

  loadClients(forceRefresh = false) {
    this.loading.set(true);

    if (!forceRefresh) {
      const storedClients = localStorage.getItem('clients');
      if (storedClients) {
        this.updateStateAndStorage(JSON.parse(storedClients));
        this.loading.set(false);
        return;
      }
    }

    this.clientService().getClients().subscribe(clients => {
      this.updateStateAndStorage(clients);
      this.loading.set(false);
    });
  }

  openAdvancedSearch() {
    const dialogRef = this.dialog.open(AdvancedSearchComponent, {
      disableClose: true,
      width: '600px',
      data: { title: 'Advanced Search' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.handleData(result);
      }
    });
  }

  openClientDialog(title: string, client?: Client): void {
    this.dialogRef = this.dialog.open(ClientDialogComponent, {
      disableClose: true,
      width: '600px',
      data: { title, client },
    });

    const instance = this.dialogRef.componentInstance;

    instance.validateClient.subscribe((formData) => {
      const isUpdate = !!client;

      if (!isUpdate) {
        const exists = this.signalClients().some(c => c.document === formData.document);
        if (exists) {
          instance.clientForm.get('document')?.setErrors({ duplicate: true });
          instance.clientForm.get('document')?.markAsTouched();
          return;
        }
      }

      isUpdate ? this.updateClient(formData) : this.insertClient(formData);
    });
  }

  insertClient(formData: any) {
    const client = this.formatClient(formData);

    //this.clientService().createClient(client).subscribe((newClient) => { /** Habilitar para persistir * */
      const clients = [...this.signalClients(), client];
      this.updateStateAndStorage(clients);
      this.dialogRef.close();
    //});
  }

  updateClient(formData: any) {
    const updatedClient = this.formatClient(formData, true);

    //this.clientService().updateClient(updatedClient).subscribe(() => { /** Habilitar para persistir * */
      const clients = this.signalClients().map(c =>
        c.id === updatedClient.id ? { ...updatedClient } : c
      );
      this.updateStateAndStorage(clients);
      this.dialogRef.close();
    //});
  }

  removeClient(id: string) {
    //this.clientService().deleteClient(id).subscribe(() => { /** Habilitar para persistir * */
      const clients = this.signalClients().filter(c => c.id !== id);
      this.updateStateAndStorage(clients);
    //});
  }

  handleData(data: any) {
    const result = this.clientService().getAdvancedSearch(this.signalClients(), data.field, data.value);
    this.signalClients.update(() => result);
  }

  refreshClients() {
    this.loadClients(true);
  }

  private updateStateAndStorage(clients: Client[]) {
    this.signalClients.update(() => clients);
    localStorage.setItem('clients', JSON.stringify(clients));
  }

  downloadCSV() {
    const clients = this.signalClients();
    if (clients.length === 0) return;

    const csv = this.papa.unparse(
      clients.map(client => [
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
      }
    );

    Utility.exportToCSV('clients.csv', csv);
  }

  trackByClient(index: number, client: Client) {
    return client.id;
  }

  ngOnDestroy() {
    localStorage.removeItem('clients');
  }
}

