import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-flip',
  templateUrl: './flip.component.html',
  styleUrls: ['./flip.component.css'],
})
export class FlipComponent {
  @Input() section: string = '';
  @Output() showSectionEvent = new EventEmitter<string>();

  showSection(): void {
    this.showSectionEvent.emit(this.section);
  }
}
