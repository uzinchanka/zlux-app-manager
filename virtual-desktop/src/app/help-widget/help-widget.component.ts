import { Component, OnInit, ViewChild } from '@angular/core';
import { CanvasDrawerComponent } from './canvas-drawer/canvas-drawer.component';

@Component({
  selector: 'help-widget',
  templateUrl: './help-widget.component.html',
  styleUrls: ['./help-widget.component.scss']
})
export class HelpWidgetComponent implements OnInit {

  showButtons: boolean;

  @ViewChild('izCanvasDrawer')
  izCanvasDrawer: CanvasDrawerComponent;

  constructor() {
    this.showButtons = false;
  }

  ngOnInit() {
  }

  toggleShowButtons() {
    this.showButtons = !this.showButtons;
  }

  reportClicked() {
    this.izCanvasDrawer.capture();
  }

  wizardsClicked() {
    console.log('Click on wizardsButton');
  }
}
