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

  primary_is_card: boolean = true;
  primary_id: number = 0;
  primary_list: any[] = [];
  secondary_list: any[] = [];

  cards: Card[] = [];
  categories: Category[] = [];

  sort_method: string = 'Alphabetical';
  sort_methods: string[] = [
    'Alphabetical',
    'Alphabetical (reversed)',
    'ID',
    'ID (reversed)',
  ];

  card_count: { [id: number]: number } = {};
  category_count: { [id: number]: number } = {};

  cards_categories: { [id: number]: { [id: number]: number } } = {};
  categories_cards: { [id: number]: { [id: number]: number } } = {};

  constructor(private httpService: HttpService) {}

  sortByTranslation(a: any, b: any): number {
    const a_translation = a.translation.toLowerCase();
    const b_translation = b.translation.toLowerCase();
    if (a_translation < b_translation) return -1;
    if (a_translation > b_translation) return 1;
    return 0;
  }

  sortByName(a: any, b: any): number {
    const a_name = a.name.toLowerCase();
    const b_name = b.name.toLowerCase();
    if (a_name < b_name) return -1;
    if (a_name > b_name) return 1;
    return 0;
  }

  sortByID(a: any, b: any): number {
    if (a.id < b.id) return -1;
    if (a.id > b.id) return 1;
    return 0;
  }

  getCards(): void {
    this.httpService
      .get('/api/vietnamese/dump/cards')
      .subscribe((data: any) => {
        data.sort(this.sortByTranslation);
        this.cards = data;
        this.primary_list = data;

        for (let i in data) {
          const row = data[i];
          const card_id = row.id;
          if (!this.card_count[card_id]) {
            this.card_count[card_id] = 0;
          }
          if (!this.cards_categories[card_id]) {
            this.cards_categories[card_id] = {};
          }
        }
      });
  }

  getCategories(): void {
    this.httpService
      .get('/api/vietnamese/dump/categories')
      .subscribe((data: any) => {
        data.sort(this.sortByName);
        this.categories = data;
        this.secondary_list = data;

        for (let i in data) {
          const row = data[i];
          const category_id = row.id;
          if (!this.category_count[category_id]) {
            this.category_count[category_id] = 0;
          }
          if (!this.categories_cards[category_id]) {
            this.categories_cards[category_id] = {};
          }
        }
      });
  }

  getCardCategories(): void {
    this.httpService
      .get('/api/vietnamese/dump/cards_categories')
      .subscribe((data: any) => {
        for (let i in data) {
          const row = data[i];
          const card_id = row.card;
          const category_id = row.category;

          if (!this.card_count[card_id]) {
            this.card_count[card_id] = 0;
          }
          this.card_count[card_id]++;

          if (!this.category_count[category_id]) {
            this.category_count[category_id] = 0;
          }
          this.category_count[category_id]++;

          if (!this.cards_categories[card_id]) {
            this.cards_categories[card_id] = {};
          }
          this.cards_categories[card_id][category_id] = row.id;

          if (!this.categories_cards[category_id]) {
            this.categories_cards[category_id] = {};
          }
          this.categories_cards[category_id][card_id] = row.id;
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

  setSortMethod(method: string): void {
    this.sort_method = method;
    switch (method) {
      case 'Alphabetical':
      case 'Alphabetical (reversed)':
        this.cards = this.cards.sort(this.sortByTranslation);
        this.categories = this.categories.sort(this.sortByName);
        break;
      case 'ID':
      case 'ID (reversed)':
        this.cards = this.cards.sort(this.sortByID);
        this.categories = this.categories.sort(this.sortByID);
        break;
      default:
        break;
    }
    if (method.indexOf('reverse') >= 0) {
      this.cards.reverse();
      this.categories.reverse();
    }
  }

  togglePrimary(): void {
    this.primary_is_card = !this.primary_is_card;
    this.primary_id = 0;
    this.primary_list = this.primary_is_card ? this.cards : this.categories;
    this.secondary_list = this.primary_is_card ? this.categories : this.cards;
  }

  selectPrimary(id: number): void {
    this.primary_id = id;
  }

  updateAfterDelete(card_id: number, category_id: number): void {
    this.card_count[card_id]--;
    this.category_count[category_id]--;
    delete this.cards_categories[card_id][category_id];
    delete this.categories_cards[category_id][card_id];
  }

  deleteSecondary(secondary_id: number): void {
    const db_id = this.primary_is_card
      ? this.cards_categories[this.primary_id][secondary_id]
      : this.categories_cards[this.primary_id][secondary_id];
    this.httpService
      .delete('/api/vietnamese/card-category/' + db_id)
      .subscribe({
        next: () => {
          if (this.primary_is_card) {
            this.updateAfterDelete(this.primary_id, secondary_id);
          } else {
            this.updateAfterDelete(secondary_id, this.primary_id);
          }
        },
        error: () => alert('Failed to delete category!'),
      });
  }

  updateAfterAdd(card_id: number, category_id: number, db_id: number): void {
    if (!this.card_count[card_id]) {
      this.card_count[card_id] = 0;
    }
    this.card_count[card_id]++;

    if (!this.category_count[category_id]) {
      this.category_count[category_id] = 0;
    }
    this.category_count[category_id]++;

    if (!this.cards_categories[card_id]) {
      this.cards_categories[card_id] = {};
    }
    this.cards_categories[card_id][category_id] = db_id;

    if (!this.categories_cards[category_id]) {
      this.categories_cards[category_id] = {};
    }
    this.categories_cards[category_id][card_id] = db_id;
  }

  addSecondary(secondary_id: number): void {
    const card_category = this.primary_is_card
      ? { card: this.primary_id, category: secondary_id }
      : { card: secondary_id, category: this.primary_id };
    this.httpService
      .post('/api/vietnamese/card-category', card_category)
      .subscribe({
        next: (res: any) => {
          if (this.primary_is_card) {
            this.updateAfterAdd(this.primary_id, secondary_id, res.insertId);
          } else {
            this.updateAfterAdd(secondary_id, this.primary_id, res.insertId);
          }
        },
        error: () => alert('Failed to add category!'),
      });
  }

  selectSecondary(secondary_id: number): void {
    const obj = this.primary_is_card
      ? this.cards_categories
      : this.categories_cards;
    if (obj[this.primary_id] && obj[this.primary_id][secondary_id]) {
      this.deleteSecondary(secondary_id);
    } else {
      this.addSecondary(secondary_id);
    }
  }
}
