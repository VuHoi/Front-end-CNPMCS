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
import { DemoModelServiceProxy, SupplierServiceProxy, ProductsServiceProxy, PurchaseServiceProxy } from '@shared/service-proxies/service-proxies';
import { ProductComponent } from './product/product.component';
import { CreateOrEditProductModalComponent } from './product/create-or-edit-product-modal/create-or-edit-product-modal.component';
import { PlanComponent } from './plan/plan.component';
import { CreateOrEditPlanModalComponent } from './plan/create-or-edit-plan-modal/create-or-edit-plan-modal.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { CreateOrEditPurchaseModalComponent } from './purchase/create-or-edit-purchase-modal/create-or-edit-purchase-modal.component';
import { PurchaseHistoryComponent } from './purchaseHistory/purchaseHistory.component';
import { BudgetComponent } from './budget/budget.component';
import { SupplierComponent } from './supplier/supplier.component';
import { CreateOrEditSupplierComponent } from './supplier/create-or-edit-supplier/create-or-edit-supplier.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { BiddingComponent } from './product/bidding/bidding.component';
import { DropdownModule } from 'primeng/dropdown';
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
        InputMaskModule,
        MultiSelectModule,
        CalendarModule,
        DropdownModule
    ],
    declarations: [
        MenuClientComponent, CreateOrEditMenuClientModalComponent,
        ProductComponent, CreateOrEditProductModalComponent,
        PlanComponent, CreateOrEditPlanModalComponent, PurchaseComponent, CreateOrEditPurchaseModalComponent, PurchaseHistoryComponent,
        BudgetComponent,
        SupplierComponent,
        CreateOrEditSupplierComponent,
        BiddingComponent
    ],
    providers: [
        DemoModelServiceProxy,
        SupplierServiceProxy,
        ProductsServiceProxy,
        PurchaseServiceProxy
    ]
})
export class GWebsiteModule { }
