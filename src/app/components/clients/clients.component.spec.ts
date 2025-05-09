import { ClientsComponent } from './clients.component';
import { ClientService } from '../../services/client.service';
import { of } from 'rxjs';
import { Client } from '../../models/client';
import { Papa } from 'ngx-papaparse';
import { Utility } from '../../utils/utility';
import { EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';

describe('ClientsComponent', () => {
  let component: ClientsComponent;
  let clientServiceMock: Partial<ClientService>;
  let papaMock: Partial<Papa>;

  const mockClients: Client[] = [
    { id: '1', document: '1047390099', name: 'William', phone: '111', email: 'william@test.com', dataDates: '2024-01-01 2024-01-02' },
    { id: '2', document: '123456789', name: 'Bob', phone: '222', email: 'bob@test.com', dataDates: '2024-02-01 2024-02-02' }
  ];

  beforeEach(() => {
    clientServiceMock = {
      getClients: jest.fn().mockReturnValue(of(mockClients)),
      createClient: jest.fn().mockReturnValue(of(null)),
      updateClient: jest.fn().mockReturnValue(of(null)),
      deleteClient: jest.fn().mockReturnValue(of(null)),
      refreshClients: jest.fn(),
      getAdvancedSearch: jest.fn().mockReturnValue([]),
    };

    papaMock = {
      unparse: jest.fn().mockReturnValue('id,document,name,email,phone,dataDates\n1,1234567890,William,william@example.com,555-1234,2021-01-01 2021-12-31'),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: ClientService, useValue: clientServiceMock },
        { provide: Papa, useValue: papaMock },
      ],
    });

    runInInjectionContext(TestBed.inject(EnvironmentInjector), () => {
      component = new ClientsComponent();
    });
  });

  it('debería cargar clientes desde el servicio si no hay en localStorage', () => {
    component.loadClients();
    expect(clientServiceMock.getClients).toHaveBeenCalled();
    expect(component.signalClients().length).toBe(2);
  });

  it('debería cargar clientes desde localStorage si existen', () => {
    localStorage.setItem('clients', JSON.stringify(mockClients));
    component.loadClients();
    expect(clientServiceMock.getClients).not.toHaveBeenCalled();
    expect(component.signalClients().length).toBe(2);
  });

  it('debería agregar un nuevo cliente si no está duplicado', () => {
    component.signalClients.update(() => []);
    const newClient = mockClients[0];

    component.clientModal = {
      closeModal: jest.fn(),
      clientForm: {
        get: () => ({ setErrors: jest.fn() })
      }
    } as any;

    component.handleNewClient(newClient);

    expect(clientServiceMock.createClient).toHaveBeenCalledWith(newClient);
  });

  it('no debería agregar cliente si el documento está duplicado', () => {
    component.signalClients.update(() => [...mockClients]);

    const duplicate = mockClients[0];
    const setErrors = jest.fn();

    component.clientModal = {
      clientForm: {
        get: jest.fn().mockReturnValue({ setErrors })
      }
    } as any;

    component.handleNewClient(duplicate);

    expect(setErrors).toHaveBeenCalledWith({ duplicate: true });
    expect(clientServiceMock.createClient).not.toHaveBeenCalled();
  });

  it('debería eliminar cliente correctamente', () => {
    component.signalClients.update(() => [...mockClients]);

    component.removeClient('1');

    expect(clientServiceMock.deleteClient).toHaveBeenCalledWith('1');
  });

  it('debería exportar los clientes a CSV', () => {
    component.signalClients.set([
      {
        id: '1',
        document: '123',
        name: 'William',
        email: 'william@test.com',
        phone: '111',
        dataDates: '2024-01-01 2024-01-02',
      },
    ]);

    jest.spyOn(component.papa, 'unparse').mockReturnValue('csv,data');
    jest.spyOn(Utility, 'exportToCSV').mockImplementation();

    component.downloadCSV();

    expect(Utility.exportToCSV).toHaveBeenCalledWith(
        'clients.csv',
        expect.any(String)
      );
  });

});