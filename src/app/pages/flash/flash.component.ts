import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../shared/services/http/http.service';
import { Card } from '../../shared/interfaces/card';
import { Example } from '../../shared/interfaces/example';

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
  loading: boolean = true;

  card_ids: number[] = [];
  card_idx: number = 0;
  card: Card = { id: 0, word: '', translation: '' };
  examples: Example[] = [];

  flip_reset: SectionsFlipped = {
    word: true,
    translation: true,
    examples: true,
    translations: true,
  };
  flipped: SectionsFlipped = JSON.parse(JSON.stringify(this.flip_reset));
  flip_type: string = 'Show All';
  flip_type_options: string[] = [
    'Show All',
    'Show Vietnamese Only',
    'Show English Only',
  ];

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.httpService.get('/api/cards').subscribe((data: any) => {
      this.card_ids = data;
      this.onChange();
    });

    window.document.onkeydown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          this.showUpperSections();
          break;
        case 'ArrowDown':
          this.showLowerSections();
          break;
        case 'ArrowRight':
        case 'N':
        case 'n':
          this.nextCard();
          break;
        case 'ArrowLeft':
        case 'P':
        case 'p':
          this.previousCard();
          break;
        case 'R':
        case 'r':
          this.randomCard();
          break;
        default:
          break;
      }
    };
  }

  onChange(): void {
    this.loading = true;
    const id = this.card_ids[this.card_idx];
    this.httpService.get('/api/card/' + id).subscribe((card: any) => {
      this.card = card;
      this.httpService.get('/api/examples/' + id).subscribe((examples: any) => {
        this.examples = examples;
        this.loading = false;
      });
    });
    this.flipped = JSON.parse(JSON.stringify(this.flip_reset));
  }

  previousCard(): void {
    if (!this.card_ids.length) return;
    if (this.card_idx == 0) {
      this.card_idx = this.card_ids.length - 1;
    } else {
      this.card_idx = this.card_idx - 1;
    }
    this.onChange();
  }

  randomCard(): void {
    if (!this.card_ids.length) return;
    this.card_idx = Math.floor(Math.random() * this.card_ids.length);
    this.onChange();
  }

  nextCard(): void {
    if (!this.card_ids.length) return;
    const next = this.card_idx + 1;
    if (next == this.card_ids.length) {
      this.card_idx = 0;
    } else {
      this.card_idx = next;
    }
    this.onChange();
  }

  showUpperSections(): void {
    this.flipped['word'] = true;
    this.flipped['translation'] = true;
  }

  showLowerSections(): void {
    this.flipped['examples'] = true;
    this.flipped['translations'] = true;
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

  setFlipType(type: string): void {
    const viet = type.includes('All') || type.includes('Vietnamese');
    const eng = type.includes('All') || type.includes('English');
    this.flip_reset = {
      word: viet,
      translation: eng,
      examples: viet,
      translations: eng,
    };
    this.flipped = JSON.parse(JSON.stringify(this.flip_reset));
    this.flip_type = type;
  }
}
