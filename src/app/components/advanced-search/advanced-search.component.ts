import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-advanced-search',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './advanced-search.component.html',
  styleUrl: './advanced-search.component.scss'
})
export class AdvancedSearchComponent implements AfterViewInit{
  @Input() title = '';
  searchForm!: FormGroup;

  @Output() data = new EventEmitter<any>();
  @ViewChild('advancedSearchModal') modalElement!: ElementRef;
  private modalInstance!: Modal;

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      field: ['', [Validators.required]],
      value: ['', Validators.required],
    });
  }

  ngAfterViewInit() {
    this.modalInstance = new Modal(this.modalElement.nativeElement);
  }

  validateForm() {
    let data: any = {
      field: this.searchForm.value.field,
      value: this.searchForm.value.value,
    }
    this.data.emit(data);
  }

  isInvalid(field: string): any {
    return this.searchForm.get(field)?.invalid && this.searchForm.get(field)?.touched;
  }

  openModal() {
    this.modalInstance.show();
  }

  closeModal() {
    this.searchForm.reset();
    this.modalInstance.hide();
  }

}
