import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpService } from '../../../shared/services/http/http.service';
import { Example } from '../../../shared/interfaces/example';

@Component({
  selector: 'app-flash-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.css'],
})
export class ExamplesComponent implements OnInit {
  @Input() flipped: boolean = true;
  @Input() examples: Example[] = [];
  @Output() showSectionEvent = new EventEmitter<string>();
  can_play: boolean = false;
  example_audio_files: number[] = [];

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.httpService.get('/api/audio/examples').subscribe((data: any) => {
      this.example_audio_files = data;

      if (this.example_audio_files.length) {
        const id = this.example_audio_files[0];
        this.httpService.getAudio('/api/audio/example/' + id).subscribe({
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

  playAudio(id: number): void {
    if (!this.can_play) return;
    this.httpService.getAudio('/api/audio/example/' + id).subscribe({
      next: (blob: Blob) => {
        const audio = new Audio(URL.createObjectURL(blob));
        audio.oncanplay = () => {
          audio.play();
        };
      },
      error: () => alert('No audio found'),
    });
  }

  showSection(): void {
    this.showSectionEvent.emit('examples');
  }
}
