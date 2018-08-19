import { Component, OnInit, Output } from '@angular/core';
import { BackendService } from '../backend.service';
import { EventEmitter } from '@angular/core';
import { LoggerService } from '../logger.service';


@Component({
  selector: 'app-url-input',
  templateUrl: './url-input.component.html',
  styleUrls: ['./url-input.component.css'],
})
export class UrlInputComponent implements OnInit {

  @Output() urlCreated: EventEmitter<string> = new EventEmitter<string>();

  constructor(private backend: BackendService, private logger: LoggerService) { 
    this.location = window.location.host
  }

  location: string = null;
  custom: string = null;
  original: string = null;
  customInputStatus: string = null;
  originalInputStatus: string = null;

  showSuccess(createdUrl): void{
    this.urlCreated.emit(createdUrl);
  };

  onOriginalInput(): void{
    if(!this.original){
      this.originalInputStatus = 'is-invalid';
    } else {
      this.originalInputStatus = null
    }
    
  }
  onCustomInput(): void{
    const url: string = this.location + 'api/is_exists/'
    if(this.custom){
      this.backend.isCustomExists(this.location, this.custom)
        .subscribe(
          (response: any) => {  
            if(!response.isExists){
              this.customInputStatus = 'is-valid'
            } else {
              this.customInputStatus = 'is-invalid'
            }
          },
          (error: any) => {
            this.logger.logHttpError(error.url, error.message)
          }
        )
      } else {
        this.customInputStatus = null
      }
    
  }

  validate(): boolean{
    this.onOriginalInput();
    if(this.original && this.customInputStatus !== 'is-invalid' && this.originalInputStatus !== 'is-invalid'){
      return true;
    } else {
      return false;
    }
  }

  submitURL(event): void{
    event.preventDefault()
    if(this.validate()){
      this.backend.shortenUrl(this.location, this.original, this.custom)
      .subscribe(
        (response: any) => {
          this.showSuccess(response.createdUrl);
        },
        (error: any) => {
          this.logger.logHttpError(error.url, error.message);
        }
      )
    }
  }

  ngOnInit() {
  }

}
