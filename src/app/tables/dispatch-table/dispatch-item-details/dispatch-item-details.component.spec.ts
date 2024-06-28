import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchItemDetailsComponent } from './dispatch-item-details.component';

describe('DispatchItemDetailsComponent', () => {
  let component: DispatchItemDetailsComponent;
  let fixture: ComponentFixture<DispatchItemDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DispatchItemDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DispatchItemDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
