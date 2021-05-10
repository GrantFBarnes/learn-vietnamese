import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-flash-flip',
  templateUrl: './flip.component.html',
  styleUrls: ['./flip.component.css'],
})
export class FlipComponent {
  @Output() showSectionEvent = new EventEmitter();

  showSection(): void {
    this.showSectionEvent.emit();
  }
}
