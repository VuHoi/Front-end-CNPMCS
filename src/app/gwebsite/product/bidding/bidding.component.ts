import { Component, OnInit, ViewChild, Output, EventEmitter, Injector } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { AppComponentBase } from '@shared/common/app-component-base';

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
  constructor(injector: Injector) { super(injector); }


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
