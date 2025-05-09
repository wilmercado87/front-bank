import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Utility } from '../../utils/utility';

@Component({
  selector: 'app-advanced-search',
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './advanced-search.component.html',
  styleUrl: './advanced-search.component.scss'
})
export class AdvancedSearchComponent{
  columns = Utility.columns;
  searchForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AdvancedSearchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string }
  ) {
    this.searchForm = this.fb.group({
      field: ['', Validators.required],
      value: ['', Validators.required],
    });
  }

  submit() {
    if (this.searchForm.valid) {
      this.dialogRef.close(this.searchForm.value);
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
