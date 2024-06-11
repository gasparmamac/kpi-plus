import { Component, OnInit } from '@angular/core';
import { DispatchFormComponent } from '../dispatch-form/dispatch-form.component';

@Component({
  selector: 'app-edit-dispatch',
  standalone: true,
  imports: [DispatchFormComponent],
  templateUrl: './edit-dispatch.component.html',
  styleUrl: './edit-dispatch.component.css',
})
export class EditDispatchComponent implements OnInit {
  formMode = 'edit';
  ngOnInit(): void {}
}
