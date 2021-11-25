import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Category } from '../../../shared/interfaces/category';

@Component({
  selector: 'app-quiz-settings',
  templateUrl: './quiz-settings.component.html',
  styleUrls: ['./quiz-settings.component.css'],
})
export class QuizSettingsComponent implements OnInit {
  @Input() question_type_selected: string = 'Vietnamese';
  @Output() setQuestionTypeEvent = new EventEmitter<string>();

  @Input() category_id: number = 0;
  @Input() category_name: string = '';
  @Input() categories: Category[] = [];
  @Output() setCategoryEvent = new EventEmitter<any>();

  @Input() answer_count: number = 3;
  @Output() setAnswerCountEvent = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {}

  setQuestionType(t: string): void {
    this.setQuestionTypeEvent.emit(t);
  }

  setCategory(option: any): void {
    this.setCategoryEvent.emit(option);
  }

  answerCountChange(): void {
    if (this.answer_count < 3 || this.answer_count > 8) {
      this.answer_count = 3;
    }
    this.setAnswerCountEvent.emit(this.answer_count);
  }
}
