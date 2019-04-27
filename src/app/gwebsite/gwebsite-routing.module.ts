import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuClientComponent } from '@app/gwebsite/menu-client/menu-client.component';
import { DemoModelComponent } from './demo-model/demo-model.component';
import { CustomerComponent } from './customer/customer.component';
import { ProductComponent } from './product/product.component';
import { PlanComponent } from './plan/plan.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { PurchaseHistoryComponent } from './purchaseHistory/purchaseHistory.component';
import { BudgetComponent } from './budget/budget.component';

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
                        path: 'demo-model', component: DemoModelComponent,
                        data: { permission: 'Pages.Administration.DemoModel' }
                    },
                ]
            },
            {
                path: '',
                children: [
                    {
                        path: 'customer', component: CustomerComponent,
                        data: { permission: 'Pages.Administration.Customer' }
                    },
                ]
            },
            {
                path: '',
                children: [
                    {
                        path: 'product', component: ProductComponent,
                        //tiennnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn
                        data: { permission: 'Pages.Administration.MenuClient' }
                    },
                ]
            },
            {
                path: '',
                children: [
                    {
                        path: 'plan', component: PlanComponent,
                        //tiennnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn
                        data: { permission: 'Pages.Administration.MenuClient' }
                    },
                ]
            },
            {
                path: '',
                children: [
                    {
                        path: 'purchase', component: PurchaseComponent,
                        //tiennnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn
                        data: { permission: 'Pages.Administration.MenuClient' }
                    },
                ]
            },
            {
                path: '',
                children: [
                    {
                        path: 'purchase-history', component: PurchaseHistoryComponent,
                        //tiennnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn
                        data: { permission: 'Pages.Administration.MenuClient' }
                    },
                ]
            },
            {
                path: '',
                children: [
                    {
                        path: 'budget', component: BudgetComponent,
                        //tiennnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn
                        data: { permission: 'Pages.Administration.MenuClient' }
                    },
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class GWebsiteRoutingModule { }
