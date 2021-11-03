import { TestBed } from '@angular/core/testing';

import { PagesWrapService } from './pages-wrap.service';

describe('PagesWrapService', () => {
  let service: PagesWrapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PagesWrapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
