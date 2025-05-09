import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewClientComponent } from './new-client.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ElementRef } from '@angular/core';
import { Utility } from '../../../utils/utility';

jest.mock('bootstrap', () => ({
  Modal: jest.fn().mockImplementation(() => ({
    show: jest.fn(),
    hide: jest.fn(),
  })),
}));

jest.mock('../../../utils/utility', () => ({
  Utility: {
    setModalInstance: jest.fn(),
  },
}));

describe('NewClientComponent', () => {
  let component: NewClientComponent;
  let fixture: ComponentFixture<NewClientComponent>;
  let modalElement: ElementRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, NewClientComponent],
      providers: [FormBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(NewClientComponent);
    component = fixture.componentInstance;
    modalElement = fixture.nativeElement.querySelector('#newClientModal');
    component.modalElement = modalElement;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario', () => {
    expect(component.clientForm).toBeTruthy();
    expect(component.clientForm.value).toEqual({
      id: '',
      document: '',
      name: '',
      email: '',
      phone: '',
      startDate: '',
      endDate: '',
    });
  });

  it('debería emitir el evento el newClient cuando el validateForm es llamado con el new client', () => {
    const spy = jest.spyOn(component.newClient, 'emit');
    component.clientForm.setValue({
      id: '',
      document: '1234567890',
      name: 'William Mercado',
      email: 'william.mercado@example.com',
      phone: '1234567890',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
    });
    component.validateForm();
    expect(spy).toHaveBeenCalledWith({
      document: '1234567890',
      name: 'William Mercado',
      email: 'william.mercado@example.com',
      phone: '1234567890',
      dataDates: '2025-01-01 2025-12-31',
    });
  });

  it('debería emitir el evento updateClient cuaando el validateForm es llamado cuando existe un cliente', () => {
    component.isNewClient = false;
    const spy = jest.spyOn(component.updateClient, 'emit');
    component.clientForm.setValue({
      id: '1',
      document: '1234567890',
      name: 'William Mercado',
      email: 'william.mercado@example.com',
      phone: '1234567890',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
    });
    component.validateForm();
    expect(spy).toHaveBeenCalledWith({
      id: '1',
      document: '1234567890',
      name: 'William Mercado',
      email: 'william.mercado@example.com',
      phone: '1234567890',
      dataDates: '2025-01-01 2025-12-31',
    });
  });
});

