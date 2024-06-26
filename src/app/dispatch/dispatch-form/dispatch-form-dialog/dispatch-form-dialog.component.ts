import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DispatchService } from '../../dispatch.service';
import { DispatchModel } from '../../../services/firestore.service';

@Component({
  selector: 'app-dispatch-form-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './dispatch-form-dialog.component.html',
  styleUrl: './dispatch-form-dialog.component.css',
})
export class DispatchFormDialogComponent {
  constructor(
    private router: Router,
    private dispatchService: DispatchService,
    @Inject(MAT_DIALOG_DATA) public data: DispatchModel
  ) {}
  onCancel() {
    this.router.navigate(['/menu/dispatch/table']);
  }
  onYes() {
    // this.dispatchService.addDispatchItem(this.data);
  }
}
