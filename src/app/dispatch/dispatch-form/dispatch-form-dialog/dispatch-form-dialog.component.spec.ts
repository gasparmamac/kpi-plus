import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchFormDialogComponent } from './dispatch-form-dialog.component';

describe('DispatchFormDialogComponent', () => {
  let component: DispatchFormDialogComponent;
  let fixture: ComponentFixture<DispatchFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DispatchFormDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DispatchFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
