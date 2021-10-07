import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyConfigFormComponent } from './study-config-form.component';

describe('StudyFormComponent', () => {
  let component: StudyConfigFormComponent;
  let fixture: ComponentFixture<StudyConfigFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudyConfigFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudyConfigFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
