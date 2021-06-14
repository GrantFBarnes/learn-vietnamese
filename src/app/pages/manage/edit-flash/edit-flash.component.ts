import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../shared/services/http/http.service';
import { Card } from '../../../shared/interfaces/card';
import { Example } from '../../../shared/interfaces/example';

@Component({
  selector: 'app-edit-flash',
  templateUrl: './edit-flash.component.html',
  providers: [HttpService],
  styleUrls: ['./edit-flash.component.css'],
})
export class EditFlashComponent implements OnInit {
  is_iphone: boolean = false;
  authorized: boolean = false;
  card: Card = { id: 0, word: '', translation: '' };
  cards: Card[] = [];
  card_audio_files: number[] = [];
  example: Example = { id: 0, card: 0, example: '', translation: '' };
  examples: { [card_id: number]: Example[] } = {};
  example_audio_files: number[] = [];
  examples_show: { [card_id: number]: boolean } = {};
  examples_show_all: boolean = false;

  constructor(private httpService: HttpService) {}

  getCards(): void {
    this.httpService.get('/api/dump/cards').subscribe((data: any) => {
      this.cards = data;
      for (let i in data) {
        const id = data[i].id;
        if (!this.examples_show[id]) this.examples_show[id] = false;
      }
    });
  }

  getCardAudioIds(): void {
    if (this.is_iphone) return;
    this.httpService
      .get('/api/audio/cards')
      .subscribe((data: any) => (this.card_audio_files = data));
  }

  getExamples(): void {
    this.httpService.get('/api/dump/examples').subscribe((data: any) => {
      this.examples = {};
      for (let i in data) {
        const card_id = data[i].card;
        if (!this.examples[card_id]) this.examples[card_id] = [];
        this.examples[card_id].push(data[i]);
      }
    });
  }

  getExampleAudioIds(): void {
    if (this.is_iphone) return;
    this.httpService
      .get('/api/audio/examples')
      .subscribe((data: any) => (this.example_audio_files = data));
  }

  getAudioIds(): void {
    this.getCardAudioIds();
    this.getExampleAudioIds();
  }

  authorize(): void {
    this.authorized = true;
    this.getCards();
    this.getExamples();
    this.getAudioIds();
  }

  ngOnInit(): void {
    // redirect to https if not localhost
    if (!window.origin.includes('local')) {
      if (location.protocol !== 'https:') {
        location.replace(
          'https:' + location.href.substring(location.protocol.length)
        );
      }
    }

    this.is_iphone = window.navigator.userAgent.includes('iPhone');
    this.httpService.get('/api/authenticated').subscribe({
      next: () => this.authorize(),
      error: () => (this.authorized = false),
    });
  }

  playAudio(folder: string, id: number): void {
    this.httpService.getAudio('/api/audio/' + folder + '/' + id).subscribe({
      next: (blob: Blob) => {
        const sound = new Audio(URL.createObjectURL(blob));
        sound.addEventListener('canplaythrough', () => {
          sound.play();
        });
      },
      error: () => alert('No audio found'),
    });
  }

  saveAudio(folder: string, id: number, audio: Blob): void {
    if (!audio) return;
    if (!audio.size) return;

    this.httpService.post('/api/audio/' + folder + '/' + id, audio).subscribe({
      next: () => this.getAudioIds(),
      error: () => alert('Failed to save audio!'),
    });
  }

  toggleExampleShowAll() {
    this.examples_show_all = !this.examples_show_all;
    for (let id in this.examples_show) {
      this.examples_show[id] = this.examples_show_all;
    }
  }

  toggleExampleShow(id: number) {
    this.examples_show[id] = !this.examples_show[id];
  }

  playCardAudio(id: number): void {
    this.playAudio('card', id);
  }

  saveCard(card: Card): void {
    this.httpService.put('/api/card', card).subscribe({
      next: () => this.getCards(),
      error: () => alert('Failed to save changes!'),
    });
  }

  saveCardAudio(audio: Blob): void {
    this.saveAudio('card', this.card.id, audio);
  }

  selectCard(idx: number): void {
    this.card = JSON.parse(JSON.stringify(this.cards[idx]));
  }

  deleteCard(id: number): void {
    if (window.confirm('Are you sure you want to delete card ' + id + '?')) {
      this.httpService.delete('/api/card/' + id).subscribe({
        next: () => this.authorize(),
        error: () => alert('Failed to delete card!'),
      });
    }
  }

  addCard(card: Card): void {
    this.httpService.post('/api/card', card).subscribe({
      next: () => this.getCards(),
      error: () => alert('Failed to add card!'),
    });
  }

  playExampleAudio(id: number): void {
    this.playAudio('example', id);
  }

  saveExample(example: Example): void {
    this.httpService.put('/api/example', example).subscribe({
      next: () => this.getExamples(),
      error: () => alert('Failed to save example!'),
    });
  }

  saveExampleAudio(audio: Blob): void {
    this.saveAudio('example', this.example.id, audio);
  }

  selectExample(card_idx: number, card_id: number, example_idx: number): void {
    this.selectCard(card_idx);
    this.example = JSON.parse(
      JSON.stringify(this.examples[card_id][example_idx])
    );
  }

  deleteExample(id: number): void {
    if (window.confirm('Are you sure you want to delete example ' + id + '?')) {
      this.httpService.delete('/api/example/' + id).subscribe({
        next: () => this.getExamples(),
        error: () => alert('Failed to delete example!'),
      });
    }
  }

  addExample(example: Example): void {
    this.httpService.post('/api/example', example).subscribe({
      next: () => this.getExamples(),
      error: () => alert('Failed to add example!'),
    });
  }
}