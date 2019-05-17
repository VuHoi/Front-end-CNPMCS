import { AfterViewInit, Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as _ from 'lodash';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { Paginator } from 'primeng/components/paginator/paginator';
import { Table } from 'primeng/components/table/table';
import { CreateOrEditSupplierCategoryModalComponent } from './create-or-edit-supplierCategory-modal/create-or-edit-supplierCategory-modal.component';
import { WebApiServiceProxy, IFilter } from '@shared/service-proxies/webapi.service';
import { NewSupDto, StatusEnum } from './dto/supplierCategory.dto';


@Component({
    selector: 'app-supplierCategory',
    templateUrl: './supplierCategory.component.html',
    styleUrls: ['./supplierCategory.component.css'],
    animations: [appModuleAnimation()]
})
export class SupplierCategoryComponent extends AppComponentBase implements AfterViewInit, OnInit {

    /**
     * @ViewChild là dùng get control và call thuộc tính, functions của control đó
     */
    @ViewChild('textsTable') textsTable: ElementRef;
    @ViewChild('createOrEditModal') createOrEditModal: CreateOrEditSupplierCategoryModalComponent;
    @ViewChild('dataTable') dataTable: Table;
    @ViewChild('paginator') paginator: Paginator;

    /**
     * tạo các biến dể filters
     */
    filterText: string;
    supplierCatalogCode = '';
    supplierCatalogName = '';
    public newPCDto: NewSupDto;
    public statusEnum = StatusEnum;
    public status = StatusEnum.All;
    public StatusList = [
        {
            id: StatusEnum.All,
            name: ''
        },
        {
            id: StatusEnum.Open,
            name: 'Open'
        },
        {
            id: StatusEnum.Close,
            name: 'Close'
        }
    ];

    public supplierCatalogFakes = [
        {
            id: 1,
            code: 'SA001',
            name: 'Stationery',
            note: 'Electronic products such as computers',
            status: 1
        },
        {
            id: 2,
            code: 'CE002',
            name: 'Electronice Device',
            note: 'Electronic products such as computers',
            status: 1
        },
        {
            id: 3,
            code: 'BM003',
            name: 'Building Materials',
            note: 'Electronic products such as computers',
            status: 2
        },
        {
            id: 4,
            code: 'MA004',
            name: 'Mobile',
            note: 'Electronic products such as computers',
            status: 1
        },
        {
            id: 5,
            code: 'WA005',
            name: 'Wooden',
            note: 'Electronic products such as computers',
            status: 2
        },
        {
            id: 6,
            code: 'FA006',
            name: 'Food And Drink',
            note: 'Electronic products such as computers',
            status: 1
        },
        {
            id: 7,
            code: 'VE007',
            name: 'Vehicle',
            note: 'Electronic products such as computers',
            status: 1
        },
        {
            id: 8,
            code: 'CS008',
            name: 'Cleaning Stuff',
            note: 'Electronic products such as computers',
            status: 2
        },
        {
            id: 9,
            code: 'TO009',
            name: 'Tool',
            note: 'Electronic products such as computers',
            status: 2
        },
        {
            id: 10,
            code: 'CS010',
            name: 'Costume',
            note: 'Electronic products such as computers',
            status: 1
        }
    ];

    // chỉ có những người có thẩm quyền mới đc phép close hay open ProductCatalog item,
    // những người đó có isRoleActionPC = true. Lúc đó UI sẽ hiển thị cho phép action
    public isRoleActionPC = false;


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
     * Hàm get danh sách SupplierCategory
     * @param event
     */
    getSupplierCategorys(event?: LazyLoadEvent) {
        if (!this.paginator || !this.dataTable) {
            return;
        }

        //show loading trong gridview
        this.primengTableHelper.showLoadingIndicator();

        /**
         * Sử dụng _apiService để call các api của backend
         */

        // this._apiService.get('api/MenuClient/GetMenuClientsByFilter',
        //     [{ fieldName: 'Name', value: this.filterText }],
        //     this.primengTableHelper.getSorting(this.dataTable),
        //     this.primengTableHelper.getMaxResultCount(this.paginator, event),
        //     this.primengTableHelper.getSkipCount(this.paginator, event),
        // ).subscribe(result => {
        //     this.primengTableHelper.totalRecordsCount = result.totalCount;
        //     this.primengTableHelper.records = result.items;
        //     this.primengTableHelper.hideLoadingIndicator();
        // });

        this.primengTableHelper.totalRecordsCount = 14;
        this.primengTableHelper.records = this.supplierCatalogFakes;
        this.primengTableHelper.hideLoadingIndicator();
    }

    init(): void {

        //get permission open/close PC item for this user:
        // nếu kq trả về true, nghĩa là đc phép action thì gán, để UI xuất hiện action
        this.isRoleActionPC = true;

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
        this._router.navigate(['app/gwebsite/supplierCategory', {
            filterText: this.filterText
        }]);

        if (this.paginator.getPage() !== 0) {
            this.paginator.changePage(0);
            return;
        }
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
        if (this.createOrEditModal.newProductCategory.code) {
            for (let i = 0; i < this.primengTableHelper.records.length; i++) {
                if (this.primengTableHelper.records[i].id === this.createOrEditModal.newProductCategory.code) {
                    this.primengTableHelper.records[i] = this.createOrEditModal.newProductCategory;
                    return;
                }
            }
        } else { this.reloadPage(); }
    }

    //hàm show view create SupplierCategory
    createSupplierCategory() {
        this.createOrEditModal.show();
    }

    public searchSupplierCatalog(): void {
        if ((this.supplierCatalogCode && this.supplierCatalogCode !== '')
            || (this.supplierCatalogName && this.supplierCatalogName !== '') ||
            (this.status && this.status !== StatusEnum.All)) {
            // luc nay moi search, gui xuong BE se filter theo like %name%, %code % va == status
            console.log(this.supplierCatalogCode + '__' + this.supplierCatalogName + '__' + this.status);
        }
    }

    //chỉ những người có permission mới đc phép thực thi action với PC
    public actionPCItem(id: number, row: any): void {
        if (this.isRoleActionPC) {
            //call api edit status close/open cho Product category này thông qua id truyền vào

            row.status = row.status === this.statusEnum.Open ? this.statusEnum.Close : this.statusEnum.Open;
        }

    }

    //chỉ những người có permission mới đc phép thực thi action với PC
    public removePcItem(id: number, row: any, index: number): void {
        if (this.isRoleActionPC) {
            //call api delete Product category này thông qua id truyền vào
            //remove xong load lai table

            // tạm thời UI ta chỉ xóa tạm list fake data đi
            this.supplierCatalogFakes.splice(index, 1);
        }
    }
}
