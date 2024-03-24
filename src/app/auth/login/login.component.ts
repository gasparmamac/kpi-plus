import { Component, inject } from '@angular/core';

import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  Form,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';

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
    CommonModule,
  ],
})
export class LoginComponent {
  // private fb = inject(FormBuilder);
  constructor(private fb: FormBuilder) {}
  loginForm = this.fb.group({
    email: [null],
    password: [null],
  });
  hide = true;
  isQuerying = false;

  onSubmit(): void {
    this.isQuerying = !this.isQuerying;
    alert('Thanks! ');
  }
}
