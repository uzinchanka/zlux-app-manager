import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';

@Component({
  selector: 'iz-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss']
})
export class TextAreaComponent implements OnChanges {

  private text = '';
  position: {x: string, y: string};

  @ViewChild('textarea')
  textarea: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.text) {
      console.log(changes.text);
    }
  }

  focus(){
    this.textarea.nativeElement.focus();
  }
}
