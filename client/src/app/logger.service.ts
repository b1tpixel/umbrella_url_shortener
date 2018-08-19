import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() { }

  logHttpError(location: string, error: string): void {
    console.log(`Got "${error}" when tried to access ${location}`);
  }
  
  logHttpSuccess(location: string, custom: string): void {
    const url: string = location + custom
    console.log(`Successfully created shortened url: ${url}`)
  }
}
