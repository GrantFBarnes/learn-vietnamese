import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../shared/services/http/http.service';
import { Card } from '../../shared/interfaces/card';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  providers: [HttpService],
  styleUrls: ['./quiz.component.css'],
})
export class QuizComponent implements OnInit {
  all_card_ids: number[] = [];
  correct_idx: number = 0;
  cards: Card[] = [];

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.httpService.get('/api/cards').subscribe((data: any) => {
      this.all_card_ids = data;
      this.nextQuestion();
    });
  }

  nextQuestion(): void {
    if (!this.all_card_ids.length) return;
    if (this.all_card_ids.length < 5) return;
    let indexes = new Set();
    let card_ids = [];
    while (indexes.size !== 4) {
      const idx = Math.floor(Math.random() * this.all_card_ids.length);
      if (!indexes.has(idx)) {
        indexes.add(idx);
        card_ids.push(this.all_card_ids[idx]);
      }
    }
    this.correct_idx = Math.floor(Math.random() * 4);

    this.httpService
      .post('/api/cards/bulk', card_ids)
      .subscribe((data: any) => (this.cards = data));
  }
}
