import { Component, Input, OnInit, inject } from '@angular/core';

import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormControl,
  FormGroup,
} from '@angular/forms';
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
export class DispatchFilterFormComponent implements OnInit {
  filterForm!: FormGroup<{ filterValue: FormControl<string | null> }>;

  constructor(
    private fb: FormBuilder,
    private dispatchService: DispatchService
  ) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      filterValue: ['no_payroll', Validators.required],
    });
  }

  filterOptions = [
    { name: 'No payroll', abbreviation: 'no_payroll' },
    { name: 'No invoice', abbreviation: 'no_invoice' },
    { name: 'No o.r.', abbreviation: 'no_or' },
    { name: 'Last 100', abbreviation: 'last100' },
  ];

  onApply(): void {
    const filterValue = String(this.filterForm.value.filterValue);
    this.dispatchService.filterValueSubject.next(filterValue);
    this.dispatchService.getDispatchItems();
  }
}
