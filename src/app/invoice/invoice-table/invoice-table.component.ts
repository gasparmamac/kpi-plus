import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { InvoiceTableDataSource } from './invoice-table-datasource';
import { DispatchModel } from '../../services/firestore.service';
import { CommonModule } from '@angular/common';
import { SearchEntryComponent } from '../../forms/search-entry/search-entry.component';
import { FormsService } from '../../forms/forms.service';
import { DashboardService } from '../../dashboard/dashboard.service';

@Component({
  selector: 'app-invoice-table',
  templateUrl: './invoice-table.component.html',
  styleUrl: './invoice-table.component.css',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    SearchEntryComponent,
  ],
})
export class InvoiceTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<DispatchModel>;

  dataSource = new InvoiceTableDataSource(
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
    'plate_no',
    'destination',
    'cbm',
    'qty',
    'drops',
    'disp_rate',
  ];

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
