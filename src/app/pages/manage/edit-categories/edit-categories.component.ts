import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../shared/services/http/http.service';
import { Category } from '../../../shared/interfaces/category';

@Component({
  selector: 'app-edit-categories',
  templateUrl: './edit-categories.component.html',
  providers: [HttpService],
  styleUrls: ['./edit-categories.component.css'],
})
export class EditCategoriesComponent implements OnInit {
  authorized: boolean = false;
  category: Category = { id: 0, name: '' };
  categories: Category[] = [];

  constructor(private httpService: HttpService) {}

  getCategories(): void {
    this.httpService
      .get('/api/vietnamese/dump/categories')
      .subscribe((data: any) => {
        this.categories = data;
      });
  }

  authorize(): void {
    this.authorized = true;
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

    this.httpService.get('/api/authentication/manager').subscribe({
      next: () => this.authorize(),
      error: () => (this.authorized = false),
    });
  }

  selectCategory(idx: number): void {
    this.category = JSON.parse(JSON.stringify(this.categories[idx]));
  }

  saveCategory(category: Category): void {
    this.httpService.put('/api/vietnamese/category', category).subscribe({
      next: () => this.authorize(),
      error: () => alert('Failed to save changes!'),
    });
  }

  deleteCategory(id: number) {
    if (
      window.confirm('Are you sure you want to delete category ' + id + '?')
    ) {
      this.httpService.delete('/api/vietnamese/category/' + id).subscribe({
        next: () => this.authorize(),
        error: () => alert('Failed to delete category!'),
      });
    }
  }

  addCategory(category: Category): void {
    this.httpService.post('/api/vietnamese/category', category).subscribe({
      next: () => this.authorize(),
      error: () => alert('Failed to add category!'),
    });
  }
}
