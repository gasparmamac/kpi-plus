import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import {
  MatTableModule,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { DispatchFilterFormComponent } from '../dispatch-filter-form/dispatch-filter-form.component';
import { DispatchService } from '../dispatch.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-dispatch-table',
  templateUrl: './dispatch-table.component.html',
  styleUrl: './dispatch-table.component.css',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,

    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatProgressBarModule,
    ReactiveFormsModule,

    DispatchFilterFormComponent,
  ],
})
export class DispatchTableComponent
  implements AfterViewInit, OnInit, OnDestroy
{
  dataSubscription = new Subscription();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource();

  // displayedColumns = [
  //   'destination',
  //   'disp_date',
  //   'disp_rate',
  //   'disp_slip',
  //   'driver',
  //   'drops',
  //   'helper',
  //   'inv_date',
  //   'inv_no',
  //   'odo_end',
  //   'odo_start',
  //   'or_date',
  //   'or_no',
  //   'payroll_date',
  //   'payroll_no',
  //   'plate_no',
  //   'qty',
  //   'route',
  //   'wd_type',
  // ];
  displayedColumns = ['disp_date', 'route', 'plate_no', 'driver', 'helper'];

  constructor(
    private fb: FormBuilder,
    private dispatchService: DispatchService
  ) {}

  ngOnInit(): void {}
  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
  }

  searchEntryForm = this.fb.group({
    postalCode: [null],
  });

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSubscription = this.dispatchService.dispatchItems$.subscribe(
      (data) => {
        console.log(data);
        this.dataSource.data = data;
      }
    );
  }

  onSearchEntry($event: Event) {
    const searchValue = ($event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    console.log(searchValue);
    this.dataSource.filter = searchValue;
  }
}
