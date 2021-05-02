import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http/http.service';

interface Card {
  id: number;
  v_word: string;
  e_word: string;
}

@Component({
  selector: 'app-flash',
  templateUrl: './flash.component.html',
  providers: [HttpService],
  styleUrls: ['./flash.component.css'],
})
export class FlashComponent implements OnInit {
  idx: number = 0;
  card: Card = { id: 0, v_word: '', e_word: '' };
  cards: Card[] = [];

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.httpService.get('/api/table/flash_cards').subscribe((data: any) => {
      this.cards = data;
      if (this.cards.length) this.card = this.cards[0];
    });
  }

  previousCard(): void {
    if (!this.cards.length) return;

    if (this.idx == 0) {
      this.idx = this.cards.length - 1;
    } else {
      this.idx = this.idx - 1;
    }
    this.card = this.cards[this.idx];
  }

  randomCard(): void {
    if (!this.cards.length) return;
    this.idx = Math.floor(Math.random() * this.cards.length);
    this.card = this.cards[this.idx];
  }

  nextCard(): void {
    if (!this.cards.length) return;

    const next = this.idx + 1;
    if (next == this.cards.length) {
      this.idx = 0;
    } else {
      this.idx = next;
    }
    this.card = this.cards[this.idx];
  }
}
