import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuClientComponent } from '@app/gwebsite/menu-client/menu-client.component';
import { ProductComponent } from './product/product.component';
import { ProductCategoryComponent } from './productCategory/productCategory.component';
import { PlanComponent } from './plan/plan.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { PurchaseHistoryComponent } from './purchaseHistory/purchaseHistory.component';
import { BudgetComponent } from './budget/budget.component';
import { SupplierComponent } from './supplier/supplier.component';
import { SupplierCategoryComponent } from './supplierCategory/supplierCategory.component';
import { ProjectComponent } from './project/project.component';
import { BidProfileComponent } from './bids/bidProfile.component';
import { PurchaseContractComponent } from './purchaseContract/purchaseContract.component';
import { PurchaseOrderComponent } from './purchaseOrder/purchaseOrder.component';
import { SubmissionComponent } from './submission/submission.component';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    {
                        path: 'menu-client', component: MenuClientComponent,
                        data: { permission: 'Pages.Administration.MenuClient' }
                    },
                ]
            },
            {
                path: '',
                children: [
                    {
                        path: 'supplier-category', component: SupplierCategoryComponent,
                        //tiennnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn
                        data: { permission: 'Pages.Administration.MenuClient' }
                    },
                ]
            },
            {
                path: '',
                children: [
                    {
                        path: 'supplier', component: SupplierComponent,
                        data: { permission: 'Pages.Administration.MenuClient' }
                    },
                ]
            },
            {
                path: '',
                children: [
                    {
                        path: 'product-category', component: ProductCategoryComponent,
                        data: { permission: 'Pages.Administration.MenuClient' }
                    },
                ]
            },
            {
                path: '',
                children: [

                    {
                        path: 'product', component: ProductComponent,
                        data: { permission: 'Pages.Administration.MenuClient' }
                    },
                    {
                        path: 'plan', component: PlanComponent,
                        data: { permission: 'Pages.Administration.MenuClient' }
                    },
                    {
                        path: 'purchase', component: PurchaseComponent,
                        data: { permission: 'Pages.Administration.MenuClient' }
                    },
                    {
                        path: 'supplier', component: SupplierComponent,
                        data: { permission: 'Pages.Administration.MenuClient' }
                    },
                    {
                        path: 'purchase-history', component: PurchaseHistoryComponent,
                        data: { permission: 'Pages.Administration.MenuClient' }
                    },
                    {
                        path: 'budget', component: BudgetComponent,
                        data: { permission: 'Pages.Administration.MenuClient' }
                    },
                ]
            },
            {
                path: '',
                children: [
                    {
                        path: 'project', component: ProjectComponent,
                        data: { permission: 'Pages.Administration.MenuClient' }
                    },
                ]
            },
            {
                path: '',
                children: [
                    {
                        path: 'bidProfile', component: BidProfileComponent,
                        data: { permission: 'Pages.Administration.MenuClient' }
                    },
                ]
            },
            {
                path: '',
                children: [
                    {
                        path: 'purchaseContract', component: PurchaseContractComponent,
                        data: { permission: 'Pages.Administration.MenuClient' }
                    },
                ]
            },
            {
                path: '',
                children: [
                    {
                        path: 'purchaseOrder', component: PurchaseOrderComponent,
                        data: { permission: 'Pages.Administration.MenuClient' }
                    },
                ]
            },
            {
                path: '',
                children: [
                    {
                        path: 'submission', component: SubmissionComponent,
                        data: { permission: 'Pages.Administration.MenuClient' }
                    },
                ]
            },
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class GWebsiteRoutingModule { }
