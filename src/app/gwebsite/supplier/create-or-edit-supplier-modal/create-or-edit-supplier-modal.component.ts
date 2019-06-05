import { Component, ElementRef, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { WebApiServiceProxy } from '@shared/service-proxies/webapi.service';
import { ComboboxItemDto } from '@shared/service-proxies/service-proxies';
import { SupplierDto } from '../dto/supplier.dto';

@Component({
    selector: 'createOrEditSupplierModal',
    templateUrl: './create-or-edit-supplier-modal.component.html',
    styleUrls: ['./create-or-edit-supplier-modal.component.css']
})
export class CreateOrEditSupplierModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal') modal: ModalDirective;
    @ViewChild('supplierCombobox') supplierCombobox: ElementRef;
    @ViewChild('iconCombobox') iconCombobox: ElementRef;

    /**
     * @Output dùng để public event cho component khác xử lý
     */
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    supplier: SupplierDto = new SupplierDto();
    suppliers: ComboboxItemDto[] = [];

    constructor(
        injector: Injector,
        private _apiService: WebApiServiceProxy
    ) {
        super(injector);
    }

    show(supplierId?: number | null | undefined): void {
        this.active = true;

        this._apiService.getForEdit('api/MenuClient/GetMenuClientForEdit', supplierId).subscribe(result => {
            // tiennnnnnnnnnnnnnnnnnnnnnnnnnnnn
            this.supplier = result.menuClient;
            this.suppliers = result.menuClients;
            this.modal.show();
            setTimeout(() => {
                $(this.supplierCombobox.nativeElement).selectpicker('refresh');
            }, 0);
        });
    }

    save(): void {
        let input = this.supplier;
        this.saving = true;
        if (input.id) {
            this.updateSupplier();
        } else {
            this.insertSupplier();
        }
    }

    insertSupplier() {
        // tiennnnnnnnnnnnnnnnnnnnnnnnnnnnn
        this._apiService.post('api/MenuClient/CreateMenuClient', this.supplier)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
            });
    }

    updateSupplier() {
        // tiennnnnnnnnnnnnnnnnnnnnnnnnnnnn
        this._apiService.put('api/MenuClient/UpdateMenuClient', this.supplier)
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
