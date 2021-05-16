import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../shared/services/http/http.service';
import { Card } from './card';
import { Example } from './example';

interface SectionsFlipped {
  word: boolean;
  translation: boolean;
  examples: boolean;
  translations: boolean;
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
    translation: false,
    examples: true,
    translations: false,
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
      case 'translation':
      case 'examples':
      case 'translations':
        this.flipped[section] = true;
        break;
      default:
        break;
    }
  }

  reverseCards(): void {
    this.defaultFlipped = {
      word: !this.defaultFlipped.word,
      translation: !this.defaultFlipped.translation,
      examples: !this.defaultFlipped.examples,
      translations: !this.defaultFlipped.translations,
    };
    this.flipped = JSON.parse(JSON.stringify(this.defaultFlipped));
  }
}
