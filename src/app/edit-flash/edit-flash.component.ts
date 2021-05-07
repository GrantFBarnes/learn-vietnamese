import { Component, OnInit } from '@angular/core';
import { HttpService } from '../shared/http/http.service';

@Component({
  selector: 'app-edit-flash',
  templateUrl: './edit-flash.component.html',
  providers: [HttpService],
  styleUrls: ['./edit-flash.component.css'],
})
export class EditFlashComponent implements OnInit {
  authorized: boolean = false;

  constructor(private httpService: HttpService) {}

  authorize(): void {
    this.authorized = true;
  }

  ngOnInit(): void {
    this.httpService.getText('/api/authenticated').subscribe({
      next: () => this.authorize(),
      error: () => (this.authorized = false),
    });
  }
}
