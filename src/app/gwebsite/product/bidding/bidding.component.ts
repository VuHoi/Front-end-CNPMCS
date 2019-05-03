import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-bidding',
  templateUrl: './bidding.component.html',
  styleUrls: ['./bidding.component.css']
})
export class BiddingComponent extends AppComponentBase {
  val1 = '';
  @ViewChild('biddingModel') modal: ModalDirective;
  @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

  active = false;
  constructor() { }

  ngOnInit() {

  }
  show(productId?: number | null | undefined): void {
    this.active = true;
    this.modal.show();
  }
  onChangeRadioButton() {
    console.log(this.val1);
  }
  save() {

  }

  close(): void {
    this.active = false;
    this.modal.hide();
  }
}
