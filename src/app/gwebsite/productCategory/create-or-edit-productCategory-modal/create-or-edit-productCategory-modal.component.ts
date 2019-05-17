import { Component, ElementRef, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { WebApiServiceProxy } from '@shared/service-proxies/webapi.service';
import { ComboboxItemDto } from '@shared/service-proxies/service-proxies';
import { NewPCDto, StatusEnum } from '../dto/productCategory.dto';

@Component({
    selector: 'createOrEditProductCategoryModal',
    templateUrl: './create-or-edit-productCategory-modal.component.html',
    styleUrls: ['./create-or-edit-productCategory-modal.component.css']
})
export class CreateOrEditProductCategoryModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal') modal: ModalDirective;
    @ViewChild('productCategoryCombobox') productCategoryCombobox: ElementRef;
    @ViewChild('iconCombobox') iconCombobox: ElementRef;

    /**
     * @Output dùng để public event cho component khác xử lý
     */
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    public newProductCategory: NewPCDto;
    public pcCode = '';
    public pcName = '';
    public status = StatusEnum.Open;
    public statusEnum = StatusEnum;
    public isCheckStatus = false;

    constructor(
        injector: Injector,
        private _apiService: WebApiServiceProxy
    ) {
        super(injector);
    }

    show(): void {
        this.active = true;
        this.saving = false;

        // this._apiService.getForEdit('api/MenuClient/GetMenuClientForEdit', productCategoryId).subscribe(result => {
        //     this.productCategory = result.menuClient;
        //     this.productCategorys = result.menuClients;
        //     this.modal.show();
        //     setTimeout(() => {
        //             $(this.productCategoryCombobox.nativeElement).selectpicker('refresh');
        //     }, 0);
        // });

        this.modal.show();

    }

    save(): void {

        if (this.pcCode && this.pcCode !== '') {

            this.saving = true;

            let status = this.isCheckStatus ? StatusEnum.Open : StatusEnum.Close;

            this.newProductCategory = new NewPCDto(this.pcCode, this.pcName, status);

            console.log(this.newProductCategory.code + '--' + this.newProductCategory.name + this.newProductCategory.status);
            // this.insertProductCategory();

            // call api create product category theo code,nam,status
            // add xuống, id tự tạo

            //trước khi add nhớ check duplicat code.


            this.close();
        }
    }

    insertProductCategory() {
        this._apiService.post('api/MenuClient/CreateMenuClient', this.newProductCategory)
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
}
