import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Router, RouterModule } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { DispatchService } from './dispatch.service';
import { DispatchTableComponent } from '../tables/dispatch-table/dispatch-table.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dispatch',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBar,
    MatSnackBarModule,

    DispatchTableComponent,
  ],
  templateUrl: './dispatch.component.html',
  styleUrl: './dispatch.component.css',
})
export class DispatchComponent implements OnInit, OnDestroy {
  title = 'Dispatch Table';
  loading$!: Observable<boolean>;
  querying$!: Observable<boolean>;

  constructor(
    private router: Router,
    private dispatchService: DispatchService
  ) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.loading$ = this.dispatchService.loading$;
    this.querying$ = this.dispatchService.querying$;
  }

  onAdd() {
    this.router.navigate(['/menu/dispatch/edit-dispatch']);
  }
}
