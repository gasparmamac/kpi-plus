import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Router, RouterModule } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { DispatchService } from './dispatch.service';

@Component({
  selector: 'app-dispatch',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBar,
  ],
  templateUrl: './dispatch.component.html',
  styleUrl: './dispatch.component.css',
})
export class DispatchComponent implements OnInit, OnDestroy {
  title = 'Dispatch Table';
  loadingSubscription = new Subscription();
  loading: boolean = false;

  constructor(
    private router: Router,
    private dispatchService: DispatchService
  ) {}
  ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.loadingSubscription = this.dispatchService.loading$.subscribe(
      (loading: boolean) => (this.loading = loading)
    );
  }

  onAdd() {
    console.log('Addiing');
    this.router.navigate(['/menu/dispatch/edit-dispatch']);
  }
}
