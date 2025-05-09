import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientsComponent } from './clients.component';
import { CommonModule, DatePipe } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ClientService } from '../../services/client.service';
import { Papa } from 'ngx-papaparse';
import { BehaviorSubject, of } from 'rxjs';
import { ClientDialogComponent } from './client-dialog/client-dialog.component';

describe('ClientsComponent', () => {
  let component: ClientsComponent;
  let fixture: ComponentFixture<ClientsComponent>;
  let clientServiceSpy: jest.Mocked<ClientService>;
  let dialogSpy: jest.Mocked<MatDialog>;
  let papaSpy: jest.Mocked<Papa>;
  let dialogRefSpy: jest.Mocked<MatDialogRef<ClientDialogComponent>>;

  const refreshTriggerMock = new BehaviorSubject<void>(undefined);

  beforeEach(() => {
    clientServiceSpy = {
      http: {} as any,

      getClients: jest.fn().mockReturnValue(of([])),
      createClient: jest.fn().mockReturnValue(of({})),
      updateClient: jest.fn().mockReturnValue(of({})),
      deleteClient: jest.fn().mockReturnValue(of({})),
      getAdvancedSearch: jest.fn().mockReturnValue([]),
      
      refreshClients: jest.fn(), 
      refreshTrigger: refreshTriggerMock

    };

    dialogRefSpy = {
      close: jest.fn(),
      afterClosed: jest.fn().mockReturnValue(of(true)),
      backdropClick: jest.fn(),
      keydownEvents: jest.fn(),
      updateSize: jest.fn(),
      updatePosition: jest.fn(),
      updateScrollStrategy: jest.fn(),
      addPanelClass: jest.fn(),
      removePanelClass: jest.fn(),
      _containerInstance: {} as any,
      componentInstance: {} as any,
      componentRef: null,
      disableClose: false,
      updateDisableClose: jest.fn(),
      updateId: jest.fn(),
      getState: jest.fn(),
    } as any;

    dialogSpy = {
      open: jest.fn().mockReturnValue(dialogRefSpy),
    } as any;

    papaSpy = {
      unparse: jest.fn().mockReturnValue('csv content'),
    } as any;


    TestBed.configureTestingModule({
      imports: [CommonModule, NgxPaginationModule, ClientsComponent],
      providers: [
        DatePipe,
        { provide: ClientService, useValue: clientServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: Papa, useValue: papaSpy },
      ],
    });

    fixture = TestBed.createComponent(ClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call insertClient when the form is submitted with valid data', () => {
    const formData = { document: '123', name: 'William', email: 'william@test.com', phone: '12345', startDate: new Date(), endDate: new Date() };
    component.insertClient(formData);
    expect(clientServiceSpy.createClient).toHaveBeenCalled();
  });

  it('should call updateClient when the form is submitted with existing client data', () => {
    const formData = { id: '1', document: '123', name: 'William', email: 'william@test.com', phone: '12345', startDate: new Date(), endDate: new Date() };
    component.updateClient(formData);
    expect(clientServiceSpy.updateClient).toHaveBeenCalled();
  });

  it('should call removeClient and delete a client', () => {
    const id = '1';
    component.removeClient(id);
    expect(clientServiceSpy.deleteClient).toHaveBeenCalledWith(id);
  });



  it('should handle advanced search data', () => {
    const searchData = { field: 'name', value: 'William' };
    component.handleData(searchData);
    expect(clientServiceSpy.getAdvancedSearch).toHaveBeenCalledWith(expect.any(Array), searchData.field, searchData.value);
  });

  it('should refresh clients', () => {
    component.refreshClients();
    expect(clientServiceSpy.getClients).toHaveBeenCalled();
  });
});
