import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Example } from '../../../shared/interfaces/example';

@Component({
  selector: 'app-flash-translations',
  templateUrl: './translations.component.html',
  styleUrls: ['./translations.component.css'],
})
export class TranslationsComponent implements OnInit {
  @Input() flipped: boolean = true;
  @Input() examples: Example[] = [];
  @Output() showSectionEvent = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  showSection(): void {
    this.showSectionEvent.emit('translations');
  }
}
