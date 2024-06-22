import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DispatchModel } from '../services/firestore.service';
import { DashboardService } from './dashboard.service';
import { Subscription, combineLatest, merge } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: true,
  imports: [
    AsyncPipe,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
  ],
})
export class DashboardComponent implements OnInit, OnDestroy {
  noOrSubscription = new Subscription();
  noOrItems!: DispatchModel[];

  constructor(private ds: DashboardService) {
    console.log('dashboard component called');
  }
  ngOnInit(): void {
    console.log('dashboard component ng oninit');
    this.noOrSubscription = this.ds.noOrItems$.subscribe(
      (items) => (this.noOrItems = items)
    );
  }
  ngOnDestroy(): void {
    console.log('dashboard component ngondestroy');
    if (this.noOrSubscription) this.noOrSubscription.unsubscribe();
  }

  private breakpointObserver = inject(BreakpointObserver);
  /** Based on the screen size, switch from standard to one column per row */
  cards = combineLatest([
    this.breakpointObserver.observe(Breakpoints.Handset),
    this.ds.noOrItems$,
  ]).pipe(
    map(([breakpoints, noOr]) => {
      const matches = breakpoints.matches;
      const data = noOr.map((item) => item.disp_date);
      if (matches) {
        return [
          { title: 'Dispatch', cols: 1, rows: 1, data: data },
          { title: 'Invoice', cols: 1, rows: 1 },
          { title: 'Payroll', cols: 1, rows: 1 },
          { title: 'Payment', cols: 1, rows: 1 },
        ];
      }

      return [
        { title: 'Dispatch', cols: 2, rows: 1, data: data },
        { title: 'Invoice', cols: 1, rows: 1 },
        { title: 'Payroll', cols: 1, rows: 2 },
        { title: 'Payment', cols: 1, rows: 1 },
      ];
    })
  );
}
