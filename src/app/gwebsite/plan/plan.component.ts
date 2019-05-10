import { AfterViewInit, Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as _ from 'lodash';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { Paginator } from 'primeng/components/paginator/paginator';
import { Table } from 'primeng/components/table/table';
import { CreateOrEditPlanModalComponent } from './create-or-edit-plan-modal/create-or-edit-plan-modal.component';
import { WebApiServiceProxy, IFilter } from '@shared/service-proxies/webapi.service';
import { ApprovalStatusEnum } from './dto/plan.dto';

@Component({
    selector: 'app-plan',
    templateUrl: './plan.component.html',
    styleUrls: ['./plan.component.css'],
    animations: [appModuleAnimation()]
})
export class PlanComponent extends AppComponentBase implements AfterViewInit, OnInit {

    /**
     * @ViewChild là dùng get control và call thuộc tính, functions của control đó
     */
    @ViewChild('textsTable') textsTable: ElementRef;
    @ViewChild('createOrEditModal') createOrEditModal: CreateOrEditPlanModalComponent;
    @ViewChild('dataTable') dataTable: Table;
    @ViewChild('paginator') paginator: Paginator;

    /**
     * tạo các biến dể filters
     */
    public filterText: string;
    public approvalStatus = 3; // all status
    public ApprovalStatusList = [
        {
            id: ApprovalStatusEnum.AllStatus,
            name: 'All Status'
        },
        {
            id: ApprovalStatusEnum.Approved,
            name: 'Approved'
        },
        {
            id: ApprovalStatusEnum.AwaitingApproval,
            name: 'Awaiting Approval'
        }
    ];

    public UnitCodeList = ['HN', 'HP', 'DN', 'TPHCM', 'CT'];
    public unitCode = this.UnitCodeList[0];

    public DepartmentCodeList = ['IT', 'HR', 'Acco', 'Mark', 'Sale', 'PR'];
    public deparmentCode = this.DepartmentCodeList[0];

    constructor(
        injector: Injector,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _apiService: WebApiServiceProxy
    ) {
        super(injector);
    }

    /**
     * Hàm xử lý trước khi View được init
     */
    ngOnInit(): void {
    }

    /**
     * Hàm xử lý sau khi View được init
     */
    ngAfterViewInit(): void {
        setTimeout(() => {
            this.init();
        });
    }

    /**
     * Hàm get danh sách Plan
     * @param event
     */
    getPlans(event?: LazyLoadEvent) {
        if (!this.paginator || !this.dataTable) {
            return;
        }

        //show loading trong gridview
        this.primengTableHelper.showLoadingIndicator();

        /**
         * Sử dụng _apiService để call các api của backend
         */

        // tiennnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn
        this._apiService.get('api/MenuClient/GetMenuClientsByFilter',
            [{ fieldName: 'Name', value: this.filterText }],
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event),
        ).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    init(): void {
        //get params từ url để thực hiện filter
        this._activatedRoute.params.subscribe((params: Params) => {
            this.filterText = params['filterText'] || '';
            //reload lại gridview
            this.reloadPage();
        });
    }

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    applyFilters(): void {
        //truyền params lên url thông qua router
        // this._router.navigate(['app/gwebsite/plan', {
        //     filterText: this.filterText
        // }]);

        // if (this.paginator.getPage() !== 0) {
        //     this.paginator.changePage(0);
        //     return;
        // }
        console.log('Approved 1');
    }

    /**
     * Tạo pipe thay vì tạo từng hàm truncate như thế này
     * @param text
     */
    truncateString(text): string {
        return abp.utils.truncateStringWithPostfix(text, 32, '...');
    }

    //Refresh grid khi thực hiện create or edit thành công
    refreshValueFromModal(): void {
        if (this.createOrEditModal.plan.id) {
            for (let i = 0; i < this.primengTableHelper.records.length; i++) {
                if (this.primengTableHelper.records[i].id === this.createOrEditModal.plan.id) {
                    this.primengTableHelper.records[i] = this.createOrEditModal.plan;
                    return;
                }
            }
        } else { this.reloadPage(); }
    }

    //hàm show view create Plan
    createPlan() {
        this.createOrEditModal.show();
    }
    public SearchPlan(): void {
        console.log(this.approvalStatus + '__' + this.unitCode);
    }

    public ViewPlanDetail(planId: number): void {
        this._router.navigate(['app/gwebsite/plan', planId]);
    }
}
