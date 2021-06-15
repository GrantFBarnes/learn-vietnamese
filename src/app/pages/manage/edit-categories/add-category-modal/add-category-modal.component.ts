import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Category } from '../../../../shared/interfaces/category';

@Component({
  selector: 'app-add-category-modal',
  templateUrl: './add-category-modal.component.html',
  styleUrls: ['./add-category-modal.component.css'],
})
export class AddCategoryModalComponent implements OnInit {
  category: Category = { id: 0, name: '' };
  @Output() addCategoryEvent = new EventEmitter<Category>();

  constructor() {}

  ngOnInit(): void {}

  addCategory(): void {
    this.addCategoryEvent.emit(this.category);
    this.category.name = '';
  }
}
