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
  can_play: boolean = false;
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
    this.httpService
      .get('/api/vietnamese/dump/cards')
      .subscribe((data: any) => {
        this.cards = data;
        for (let i in data) {
          const id = data[i].id;
          if (!this.examples_show[id]) this.examples_show[id] = false;
        }
      });
  }

  getCardAudioIds(): void {
    this.httpService
      .get('/api/vietnamese/audio/cards')
      .subscribe((data: any) => {
        this.card_audio_files = data;

        if (this.card_audio_files.length) {
          const id = this.card_audio_files[0];
          this.httpService
            .getAudio('/api/vietnamese/audio/card/' + id)
            .subscribe({
              next: (blob: Blob) => {
                const audio = new Audio(URL.createObjectURL(blob));
                audio.oncanplay = () => {
                  this.can_play = true;
                };
              },
              error: () => {},
            });
        }
      });
  }

  getExamples(): void {
    this.httpService
      .get('/api/vietnamese/dump/examples')
      .subscribe((data: any) => {
        this.examples = {};
        for (let i in data) {
          const card_id = data[i].card;
          if (!this.examples[card_id]) this.examples[card_id] = [];
          this.examples[card_id].push(data[i]);
        }
      });
  }

  getExampleAudioIds(): void {
    this.httpService
      .get('/api/vietnamese/audio/examples')
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

    this.httpService.get('/api/authenticated').subscribe({
      next: () => this.authorize(),
      error: () => (this.authorized = false),
    });
  }

  playAudio(folder: string, id: number): void {
    this.httpService
      .getAudio('/api/vietnamese/audio/' + folder + '/' + id)
      .subscribe({
        next: (blob: Blob) => {
          const audio = new Audio(URL.createObjectURL(blob));
          audio.oncanplay = () => {
            audio.play();
          };
        },
        error: () => alert('No audio found'),
      });
  }

  saveAudio(folder: string, id: number, audio: Blob): void {
    if (!audio) return;
    if (!audio.size) return;

    this.httpService
      .post('/api/vietnamese/audio/' + folder + '/' + id, audio)
      .subscribe({
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
    this.httpService.put('/api/vietnamese/card', card).subscribe({
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
      this.httpService.delete('/api/vietnamese/card/' + id).subscribe({
        next: () => this.authorize(),
        error: () => alert('Failed to delete card!'),
      });
    }
  }

  addCard(card: Card): void {
    this.httpService.post('/api/vietnamese/card', card).subscribe({
      next: () => this.getCards(),
      error: () => alert('Failed to add card!'),
    });
  }

  playExampleAudio(id: number): void {
    this.playAudio('example', id);
  }

  saveExample(example: Example): void {
    this.httpService.put('/api/vietnamese/example', example).subscribe({
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
      this.httpService.delete('/api/vietnamese/example/' + id).subscribe({
        next: () => this.getExamples(),
        error: () => alert('Failed to delete example!'),
      });
    }
  }

  addExample(example: Example): void {
    this.httpService.post('/api/vietnamese/example', example).subscribe({
      next: () => this.getExamples(),
      error: () => alert('Failed to add example!'),
    });
  }
}
