import { TestBed } from '@angular/core/testing';

import { IssueReportService } from './issue-report.service';
import { HttpClientModule } from '@angular/common/http';

describe('IssueReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({imports: [
    HttpClientModule
  ]}));

  it('should be created', () => {
    const service: IssueReportService = TestBed.get(IssueReportService);
    expect(service).toBeTruthy();
  });
});
