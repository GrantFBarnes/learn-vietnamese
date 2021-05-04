import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Card } from '../card';

@Component({
  selector: 'app-flash-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.css'],
})
export class WordComponent implements OnInit {
  @Input() flipped: boolean = true;
  @Input() card: Card = { id: 0, word: '', translation: '' };
  @Output() showSectionEvent = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  showSection(): void {
    this.showSectionEvent.emit('word');
  }
}
