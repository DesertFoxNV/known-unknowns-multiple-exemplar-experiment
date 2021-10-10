import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialButtonComponent } from './trial-button.component';

describe('TrialButtonComponent', () => {
  let component: TrialButtonComponent;
  let fixture: ComponentFixture<TrialButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrialButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
