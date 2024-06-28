import { Component, Inject, inject } from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-dispatch-snackbar',
  standalone: true,
  imports: [],
  templateUrl: './dispatch-snackbar.component.html',
  styleUrl: './dispatch-snackbar.component.css',
})
export class DispatchSnackbarComponent {
  snackBarRef = inject(MatSnackBarRef);
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { id: string }) {}

  onClick() {
    this.snackBarRef.dismissWithAction();
  }
}
