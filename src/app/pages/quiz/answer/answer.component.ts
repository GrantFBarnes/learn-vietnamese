import { Component, OnInit, Input } from '@angular/core';
import { Card } from '../../../shared/interfaces/card';

@Component({
  selector: 'app-quiz-answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.css'],
})
export class AnswerComponent implements OnInit {
  @Input() card: Card = { id: 0, word: '', translation: '' };
  @Input() correct: boolean = false;
  opened: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.opened = false;
  }

  open(): void {
    this.opened = true;
  }
}
