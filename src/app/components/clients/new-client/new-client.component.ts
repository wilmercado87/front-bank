import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, output, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Modal } from 'bootstrap';
import { Client } from '../../../models/client';
import { Utility } from '../../../utils/utility';

@Component({
  selector: 'app-new-client',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './new-client.component.html',
  styleUrl: './new-client.component.scss'
})
export class NewClientComponent implements AfterViewInit {

  clientForm!: FormGroup;

  @Input() title = '';
  newClient = output<Client>();
  updateClient = output<Client>();
  @ViewChild('newClientModal') modalElement!: ElementRef;
  modalInstance!: Modal;
  isNewClient: boolean = true;

  constructor(private fb: FormBuilder) {
    this.clientForm = this.fb.group({
      id: [''],
      document: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^[0-9]{10}$')]],
      name: ['', Validators.required],
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
    let client: Client = {
      document: this.clientForm.value.document,
      name: this.clientForm.value.name,
      email: this.clientForm.value.email,
      phone: this.clientForm.value.phone,
      dataDates: this.clientForm.value.startDate + ' ' + this.clientForm.value.endDate,
    };

    if (!this.isNewClient) {
      client.id = this.clientForm.value.id;
    }

    this.isNewClient ? this.newClient.emit(client) : this.updateClient.emit(client);
  }

  openModal(isNewClient: boolean) {
    this.isNewClient = isNewClient;
    this.modalInstance.show(); 
    Utility.setModalInstance('false', this.modalInstance, this.modalElement);
  }

  closeModal() {
    this.clientForm.reset();
    this.modalInstance.hide();
    Utility.setModalInstance('true', this.modalInstance, this.modalElement);
  }

}
