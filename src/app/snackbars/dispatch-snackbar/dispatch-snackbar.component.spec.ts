import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchSnackbarComponent } from './dispatch-snackbar.component';

describe('DispatchSnackbarComponent', () => {
  let component: DispatchSnackbarComponent;
  let fixture: ComponentFixture<DispatchSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DispatchSnackbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DispatchSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
