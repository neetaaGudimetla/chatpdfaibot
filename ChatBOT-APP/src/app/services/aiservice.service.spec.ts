import { TestBed } from '@angular/core/testing';

import { AiserviceService } from './aiservice.service';

describe('AiserviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AiserviceService = TestBed.get(AiserviceService);
    expect(service).toBeTruthy();
  });
});
