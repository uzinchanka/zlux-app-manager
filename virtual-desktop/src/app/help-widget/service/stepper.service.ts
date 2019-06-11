import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stepper } from '../help-widget.component';

import { PluginManager } from '../../../../../../zlux-platform/base/src/plugin-manager/plugin-manager';


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

  getSteppersForInstalledPlugins(): Promise<Stepper[]> {
    return PluginManager.loadPlugins().then((plugins: any[]) => {
      return plugins.filter((p)=>p.webContent && p.webContent.launchDefinition).map((plugin) => {
        return {
          id: plugin.identifier,
          name: plugin.webContent.launchDefinition.pluginShortNameDefault,
          steps: []
        }
      });
    });
  }
}
