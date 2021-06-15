import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../shared/services/http/http.service';
import { Card } from '../../../shared/interfaces/card';
import { Category } from '../../../shared/interfaces/category';

@Component({
  selector: 'app-edit-flash-categories',
  templateUrl: './edit-flash-categories.component.html',
  providers: [HttpService],
  styleUrls: ['./edit-flash-categories.component.css'],
})
export class EditFlashCategoriesComponent implements OnInit {
  authorized: boolean = false;

  cards: Card[] = [];
  categories: Category[] = [];

  card_index: number = 0;
  category_indexes: any = new Set();

  constructor(private httpService: HttpService) {}

  getCards(): void {
    this.httpService.get('/api/dump/cards').subscribe((data: any) => {
      this.cards = data;
    });
  }

  getCategories(): void {
    this.httpService.get('/api/dump/categories').subscribe((data: any) => {
      this.categories = data;
    });
  }

  authorize(): void {
    this.authorized = true;
    this.getCards();
    this.getCategories();
  }

  ngOnInit(): void {
    // redirect to https if not localhost
    if (!window.origin.includes('local')) {
      if (location.protocol !== 'https:') {
        location.replace(
          'https:' + location.href.substring(location.protocol.length)
        );
      }
    }

    this.httpService.get('/api/authenticated').subscribe({
      next: () => this.authorize(),
      error: () => (this.authorized = false),
    });
  }

  selectCard(idx: number): void {
    this.card_index = idx;
    this.category_indexes = new Set();
  }

  toggleCategory(idx: number): void {
    if (this.category_indexes.has(idx)) {
      this.category_indexes.delete(idx);
    } else {
      this.category_indexes.add(idx);
    }
  }
}
