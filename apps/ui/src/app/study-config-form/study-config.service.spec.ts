import { TestBed } from '@angular/core/testing';

import { StudyConfigService } from './study-config.service';

describe('StudyConfigService', () => {
  let service: StudyConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudyConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
