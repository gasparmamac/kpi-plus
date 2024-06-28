import { Component, OnInit } from '@angular/core';
import { DispatchFormComponent } from '../../forms/dispatch-form/dispatch-form.component';

@Component({
  selector: 'app-add-dispatch',
  standalone: true,
  imports: [DispatchFormComponent],
  templateUrl: './add-dispatch.component.html',
  styleUrl: './add-dispatch.component.css',
})
export class AddDispatchComponent implements OnInit {
  formMode = 'add-dispatch';
  ngOnInit(): void {}
}
