import { TestBed } from '@angular/core/testing';

import { StepperService } from './stepper.service';
import { HttpClientModule } from '@angular/common/http';

describe('StepperService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule
    ]
  }));

  it('should be created', () => {
    const service: StepperService = TestBed.get(StepperService);
    expect(service).toBeTruthy();
  });
});
