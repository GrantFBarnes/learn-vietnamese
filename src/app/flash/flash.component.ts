import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http/http.service';

interface Card {
  id: number;
  word: string;
  translation: string;
}

interface Example {
  id: number;
  card: string;
  example: string;
  translation: string;
}

interface SectionsFlipped {
  word: boolean;
  word_translation: boolean;
  examples: boolean;
  examples_translation: boolean;
}

@Component({
  selector: 'app-flash',
  templateUrl: './flash.component.html',
  providers: [HttpService],
  styleUrls: ['./flash.component.css'],
})
export class FlashComponent implements OnInit {
  ids: number[] = [];
  idx: number = 0;
  card: Card = { id: 0, word: '', translation: '' };
  examples: Example[] = [];
  defaultFlipped: SectionsFlipped = {
    word: true,
    word_translation: false,
    examples: true,
    examples_translation: false,
  };
  flipped: SectionsFlipped = JSON.parse(JSON.stringify(this.defaultFlipped));

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.httpService.get('/api/cards').subscribe((data: any) => {
      this.ids = data;
      this.onChange();
    });
  }

  onChange(): void {
    const id = this.ids[this.idx];
    this.httpService
      .get('/api/card/' + id)
      .subscribe((data: any) => (this.card = data));
    this.httpService
      .get('/api/card-examples/' + id)
      .subscribe((data: any) => (this.examples = data));
    this.flipped = JSON.parse(JSON.stringify(this.defaultFlipped));
  }

  previousCard(): void {
    if (!this.ids.length) return;
    if (this.idx == 0) {
      this.idx = this.ids.length - 1;
    } else {
      this.idx = this.idx - 1;
    }
    this.onChange();
  }

  randomCard(): void {
    if (!this.ids.length) return;
    this.idx = Math.floor(Math.random() * this.ids.length);
    this.onChange();
  }

  nextCard(): void {
    if (!this.ids.length) return;
    const next = this.idx + 1;
    if (next == this.ids.length) {
      this.idx = 0;
    } else {
      this.idx = next;
    }
    this.onChange();
  }

  showSection(section: string): void {
    switch (section) {
      case 'word':
      case 'word_translation':
      case 'examples':
      case 'examples_translation':
        this.flipped[section] = true;
        break;
      default:
        break;
    }
  }

  reverseCards(): void {
    this.defaultFlipped = {
      word: !this.defaultFlipped.word,
      word_translation: !this.defaultFlipped.word_translation,
      examples: !this.defaultFlipped.examples,
      examples_translation: !this.defaultFlipped.examples_translation,
    };
    this.flipped = JSON.parse(JSON.stringify(this.defaultFlipped));
  }
}
