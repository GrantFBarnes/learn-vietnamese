import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Example } from '../../../flash/example';

@Component({
  selector: 'app-edit-example-modal',
  templateUrl: './edit-example-modal.component.html',
  styleUrls: ['./edit-example-modal.component.css'],
})
export class EditExampleModalComponent implements OnInit {
  @Input() example: Example = { id: 0, card: 0, example: '', translation: '' };
  @Output() saveExampleEvent = new EventEmitter<Example>();

  constructor() {}

  ngOnInit(): void {}

  save(): void {
    this.saveExampleEvent.emit(this.example);
  }
}
