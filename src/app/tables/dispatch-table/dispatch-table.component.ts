import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { DispatchTableDataSource } from './dispatch-table-datasource';
import { FormsService } from '../../forms/forms.service';
import { DashboardService } from '../../dashboard/dashboard.service';
import { DispatchModel } from '../../services/firestore.service';
import { CommonModule } from '@angular/common';
import { SearchEntryComponent } from '../../forms/search-entry/search-entry.component';
import { MatIconModule } from '@angular/material/icon';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { MatButtonModule } from '@angular/material/button';
import { DispatchItemDetailsComponent } from './dispatch-item-details/dispatch-item-details.component';

@Component({
  selector: 'app-dispatch-table',
  templateUrl: './dispatch-table.component.html',
  styleUrl: './dispatch-table.component.css',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    SearchEntryComponent,
    DispatchItemDetailsComponent,
  ],
})
export class DispatchTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<DispatchModel>;

  dataSource = new DispatchTableDataSource(
    this.formsService,
    this.dashboardService
  );

  constructor(
    private formsService: FormsService,
    private dashboardService: DashboardService
  ) {}

  displayedColumns = [
    'disp_date',
    'disp_slip',
    'route',
    'plate_no',
    'driver',
    'helper',
  ];
  displayedColumnsWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement!: DispatchModel | null;

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
