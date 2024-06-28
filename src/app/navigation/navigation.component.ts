import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DispatchService } from '../dispatch/dispatch.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatProgressBarModule,
    AsyncPipe,
    DashboardComponent,
    RouterModule,
  ],
})
export class NavigationComponent implements OnInit, OnDestroy {
  isLoading$;
  isQuerying$;
  constructor(
    private authService: AuthService,
    private dispatchService: DispatchService
  ) {
    this.isLoading$ = dispatchService.loading$;
    this.isQuerying$ = dispatchService.querying$;
  }

  ngOnInit(): void {}
  ngOnDestroy(): void {}

  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
}
