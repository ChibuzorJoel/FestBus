import { TestBed } from '@angular/core/testing';

import { BusDataService } from './bus-data.service';

describe('BusDataService', () => {
  let service: BusDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
