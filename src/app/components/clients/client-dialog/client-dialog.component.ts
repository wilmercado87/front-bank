import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Client } from '../../../models/client';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MaterialModule } from '../../../material/material.module';
import { Utility } from '../../../utils/utility';

@Component({
  selector: 'app-client-dialog',
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './client-dialog.component.html',
  styleUrl: './client-dialog.component.scss',
})
export class ClientDialogComponent implements OnInit {
    @Input() title = '';
    @Output() validateClient = new EventEmitter<any>();
    clientForm!: FormGroup;
    
    isNewClient: boolean = true;

    constructor(private fb: FormBuilder, 
        private dialogRef: MatDialogRef<ClientDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { title: string; client?: Client }) {
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

    ngOnInit(): void {
      if (this.data?.client) {
        const { client } = this.data;
        this.clientForm.patchValue({
            id: client.id,
            document: client.document,
            name: client.name,
            email: client.email,
            phone: client.phone,
            startDate: Utility.parseDate(client.dataDates.split(' ')[0]),
            endDate: Utility.parseDate(client.dataDates.split(' ')[1]),
        });
      }
    }

    isInvalid(field: string): any {
        return this.clientForm.get(field)?.invalid && this.clientForm.get(field)?.touched;
    }

    onSubmit(): void {
        if (this.clientForm.valid) {
            this.validateClient.emit(this.clientForm.value);
        }
    }

    onCancel() {
        this.clientForm.reset();
        this.dialogRef.close();
    }
    
}
