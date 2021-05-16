import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Card } from '../../../flash/card';

declare var MediaRecorder: any;

@Component({
  selector: 'app-edit-card-modal',
  templateUrl: './edit-card-modal.component.html',
  styleUrls: ['./edit-card-modal.component.css'],
})
export class EditCardModalComponent implements OnInit {
  @Input() card: Card = { id: 0, word: '', translation: '', audio: new Blob() };
  @Output() saveEvent = new EventEmitter<Card>();
  recording: boolean = false;
  recorder: any;
  audio: any;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {}

  ngOnChanges() {
    // update audio to new card audio
    if (this.card.audio && this.card.audio.size) {
      const blob = this.card.audio;
      const url = URL.createObjectURL(blob);
      const play = () => new Audio(url).play();
      this.audio = { blob, url, play };
    } else {
      this.audio = null;
    }
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
              const url = URL.createObjectURL(blob);
              const play = () => new Audio(url).play();
              res({ blob, url, play });
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
    this.audio.url = this.sanitizer.bypassSecurityTrustUrl(this.audio.url);
    this.recorder = null;
    if (this.audio.blob.size > 200000) {
      this.audio = null;
      alert('Audio recording is too large! Please try again.');
    } else {
      this.card.audio = this.audio.blob;
    }
  }

  save(): void {
    this.saveEvent.emit(this.card);
  }
}
