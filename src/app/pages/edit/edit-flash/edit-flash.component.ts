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
  examples: Example[] = [];

  constructor(private httpService: HttpService) {}

  authorize(): void {
    this.authorized = true;
    this.httpService
      .get('/api/dump/cards')
      .subscribe((data: any) => (this.cards = data));
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

  playAudio(): void {
    if (!this.card.audio) return;
    if (!this.card.audio.size) return;
    const blobURL = URL.createObjectURL(this.card.audio);
    const sound = new Audio(blobURL);
    sound.addEventListener('canplaythrough', () => {
      sound.play();
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

  selectCard(idx: number): void {
    this.card = JSON.parse(JSON.stringify(this.cards[idx]));
  }

  deleteCard(id: number): void {
    console.log('deleting', id);
  }

  addCard(): void {
    console.log('add new card');
  }
}
