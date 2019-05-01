import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, Injector } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { ProductsServiceProxy, SupplierSavedDto, Bidding, BiddingSaved, SupplierServiceProxy } from '@shared/service-proxies/service-proxies';
import { AppComponentBase } from '@shared/common/app-component-base';
import { SelectItem } from 'primeng/primeng';

@Component({
    selector: 'app-create-or-edit-supplier',
    templateUrl: './create-or-edit-supplier.component.html',
    styleUrls: ['./create-or-edit-supplier.component.css']
})
export class CreateOrEditSupplierComponent extends AppComponentBase {
    @ViewChild('createOrEditModal') modal: ModalDirective;
    @ViewChild('purchaseCombobox') purchaseCombobox: ElementRef;
    @ViewChild('iconCombobox') iconCombobox: ElementRef;

    /**
     * @Output dùng để public event cho component khác xử lý
     */
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    supplier: SupplierSavedDto = new SupplierSavedDto();
    biddings: any[] = [];
    productId = '';
    selectItems: SelectItem[];
    rangeDates: Date[];
    constructor(
        injector: Injector,
        private _productsServiceProxy: ProductsServiceProxy,
        private _supplierServiceProxy: SupplierServiceProxy
    ) {
        super(injector);
        this.getDataProduct();

    }

    show(supplier?: any | null | undefined): void {
        this.active = true;
        this.supplier = supplier ? supplier : null;
        this.modal.show();
    }

    save(): void {

        var input = this.supplier;
        this.saving = true;
        if (input.id) {
            this.updatePurchase();
        } else {
            this.insertPurchase();
        }
    }
    getDataProduct() {
        this._productsServiceProxy.getProducts().subscribe(products => {
            this.selectItems = [];
            products.items.map(i => this.selectItems.push({ value: { id: i.id }, label: i.name }))
        });
    }
    insertPurchase() {
        var input = this.supplier;
        input.biddings = [];
        this.biddings.map(item => {
            const startDate = item.ranges ? item.ranges[0] : new Date();
            const endDate = item.ranges ? item.ranges[1] ? item.ranges[1] : new Date() : new Date();
            input.biddings.push(new BiddingSaved({
                startDate, endDate,
                status: 0, productId: item.id, supplierId: input.id
            }));
        })

        this._supplierServiceProxy.createSupplier(input).subscribe(item => console.log(item), err => console.log(err));
    }

    updatePurchase() {
        var input = this.supplier;
        input.biddings = [];
        this.biddings.map(item => {
            const startDate = item.ranges ? item.ranges[0] : new Date();
            const endDate = item.ranges ? item.ranges[1] ? item.ranges[1] : new Date() : new Date();
            input.biddings.push(new BiddingSaved({
                startDate, endDate,
                status: 0, productId: item.id, supplierId: input.id
            }));
        })

        this._supplierServiceProxy.updateSupplier(input).subscribe(item => {
            this.close();
            this.modalSave.emit(null);
        }, err => console.log(err));
    }
    onChangeOptionProduct() {
        console.log('sss', this.biddings);
    }
    close(): void {
        this.active = false;
        this.modal.hide();
    }
}
