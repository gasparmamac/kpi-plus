import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
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
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DispatchFormDialogComponent } from './dispatch-form-dialog/dispatch-form-dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable, Subscription, map } from 'rxjs';
import { DispatchService } from '../dispatch.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DispatchModel } from '../../services/firestore.service';

@Component({
  selector: 'app-dispatch-form',
  templateUrl: './dispatch-form.component.html',
  styleUrl: './dispatch-form.component.css',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatStepperModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class DispatchFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() formMode = '';
  @Input() element!: DispatchModel | null;
  dispatchForm!: FormGroup;
  deliveryUnitForm!: FormGroup;
  invoiceForm!: FormGroup;
  payrollForm!: FormGroup;
  orForm!: FormGroup;
  stepperOrientation!: Observable<'horizontal' | 'vertical'>;

  loadingSubscription = new Subscription();
  loading = false;
  completed = false;

  @ViewChild('stepper')
  private dispatchStepper!: MatStepper;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dispatchService: DispatchService,
    public dialog: MatDialog,
    public breakpointObserver: BreakpointObserver
  ) {}

  ngAfterViewInit(): void {}
  ngOnDestroy(): void {
    if (this.loadingSubscription) this.loadingSubscription.unsubscribe();
  }

  ngOnInit(): void {
    // this.loadingSubscription = this.dispatchService.loading$.subscribe(
    //   (loadingStatus) => {
    //     this.loading = loadingStatus;
    //     this.completed = loadingStatus!;
    //   }
    // );

    this.stepperOrientation = this.breakpointObserver
      .observe('(min-width: 800px)')
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

    if (this.element) {
      this.updateForm();
    }
  }

  private updateForm() {
    if (this.element) {
      this.dispatchForm.patchValue(this.element);
      this.deliveryUnitForm.patchValue(this.element);
      this.invoiceForm.patchValue(this.element);
      this.payrollForm.patchValue(this.element);
      this.orForm.patchValue(this.element);
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

  onSubmit(): void {
    // alert('Thanks!');
    // const dispatchItem = this.dispatchForm.value;
    // console.log(dispatchItem);
  }

  onCancel() {
    console.log('cancelled');
    this.router.navigate(['/menu/dispatch/table']);
  }

  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    this.dialog.open(DispatchFormDialogComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        ...this.dispatchForm.value,
        ...this.deliveryUnitForm.value,
        ...this.invoiceForm.value,
        ...this.payrollForm.value,
        ...this.orForm.value,
      },
    });
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

  onContinue() {
    const formValues = {
      ...this.dispatchForm.value,
      ...this.deliveryUnitForm.value,
      ...this.invoiceForm.value,
      ...this.payrollForm.value,
      ...this.orForm.value,
    };
    // switch (this.formMode) {
    //   case 'edit':
    //     if (this.element) {
    //       if (this.element.id) {
    //         const id = this.element.id;
    //         this.dispatchService
    //           .updateDispatch(id, formValues)
    //           .then(() => this.dispatchStepper.next());
    //       } else {
    //         console.log('Error updating dispatch: No ID');
    //       }
    //     } else {
    //       console.log('Error updating dispatch: No Element');
    //     }
    //     break;
    //   default: //formMode === add
    //     this.dispatchService
    //       .addDispatchItem(formValues)
    //       .then(() => this.dispatchStepper.next());
    // }
  }

  onNo(formMode: string) {
    if (formMode === 'edit') {
      this.router.navigate(['../../table'], {
        relativeTo: this.activatedRoute,
      });
    } else {
      this.router.navigate(['../table'], {
        relativeTo: this.activatedRoute,
      });
    }
  }
}
