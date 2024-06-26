import { Injectable, OnDestroy } from '@angular/core';
import { DispatchModel, FirestoreService } from '../services/firestore.service';
import { BehaviorSubject, Subscription, combineLatest, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService implements OnDestroy {
  noOrSubject = new BehaviorSubject<DispatchModel[]>([]);
  noPayrollSubject = new BehaviorSubject<DispatchModel[]>([]);

  noInvNoPayrollSubject = new BehaviorSubject<DispatchModel[]>([]);
  noInVNoOrSubject = new BehaviorSubject<DispatchModel[]>([]);
  noInvAggSubject = new BehaviorSubject<DispatchModel[]>([]);

  noOrItems$ = this.noOrSubject.asObservable();
  noPayrollItems$ = this.noPayrollSubject.asObservable();

  noInvNoPayroll$ = this.noInvNoPayrollSubject.asObservable();
  noInVNoOr$ = this.noInVNoOrSubject.asObservable();
  noInvAgg$ = this.noInvAggSubject.asObservable();

  subscription = new Subscription();

  constructor(private firestoreService: FirestoreService) {
    this.firestoreService.noOrQuery();
    this.firestoreService.noPayrollQuery();

    this.subscription = combineLatest([
      this.firestoreService.noOrQuery(),
      this.firestoreService.noPayrollQuery(),
    ])
      .pipe(
        map(([noOr, noPayroll]) => {
          const noInvNoOr = noOr.filter(
            (item) =>
              item.inv_date === null ||
              item.inv_date === '' ||
              item.inv_no === null ||
              item.inv_no === ''
          );
          const noInvNoPayroll = noPayroll.filter(
            (item) =>
              item.inv_date === null ||
              item.inv_date === '' ||
              item.inv_no === null ||
              item.inv_no === ''
          );
          const noInvAgg = removeDuplicate(noOr, noPayroll);

          this.noOrSubject.next(noOr);
          this.noPayrollSubject.next(noPayroll);
          this.noInVNoOrSubject.next(noInvNoOr);
          this.noInvNoPayrollSubject.next(noInvNoPayroll);
          this.noInvAggSubject.next(noInvAgg);
          console.log('dashboard no OR:  ', noOr);
          console.log('dashboard no Payroll:  ', noPayroll);
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}

function removeDuplicate(
  arr1: DispatchModel[],
  arr2: DispatchModel[]
): DispatchModel[] {
  const combinedArr = [...arr1, ...arr2];
  const uniqueArr = combinedArr.filter(
    (filterItem, index) =>
      index === combinedArr.findIndex((item) => item.id === filterItem.id)
  );

  return uniqueArr;
}
