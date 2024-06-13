import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchDetailViewComponent } from './dispatch-detail-view.component';

describe('DispatchDetailViewComponent', () => {
  let component: DispatchDetailViewComponent;
  let fixture: ComponentFixture<DispatchDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DispatchDetailViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DispatchDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
