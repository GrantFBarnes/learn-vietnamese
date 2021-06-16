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

  card_id: number = 0;
  cards: Card[] = [];
  categories: Category[] = [];
  cards_categories: { [id: number]: { [id: number]: number } } = {};
  card_category_count: { [id: number]: number } = {};

  constructor(private httpService: HttpService) {}

  getCards(): void {
    this.httpService.get('/api/dump/cards').subscribe((data: any) => {
      data.sort((a: any, b: any) => {
        const at = a.translation.toLowerCase();
        const bt = b.translation.toLowerCase();
        if (at < bt) return -1;
        if (at > bt) return 1;
        return 0;
      });
      this.cards = data;

      for (let i in data) {
        const row = data[i];
        const card_id = row.id;
        if (!this.cards_categories[card_id]) {
          this.cards_categories[card_id] = {};
        }
        if (!this.card_category_count[card_id]) {
          this.card_category_count[card_id] = 0;
        }
      }
    });
  }

  getCategories(): void {
    this.httpService.get('/api/dump/categories').subscribe((data: any) => {
      this.categories = data;
    });
  }

  getCardCategories(): void {
    this.httpService
      .get('/api/dump/cards_categories')
      .subscribe((data: any) => {
        for (let i in data) {
          const row = data[i];
          const card_id = row.card;
          const category_id = row.category;

          if (!this.cards_categories[card_id]) {
            this.cards_categories[card_id] = {};
          }
          this.cards_categories[card_id][category_id] = row.id;

          if (!this.card_category_count[card_id]) {
            this.card_category_count[card_id] = 0;
          }
          this.card_category_count[card_id]++;
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

  selectCard(id: number): void {
    this.card_id = id;
  }

  deleteCategory(id: number): void {
    this.httpService
      .delete('/api/card-category/' + this.cards_categories[this.card_id][id])
      .subscribe({
        next: () => {
          delete this.cards_categories[this.card_id][id];
          this.card_category_count[this.card_id]--;
        },
        error: () => alert('Failed to delete category!'),
      });
  }

  addCategory(id: number): void {
    const card_category = { card: this.card_id, category: id };
    this.httpService.post('/api/card-category', card_category).subscribe({
      next: (res: any) => {
        if (!this.cards_categories[this.card_id]) {
          this.cards_categories[this.card_id] = {};
        }
        this.cards_categories[this.card_id][id] = res.insertId;

        if (!this.card_category_count[this.card_id]) {
          this.card_category_count[this.card_id] = 0;
        }
        this.card_category_count[this.card_id]++;
      },
      error: () => alert('Failed to add category!'),
    });
  }

  toggleCategory(id: number): void {
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
