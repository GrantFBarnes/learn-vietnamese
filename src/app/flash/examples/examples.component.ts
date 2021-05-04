import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Example } from '../example';

@Component({
  selector: 'app-flash-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.css'],
})
export class ExamplesComponent implements OnInit {
  @Input() flipped: boolean = true;
  @Input() examples: Example[] = [];
  @Output() showSectionEvent = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  showSection(): void {
    this.showSectionEvent.emit('examples');
  }
}
