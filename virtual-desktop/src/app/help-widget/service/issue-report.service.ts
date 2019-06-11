import { Injectable } from '@angular/core';

import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

interface IssueReport {
  id: string,
  mailto: string,
  cc: string
  text: string,
  base64Img: any
}

@Injectable({
  providedIn: 'root'
})
export class IssueReportService {

  BASE_PATH = '/pathtoservice';

  constructor(private http: HttpClient) { }

  sendIssueReport(report: IssueReport): Observable<IssueReport> {
    return this.http.post(this.BASE_PATH + `/issueReport`, report) as Observable<IssueReport>;
  }
}
