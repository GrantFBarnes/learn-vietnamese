import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Card } from '../../../flash/card';
import { Example } from '../../../flash/example';

@Component({
  selector: 'app-add-example-modal',
  templateUrl: './add-example-modal.component.html',
  styleUrls: ['./add-example-modal.component.css'],
})
export class AddExampleModalComponent implements OnInit {
  example: Example = { id: 0, card: 0, example: '', translation: '' };
  @Input() card: Card = { id: 0, word: '', translation: '' };
  @Output() addExampleEvent = new EventEmitter<Example>();

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.example.card = this.card.id;
  }

  addExample(): void {
    this.addExampleEvent.emit(this.example);
    this.example.example = '';
    this.example.translation = '';
  }
}
