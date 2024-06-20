import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { InvoiceTableDataSource } from './invoice-table-datasource';
import {
  DispatchModel,
  FirestoreService,
} from '../../services/firestore.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invoice-table',
  templateUrl: './invoice-table.component.html',
  styleUrl: './invoice-table.component.css',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule],
})
export class InvoiceTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<DispatchModel>;
  dataSource: any;

  constructor(private firestoreService: FirestoreService) {
    firestoreService.loadDispatchForInvoice(); //need caching or else, it will always submit query to server
    this.dataSource = new InvoiceTableDataSource(this.firestoreService);
  }

  displayedColumns = [
    'disp_date',
    'disp_slip',
    'destination',
    'plate_no',
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
