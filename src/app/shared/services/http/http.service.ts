import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HttpService {
  server_host: string = window.location.origin;

  constructor(private http: HttpClient) {
    if (this.server_host.indexOf('localhost') >= 0) {
      this.server_host = 'http://localhost:8080';
    }
  }

  getText(url: string) {
    return this.http.get(this.server_host + url, {
      withCredentials: true,
      responseType: 'text',
    });
  }

  getJSON(url: string) {
    return this.http.get(this.server_host + url, {
      withCredentials: true,
    });
  }

  postText(url: string, body: {}) {
    return this.http.post(this.server_host + url, body, {
      withCredentials: true,
      responseType: 'text',
    });
  }

  postJSON(url: string, body: {}) {
    return this.http.post(this.server_host + url, body, {
      withCredentials: true,
    });
  }
}
