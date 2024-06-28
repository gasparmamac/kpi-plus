import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-fuel-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './fuel-dialog.component.html',
  styleUrl: './fuel-dialog.component.css',
})
export class FuelDialogComponent {}
