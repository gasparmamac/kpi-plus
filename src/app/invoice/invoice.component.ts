import { Component } from '@angular/core';
import { InvoiceTableComponent } from './invoice-table/invoice-table.component';
import { DrapDropComponent } from '../drap-drop/drap-drop.component';

@Component({
  selector: 'app-invoice',
  standalone: true,
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css',
  imports: [InvoiceTableComponent, DrapDropComponent],
})
export class InvoiceComponent {}
