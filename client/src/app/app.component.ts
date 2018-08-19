import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';
  createdUrl: string = null
  showSuccess(createdUrl: string){
    this.createdUrl = createdUrl;
  }
  backToForm(){
    this.createdUrl = null;
  }
}

