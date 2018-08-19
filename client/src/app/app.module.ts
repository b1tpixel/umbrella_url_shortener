import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { UrlInputComponent } from './url-input/url-input.component';
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { SuccessViewComponent } from './success-view/success-view.component'

@NgModule({
  declarations: [
    AppComponent,
    UrlInputComponent,
    SuccessViewComponent, 
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
