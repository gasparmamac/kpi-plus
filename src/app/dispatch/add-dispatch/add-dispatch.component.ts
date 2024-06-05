import { Component } from '@angular/core';
import { DispatchFormComponent } from '../dispatch-form/dispatch-form.component';

@Component({
  selector: 'app-add-dispatch',
  standalone: true,
  imports: [DispatchFormComponent],
  templateUrl: './add-dispatch.component.html',
  styleUrl: './add-dispatch.component.css',
})
export class AddDispatchComponent {}
