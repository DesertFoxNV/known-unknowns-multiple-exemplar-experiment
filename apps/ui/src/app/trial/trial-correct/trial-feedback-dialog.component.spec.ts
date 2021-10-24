import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialFeedbackDialogComponent } from './trial-feedback-dialog.component';

describe('BlockStartDialogComponent', () => {
  let component: TrialFeedbackDialogComponent;
  let fixture: ComponentFixture<TrialFeedbackDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrialFeedbackDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialFeedbackDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
