import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
class Step {
  id: number;
  text: string;
  xpath: string;
}
class Stepper {
  id: string;
  name: string;
  steps: Step[]
}


@Injectable({
  providedIn: 'root'
})
export class StepperService {

  BASE_PATH = '/pathtoservice';

  constructor(private http: HttpClient) { }

  saveStepper(stepper: Stepper): Observable<Stepper> {
    return this.http.post(this.BASE_PATH + `/stepper`, stepper) as Observable<Stepper>;
  }

  getAll(): Observable<Stepper> {
    return this.http.get(this.BASE_PATH + `/stepper`) as Observable<Stepper>;
  }

  getOne(id: string): Observable<Stepper> {
    return this.http.get(this.BASE_PATH + `/stepper/${id}`) as Observable<Stepper>;
  }
}
