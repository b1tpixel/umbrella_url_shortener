import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from '../../node_modules/rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class BackendService {
  constructor(
    private http: HttpClient,
  ) { }

  opts: {} = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  isCustomExists(location: string, custom: string){
    const url: string = 'api/is_exists/'
    return this.http.get(url, {params: {custom: custom}})
  }

  shortenUrl(location: string, original: string, custom: string){
    const url: string = 'api/shorten_url';
    const data: {} = {
      custom: custom,
      original: original,
    };
    return this.http.post(url, data, this.opts)
  }
}
