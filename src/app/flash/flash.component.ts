import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http/http.service';

interface Card {
  id: number;
  word: string;
  translation: string;
}

interface SectionsFlipped {
  word: boolean;
  translation: boolean;
  word_examples: boolean;
  translation_examples: boolean;
}

@Component({
  selector: 'app-flash',
  templateUrl: './flash.component.html',
  providers: [HttpService],
  styleUrls: ['./flash.component.css'],
})
export class FlashComponent implements OnInit {
  idx: number = 0;
  card: Card = { id: 0, word: '', translation: '' };
  cards: Card[] = [];
  defaultFlipped: SectionsFlipped = {
    word: true,
    translation: false,
    word_examples: true,
    translation_examples: false,
  };
  flipped: SectionsFlipped = JSON.parse(JSON.stringify(this.defaultFlipped));

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.httpService.get('/api/table/cards').subscribe((data: any) => {
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
    this.flipped = JSON.parse(JSON.stringify(this.defaultFlipped));
  }

  randomCard(): void {
    if (!this.cards.length) return;
    this.idx = Math.floor(Math.random() * this.cards.length);
    this.card = this.cards[this.idx];
    this.flipped = JSON.parse(JSON.stringify(this.defaultFlipped));
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
    this.flipped = JSON.parse(JSON.stringify(this.defaultFlipped));
  }

  showSection(section: string): void {
    switch (section) {
      case 'word':
      case 'translation':
      case 'word_examples':
      case 'translation_examples':
        this.flipped[section] = true;
        break;
      default:
        break;
    }
  }
}
