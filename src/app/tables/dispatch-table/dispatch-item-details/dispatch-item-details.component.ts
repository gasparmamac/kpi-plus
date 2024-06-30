import { Component, Input, OnInit } from '@angular/core';
import { DispatchModel } from '../../../services/firestore.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { DispatchService } from '../../../dispatch/dispatch.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dispatch-item-details',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './dispatch-item-details.component.html',
  styleUrl: './dispatch-item-details.component.css',
})
export class DispatchItemDetailsComponent implements OnInit {
  @Input()
  element!: any;

  constructor(
    private dispatchService: DispatchService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    console.log('element sa item details', this.element);
  }

  onDelete(id: string) {
    console.log('id: ', id);
    this.dispatchService.deleteDispatchItem(id);
    this.dispatchService.queryingSubject.next(true);
  }

  onEdit(arg0: DispatchModel) {
    this.router.navigate(['../edit', arg0.id], {
      state: { element: arg0 },
      relativeTo: this.activatedRoute,
    });
  }
}
