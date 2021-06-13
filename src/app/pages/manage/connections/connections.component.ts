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
  connections: Connection[] = [];

  ip_connections: { [ip: string]: number } = {};
  total_ips: number = 0;

  day_connections: { [time: string]: number } = {};
  total_days: number = 0;

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.httpService.get('/api/dump/connections').subscribe((data: any) => {
      this.connections = data;

      for (let i in data) {
        const connection = data[i];

        const ip = connection.ip;
        if (!this.ip_connections[ip]) this.ip_connections[ip] = 0;
        this.ip_connections[ip]++;

        const day = new Date(connection.time).toDateString();
        if (!this.day_connections[day]) this.day_connections[day] = 0;
        this.day_connections[day]++;
      }
      this.total_ips = Object.keys(this.ip_connections).length;
      this.total_days = Object.keys(this.day_connections).length;
    });
  }
}
