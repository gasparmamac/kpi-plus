import { Component } from '@angular/core';
import { InvoiceTableComponent } from './invoice-table/invoice-table.component';

@Component({
  selector: 'app-invoice',
  standalone: true,
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css',
  imports: [InvoiceTableComponent],
})
export class InvoiceComponent {}
