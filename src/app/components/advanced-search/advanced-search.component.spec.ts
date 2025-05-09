import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdvancedSearchComponent } from './advanced-search.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('AdvancedSearchComponent', () => {
  let component: AdvancedSearchComponent;
  let fixture: ComponentFixture<AdvancedSearchComponent>;
  let dialogRefSpy: jest.Mocked<MatDialogRef<AdvancedSearchComponent>>;

  beforeEach(() => {
    dialogRefSpy = jest.mocked({
      close: jest.fn(),
      _containerInstance: null,
      componentInstance: null,
      componentRef: null,
      disableClose: false,
      id: '',
      backdropClick: jest.fn(),
      closeAll: jest.fn(),
      afterOpened: jest.fn(),
      beforeClosed: jest.fn(),
      afterClosed: jest.fn(),
      updateSize: jest.fn(),
      updatePosition: jest.fn(),
      addPanelClass: jest.fn(),
      removePanelClass: jest.fn(),
      getState: jest.fn(),
    } as unknown as MatDialogRef<AdvancedSearchComponent>);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MaterialModule, AdvancedSearchComponent],
      providers: [
        FormBuilder,
        { provide: MAT_DIALOG_DATA, useValue: { title: 'Advanced Search' } },
        { provide: MatDialogRef, useValue: dialogRefSpy },
      ],
    });

    fixture = TestBed.createComponent(AdvancedSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and initialize form', () => {
    expect(component).toBeTruthy();
    expect(component.searchForm).toBeDefined();
    expect(component.searchForm.get('field')).toBeTruthy();
    expect(component.searchForm.get('value')).toBeTruthy();
  });

  it('should invalidate the form if fields are empty', () => {
    const form = component.searchForm;
    expect(form.invalid).toBeTruthy();
  });

  it('should validate the form if fields are filled', () => {
    const form = component.searchForm;
    form.controls['field'].setValue('name');
    form.controls['value'].setValue('william.mercado');
    expect(form.valid).toBeTruthy();
  });

  it('should call dialogRef.close() when submit is called with valid form', () => {
    const form = component.searchForm;
    form.controls['field'].setValue('name');
    form.controls['value'].setValue('william.mercado');
    
    component.submit();

    expect(dialogRefSpy.close).toHaveBeenCalledWith({ field: 'name', value: 'william.mercado' });
  });

  it('should not call dialogRef.close() when submit is called with invalid form', () => {
    component.submit();
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('should call dialogRef.close() when cancel is called', () => {
    component.cancel();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });
});
