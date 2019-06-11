import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'iz-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss']
})
export class TextAreaComponent implements OnChanges {

  private text = '';
  position: {x: string, y: string};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.text) {
      console.log(changes.text);
    }
  }
}
