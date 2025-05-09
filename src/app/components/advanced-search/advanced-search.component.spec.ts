import { TestBed } from '@angular/core/testing';
import { AdvancedSearchComponent } from './advanced-search.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ComponentFixture } from '@angular/core/testing';

describe('AdvancedSearchComponent', () => {
  let component: AdvancedSearchComponent;
  let fixture: ComponentFixture<AdvancedSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancedSearchComponent, ReactiveFormsModule],
      providers: [FormBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(AdvancedSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario con valores vacíos', () => {
    expect(component.searchForm.value).toEqual({
      field: '',
      value: '',
    });
  });

  it('debería marcar el formulario como inválido si los campos están vacíos', () => {
    component.searchForm.controls['field'].setValue('');
    component.searchForm.controls['value'].setValue('');
    expect(component.searchForm.valid).toBe(false);
  });

  it('debería marcar el formulario como válido si los campos están llenos', () => {
    component.searchForm.controls['field'].setValue('Nombre');
    component.searchForm.controls['value'].setValue('William');
    expect(component.searchForm.valid).toBe(true);
  });

  it('debería emitir datos al validar el formulario', () => {
    jest.spyOn(component.data, 'emit');

    component.searchForm.setValue({
      field: 'Email',
      value: 'test@example.com',
    });

    component.validateForm();

    expect(component.data.emit).toHaveBeenCalledWith({
      field: 'Email',
      value: 'test@example.com',
    });
  });
});

