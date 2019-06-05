import { Component, ElementRef, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap';
import { SelectItem } from 'primeng/primeng';
import * as moment from 'moment';

@Component({
    selector: 'createOrEditProductModal',
    templateUrl: './create-or-edit-product-modal.component.html',
    styleUrls: ['./create-or-edit-product-modal.component.css']
})
export class CreateOrEditProductModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal') modal: ModalDirective;
    @ViewChild('productCombobox') productCombobox: ElementRef;
    @ViewChild('iconCombobox') iconCombobox: ElementRef;
    biddingTypes = [
        { label: 'Select bidding type', value: null },
        { label: 'Đấu thầu', value: 0 },
        { label: 'Chuyển nhượng', value: 1 },
        { label: 'Gì đó', value: 2 }

    ];
    status = [
        { label: 'Select status', value: null },
        { label: 'Trúng thầu', value: 1 },
        { label: 'Dự thầu', value: 2 },
        { label: 'Hết hạn', value: 3 }

    ];
    /**
     * @Output dùng để public event cho component khác xử lý
     */
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    selectItems: SelectItem[] = [];
    suppliers: SelectItem[] = [];
    rangeDates: Date[];
    constructor(
        injector: Injector
    ) {
        super(injector);
        this.getDataProduct();
        this.suppliers.push({ value: '', label: 'Select supplier' });
    }

    show(productId?: number | null | undefined): void {
        this.active = true;
        this.modal.show();
    }

    save(): void {
        this.saving = true;
        // this.bidding.status = 0;


    }
    dropdownChange() {
        this.getSupplierByProduct();
    }
    getDataProduct() {

    }

    getSupplierByProduct() {

    }
    dropdownSupplierChange() {
    }
    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
