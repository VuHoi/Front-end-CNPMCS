import { CustomerServiceProxy } from './../../shared/service-proxies/service-proxies';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { FileUploadModule } from 'ng2-file-upload';
import { ModalModule, PopoverModule, TabsModule, TooltipModule } from 'ngx-bootstrap';
import { AutoCompleteModule, EditorModule, FileUploadModule as PrimeNgFileUploadModule, InputMaskModule, PaginatorModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { GWebsiteRoutingModule } from './gwebsite-routing.module';

import { MenuClientComponent, CreateOrEditMenuClientModalComponent } from './index';
import { DemoModelServiceProxy } from '@shared/service-proxies/service-proxies';
import { ProductCategoryComponent } from './productCategory/productCategory.component';
import { CreateOrEditProductCategoryModalComponent } from './productCategory/create-or-edit-productCategory-modal/create-or-edit-productCategory-modal.component';
import { ProductComponent } from './product/product.component';
import { CreateOrEditProductModalComponent } from './product/create-or-edit-product-modal/create-or-edit-product-modal.component';
import { PlanComponent } from './plan/plan.component';
import { CreateOrEditPlanModalComponent } from './plan/create-or-edit-plan-modal/create-or-edit-plan-modal.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { CreateOrEditPurchaseModalComponent } from './purchase/create-or-edit-purchase-modal/create-or-edit-purchase-modal.component';
import { PurchaseHistoryComponent } from './purchaseHistory/purchaseHistory.component';
import { BudgetComponent } from './budget/budget.component';
import { SupplierComponent } from './supplier/supplier.component';
import { CreateOrEditSupplierModalComponent } from './supplier/create-or-edit-supplier-modal/create-or-edit-supplier-modal.component';
import { SupplierCategoryComponent } from './supplierCategory/supplierCategory.component';
import { CreateOrEditSupplierCategoryModalComponent } from './supplierCategory/create-or-edit-supplierCategory-modal/create-or-edit-supplierCategory-modal.component';



@NgModule({
    imports: [
        FormsModule,
        NgSelectModule,
        CommonModule,
        FileUploadModule,
        ModalModule.forRoot(),
        TabsModule.forRoot(),
        TooltipModule.forRoot(),
        PopoverModule.forRoot(),
        GWebsiteRoutingModule,
        UtilsModule,
        AppCommonModule,
        TableModule,
        PaginatorModule,
        PrimeNgFileUploadModule,
        AutoCompleteModule,
        EditorModule,
        InputMaskModule
    ],
    declarations: [
        MenuClientComponent, CreateOrEditMenuClientModalComponent,
        ProductComponent, CreateOrEditProductModalComponent,
        PlanComponent, CreateOrEditPlanModalComponent, PurchaseComponent, CreateOrEditPurchaseModalComponent,  PurchaseHistoryComponent,
        BudgetComponent, ProductCategoryComponent, CreateOrEditProductCategoryModalComponent, SupplierComponent, CreateOrEditSupplierModalComponent,
        SupplierCategoryComponent, CreateOrEditSupplierCategoryModalComponent
    ],
    providers: [
        DemoModelServiceProxy,
        CustomerServiceProxy
    ]
})
export class GWebsiteModule { }
