import { AfterViewInit, Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as _ from 'lodash';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { Paginator } from 'primeng/components/paginator/paginator';
import { Table } from 'primeng/components/table/table';
import { CreateOrEditProductCategoryModalComponent } from './create-or-edit-productCategory-modal/create-or-edit-productCategory-modal.component';
import { WebApiServiceProxy, IFilter } from '@shared/service-proxies/webapi.service';
import { StatusEnum } from './dto/productCategory.dto';

@Component({
    selector: 'app-productCategory',
    templateUrl: './productCategory.component.html',
    styleUrls: ['./productCategory.component.css'],
    animations: [appModuleAnimation()]
})
export class ProductCategoryComponent extends AppComponentBase implements AfterViewInit, OnInit {

    /**
     * @ViewChild là dùng get control và call thuộc tính, functions của control đó
     */
    @ViewChild('textsTable') textsTable: ElementRef;
    @ViewChild('createOrEditModal') createOrEditModal: CreateOrEditProductCategoryModalComponent;
    @ViewChild('dataTable') dataTable: Table;
    @ViewChild('paginator') paginator: Paginator;


    // chỉ có những người có thẩm quyền mới đc phép close hay open ProductCatalog item,
    // những người đó có isRoleActionPC = true. Lúc đó UI sẽ hiển thị cho phép action
    public isRoleActionPC = false;

    filterText: string;
    public productCatalogCode = '';
    public productCatalogName = '';
    public status = StatusEnum.All;
    public statusEnum = StatusEnum;
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


    //Supplier, tương tự với product
    //get all supplier catalog
    // chú ý: có get số supplier đc reference đến supplier catalog, mục đích để kiểm tra nếu SC đã tồn tại
    // supplier rồi thì ko đc close hoặc remove.
    // khi count supplier > 0 thì respone lên isInCludeSupplier = true
    // chỉ đc phép close hoặc remove những SC có isInCludeSupplier: false

    //status: 2(close) nghĩa là đang ko ref sup nào, lúc này fakes data ép buộc set isInCludeSupplier = false
    public productCatalogFakes = [
        {
            id: 1,
            code: 'SA001',
            name: 'Stationery',
            note: 'Electronic products such as computers',
            status: 1,
            isInCludeProduct: true
        },
        {
            id: 2,
            code: 'CE002',
            name: 'Electronice Device',
            note: 'Electronic products such as computers',
            status: 1,
            isInCludeProduct: false
        },
        {
            id: 3,
            code: 'BM003',
            name: 'Building Materials',
            note: 'Electronic products such as computers',
            status: 2,
            isInCludeProduct: false
        },
        {
            id: 4,
            code: 'MA004',
            name: 'Mobile',
            note: 'Electronic products such as computers',
            status: 1,
            isInCludeProduct: true
        },
        {
            id: 5,
            code: 'WA005',
            name: 'Wooden',
            note: 'Electronic products such as computers',
            status: 2,
            isInCludeProduct: false
        },
        {
            id: 6,
            code: 'FA006',
            name: 'Food And Drink',
            note: 'Electronic products such as computers',
            status: 1,
            isInCludeProduct: false
        },
        {
            id: 7,
            code: 'VE007',
            name: 'Vehicle',
            note: 'Electronic products such as computers',
            status: 1,
            isInCludeProduct: true
        },
        {
            id: 8,
            code: 'CS008',
            name: 'Cleaning Stuff',
            note: 'Electronic products such as computers',
            status: 2,
            isInCludeProduct: false
        },
        {
            id: 9,
            code: 'TO009',
            name: 'Tool',
            note: 'Electronic products such as computers',
            status: 1,
            isInCludeProduct: true
        },
        {
            id: 10,
            code: 'CS010',
            name: 'Costume',
            note: 'Electronic products such as computers',
            status: 1,
            isInCludeProduct: false
        }
    ];

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
            this.init();
        });
    }

    /**
     * Hàm get danh sách ProductCategory
     * @param event
     */
    getProductCategorys(event?: LazyLoadEvent) {
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

        this.primengTableHelper.totalRecordsCount = 15;
        this.primengTableHelper.records = this.productCatalogFakes;
        this.primengTableHelper.records.forEach((row, i) => {
            row.isEdit = false;
        });
        this.primengTableHelper.hideLoadingIndicator();
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
        this._router.navigate(['app/gwebsite/productCategory', {
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

    //hàm show view create ProductCategory
    createProductCategory() {
        this.createOrEditModal.show();
    }

    public searchPCatalog(): void {
        if ((this.productCatalogCode && this.productCatalogCode !== '')
            || (this.productCatalogName && this.productCatalogName !== '') ||
            (this.status && this.status !== StatusEnum.All)) {
            // luc nay moi search, gui xuong BE se filter theo like %name%, %code % va == status
            console.log(this.productCatalogCode + '__' + this.productCatalogName + '__' + this.status);
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
            this.productCatalogFakes.splice(index, 1);
        }
    }

}
