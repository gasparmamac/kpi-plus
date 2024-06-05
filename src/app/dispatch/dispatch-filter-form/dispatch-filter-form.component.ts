import { Component, inject } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { FirestoreService } from '../../services/firestore.service';
import { DispatchService } from '../dispatch.service';

@Component({
  selector: 'app-dispatch-filter-form',
  templateUrl: './dispatch-filter-form.component.html',
  styleUrl: './dispatch-filter-form.component.css',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
  ],
})
export class DispatchFilterFormComponent {
  constructor(
    private fb: FormBuilder,
    private dispatchService: DispatchService
  ) {}

  filterForm = this.fb.group({
    filterValue: [null, Validators.required],
  });

  filterOptions = [
    { name: 'No payroll', abbreviation: 'no_payroll' },
    { name: 'No invoice', abbreviation: 'no_invoice' },
    { name: 'No O.R.', abbreviation: 'no_or' },
  ];

  onApply(): void {
    const filterValue = String(this.filterForm.value.filterValue);
    this.dispatchService.getDispatchItems(filterValue);
  }
}
