import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuClientComponent } from '@app/gwebsite/menu-client/menu-client.component';
import { ProductComponent } from './product/product.component';
import { PlanComponent } from './plan/plan.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { PurchaseHistoryComponent } from './purchaseHistory/purchaseHistory.component';
import { BudgetComponent } from './budget/budget.component';
import { SupplierComponent } from './supplier/supplier.component';

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
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class GWebsiteRoutingModule { }
