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
  examples: { [card_id: number]: Example[] } = {};

  constructor(private httpService: HttpService) {}

  getCards(): void {
    this.httpService
      .get('/api/dump/cards')
      .subscribe((data: any) => (this.cards = data));
  }

  getAudioFiles(): void {
    this.httpService
      .get('/api/audio-files')
      .subscribe((data: any) => (this.audio_files = data));
  }

  getCardExamples(): void {
    this.httpService.get('/api/dump/card_examples').subscribe((data: any) => {
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
    this.getCardExamples();
  }

  ngOnInit(): void {
    this.httpService.get('/api/authenticated').subscribe({
      next: () => this.authorize(),
      error: () => (this.authorized = false),
    });
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
}
