import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';

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

import { CommonModule } from '@angular/common';
import { DispatchModel } from '../../services/firestore.service';
import { Observable, Subscription, map, reduce } from 'rxjs';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
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
  @Input() formMode = '';
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
  isCompleted$!: Observable<boolean>;
  isChecked = false;

  constructor(
    private fb: FormBuilder,
    private dispatchService: DispatchService,
    public breakpointObserver: BreakpointObserver,
    readonly dialog: MatDialog
  ) {}

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    console.log('form ngOnInit ');

    this.stepperOrientation = this.breakpointObserver
      .observe('(min-width:800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));

    this.initFormByMode(this.formMode);

    this.onRouteValueChanges();
    this.onPlateNoValueChanges();
    this.onDriverValueChanges();
    this.onHelperValueChanges();
  }

  private initFormByMode(formMode: string): void {
    /**
     * Initialize all controls with NULL
     * Expose only the required form/s (adding, editing)
     * Unexposed forms will have null values oo old values (if editing)
     * All exposed forms will be required.
     */
    this.dispatchForm = this.fb.group({
      disp_date: [null, Validators.required],
      disp_slip: [
        null,
        [Validators.required, Validators.pattern('^[^\\s][\\s\\S]*$')],
      ],
      route: [null, Validators.required],
      odz_route: null,
      destination: [
        null,
        [Validators.required, Validators.pattern('^[^\\s][\\s\\S]*$')],
      ],
      cbm: [4.5, [Validators.required]],
      drops: [null, [Validators.required]],
      qty: [null, [Validators.required]],
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
      fuel_or: [
        null,
        [Validators.required, Validators.pattern('^[^\\s][\\s\\S]*$')],
      ],
      fuel_item: [
        null,
        [Validators.required, Validators.pattern('^[^\\s][\\s\\S]*$')],
      ],
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

    switch (formMode) {
      case 'edit-dispatch':
        /**Update initialised forms above with the data from the passed element */
        this.dispatchForm.patchValue({ ...this.element });
        this.deliveryUnitForm.patchValue({ ...this.element });
        this.fuelForm.patchValue({ ...this.element });
        this.invoiceForm.patchValue({ ...this.element });
        this.payrollForm.patchValue({ ...this.element });
        this.orForm.patchValue({ ...this.element });
        if (this.dispatchForm.get('route')?.value === 'ODZ')
          this.onRouteValue('ODZ');
        if (this.deliveryUnitForm.get('plate_no')?.value === 'BAC')
          this.onPlateNoValue('BAC');
        if (this.deliveryUnitForm.get('driver')?.value === 'EXD')
          this.onDriverValue('EXD');
        if (this.deliveryUnitForm.get('helper')?.value === 'EXH')
          this.onHelperValue('EXH');

        break;
    }
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
        /**add formvalues, including all controls with null (unexposed) */
        console.log('disp item for creation/adding: ', formValues);
        this.dispatchService.addDispatchItem(formValues);
        break;

      case 'edit-dispatch':
        if (this.element && this.element.id) {
          const oldVal = this.element;
          const updatedVal = { ...formValues, id: this.element.id };
          const updatedFields = this.updatedFields(oldVal, updatedVal);
          const updatedFieldCount = Object.keys(updatedFields).length;
          console.log('updatedFieldCount: ', Object.keys(updatedFields).length);

          this.dispatchService.updateDispatchItem(
            this.element.id,
            updatedFields,
            updatedFieldCount
          );
        } else {
          console.error('No dispatch element or element-id to edit');
        }
        break;
    }
  }

  private updatedFields(
    preEditedValues: DispatchModel,
    formValues: DispatchModel
  ): Partial<DispatchModel> {
    let updateFields: Partial<DispatchModel> = {};

    updateFields = Object.keys(preEditedValues).reduce<Partial<DispatchModel>>(
      (acc, key) => {
        const typedKey = key as keyof DispatchModel;
        if (preEditedValues[typedKey] !== formValues[typedKey]) {
          acc[typedKey] = formValues[typedKey];
        }
        return acc;
      },
      {} as Partial<DispatchModel>
    );
    return updateFields;
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
      this.fuelForm
        .get('fuel_or')
        ?.setValidators([
          Validators.required,
          Validators.pattern('^[^\\s][\\s\\S]*$'),
        ]);
      this.fuelForm
        .get('fuel_item')
        ?.setValidators([
          Validators.required,
          Validators.pattern('^[^\\s][\\s\\S]*$'),
        ]);
      this.fuelForm.get('fuel_amt')?.setValidators([Validators.required]);
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
    const subs = this.dispatchForm
      .get('route')
      ?.valueChanges.subscribe((routeVal) => {
        this.onRouteValue(routeVal);
      });
    this.subscription.add(subs);
  }
  private onPlateNoValueChanges(): void {
    const subs = this.deliveryUnitForm
      .get('plate_no')
      ?.valueChanges.subscribe((plateNoVal) => {
        this.onPlateNoValue(plateNoVal);
      });
    this.subscription.add(subs);
  }
  private onDriverValueChanges(): void {
    const subs = this.deliveryUnitForm
      .get('driver')
      ?.valueChanges.subscribe((driverVal) => {
        this.onDriverValue(driverVal);
      });
    this.subscription.add(subs);
  }
  private onHelperValueChanges(): void {
    const subs3 = this.deliveryUnitForm
      .get('helper')
      ?.valueChanges.subscribe((helperVal) => {
        this.onHelperValue(helperVal);
      });
    this.subscription.add(subs3);
  }

  private onRouteValue(routeVal: string): void {
    const odzRouteControl = this.dispatchForm.get('odz_route');
    if (routeVal === 'ODZ') {
      odzRouteControl?.setValidators([
        Validators.required,
        Validators.pattern('^[^\\s][\\s\\S]*$'),
      ]);
    } else {
      odzRouteControl?.clearValidators();
    }
    odzRouteControl?.updateValueAndValidity();
  }
  private onPlateNoValue(plateNoVal: string): void {
    const backupPlateNoControl = this.deliveryUnitForm.get('backup_plate_no');
    if (plateNoVal === 'BAC') {
      backupPlateNoControl?.setValidators([
        Validators.required,
        Validators.pattern('^[^\\s][\\s\\S]*$'),
      ]);
    } else {
      backupPlateNoControl?.clearValidators();
    }
    backupPlateNoControl?.updateValueAndValidity();
  }
  private onDriverValue(driverVal: string): void {
    const extraDriverControl = this.deliveryUnitForm.get('extra_driver');
    if (driverVal === 'EXD') {
      extraDriverControl?.setValidators([
        Validators.required,
        Validators.pattern('^[^\\s][\\s\\S]*$'),
      ]);
    } else {
      extraDriverControl?.clearValidators();
    }
    extraDriverControl?.updateValueAndValidity();
  }
  private onHelperValue(helperVal: string): void {
    const extrahelperControl = this.deliveryUnitForm.get('extra_helper');
    if (helperVal === 'EXH') {
      extrahelperControl?.setValidators([
        Validators.required,
        Validators.pattern('^[^\\s][\\s\\S]*$'),
      ]);
    } else {
      extrahelperControl?.clearValidators();
    }
    extrahelperControl?.updateValueAndValidity();
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
/**
 * TODO4. Review dashboard service versus separate qeury for dispatch.
 */
