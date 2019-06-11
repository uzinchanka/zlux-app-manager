import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpWidgetComponent } from './help-widget.component';
import { RoundButtonComponent } from './round-button/round-button.component';
import { CanvasDrawerComponent } from './canvas-drawer/canvas-drawer.component';
import { TextAreaComponent } from './text-area/text-area.component';
import {FormsModule} from '@angular/forms';
import { IssueReportService } from './service/issue-report.service';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
  ],
  declarations: [HelpWidgetComponent, RoundButtonComponent, CanvasDrawerComponent, TextAreaComponent],
  exports: [HelpWidgetComponent],
  providers: [IssueReportService]
})
export class HelpWidgetModule { }
