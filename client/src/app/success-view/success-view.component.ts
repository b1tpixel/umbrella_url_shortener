import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-success-view',
  templateUrl: './success-view.component.html',
  styleUrls: ['./success-view.component.css']
})
export class SuccessViewComponent implements OnInit {

  constructor() { }

  @Input('createdUrl') createdUrl: string;

  @Output() backToForm: EventEmitter<any> = new EventEmitter<any>();

  handleBtnClick(){
    this.backToForm.emit()
  }

  ngOnInit() {
  }

}
