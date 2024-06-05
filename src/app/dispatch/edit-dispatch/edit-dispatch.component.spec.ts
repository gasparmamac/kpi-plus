import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDispatchComponent } from './edit-dispatch.component';

describe('EditDispatchComponent', () => {
  let component: EditDispatchComponent;
  let fixture: ComponentFixture<EditDispatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDispatchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditDispatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
