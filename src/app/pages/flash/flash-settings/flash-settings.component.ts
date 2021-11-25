import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Category } from '../../../shared/interfaces/category';

@Component({
  selector: 'app-flash-settings',
  templateUrl: './flash-settings.component.html',
  styleUrls: ['./flash-settings.component.css'],
})
export class FlashSettingsComponent implements OnInit {
  @Output() setFlipTypeEvent = new EventEmitter<string>();

  @Input() category_id: number = 0;
  @Input() category_name: string = '';
  @Input() categories: Category[] = [];
  @Output() setCategoryEvent = new EventEmitter<any>();

  @Input() auto_mode: boolean = false;
  @Input() auto_play: boolean = true;
  @Input() auto_next: string = 'next';
  @Input() timeout_seconds: number = 3;
  @Output() toggleAutoModeEvent = new EventEmitter<null>();
  @Output() toggleAutoPlayEvent = new EventEmitter<null>();
  @Output() setAutoNextEvent = new EventEmitter<string>();
  @Output() setTimeoutSecondsEvent = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {}

  setFlipType(option: string): void {
    this.setFlipTypeEvent.emit(option);
  }

  setCategory(option: any): void {
    this.setCategoryEvent.emit(option);
  }

  toggleAutoMode(): void {
    this.toggleAutoModeEvent.emit();
  }

  toggleAutoPlay(): void {
    this.toggleAutoPlayEvent.emit();
  }

  setAutoNext(val: string): void {
    this.setAutoNextEvent.emit(val);
  }

  timeoutChange(): void {
    if (this.timeout_seconds < 1 || this.timeout_seconds > 15) {
      this.timeout_seconds = 3;
    }
    this.setTimeoutSecondsEvent.emit(this.timeout_seconds);
  }
}
