import { Component, OnInit } from '@angular/core';
import { DispatchFormComponent } from '../dispatch-form/dispatch-form.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { routes } from '../../app.routes';

@Component({
  selector: 'app-add-dispatch',
  standalone: true,
  imports: [DispatchFormComponent],
  templateUrl: './add-dispatch.component.html',
  styleUrl: './add-dispatch.component.css',
})
export class AddDispatchComponent implements OnInit {
  addDispatchForm!: FormGroup;
  formMode = 'add';

  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {}
}
