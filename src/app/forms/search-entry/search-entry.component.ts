import { Component, OnDestroy, OnInit, inject } from '@angular/core';

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
import { BehaviorSubject } from 'rxjs';
import { FormsService } from '../forms.service';

@Component({
  selector: 'app-search-entry',
  templateUrl: './search-entry.component.html',
  styleUrl: './search-entry.component.css',
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
export class SearchEntryComponent implements OnInit, OnDestroy {
  searchEntryForm!: FormGroup<{ searchEntry: FormControl<null> }>;

  constructor(private fb: FormBuilder, private fs: FormsService) {}

  ngOnInit(): void {
    this.searchEntryForm = this.fb.group({
      searchEntry: null,
    });
  }

  ngOnDestroy(): void {}

  onSearchEntry($event: KeyboardEvent) {
    console.log('predded');
    const searchValue = ($event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.fs.searchInputSubject.next(searchValue);
  }
}
