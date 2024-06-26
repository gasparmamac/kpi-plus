import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard/dashboard.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { DispatchModel } from '../services/firestore.service';

@Injectable({
  providedIn: 'root',
})
export class DispatchService implements OnDestroy {
  noInvNoPayrollSubject = new BehaviorSubject<DispatchModel[]>([]);
  noPayrollItemsSubject = new BehaviorSubject<DispatchModel[]>([]);

  noInvNoPayroll$ = this.noInvNoPayrollSubject.asObservable();
  noPayrollItems$ = this.noPayrollItemsSubject.asObservable();
  subscription = new Subscription();
  loading$: any;

  constructor(private dashboardService: DashboardService) {
    const subs1 = this.dashboardService.noPayrollItems$.subscribe((items) => {
      this.noPayrollItemsSubject.next(items);
    });
  }

  ngOnDestroy(): void {}
}
