import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-flash-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  @Input() auto_mode: boolean = false;
  @Output() toggleAutoModeEvent = new EventEmitter<null>();

  constructor() {}

  ngOnInit(): void {}

  toggleAutoMode(): void {
    this.toggleAutoModeEvent.emit();
  }
}
