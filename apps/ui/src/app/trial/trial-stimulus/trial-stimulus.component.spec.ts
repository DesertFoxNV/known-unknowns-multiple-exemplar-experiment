import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialStimulusComponent } from './trial-stimulus.component';

describe('TrialCueComponent', () => {
  let component: TrialStimulusComponent;
  let fixture: ComponentFixture<TrialStimulusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrialStimulusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialStimulusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
