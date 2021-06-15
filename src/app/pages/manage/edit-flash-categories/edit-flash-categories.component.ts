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

  card_id: string = '0';
  cards: { [id: string]: Card } = {};
  categories: { [id: string]: Category } = {};
  cards_categories: { [id: string]: { [id: string]: number } } = {};

  constructor(private httpService: HttpService) {}

  getCards(): void {
    this.httpService.get('/api/dump/cards').subscribe((data: any) => {
      for (let i in data) {
        const row = data[i];
        this.cards[row.id.toString()] = row;
      }
    });
  }

  getCategories(): void {
    this.httpService.get('/api/dump/categories').subscribe((data: any) => {
      for (let i in data) {
        const row = data[i];
        this.categories[row.id.toString()] = row;
      }
    });
  }

  getCardCategories(): void {
    this.httpService
      .get('/api/dump/cards_categories')
      .subscribe((data: any) => {
        for (let i in data) {
          const row = data[i];
          const card_id = row.card.toString();
          const category_id = row.category.toString();
          if (!this.cards_categories[card_id]) {
            this.cards_categories[card_id] = {};
          }
          this.cards_categories[card_id][category_id] = row.id;
        }
      });
  }

  authorize(): void {
    this.authorized = true;
    this.getCards();
    this.getCategories();
    this.getCardCategories();
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

  selectCard(id: string): void {
    this.card_id = id;
  }

  deleteCategory(id: string): void {
    this.httpService
      .delete('/api/card-category/' + this.cards_categories[this.card_id][id])
      .subscribe({
        next: () => delete this.cards_categories[this.card_id][id],
        error: () => alert('Failed to delete category!'),
      });
  }

  addCategory(id: string): void {
    const card_category = {
      card: parseInt(this.card_id),
      category: parseInt(id),
    };
    this.httpService.post('/api/card-category', card_category).subscribe({
      next: (res: any) => {
        if (!this.cards_categories[this.card_id]) {
          this.cards_categories[this.card_id] = {};
        }
        this.cards_categories[this.card_id][id] = res.insertId;
      },
      error: () => alert('Failed to add category!'),
    });
  }

  toggleCategory(id: string): void {
    if (
      this.cards_categories[this.card_id] &&
      this.cards_categories[this.card_id][id]
    ) {
      this.deleteCategory(id);
    } else {
      this.addCategory(id);
    }
  }
}
