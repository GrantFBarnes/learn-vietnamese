import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Card } from '../../../flash/card';

@Component({
  selector: 'app-add-card-modal',
  templateUrl: './add-card-modal.component.html',
  styleUrls: ['./add-card-modal.component.css'],
})
export class AddCardModalComponent implements OnInit {
  card: Card = { id: 0, word: '', translation: '' };
  @Output() addCardEvent = new EventEmitter<Card>();

  constructor() {}

  ngOnInit(): void {}

  addCard(): void {
    this.addCardEvent.emit(this.card);
    this.card.word = '';
    this.card.translation = '';
  }
}
