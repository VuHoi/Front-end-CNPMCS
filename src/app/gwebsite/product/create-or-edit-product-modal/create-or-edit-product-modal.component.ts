import { Component, ElementRef, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { WebApiServiceProxy } from '@shared/service-proxies/webapi.service';
import { ComboboxItemDto } from '@shared/service-proxies/service-proxies';
import { ProductDto, ApprovalStatusEnum, NewPJDto } from '../dto/product.dto';
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

    /**
     * @Output dùng để public event cho component khác xử lý
     */
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

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
        private _apiService: WebApiServiceProxy
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

        this._apiService.getForEdit('api/MenuClient/GetMenuClientForEdit', productId).subscribe(result => {
            this.product = result.menuClient;
            this.products = result.menuClients;
            this.modal.show();
            setTimeout(() => {
                $(this.productCombobox.nativeElement).selectpicker('refresh');
            }, 0);
        });
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


            this.close();
        }
    }

    insertProduct() {
        // tiennnnnnnnnnnnnnnnnnnnnnnnnnnnn
        this._apiService.post('api/MenuClient/CreateMenuClient', this.product)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
            });
    }

    updateProduct() {
        // tiennnnnnnnnnnnnnnnnnnnnnnnnnnnn
        this._apiService.put('api/MenuClient/UpdateMenuClient', this.product)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
            });
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }

    activeNewPrj(event: Event): void {
        if (this.isCheckActive) {
            this.pjActiveDate = this.pjCreateDate;
        }
    }
}
