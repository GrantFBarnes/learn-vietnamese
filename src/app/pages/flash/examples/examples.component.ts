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
  is_iphone: boolean = false;
  example_audio_files: number[] = [];

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.is_iphone = window.navigator.userAgent.includes('iPhone');

    if (this.is_iphone) return;
    this.httpService
      .get('/api/audio/examples')
      .subscribe((data: any) => (this.example_audio_files = data));
  }

  playAudio(id: number): void {
    this.httpService.getAudio('/api/audio/example/' + id).subscribe({
      next: (blob: Blob) => {
        const sound = new Audio(URL.createObjectURL(blob));
        sound.addEventListener('canplaythrough', () => {
          sound.play();
        });
      },
      error: () => alert('No audio found'),
    });
  }

  showSection(): void {
    this.showSectionEvent.emit('examples');
  }
}
