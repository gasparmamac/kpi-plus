import { Component, Input } from '@angular/core';
import { DispatchModel } from '../../../services/firestore.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dispatch-item-details',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './dispatch-item-details.component.html',
  styleUrl: './dispatch-item-details.component.css',
})
export class DispatchItemDetailsComponent {
  onDelete(arg0: string | undefined) {}
  onEdit(arg0: DispatchModel) {}
  @Input()
  element!: any;
}
