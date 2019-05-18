import { Component, ElementRef, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { WebApiServiceProxy } from '@shared/service-proxies/webapi.service';
import { ComboboxItemDto } from '@shared/service-proxies/service-proxies';
import { SupplierCategoryDto, NewSupDto, StatusEnum } from '../dto/supplierCategory.dto';

@Component({
    selector: 'createOrEditSupplierCategoryModal',
    templateUrl: './create-or-edit-supplierCategory-modal.component.html',
    styleUrls: ['./create-or-edit-supplierCategory-modal.component.css']
})
export class CreateOrEditSupplierCategoryModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal') modal: ModalDirective;
    @ViewChild('supplierCategoryCombobox') supplierCategoryCombobox: ElementRef;
    @ViewChild('iconCombobox') iconCombobox: ElementRef;

    /**
     * @Output dùng để public event cho component khác xử lý
     */
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    public newSupplierCategory: NewSupDto;
    public pcCode = '';
    public pcName = '';
    public pcNote = '';
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

        this.isCheckStatus = false;
        this.pcCode = '';
        this.pcName = '';
        this.pcNote = '';

        // this._apiService.getForEdit('api/MenuClient/GetMenuClientForEdit', supplierCategoryId).subscribe(result => {
        //     this.supplierCategory = result.menuClient;
        //     this.supplierCategorys = result.menuClients;
        //     this.modal.show();
        //     setTimeout(() => {
        //         $(this.supplierCategoryCombobox.nativeElement).selectpicker('refresh');
        //     }, 0);
        // });

        this.modal.show();
    }

    save(): void {

        if (this.pcCode && this.pcCode !== '') {

            this.saving = true;

            let status = this.isCheckStatus ? StatusEnum.Open : StatusEnum.Close;

            this.newSupplierCategory = new NewSupDto(this.pcCode, this.pcName, status, this.pcNote);

            console.log(this.newSupplierCategory.code + '--' + this.newSupplierCategory.name
                + '--' + this.newSupplierCategory.status + '--' + this.newSupplierCategory.note);

            // this.insertSupplierCategory();

            // call api create product category theo code,nam,status
            // add xuống, id tự tạo

            //trước khi add nhớ check duplicat code.


            this.close();
        }
    }

    insertSupplierCategory() {
         this._apiService.post('api/MenuClient/CreateMenuClient', this.newSupplierCategory)
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
