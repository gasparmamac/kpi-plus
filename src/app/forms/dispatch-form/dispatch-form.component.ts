import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';

import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { DispatchModel } from '../../services/firestore.service';
import { Observable, Subscription, map } from 'rxjs';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule } from '@angular/router';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogTitle,
} from '@angular/material/dialog';
import { FuelDialogComponent } from './fuel-dialog/fuel-dialog.component';
import { DispatchService } from '../../dispatch/dispatch.service';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dispatch-form',
  templateUrl: './dispatch-form.component.html',
  styleUrl: './dispatch-form.component.css',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatStepperModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatCheckboxModule,
    MatIconModule,

    CommonModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DispatchFormComponent implements OnInit, OnDestroy {
  @Input() formMode = 'add-dispatch';
  @Input() element!: DispatchModel | null;

  dispatchForm!: FormGroup;
  deliveryUnitForm!: FormGroup;
  fuelForm!: FormGroup;
  invoiceForm!: FormGroup;
  payrollForm!: FormGroup;
  orForm!: FormGroup;

  stepperOrientation!: Observable<'horizontal' | 'vertical'>;

  subscription = new Subscription();

  @ViewChild('stepper')
  private dispatchFormStepper!: MatStepper;
  completed: unknown;
  isChecked = false;

  constructor(
    private fb: FormBuilder,
    private dispatchService: DispatchService,
    public breakpointObserver: BreakpointObserver,
    readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.dispatchService.dispatchFormStepperCompleteSubject.next(false);

    const subs5 = this.dispatchService.dispatchFormStepperComplete$.subscribe(
      (isCompleted) => {
        if (isCompleted) this.dispatchFormStepper.next();
      }
    );
    this.subscription.add(subs5);

    this.stepperOrientation = this.breakpointObserver
      .observe('(min-width:800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));

    this.dispatchForm = this.fb.group({
      disp_date: [null, Validators.required],
      disp_slip: [null, Validators.required],
      route: [null, Validators.required],
      odz_route: null,
      destination: [null, Validators.required],
      cbm: [4.5, Validators.required],
      drops: [null, Validators.required],
      qty: [null, Validators.required],
    });

    this.deliveryUnitForm = this.fb.group({
      plate_no: [null, Validators.required],
      backup_plate_no: null,
      driver: [null, Validators.required],
      extra_driver: null,
      helper: [null, Validators.required],
      extra_helper: null,
      odo_end: [0, Validators.required],
      odo_start: [0, Validators.required],
    });
    this.fuelForm = this.fb.group({
      fuel_date: [null, Validators.required],
      fuel_or: [null, Validators.required],
      fuel_item: [null, Validators.required],
      fuel_amt: [null, Validators.required],
    });
    this.invoiceForm = this.fb.group({
      wd_type: null,
      disp_rate: null,
      inv_date: null,
      inv_no: null,
    });
    this.payrollForm = this.fb.group({
      payroll_date: null,
      payroll_no: null,
    });
    this.orForm = this.fb.group({
      or_date: null,
      or_no: null,
    });

    this.onRouteValueChanges();
    this.onPlateNoValueChanges();
    this.onDriverValueChanges();
    this.onHelperValueChanges();
  }

  wd_types = [
    { name: 'Normal', abbreviation: 'normal' },
    { name: 'Special holiday', abbreviation: 'sp_hol' },
    { name: 'Holiday', abbreviation: 'hol' },
    { name: 'Restday', abbreviation: 'rd' },
  ];

  routes = [
    { name: 'Downtown Davao', abbreviation: 'DVO' },
    { name: 'Calinan', abbreviation: 'CAL' },
    { name: 'Toril', abbreviation: 'TOR' },
    { name: 'Outside delivery zone (ODZ)', abbreviation: 'ODZ' },
  ];
  drivers = [
    { name: 'driver1', abbreviation: 'd1' },
    { name: 'driver2', abbreviation: 'd2' },
    { name: 'driver3', abbreviation: 'd3' },
    { name: 'Extra', abbreviation: 'EXD' },
  ];

  helpers = [
    { name: 'helper1', abbreviation: 'h1' },
    { name: 'helper2', abbreviation: 'h2' },
    { name: 'helper3', abbreviation: 'h3' },
    { name: 'Extra', abbreviation: 'EXH' },
  ];

  plate_nos = [
    { name: 'lwd262', abbreviation: 'lwd262' },
    { name: 'ykv852', abbreviation: 'ykv852' },
    { name: 'mdk745', abbreviation: 'mdk745' },
    { name: 'lms946', abbreviation: 'lms946' },
    { name: 'BACKUP', abbreviation: 'BAC' },
  ];

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  onConfirm() {
    const formValues = {
      ...this.dispatchForm.value,
      ...this.deliveryUnitForm.value,
      ...this.fuelForm.value,
      ...this.invoiceForm.value,
      ...this.payrollForm.value,
      ...this.orForm.value,
    };

    switch (this.formMode) {
      case 'add-dispatch':
        this.dispatchService.addDispatchItem(formValues);
        this.dispatchService.queryingSubject.next(true);
    }
  }

  onCheckboxChange(event: MatCheckboxChange) {
    this.isChecked = event.checked;
    this.onNoFuelReceipt(this.isChecked);
    if (this.isChecked) this.openDialog('250', '250');
  }

  private openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    const subs4 = this.dialog
      .open(FuelDialogComponent, {
        width: '250px',
        enterAnimationDuration,
        exitAnimationDuration,
      })
      .afterClosed()
      .subscribe(() => this.dispatchFormStepper.next());
    this.subscription.add(subs4);
  }

  private onNoFuelReceipt(isChecked: boolean): void {
    if (!isChecked) {
      this.fuelForm.get('fuel_date')?.setValidators(Validators.required);
      this.fuelForm.get('fuel_or')?.setValidators(Validators.required);
      this.fuelForm.get('fuel_item')?.setValidators(Validators.required);
      this.fuelForm.get('fuel_amt')?.setValidators(Validators.required);
    } else {
      this.fuelForm.reset();
      this.fuelForm.get('fuel_date')?.clearValidators();
      this.fuelForm.get('fuel_or')?.clearValidators();
      this.fuelForm.get('fuel_item')?.clearValidators();
      this.fuelForm.get('fuel_amt')?.clearValidators();
    }
    this.fuelForm.get('fuel_date')?.updateValueAndValidity();
    this.fuelForm.get('fuel_or')?.updateValueAndValidity();
    this.fuelForm.get('fuel_item')?.updateValueAndValidity();
    this.fuelForm.get('fuel_amt')?.updateValueAndValidity();
  }

  private onRouteValueChanges(): void {
    const subs1 = this.dispatchForm
      .get('route')
      ?.valueChanges.subscribe((routeVal) => {
        const odzRouteControl = this.dispatchForm.get('odz_route');
        if (routeVal === 'ODZ') {
          odzRouteControl?.setValidators([Validators.required]);
        } else {
          odzRouteControl?.clearValidators();
        }
        odzRouteControl?.updateValueAndValidity();
      });
    this.subscription.add(subs1);
  }
  private onPlateNoValueChanges(): void {
    const subs2 = this.deliveryUnitForm
      .get('plate_no')
      ?.valueChanges.subscribe((plateNoVal) => {
        const backupPlateNoControl =
          this.deliveryUnitForm.get('backup_plate_no');
        if (plateNoVal === 'BAC') {
          backupPlateNoControl?.setValidators([Validators.required]);
        } else {
          backupPlateNoControl?.clearValidators();
        }
        backupPlateNoControl?.updateValueAndValidity();
      });
    this.subscription.add(subs2);
  }
  private onDriverValueChanges(): void {
    const subs3 = this.deliveryUnitForm
      .get('driver')
      ?.valueChanges.subscribe((driverVal) => {
        const extraDriverControl = this.deliveryUnitForm.get('extra_driver');
        if (driverVal === 'EXD') {
          extraDriverControl?.setValidators([Validators.required]);
        } else {
          extraDriverControl?.clearValidators();
        }
        extraDriverControl?.updateValueAndValidity();
      });
    this.subscription.add(subs3);
  }
  private onHelperValueChanges(): void {
    const subs3 = this.deliveryUnitForm
      .get('helper')
      ?.valueChanges.subscribe((helperVal) => {
        const extrahelperControl = this.deliveryUnitForm.get('extra_helper');
        if (helperVal === 'EXH') {
          extrahelperControl?.setValidators([Validators.required]);
        } else {
          extrahelperControl?.clearValidators();
        }
        extrahelperControl?.updateValueAndValidity();
      });
    this.subscription.add(subs3);
  }

  get dispatchFormControls() {
    return Object.keys(this.dispatchForm.controls).map((key) => ({
      key,
      control: this.dispatchForm.get(key),
    }));
  }
  get deliveryUnitFormControls() {
    return Object.keys(this.deliveryUnitForm.controls).map((key) => ({
      key,
      control: this.deliveryUnitForm.get(key),
    }));
  }
  get fuelFormControls() {
    return Object.keys(this.fuelForm.controls).map((key) => ({
      key,
      control: this.fuelForm.get(key),
    }));
  }
  get invoiceFormControls() {
    return Object.keys(this.invoiceForm.controls).map((key) => ({
      key,
      control: this.invoiceForm.get(key),
    }));
  }
  get orFormControls() {
    return Object.keys(this.orForm.controls).map((key) => ({
      key,
      control: this.orForm.get(key),
    }));
  }
  get payrollFormControls() {
    return Object.keys(this.payrollForm.controls).map((key) => ({
      key,
      control: this.payrollForm.get(key),
    }));
  }
}
