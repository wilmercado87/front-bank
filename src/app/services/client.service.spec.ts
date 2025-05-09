import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClientService } from './client.service';
import { Client } from '../models/client';
import { environment } from '../../environments/environment';

describe('ClientService', () => {
  let service: ClientService;
  let httpMock: HttpTestingController;

  const mockClient: Client = {
    id: '123',
    name: 'Biz',
    email: 'test@example.com',
    phone: 1234567890,
    dataDates: '2024-01-01|2024-12-31',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClientService],
    });

    service = TestBed.inject(ClientService);
    httpMock = TestBed.inject(HttpTestingController);

    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería obtener la lista de clientes', () => {
    service.getClients().subscribe((clients) => {
      expect(clients.length).toBe(1);
      expect(clients).toEqual([mockClient]);
    });

    const req = httpMock.expectOne(environment.apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush([mockClient]);
  });

  it('debería obtener un cliente por ID', () => {
    service.getClientById(mockClient.id).subscribe((client) => {
      expect(client).toEqual(mockClient);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/${mockClient.id}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockClient);
  });

  it('debería crear un nuevo cliente', () => {
    service.createClient(mockClient).subscribe((client) => {
      expect(client).toEqual(mockClient);
    });

    const req = httpMock.expectOne(environment.apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockClient);
    req.flush(mockClient);
  });

  it('debería actualizar un cliente existente', () => {
    service.updateClient(mockClient.id, mockClient).subscribe((client) => {
      expect(client).toEqual(mockClient);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/${mockClient.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockClient);
    req.flush(mockClient);
  });

  it('debería eliminar un cliente', () => {
    service.deleteClient(mockClient.id).subscribe((response) => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/${mockClient.id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
  
});
