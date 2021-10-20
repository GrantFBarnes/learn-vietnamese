import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpService } from '../../../shared/services/http/http.service';
import { Card } from '../../../shared/interfaces/card';

@Component({
  selector: 'app-flash-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.css'],
})
export class WordComponent implements OnInit {
  @Input() flipped: boolean = true;
  @Input() card: Card = { id: 0, word: '', translation: '' };
  @Output() showSectionEvent = new EventEmitter<string>();
  audio: any;

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.audio = null;
    this.httpService.getAudio('/api/audio/card/' + this.card.id).subscribe({
      next: (blob: Blob) => {
        const audio = new Audio(URL.createObjectURL(blob));
        audio.oncanplay = () => {
          this.audio = audio;
        };
      },
      error: () => {},
    });
  }

  playAudio(): void {
    if (this.audio) this.audio.play();
  }

  showSection(): void {
    this.showSectionEvent.emit('word');
  }
}
