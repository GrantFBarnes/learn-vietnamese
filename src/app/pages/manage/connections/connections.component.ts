import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../shared/services/http/http.service';
import { Connection } from '../../../shared/interfaces/connection';

@Component({
  selector: 'app-connections',
  templateUrl: './connections.component.html',
  providers: [HttpService],
  styleUrls: ['./connections.component.css'],
})
export class ConnectionsComponent implements OnInit {
  authorized: boolean = false;

  total_connections: number = 0;
  ip_connections_list: string[] = [];
  ip_connections: { [ip: string]: Connection[] } = {};
  ip_show: { [ip: string]: boolean } = {};
  ip_show_all: boolean = false;

  constructor(private httpService: HttpService) {}

  getConnections(): void {
    this.httpService.get('/api/dump/connections').subscribe((data: any) => {
      for (let i in data) {
        const connection = data[i];
        const ip = connection.ip;

        if (!this.ip_connections[ip]) this.ip_connections[ip] = [];
        this.ip_connections[ip].push(connection);

        if (!this.ip_show[ip]) this.ip_show[ip] = false;

        this.total_connections++;
      }

      this.ip_connections_list = Object.keys(this.ip_connections);
      this.ip_connections_list.sort((a: string, b: string) => {
        const a_len = this.ip_connections[a].length;
        const b_len = this.ip_connections[b].length;
        if (a_len < b_len) return 1;
        if (a_len > b_len) return -1;
        return 0;
      });
    });
  }

  authorize(): void {
    this.authorized = true;
    this.getConnections();
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

  toggleIPShowAll(): void {
    this.ip_show_all = !this.ip_show_all;
    for (let ip in this.ip_show) {
      this.ip_show[ip] = this.ip_show_all;
    }
  }

  toggleIPShow(ip: string): void {
    this.ip_show[ip] = !this.ip_show[ip];
  }
}
