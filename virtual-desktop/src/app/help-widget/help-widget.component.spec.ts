/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HelpWidgetComponent } from './help-widget.component';
import { RoundButtonComponent } from './round-button/round-button.component';
import { CanvasDrawerComponent } from './canvas-drawer/canvas-drawer.component';

describe('HelpWidgetComponent', () => {
  let component: HelpWidgetComponent;
  let fixture: ComponentFixture<HelpWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpWidgetComponent, RoundButtonComponent, CanvasDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
