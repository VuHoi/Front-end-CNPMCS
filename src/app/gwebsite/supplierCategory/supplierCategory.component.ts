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

    //get all supplier catalog
    // chú ý: có get số supplier đc reference đến supplier catalog, mục đích để kiểm tra nếu SC đã tồn tại
    // supplier rồi thì ko đc close hoặc remove.
    // khi count supplier > 0 thì respone lên isInCludeSupplier = true
    // chỉ đc phép close hoặc remove những SC có isInCludeSupplier: false

    //status: 2(close) nghĩa là đang ko ref sup nào, lúc này fakes data ép buộc set isInCludeSupplier = false
    public supplierCatalogFakes = [
        {
            id: 1,
            code: 'SA001',
            name: 'Stationery',
            note: 'Electronic products such as computers',
            status: 2,
            isInCludeSupplier: false
        },
        {
            id: 2,
            code: 'CE002',
            name: 'Electronice Device',
            note: 'Electronic products such as computers',
            status: 1,
            isInCludeSupplier: false
        }
    ];

    // chỉ có những người có thẩm quyền mới đc phép close hay open ProductCatalog item,
    // những người đó có isRoleActionPC = true. Lúc đó UI sẽ hiển thị cho phép action
    public isRoleActionPC = false;

    public myConfigStyleHeader: any = {
        'font-size': '11px'
    };

    public myConfigStyle: any = {
        'font-size': '11px'
    };

    public header;


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
        //get permission open/close PC item for this user:
        // nếu kq trả về true, nghĩa là đc phép action thì gán, để UI xuất hiện action
        this.isRoleActionPC = true;
    }

    /**
     * Hàm xử lý sau khi View được init
     */
    ngAfterViewInit(): void {
        setTimeout(() => {
            // this.init();
            // this.getSupplierCategorys();
        });
    }

    /**
     * onScrollX
     * @param event
     */
    public onScrollX(event): void {
        this.myConfigStyleHeader = {
            ...this.myConfigStyle,
            left: this.header ? `${this.header.getBoundingClientRect().left}px` : 'auto'
        };
    }


    /**
     * Hàm get danh sách SupplierCategory
     * @param event
     */
    getSupplierCategorys(event?: LazyLoadEvent, event2?: Event) {
        if (!this.paginator || !this.dataTable) {
            return;
        }
        //show loading trong gridview
        this.primengTableHelper.showLoadingIndicator();

        if (!this.supplierCatalogCode || this.supplierCatalogCode === '') {
            this.supplierCatalogCode = '';
        }
        if (!this.supplierCatalogName || this.supplierCatalogName === '') {
            this.supplierCatalogName = '';
        }
        if (this.status) {
            this.status = +this.status;
        }
        if (!this.status || (this.status !== StatusEnum.Open && this.status !== StatusEnum.Close)) {
            this.status = StatusEnum.All;
        }
        /**
         * Sử dụng _apiService để call các api của backend
         */
        this._apiService.get('api/Supplier/GetSupplierTypesWithFilter',
            [
                { fieldName: 'code', value: this.supplierCatalogCode },
                { fieldName: 'name', value: this.supplierCatalogName },
                { fieldName: 'status', value: this.status }
            ],
            this.primengTableHelper.getSorting(this.dataTable),
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event),
        ).subscribe(result => {
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.records.forEach((item) => {
                item.isEdit = false;
            });
            this.primengTableHelper.hideLoadingIndicator();
        });
        event2.preventDefault();
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
        if (this.createOrEditModal.newSupplierCategory.code) {
            for (let i = 0; i < this.primengTableHelper.records.length; i++) {
                if (this.primengTableHelper.records[i].id === this.createOrEditModal.newSupplierCategory.code) {
                    this.primengTableHelper.records[i] = this.createOrEditModal.newSupplierCategory;
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
    public editItem(id: number, row: any): void {
        if (this.isRoleActionPC && row.name && row.name !== '') {
            //call api edit name, note cho Product category này thông qua id truyền vào

            // vì bên html đã tự [(ngModel)] vào row.name và row.note rồi, nên ở đây ta chỉ cần lấy ra giá trị để update
            console.log(id + '---' + row.name + '---' + row.note);

            //save thành công
            row.isEdit = false;
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
