import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DrapDropComponent } from './drap-drop.component';

describe('DrapDropComponent', () => {
  let component: DrapDropComponent;
  let fixture: ComponentFixture<DrapDropComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DrapDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
