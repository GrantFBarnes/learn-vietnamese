import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpService } from '../../../shared/services/http/http.service';
import { Card } from '../card';

@Component({
  selector: 'app-flash-word',
  templateUrl: './word.component.html',
  styleUrls: ['./word.component.css'],
})
export class WordComponent implements OnInit {
  @Input() flipped: boolean = true;
  @Input() card: Card = { id: 0, word: '', translation: '', audio: new Blob() };
  @Output() showSectionEvent = new EventEmitter<string>();
  audio: any;

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.audio = null;
    this.httpService.getAudio('/api/audio/' + this.card.id).subscribe({
      next: (blob: Blob) => {
        this.audio = {
          play: () => new Audio(URL.createObjectURL(blob)).play(),
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
