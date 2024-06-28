import { Component, OnDestroy } from '@angular/core';
import { DispatchTableComponent } from '../../tables/dispatch-table/dispatch-table.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { DispatchService } from '../dispatch.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dispatch-list',
  standalone: true,
  imports: [
    DispatchTableComponent,
    MatIconModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './dispatch-list.component.html',
  styleUrl: './dispatch-list.component.css',
})
export class DispatchListComponent {}
