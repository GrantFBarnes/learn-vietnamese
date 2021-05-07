import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpService } from '../shared/http/http.service';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  providers: [HttpService],
  styleUrls: ['./unauthorized.component.css'],
})
export class UnauthorizedComponent implements OnInit {
  @Output() authorizeEvent = new EventEmitter();
  edit_secret: string = '';

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {}

  submit(): void {
    this.httpService
      .postText('/api/token', { edit_secret: this.edit_secret })
      .subscribe({
        next: () => this.authorizeEvent.emit(),
        error: () => alert('Access Denied'),
      });
  }
}
