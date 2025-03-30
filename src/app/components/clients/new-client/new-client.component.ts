import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, input, Input, output, Output, Signal, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Modal } from 'bootstrap';
import { Client } from '../../../models/client';

@Component({
  selector: 'app-new-client',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-client.component.html',
  styleUrl: './new-client.component.scss'
})
export class NewClientComponent implements AfterViewInit {

  clientForm!: FormGroup;

  @Input() title!: Signal<string>; 
  newClient = output<Client>();
  updateClient = output<Client>();
  @ViewChild('newClientModal') modalElement!: ElementRef;
  private modalInstance!: Modal;
  isNewClient: boolean = true;

  constructor(private fb: FormBuilder) {
    this.clientForm = this.fb.group({
      sharedKey: ['', [Validators.required, Validators.minLength(3)]],
      businessId: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  ngAfterViewInit() {
    this.modalInstance = new Modal(this.modalElement.nativeElement);
  }

  isInvalid(field: string): any {
    return this.clientForm.get(field)?.invalid && this.clientForm.get(field)?.touched;
  }

  validateForm() {
    this.clientForm.get('sharedKey')?.enable();
    let client: Client = {
      sharedKey: this.clientForm.value.sharedKey,
      businessId: this.clientForm.value.businessId,
      email: this.clientForm.value.email,
      phone: Number(this.clientForm.value.phone),
      dataAdded: this.clientForm.value.startDate + '|' + this.clientForm.value.endDate,
    };

    if (this.isNewClient) {
      this.newClient.emit(client);
    } else {
      this.updateClient.emit(client);
    }
  }

  openModal(isNewClient: boolean) {
    this.isNewClient = isNewClient;
    this.setModalInstance('false');
  }

  closeModal() {
    this.clientForm.reset();
    this.setModalInstance('true');
  }

  setModalInstance(isAriaHidden: string) {
    const modal = document.getElementById('newClientModal');
    if (modal) {
      if (isAriaHidden == 'true') {
        modal.setAttribute('aria-hidden', isAriaHidden);
        modal.setAttribute('inert', '');
        this.modalInstance.hide();
      } else {
        modal.setAttribute('aria-hidden', 'false');
        modal.removeAttribute('inert');
        this.modalInstance.show();
      }
    }
  }

}
