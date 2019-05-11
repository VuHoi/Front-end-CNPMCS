import { Component, ElementRef, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { WebApiServiceProxy } from '@shared/service-proxies/webapi.service';
import { ComboboxItemDto, SupplierServiceProxy, ProductsServiceProxy, BiddingSaved } from '@shared/service-proxies/service-proxies';
import { BidProfileDto } from '../dto/bidProfile.dto';
import { SelectItem } from 'primeng/primeng';

@Component({
    selector: 'createOrEditBidProfileModal',
    templateUrl: './create-or-edit-bidProfile-modal.component.html',
    styleUrls: ['./create-or-edit-bidProfile-modal.component.css']
})
export class CreateOrEditBidProfileModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal') modal: ModalDirective;

    /**
     * @Output dùng để public event cho component khác xử lý
     */
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();
    biddingType = 0;
    price = 0;
    biddingTypes = [
        { label: 'Select bidding type', value: null },
        { label: 'Đấu thầu', value: 1 },
        { label: 'Chuyển nhượng', value: 2 },
        { label: 'Gì đó', value: 3 }

    ];
    status = [
        { label: 'Select status', value: null },
        { label: 'Trúng thầu', value: 1 },
        { label: 'Dự thầu', value: 2 },
        { label: 'Hết hạn', value: 3 }

    ];
    active = false;
    saving = false;
    val1 = 0;
    bidProfile: BidProfileDto = new BidProfileDto();
    bidProfiles: ComboboxItemDto[] = [];
    bidding: BiddingSaved = new BiddingSaved({ productId: 0, endDate: null, status: 0, supplierId: 0, startDate: null, price: 0, biddingType: 0 });
    selectItems: SelectItem[] = [];
    suppliers: SelectItem[] = [];
    rangeDates: Date[];
    constructor(injector: Injector, private _supplierServiceProxy: SupplierServiceProxy, private _productsServiceProxy: ProductsServiceProxy) {
        super(injector);
    }
    getDataProduct() {
        this._productsServiceProxy.getProducts('', '', 1000, 0).subscribe(products => {
            this.selectItems = [];
            this.selectItems.push({ value: '', label: 'Select product' });
            products.items.map(i => this.selectItems.push({ value: i.id, label: i.name }));
        });
    }

    show(bidProfileId?: number | null | undefined): void {
        this.active = true;
        this.modal.show();
        this.getDataProduct();
    }
    onChangeRadioButton() {
        console.log(this.val1);
    }
    save(): void {
        let input = this.bidProfile;
        this.saving = true;
        if (input.id) {
            this.updateBidProfile();
        } else {
            this.insertBidProfile();
        }
    }
    getAllProduct() {

    }
    insertBidProfile() {

    }

    updateBidProfile() {

    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
