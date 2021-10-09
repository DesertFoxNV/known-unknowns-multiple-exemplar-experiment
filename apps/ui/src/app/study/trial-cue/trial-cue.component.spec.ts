import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialCueComponent } from './trial-cue.component';

describe('TrialCueComponent', () => {
  let component: TrialCueComponent;
  let fixture: ComponentFixture<TrialCueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrialCueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialCueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
