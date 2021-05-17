import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../shared/services/http/http.service';
import { Card } from '../../flash/card';
import { Example } from '../../flash/example';

@Component({
  selector: 'app-edit-flash',
  templateUrl: './edit-flash.component.html',
  providers: [HttpService],
  styleUrls: ['./edit-flash.component.css'],
})
export class EditFlashComponent implements OnInit {
  authorized: boolean = false;
  card: Card = { id: 0, word: '', translation: '' };
  cards: Card[] = [];
  audio_files: number[] = [];
  example: Example = { id: 0, card: 0, example: '', translation: '' };
  examples: { [card_id: number]: Example[] } = {};
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

  getAudioFiles(): void {
    this.httpService
      .get('/api/audio-files')
      .subscribe((data: any) => (this.audio_files = data));
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

  authorize(): void {
    this.authorized = true;
    this.getCards();
    this.getAudioFiles();
    this.getExamples();
  }

  ngOnInit(): void {
    this.httpService.get('/api/authenticated').subscribe({
      next: () => this.authorize(),
      error: () => (this.authorized = false),
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

  playAudio(idx: number): void {
    const id = this.cards[idx].id;
    this.httpService.getAudio('/api/audio/' + id).subscribe({
      next: (blob: Blob) => {
        const sound = new Audio(URL.createObjectURL(blob));
        sound.addEventListener('canplaythrough', () => {
          sound.play();
        });
      },
      error: () => alert('No audio found for card ' + id),
    });
  }

  saveCard(card: Card): void {
    this.httpService.put('/api/card', card).subscribe({
      next: () => this.getCards(),
      error: () => alert('Failed to save changes!'),
    });
  }

  saveAudio(audio: Blob): void {
    if (!audio) return;
    if (!audio.size) return;
    this.httpService.post('/api/audio/' + this.card.id, audio).subscribe({
      next: () => this.getAudioFiles(),
      error: () => alert('Failed to save audio!'),
    });
  }

  editCard(idx: number): void {
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

  addCard(): void {
    this.httpService.post('/api/card/', {}).subscribe({
      next: () => this.getCards(),
      error: () => alert('Failed to add card!'),
    });
  }

  saveExample(example: Example): void {
    this.httpService.put('/api/example', example).subscribe({
      next: () => this.getExamples(),
      error: () => alert('Failed to save example!'),
    });
  }

  editExample(card: number, idx: number): void {
    this.example = JSON.parse(JSON.stringify(this.examples[card][idx]));
  }

  deleteExample(id: number): void {
    if (window.confirm('Are you sure you want to delete example ' + id + '?')) {
      this.httpService.delete('/api/example/' + id).subscribe({
        next: () => this.getExamples(),
        error: () => alert('Failed to delete example!'),
      });
    }
  }

  addExample(card: number): void {
    this.httpService.post('/api/example/', { card: card }).subscribe({
      next: () => this.getExamples(),
      error: () => alert('Failed to add example!'),
    });
  }
}
