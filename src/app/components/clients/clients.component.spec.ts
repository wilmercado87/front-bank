import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ClientsComponent } from './clients.component';
import { ClientService } from '../../services/client.service';
import { of } from 'rxjs';
import { Papa } from 'ngx-papaparse';
import { Client } from '../../models/client';
import { provideRouter } from '@angular/router';
import { NewClientComponent } from './new-client/new-client.component';

describe('ClientsComponent', () => {
  let component: ClientsComponent;
  let clientServiceMock: any;

  beforeEach(async () => {
    clientServiceMock = {
      getClients: jest.fn().mockReturnValue(of([])),
      getClientById: jest.fn().mockReturnValue(of(null)),
      createClient: jest.fn().mockReturnValue(of({})),
      updateClient: jest.fn().mockReturnValue(of({})),
      deleteClient: jest.fn().mockReturnValue(of({})),
      getClientByAnyFields: jest.fn().mockReturnValue(of([])),
      refreshClients: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ClientsComponent],
      providers: [
        provideRouter([]),
        { provide: ClientService, useValue: clientServiceMock },
        { provide: Papa, useValue: new Papa() },
        
      ],
    }).compileComponents();

    component = TestBed.createComponent(ClientsComponent).componentInstance;

    component.clientModal = {
      title: '',
      clientForm: {
        get: jest.fn().mockReturnValue({ enable: jest.fn(), disable: jest.fn() }),
        patchValue: jest.fn(),
      },
      openModal: jest.fn(),
      closeModal: jest.fn(),
    } as unknown as NewClientComponent;

    component.inputElement = {
      nativeElement: { value: '' },
    } as any;

    global.URL.createObjectURL = jest.fn(() => 'blob-url');
    jest.spyOn(Papa.prototype, 'unparse').mockImplementation(() => 'csv-data');
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar los clientes en ngOnInit', () => {
    clientServiceMock.getClients.mockReturnValue(of([{ sharedKey: '123' }]));
    component.ngOnInit();
    expect(clientServiceMock.getClients).toHaveBeenCalled();
  });

  it('debería abrir el modal de cliente para agregar uno nuevo', () => {
    component.openClientModal('Nuevo Cliente');
    expect(component.clientModal.title).toBe('Nuevo Cliente');
    expect(component.clientModal.openModal).toHaveBeenCalledWith(true);
  });

  it('debería abrir el modal de cliente para actualizar', () => {
    const mockClient: Client = {
      sharedKey: '123',
      businessId: 'Biz',
      email: 'test@example.com',
      phone: 1234567890,
      dataAdded: '2024-01-01|2024-12-31',
    };
  
    component.openClientModal('Editar Cliente', mockClient);
  
    expect(component.clientModal.title).toBe('Editar Cliente');
    expect(component.clientModal.clientForm.get).toHaveBeenCalledWith('sharedKey');
    expect(component.clientModal.clientForm.get('sharedKey')?.disable).toHaveBeenCalled();
    expect(component.clientModal.clientForm.patchValue).toHaveBeenCalledWith({
      sharedKey: '123',
      businessId: 'Biz',
      phone: 1234567890,
      email: 'test@example.com',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    });
    expect(component.clientModal.openModal).toHaveBeenCalledWith(false);
  });
  

  it('debería abrir el modal de cliente para agregar uno nuevo', () => {
    if (!component.clientModal) {
      component.clientModal = {
        title: '',
        clientForm: {
          get: jest.fn().mockReturnValue({ enable: jest.fn() }),
        },
        openModal: jest.fn(),
      } as unknown as NewClientComponent;
    }
  
    component.openClientModal('Nuevo Cliente');
  
    expect(component.clientModal.title).toBe('Nuevo Cliente');
    expect(component.clientModal.clientForm.get).toHaveBeenCalledWith('sharedKey');
    expect(component.clientModal.openModal).toHaveBeenCalledWith(true);
  });

  it('debería manejar la actualización de un cliente', fakeAsync(() => {
    const mockClient: Client = {
      sharedKey: '123',
      businessId: 'Biz',
      phone: 1234567890,
      email: 'test@example.com',
      dataAdded: '2024-01-01|2024-12-31',
    };
  
    jest.spyOn(clientServiceMock, 'refreshClients');
    clientServiceMock.updateClient = jest.fn().mockReturnValue(of(null));
    component.clientModal = { closeModal: jest.fn() } as any;
  
    component.handleUpdateClient(mockClient);
  
    tick();
  
    expect(clientServiceMock.updateClient).toHaveBeenCalledWith('123', mockClient);
    expect(component.clientModal.closeModal).toHaveBeenCalled();
    expect(clientServiceMock.refreshClients).toHaveBeenCalled();
  }));

  it('debería realizar la búsqueda por clave compartida', () => {
    component.loading.set(false);
    clientServiceMock.getClientById.mockReturnValue(of({ sharedKey: '123' }));

    component.searchByKey('123');

    expect(clientServiceMock.getClientById).toHaveBeenCalledWith('123');
    expect(component.signalClients().length).toBe(1);
    expect(component.signalClients()[0].sharedKey).toBe('123');
  });

  it('debería exportar los clientes a CSV', () => {
    jest.spyOn(Papa.prototype, 'unparse').mockImplementation(() => 'csv-data');
    jest.spyOn(global.URL, 'createObjectURL').mockReturnValue('blob-url');
  
    const mockAnchor = document.createElement('a'); 
    jest.spyOn(document, 'createElement').mockReturnValue(mockAnchor);
    jest.spyOn(document.body, 'appendChild');
    jest.spyOn(document.body, 'removeChild');
    jest.spyOn(mockAnchor, 'click').mockImplementation(() => {});
  
    component.signalClients.set([
      { sharedKey: '123', businessId: 'BizCorp', email: 'test@example.com', phone: 1234567890, dataAdded: '2024-01-01|2024-12-31' }
    ]);
  
    component.downloadCSV();
  
    expect(Papa.prototype.unparse).toHaveBeenCalled();
    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(document.body.appendChild).toHaveBeenCalledWith(mockAnchor);
    expect(mockAnchor.click).toHaveBeenCalled();
    expect(document.body.removeChild).toHaveBeenCalledWith(mockAnchor);
  });
});
