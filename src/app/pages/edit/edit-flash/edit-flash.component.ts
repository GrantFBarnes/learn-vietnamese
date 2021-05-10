import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../shared/services/http/http.service';
import { Card } from '../../flash/card';
import { Example } from '../../flash/example';

@Component({
  selector: 'app-edit-flash',
  templateUrl: './edit-flash.component.html',
  providers: [HttpService],
  styleUrls: ['./edit-flash.component.css'],
})
export class EditFlashComponent implements OnInit {
  authorized: boolean = false;
  cards: Card[] = [];
  examples: Example[] = [];

  constructor(private httpService: HttpService) {}

  authorize(): void {
    this.authorized = true;
    this.httpService
      .getJSON('/api/dump/cards')
      .subscribe((data: any) => (this.cards = data));
    this.httpService
      .getJSON('/api/dump/card_examples')
      .subscribe((data: any) => (this.examples = data));
  }

  ngOnInit(): void {
    this.httpService.getText('/api/authenticated').subscribe({
      next: () => this.authorize(),
      error: () => (this.authorized = false),
    });
  }
}
