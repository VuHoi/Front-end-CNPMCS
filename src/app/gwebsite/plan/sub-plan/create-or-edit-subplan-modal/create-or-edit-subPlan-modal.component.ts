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

    //because 'create' will create new product for this plan
    //=> get all productCodes not assigned for this plan
    //results include: productCode, productName, CalUnit
    public productsNotAssignThisPlan = [
        {
            productCode: 'F001',
            productName: 'Computer Screen',
            calUnit: 'Int',
            unitPrice: 20000
        },
        {
            productCode: 'F002',
            productName: 'Computer CPU',
            calUnit: 'Int',
            unitPrice: 50000
        },
        {
            productCode: 'G001',
            productName: 'Fridge',
            calUnit: 'Int',
            unitPrice: 30000
        },
        {
            productCode: 'G002',
            productName: 'Water Purifier',
            calUnit: 'Int',
            unitPrice: 40000
        }
    ];

    public productCodeList = [];
    public productNameList = [];
    public ProductCalUnitList = [];
    public productUnitPriceList = [];

    public productCode = '';
    public productName = '';
    public productCalUnit = '';
    public productUnitPrice = 0;

    constructor(
        injector: Injector,
        private _apiService: WebApiServiceProxy
    ) {
        super(injector);
    }

    show(planId: number): void {

        // this._apiService.get('api/Products/GetProducts').subscribe(result => {
        //     this.products = result.items;
        //     this.modal.show();
        //     setTimeout(() => {
        //         $(this.subPlanCombobox.nativeElement).selectpicker('refresh');
        //     }, 0);
        // });

        // get all productCodes not assigned for this plan
        // by planId
        if (planId) {
            // this._apiService.getForEdit('api/MenuClient/GetMenuClientForEdit', planId).subscribe(result => {
            //     this.productsNotAssignThisPlan = result.products;
            //     this.modal.show();
            //     setTimeout(() => {
            //         $(this.subPlanCombobox.nativeElement).selectpicker('refresh');
            //     }, 0);
            // });

            this.productsNotAssignThisPlan.forEach((item, i) => {
                this.productCodeList.push(item.productCode);
                this.productNameList.push(item.productName);
                this.ProductCalUnitList.push(item.calUnit);
                this.productUnitPriceList.push(item.unitPrice);
            });

            this.productCode = this.productCodeList[0];
            this.productName = this.productNameList[0];
            this.productCalUnit = this.ProductCalUnitList[0];
            this.productUnitPrice = this.productUnitPriceList[0];

            this.modal.show();
            this.active = true;
        }
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

        console.log(this.productCode);
    }
}
