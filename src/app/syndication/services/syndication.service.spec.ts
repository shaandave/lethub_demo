import { TestBed } from '@angular/core/testing';

import { SyndicationService } from './syndication.service';

describe('SyndicationService', () => {
  let service: SyndicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SyndicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
