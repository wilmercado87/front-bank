import { TestBed } from '@angular/core/testing';
import { NewClientComponent } from './new-client.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ComponentFixture } from '@angular/core/testing';
import { Client } from '../../../models/client';

describe('NewClientComponent', () => {
  let component: NewClientComponent;
  let fixture: ComponentFixture<NewClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewClientComponent, ReactiveFormsModule],
      providers: [FormBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(NewClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario con valores vacíos', () => {
    expect(component.clientForm.value).toEqual({
      sharedKey: '',
      businessId: '',
      email: '',
      phone: '',
      startDate: '',
      endDate: '',
    });
  });

  it('debería validar el formulario correctamente', () => {
    const form = component.clientForm;
    form.controls['sharedKey'].setValue('ABC');
    form.controls['businessId'].setValue('123');
    form.controls['email'].setValue('test@example.com');
    form.controls['phone'].setValue('1234567890');
    form.controls['startDate'].setValue('2024-01-01');
    form.controls['endDate'].setValue('2024-12-31');

    expect(form.valid).toBe(true);
  });

  it('debería marcar los campos como inválidos si están vacíos', () => {
    component.clientForm.controls['sharedKey'].setValue('');
    component.clientForm.controls['businessId'].setValue('');
    component.clientForm.controls['email'].setValue('');
    component.clientForm.controls['phone'].setValue('');
    component.clientForm.controls['startDate'].setValue('');
    component.clientForm.controls['endDate'].setValue('');

    expect(component.clientForm.valid).toBe(false);
  });

  it('debería emitir un evento al crear un nuevo cliente', () => {
    jest.spyOn(component.newClient, 'emit');

    component.clientForm.setValue({
      sharedKey: 'ABC123',
      businessId: '123',
      email: 'test@example.com',
      phone: 1234567890,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    });

    component.isNewClient = true;
    component.validateForm();

    expect(component.newClient.emit).toHaveBeenCalledWith({
      sharedKey: 'ABC123',
      businessId: '123',
      email: 'test@example.com',
      phone: 1234567890,
      dataAdded: '2024-01-01|2024-12-31',
    });
  });

  it('debería emitir un evento al actualizar un cliente', () => {
    jest.spyOn(component.updateClient, 'emit');

    component.clientForm.setValue({
      sharedKey: 'XYZ789',
      businessId: '456',
      email: 'update@example.com',
      phone: 9876543210,
      startDate: '2024-02-01',
      endDate: '2024-11-30',
    });

    component.isNewClient = false;
    component.validateForm();

    expect(component.updateClient.emit).toHaveBeenCalledWith({
      sharedKey: 'XYZ789',
      businessId: '456',
      email: 'update@example.com',
      phone: 9876543210,
      dataAdded: '2024-02-01|2024-11-30',
    });
  });
});

