import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpService } from '../../../../shared/services/http/http.service';
import { Card } from '../../../flash/card';
import { Example } from '../../../flash/example';

declare var MediaRecorder: any;

@Component({
  selector: 'app-edit-example-modal',
  templateUrl: './edit-example-modal.component.html',
  styleUrls: ['./edit-example-modal.component.css'],
})
export class EditExampleModalComponent implements OnInit {
  @Input() example: Example = { id: 0, card: 0, example: '', translation: '' };
  @Input() card: Card = { id: 0, word: '', translation: '' };
  @Output() saveExampleEvent = new EventEmitter<Example>();
  @Output() saveAudioEvent = new EventEmitter<Blob>();
  is_iphone: boolean = false;
  recording: boolean = false;
  recorder: any;
  audio: any;

  constructor(
    private httpService: HttpService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.is_iphone = window.navigator.userAgent.includes('iPhone');
  }

  ngOnChanges() {
    // update example to have accurate audio
    this.audio = null;
    if (this.is_iphone) return;
    this.httpService
      .getAudio('/api/audio/example/' + this.example.id)
      .subscribe({
        next: (blob: Blob) => {
          this.audio = this.newAudio(blob);
          this.cleanAudioURL();
        },
        error: () => {},
      });
  }

  cleanAudioURL(): void {
    this.audio.url = this.sanitizer.bypassSecurityTrustUrl(this.audio.url);
  }

  newAudio(blob: Blob): {} {
    const url = URL.createObjectURL(blob);
    const play = () => new Audio(url).play();
    return { blob, url, play };
  }

  newRecorder() {
    return new Promise((resolve) => {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks: any[] = [];

        mediaRecorder.addEventListener('dataavailable', (event: any) => {
          audioChunks.push(event.data);
        });

        const start = () => mediaRecorder.start();

        const stop = () =>
          new Promise((res) => {
            mediaRecorder.addEventListener('stop', () => {
              const blob = new Blob(audioChunks);
              res(this.newAudio(blob));
            });
            mediaRecorder.stop();
          });

        resolve({ start, stop });
      });
    });
  }

  async startRecording() {
    this.recording = true;
    this.audio = null;
    this.recorder = await this.newRecorder();
    this.recorder.start();
  }

  async stopRecording() {
    this.recording = false;
    this.audio = await this.recorder.stop();
    this.cleanAudioURL();
    this.recorder = null;
    if (this.audio.blob.size > 200000) {
      this.audio = null;
      alert('Audio recording is too large! Please try again.');
    }
  }

  save(): void {
    this.saveExampleEvent.emit(this.example);
    if (this.audio && this.audio.blob && this.audio.blob.size) {
      this.saveAudioEvent.emit(this.audio.blob);
    }
  }
}
