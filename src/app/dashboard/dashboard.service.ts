import { Injectable } from '@angular/core';
import { DispatchModel, FirestoreService } from '../services/firestore.service';
import { BehaviorSubject } from 'rxjs';
import { Console } from 'console';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  noOrItemsSubject = new BehaviorSubject<DispatchModel[]>([]);
  noPaymentItemsSubject = new BehaviorSubject<DispatchModel[]>([]);

  noOrItems$ = this.noOrItemsSubject.asObservable();
  noPaymentItems$ = this.noOrItemsSubject.asObservable();

  constructor(private fs: FirestoreService) {
    console.log('dashboard service constructor called');
    this.fs.noOrQuery().subscribe((items) => this.noOrItemsSubject.next(items));
    this.fs
      .noPayrollQuery()
      .subscribe((items) => this.noPaymentItemsSubject.next(items));
  }
}
