import { Component, ElementRef, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { WebApiServiceProxy } from '@shared/service-proxies/webapi.service';
import { ComboboxItemDto, ProductSavedDto } from '@shared/service-proxies/service-proxies';
// import { ProductServiceProxy } from '@shared/service-proxies/service-proxies';
import { ProductDto, ApprovalStatusEnum, NewPJDto } from '../dto/product.dto';
import * as moment from 'moment';

@Component({
    selector: 'createOrEditProductModal',
    templateUrl: './create-or-edit-product-modal.component.html',
    styleUrls: ['./create-or-edit-product-modal.component.css']
})
export class CreateOrEditProductModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal') modal: ModalDirective;
    // @ViewChild('productCombobox') productCombobox: ElementRef;
    @ViewChild('iconCombobox') iconCombobox: ElementRef;

    /**
     * @Output dùng để public event cho component khác xử lý
     */
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;
    checked: boolean;
    product: ProductDto = new ProductDto();
    products: ComboboxItemDto[] = [];

    public pjCode = '';
    public pjName = '';
    public pjCreateDate = '';
    public pjActiveDate = '';
    public isCheckActive = false;
    public statusEnum = ApprovalStatusEnum;
    public newProduct: NewPJDto;

    constructor(
        injector: Injector,
        // private _apiService: ProductServiceProxy
    ) {
        super(injector);
    }

    show(productId?: number | null | undefined): void {
        this.active = true;
        this.saving = false;

        this.pjCode = '';
        this.pjName = '';
        this.isCheckActive = false;

        let now = new Date();
        this.pjCreateDate = moment(now).format('DD/MM/YYYY');

        this.modal.show();
    }

    save(): void {
        if (this.pjCode && this.pjCode !== '' && this.pjName && this.pjName !== '') {
            this.saving = true;

            let status = this.isCheckActive ? this.statusEnum.Active : this.statusEnum.Inactive;

            this.newProduct = new NewPJDto(this.pjCode, this.pjName, status);

            console.log(this.newProduct.code + '--' + this.newProduct.name
                + '--' + this.newProduct.status);

            // this.insertProduct();

            // call api create product category theo code,nam,status
            // add xuống, id tự tạo

            //trước khi add nhớ check duplicat code.
            // this._apiService.createProductAsync(new ProductSavedDto({ code: this.pjCode, name: this.pjName, status: this.checked ? 1 : 2 })).subscribe(item => console.log(item));

            this.close();
        }
    }


    close(): void {
        this.active = false;
        this.modal.hide();
    }

    handleChange() {
        this.isCheckActive = true;
        this.pjActiveDate = this.pjCreateDate;
    }
    activeNewPrj(event: Event): void {
        if (this.isCheckActive) {
            this.pjActiveDate = this.pjCreateDate;
        }
    }
}
