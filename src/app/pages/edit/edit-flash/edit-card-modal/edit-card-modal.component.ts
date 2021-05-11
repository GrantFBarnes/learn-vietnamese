import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Card } from '../../../flash/card';

@Component({
  selector: 'app-edit-card-modal',
  templateUrl: './edit-card-modal.component.html',
  styleUrls: ['./edit-card-modal.component.css'],
})
export class EditCardModalComponent implements OnInit {
  @Input() card: Card = { id: 0, word: '', translation: '' };
  @Output() saveEvent = new EventEmitter<Card>();

  constructor() {}

  ngOnInit(): void {}

  save(): void {
    this.saveEvent.emit(this.card);
  }
}
