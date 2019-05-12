import { Component, ElementRef, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { WebApiServiceProxy } from '@shared/service-proxies/webapi.service';
import { ComboboxItemDto } from '@shared/service-proxies/service-proxies';
import { SubPlanDto, PurchaseProducts, StatusEnum } from '../../dto/plan.dto';

@Component({
    selector: 'createOrEditSubPlanModal',
    templateUrl: './create-or-edit-subPlan-modal.component.html',
    styleUrls: ['./create-or-edit-subPlan-modal.component.css']
})
export class CreateOrEditSubPlanModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal') modal: ModalDirective;
    @ViewChild('subPlanCombobox') subPlanCombobox: ElementRef;
    @ViewChild('iconCombobox') iconCombobox: ElementRef;

    /**
     * @Output dùng để public event cho component khác xử lý
     */
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    isEdit = false;

    subPlan: SubPlanDto = new SubPlanDto();
    purchaseProducts: PurchaseProducts = new PurchaseProducts();
    products: ComboboxItemDto[] = [];

    public statusData = [
        {
            id: StatusEnum.Draft,
            name: 'Draft'
        },
        {
            id: StatusEnum.Official,
            name: 'Official '
        }
    ];

    constructor(
        injector: Injector,
        private _apiService: WebApiServiceProxy
    ) {
        super(injector);
    }

    show(subPlanId?: number | null | undefined): void {
        this._apiService.get('api/Products/GetProducts').subscribe(result => {
            this.products = result.items;
            this.modal.show();
            setTimeout(() => {
                $(this.subPlanCombobox.nativeElement).selectpicker('refresh');
            }, 0);
        });

        if (subPlanId) {
            this._apiService.getForEdit('api/MenuClient/GetMenuClientForEdit', subPlanId).subscribe(result => {
                // tiennnnnnnnnnnnnnnnnnnnnnnnnnnnn
                this.subPlan = result.menuClient;
                this.modal.show();
                setTimeout(() => {
                    $(this.subPlanCombobox.nativeElement).selectpicker('refresh');
                }, 0);
            });

            this.isEdit = true;
        } else {
            this.subPlan.id = 0;
            this.subPlan.comment = '';
            this.subPlan.departmentId = 0;
            this.subPlan.status = 1;
            this.purchaseProducts.quantity = 0;
            this.purchaseProducts.productId = 0;
            this.subPlan.purchaseProducts = this.purchaseProducts;
        }

        this.active = true;
    }

    save(): void {
        let input = this.subPlan;
        this.saving = true;
        if (input.id) {
            this.updateSubPlan();
        } else {
            this.insertSubPlan();
        }
    }

    insertSubPlan() {
        // tiennnnnnnnnnnnnnnnnnnnnnnnnnnnn
        this._apiService.post('api/Purchase/CreatePurchase', this.subPlan)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
            });
    }

    updateSubPlan() {
        // tiennnnnnnnnnnnnnnnnnnnnnnnnnnnn
        this._apiService.put('api/MenuClient/UpdateMenuClient', this.subPlan)
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
