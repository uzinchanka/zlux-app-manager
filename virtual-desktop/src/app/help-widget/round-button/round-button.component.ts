import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'round-button',
  templateUrl: './round-button.component.html',
  styleUrls: ['./round-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoundButtonComponent implements OnInit {

  @Input()
  text: string;

  constructor() { }

  ngOnInit() {
  }

}
