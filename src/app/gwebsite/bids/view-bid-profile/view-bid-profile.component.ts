import { Component, ElementRef, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap';

import { ProductsServiceProxy, BiddingSaved } from '@shared/service-proxies/service-proxies';

import * as moment from 'moment';
@Component({
  selector: 'app-view-bid-profile',
  templateUrl: './view-bid-profile.component.html',
  styleUrls: ['./view-bid-profile.component.css']
})
export class ViewBidProfileComponent extends AppComponentBase {

  @ViewChild('createOrEditModal') modal: ModalDirective;

  /**
   * @Output dùng để public event cho component khác xử lý
   */

  bidding: any = {};
  product: any = {};
  urlbase = 'http://localhost:5000';
  constructor(injector: Injector, private _productsServiceProxy: ProductsServiceProxy) {
    super(injector);

  }



  show(bidProfile?: BiddingSaved | null | undefined): void {
    this.bidding = bidProfile;
    this._productsServiceProxy.getProduct(this.bidding.product.id).subscribe(item => {
      this.product = item;
      this.modal.show();
    });
  }





  close(): void {
    this.modal.hide();
  }

}
