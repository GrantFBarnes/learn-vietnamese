import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../shared/services/http/http.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  providers: [HttpService],
  styleUrls: ['./manage.component.css'],
})
export class ManageComponent implements OnInit {
  authorized: boolean = false;

  constructor(private httpService: HttpService) {}

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

  authorize(): void {
    this.authorized = true;
  }
}
