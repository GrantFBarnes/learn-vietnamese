import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Card } from '../card';

@Component({
  selector: 'app-flash-translation',
  templateUrl: './translation.component.html',
  styleUrls: ['./translation.component.css'],
})
export class TranslationComponent implements OnInit {
  @Input() flipped: boolean = true;
  @Input() card: Card = { id: 0, word: '', translation: '', audio: new Blob() };
  @Output() showSectionEvent = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  showSection(): void {
    this.showSectionEvent.emit('translation');
  }
}
