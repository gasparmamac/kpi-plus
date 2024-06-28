import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelDialogComponent } from './fuel-dialog.component';

describe('FuelDialogComponent', () => {
  let component: FuelDialogComponent;
  let fixture: ComponentFixture<FuelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuelDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FuelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
