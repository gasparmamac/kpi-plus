import { Component, OnDestroy, OnInit, inject } from '@angular/core';

import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatIconModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatSnackBarModule,
    CommonModule,
  ],
})
export class LoginComponent implements OnInit, OnDestroy {
  hide: boolean | undefined;

  isQuerying = false;
  isQueryingSubs = new Subscription();
  signinErrorSubs = new Subscription();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private _snackbar: MatSnackBar
  ) {}

  loginForm = this.fb.group({
    email: [null],
    password: [null],
  });

  ngOnInit(): void {
    this.hide = true;
    this.isQueryingSubs = this.authService.isQuerying$.subscribe(
      (isQuerying) => {
        this.isQuerying = isQuerying;
      }
    );
    this.signinErrorSubs = this.authService.signinError$.subscribe((error) => {
      if (error) {
        this._snackbar.open(error, 'close', { duration: 10000 });
      }
    });
  }

  ngOnDestroy(): void {
    this.isQueryingSubs.unsubscribe();
  }

  onSubmit(): void {
    const email = String(this.loginForm.value.email);
    const password = String(this.loginForm.value.password);
    this.authService.signin(email, password);
  }
}
