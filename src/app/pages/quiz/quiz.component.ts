import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../shared/services/http/http.service';
import { Card } from '../../shared/interfaces/card';
import { Category } from '../../shared/interfaces/category';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  providers: [HttpService],
  styleUrls: ['./quiz.component.css'],
})
export class QuizComponent implements OnInit {
  loading: boolean = true;

  all_card_ids: number[] = [];
  correct_idx: number = 0;
  cards: Card[] = [];

  question_type: string = 'Vietnamese';
  question_type_selected: string = 'Vietnamese';

  category_id: number = 0;
  category_name: string = 'All Categories';
  categories: Category[] = [];

  answer_count: number = 3;

  constructor(private httpService: HttpService) {}

  getCards(): void {
    this.loading = true;
    this.httpService
      .get('/api/cards/category/' + this.category_id)
      .subscribe((data: any) => {
        this.all_card_ids = data;
        this.nextQuestion();
      });
  }

  ngOnInit(): void {
    this.httpService.get('/api/categories').subscribe((data: any) => {
      this.categories = data;
      this.categories.unshift({ id: 0, name: 'All Categories' });
    });

    this.getCards();

    window.document.onkeydown = (e) => {
      switch (e.key) {
        case 'Enter':
        case 'ArrowRight':
        case 'N':
        case 'n':
          this.nextQuestion();
          break;
        default:
          break;
      }
    };
  }

  nextQuestion(): void {
    if (
      !this.all_card_ids.length ||
      this.all_card_ids.length < this.answer_count
    ) {
      this.loading = false;
      this.correct_idx = 0;
      this.cards = [];
      return;
    }
    this.loading = true;
    let indexes = new Set();
    let card_ids = [];
    while (indexes.size !== this.answer_count) {
      const idx = Math.floor(Math.random() * this.all_card_ids.length);
      if (!indexes.has(idx)) {
        indexes.add(idx);
        card_ids.push(this.all_card_ids[idx]);
      }
    }
    this.correct_idx = Math.floor(Math.random() * this.answer_count);

    if (this.question_type_selected === 'Random') {
      this.question_type = Math.random() > 0.5 ? 'Vietnamese' : 'English';
    } else {
      this.question_type = this.question_type_selected;
    }

    this.httpService
      .post('/api/cards/bulk', card_ids)
      .subscribe((data: any) => {
        this.cards = data;
        this.loading = false;
      });
  }

  setQuestionType(type: string): void {
    this.question_type_selected = type;
    this.nextQuestion();
  }

  setCategory(option: any): void {
    this.category_id = option.id;
    this.category_name = option.name;
    this.getCards();
  }

  setAnswerCount(count: number): void {
    this.answer_count = count;
    this.nextQuestion();
  }
}
