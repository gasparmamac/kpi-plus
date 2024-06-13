import { Component, OnInit } from '@angular/core';
import { DispatchFormComponent } from '../dispatch-form/dispatch-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DispatchModel } from '../../services/firestore.service';

@Component({
  selector: 'app-edit-dispatch',
  standalone: true,
  imports: [DispatchFormComponent],
  templateUrl: './edit-dispatch.component.html',
  styleUrl: './edit-dispatch.component.css',
})
export class EditDispatchComponent implements OnInit {
  formMode = 'edit';
  element!: DispatchModel;
  elementId!: string | null;
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    const navigation = this.router.getCurrentNavigation();
    this.element = navigation?.extras.state?.['element'];
    this.elementId = this.activatedRoute.snapshot.paramMap.get('id');
  }
  ngOnInit(): void {
    console.log('edit dispatch element: ', this.element);
    console.log('edit dispatch elementID: ', this.elementId);
  }
}
