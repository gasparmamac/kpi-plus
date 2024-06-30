import { Injectable, OnDestroy } from '@angular/core';
import { DashboardService } from '../dashboard/dashboard.service';
import { BehaviorSubject, Subscription, catchError, tap } from 'rxjs';
import { DispatchModel, FirestoreService } from '../services/firestore.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DispatchService implements OnDestroy {
  noInvNoPayrollSubject = new BehaviorSubject<DispatchModel[]>([]);
  noPayrollItemsSubject = new BehaviorSubject<DispatchModel[]>([]);

  noInvNoPayroll$ = this.noInvNoPayrollSubject.asObservable();
  noPayrollItems$ = this.noPayrollItemsSubject.asObservable();

  queryingSubject = new BehaviorSubject<boolean>(false);
  loadingSubject = new BehaviorSubject<boolean>(false);

  querying$ = this.queryingSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  subscription = new Subscription();

  constructor(
    private dashboardService: DashboardService,
    private firestoreService: FirestoreService,
    private snackbar: MatSnackBar,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    const subs1 = this.dashboardService.noPayrollItems$.subscribe((items) => {
      this.noPayrollItemsSubject.next(items);
    });
    this.subscription.add(subs1);
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  addDispatchItem(data: DispatchModel) {
    const subs2 = this.firestoreService
      .createDoc('dispatch', data)
      .pipe(
        tap((docRef: { id: string }) => {
          this.router.navigate(['/menu/dispatch/table'], {});

          this.queryingSubject.next(false);
          this.loadingSubject.next(true);

          this.openSnackBar(
            `Dispatch with id: "${docRef.id}" is added SUCCESSFULLY!`,
            'Ok'
          );
        }),
        catchError(async (error) => {
          this.loadingSubject.next(false);
          this.queryingSubject.next(false);
          this.openSnackBar(`Error occured! \n ${error}`, 'Dismiss');
        })
      )
      .subscribe(() => {
        this.loadingSubject.next(false);
        this.queryingSubject.next(false);
      });
    this.subscription.add(subs2);
  }

  deleteDispatchItem(id: string) {
    const subs = this.firestoreService
      .deleteDoc('dispatch', id)
      .pipe(
        tap(() => {
          this.queryingSubject.next(false);
          this.loadingSubject.next(true);
          this.openSnackBar('Dispatch deleted successfully', 'Ok');
        }),
        catchError(async (error) => {
          this.loadingSubject.next(false);
          this.queryingSubject.next(false);
          this.openSnackBar(`Error occured! \n ${error}`, 'Dismiss');
        })
      )
      .subscribe(() => {
        this.loadingSubject.next(false);
        this.queryingSubject.next(false);
        this.openSnackBar('Dispatch deleted successfully', 'Ok');
      });

    this.subscription.add(subs);
  }

  private openSnackBar(message: string, action: string) {
    this.snackbar.open(message, action, { duration: 10000 });
  }
}
