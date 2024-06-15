import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
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
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { DispatchDetailViewComponent } from './dispatch-detail-view/dispatch-detail-view.component';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { DispatchModel } from '../../services/firestore.service';

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
    DispatchDetailViewComponent,
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0' })),
      state('expand', style({ height: '*' })),
      transition(
        'expanded<=>collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class DispatchTableComponent
  implements AfterViewInit, OnInit, OnDestroy
{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSubscription = new Subscription();
  showTableSubscription = new Subscription();

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
  columnsToDisplay = ['disp_date', 'route', 'plate_no', 'driver', 'helper'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement!: DispatchModel | null;
  showTable = false;

  loading$!: Observable<boolean>;
  feedbackMsg$!: Observable<string>;
  defaultFilterValue = 'no_payroll';

  constructor(
    private fb: FormBuilder,
    private dispatchService: DispatchService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('table initialised');
    this.dispatchService.getDispatchItems(this.defaultFilterValue);
    this.loading$ = this.dispatchService.loading$;
    this.feedbackMsg$ = this.dispatchService.feedbackMsg$;
    this.showTableSubscription = this.dispatchService.showTable$.subscribe(
      (status) => {
        this.showTable = status;
      }
    );
    this.dataSubscription = this.dispatchService.dispatchItems$.subscribe(
      (data) => {
        this.dataSource.data = data;
      }
    );
  }
  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
    this.showTableSubscription.unsubscribe();
  }

  searchEntryForm = this.fb.group({
    postalCode: [null],
  });

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onSearchEntry($event: Event) {
    const searchValue = ($event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = searchValue;
  }

  onAdd() {
    this.router.navigate(['/menu/dispatch/add']);
  }
}
