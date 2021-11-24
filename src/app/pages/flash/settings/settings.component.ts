import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Category } from '../../../shared/interfaces/category';

@Component({
  selector: 'app-flash-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  @Input() flip_type: string = '';
  @Input() flip_type_options: string[] = [];
  @Output() setFlipTypeEvent = new EventEmitter<string>();

  @Input() category_id: number = 0;
  @Input() category_name: string = '';
  @Input() categories: Category[] = [];
  @Output() setCategoryEvent = new EventEmitter<any>();

  @Input() auto_mode: boolean = false;
  @Output() toggleAutoModeEvent = new EventEmitter<null>();

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
}
