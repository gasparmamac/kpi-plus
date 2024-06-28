import { Component, Input } from '@angular/core';
import { DispatchModel } from '../../../services/firestore.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { DispatchService } from '../../../dispatch/dispatch.service';

@Component({
  selector: 'app-dispatch-item-details',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './dispatch-item-details.component.html',
  styleUrl: './dispatch-item-details.component.css',
})
export class DispatchItemDetailsComponent {
  @Input()
  element!: any;

  constructor(private dispatchService: DispatchService) {}

  onDelete(id: string) {
    console.log('id: ', id);
    this.dispatchService.deleteDispatchItem(id);
    this.dispatchService.queryingSubject.next(true);
  }

  onEdit(arg0: DispatchModel) {}
}
