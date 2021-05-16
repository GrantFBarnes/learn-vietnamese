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
  card: Card = { id: 0, word: '', translation: '', audio: new Blob() };
  cards: Card[] = [];
  audio_files: number[] = [];
  examples: Example[] = [];

  constructor(private httpService: HttpService) {}

  authorize(): void {
    this.authorized = true;
    this.httpService
      .get('/api/dump/cards')
      .subscribe((data: any) => (this.cards = data));
    this.httpService
      .get('/api/audio-files')
      .subscribe((data: any) => (this.audio_files = data));
    this.httpService
      .get('/api/dump/card_examples')
      .subscribe((data: any) => (this.examples = data));
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

  saveCard(data: Card): void {
    this.httpService.put('/api/card', data).subscribe({
      next: () => {
        this.authorize();
        if (data.audio.size) {
          this.httpService.post('/api/audio/' + data.id, data.audio).subscribe({
            next: () => this.authorize(),
            error: () => alert('Failed to save audio!'),
          });
        }
      },
      error: () => alert('Failed to save changes!'),
    });
  }

  editCard(idx: number): void {
    this.card = JSON.parse(JSON.stringify(this.cards[idx]));
  }

  deleteCard(id: number): void {
    console.log('deleting', id);
  }

  addCard(): void {
    console.log('add new card');
  }
}
