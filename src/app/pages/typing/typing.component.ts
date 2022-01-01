import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../shared/services/http/http.service';

@Component({
  selector: 'app-typing',
  templateUrl: './typing.component.html',
  providers: [HttpService],
  styleUrls: ['./typing.component.css'],
})
export class TypingComponent implements OnInit {
  card_ids: number[] = [];

  input: string = '';
  value: string = '';
  characters: string[] = [];

  constructor(private httpService: HttpService) {}

  getNextValue(): void {
    const idx = Math.floor(Math.random() * this.card_ids.length);
    const id = this.card_ids[idx];
    if (id) {
      this.httpService
        .get('/api/vietnamese/card/' + id)
        .subscribe((card: any) => {
          this.input = '';
          this.value = card.word.toLowerCase() + ' ';
          this.characters = this.value.split('');
        });
    }
  }

  ngOnInit(): void {
    this.httpService
      .get('/api/vietnamese/cards/category/0')
      .subscribe((data: any) => {
        this.card_ids = data;
        this.getNextValue();
      });

    window.document.onkeydown = (e) => {
      if (e.key == 'Enter') {
        this.getNextValue();
      }
    };
  }

  inputChanged(): void {
    this.input = this.input.toLowerCase();
  }
}
