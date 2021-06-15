import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Category } from '../../../../shared/interfaces/category';

@Component({
  selector: 'app-edit-category-modal',
  templateUrl: './edit-category-modal.component.html',
  styleUrls: ['./edit-category-modal.component.css'],
})
export class EditCategoryModalComponent implements OnInit {
  @Input() category: Category = { id: 0, name: '' };
  @Output() saveCategoryEvent = new EventEmitter<Category>();

  constructor() {}

  ngOnInit(): void {}

  save(): void {
    this.saveCategoryEvent.emit(this.category);
  }
}
