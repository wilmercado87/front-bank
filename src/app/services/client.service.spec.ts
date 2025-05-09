import { TestBed } from '@angular/core/testing';
import { ClientService } from './client.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { Client } from '../models/client';

describe('ClientService', () => {
  let service: ClientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClientService],
    });

    service = TestBed.inject(ClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya solicitudes pendientes
  });

  it('debería obtener clientes', (done) => {
    const mockClients: Client[] = [
      {
        id: '1',
        document: '123',
        name: 'Juan',
        phone: '123456789',
        email: 'juan@example.com',
        dataDates: '2025-01-01 2025-12-31',
      },
    ];

    service.getClients().subscribe((clients) => {
      expect(clients).toEqual(mockClients);
      done();
    });

    const req = httpMock.expectOne(`https://${environment.host}/api/v1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockClients);
  });

  it('debería crear un cliente', (done) => {
    const newClient: Client = {
      id: '2',
      document: '456',
      name: 'María',
      phone: '987654321',
      email: 'maria@example.com',
      dataDates: '2025-02-01 2025-11-30',
    };

    service.createClient(newClient).subscribe((client) => {
      expect(client).toEqual(newClient);
      done();
    });

    const req = httpMock.expectOne(`https://${environment.host}/api/v1`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newClient);
    req.flush(newClient);
  });

  it('debería actualizar un cliente', (done) => {
    const updatedClient: Client = {
      id: '1',
      document: '123',
      name: 'Juan Pérez',
      phone: '123456789',
      email: 'juanp@example.com',
      dataDates: '2025-01-01 2025-12-31',
    };

    service.updateClient(updatedClient).subscribe((client) => {
      expect(client).toEqual(updatedClient);
      done();
    });

    const req = httpMock.expectOne(
      `https://${environment.host}/api/v1/${updatedClient.id}`
    );
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(updatedClient);
    req.flush(updatedClient);
  });

  it('debería eliminar un cliente', async () => {
    const clientId = '1';

    const deleteClientPromise = service.deleteClient(clientId).toPromise();

    const req = httpMock.expectOne(`https://${environment.host}/api/v1/${clientId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    const response = await deleteClientPromise;
    expect(response).toBeNull();
  });
});
