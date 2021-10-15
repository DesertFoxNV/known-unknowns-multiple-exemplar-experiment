import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialCorrectDialogComponent } from './trial-correct-dialog.component';

describe('BlockStartDialogComponent', () => {
  let component: TrialCorrectDialogComponent;
  let fixture: ComponentFixture<TrialCorrectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrialCorrectDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialCorrectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
