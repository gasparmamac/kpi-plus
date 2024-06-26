import { Component, Input } from '@angular/core';
import { DispatchModel } from '../../../services/firestore.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { DispatchService } from '../../dispatch.service';

@Component({
  selector: 'app-dispatch-detail-view',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './dispatch-detail-view.component.html',
  styleUrl: './dispatch-detail-view.component.css',
})
export class DispatchDetailViewComponent {
  @Input() element: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dispatchService: DispatchService
  ) {}

  onDelete(id: string) {
    // this.dispatchService.deleteDispatch(id);
  }

  onEdit(element: DispatchModel) {
    this.router.navigate(['../edit', element.id], {
      state: { element },
      relativeTo: this.activatedRoute,
    });
  }
}
