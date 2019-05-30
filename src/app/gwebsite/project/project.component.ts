import { AfterViewInit, Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as _ from 'lodash';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { Paginator } from 'primeng/components/paginator/paginator';
import { Table } from 'primeng/components/table/table';
import { CreateOrEditProjectModalComponent } from './create-or-edit-project-modal/create-or-edit-project-modal.component';
import { WebApiServiceProxy, IFilter } from '@shared/service-proxies/webapi.service';
import { IMyDpOptions, IMyDateModel, IMyDate } from 'mydatepicker';
import * as moment from 'moment';
import { ApprovalStatusEnum } from './dto/project.dto';


@Component({
    selector: 'app-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.css'],
    animations: [appModuleAnimation()]
})
export class ProjectComponent extends AppComponentBase implements AfterViewInit, OnInit {

    /**
     * @ViewChild là dùng get control và call thuộc tính, functions của control đó
     */
    @ViewChild('textsTable') textsTable: ElementRef;
    @ViewChild('createOrEditModal') createOrEditModal: CreateOrEditProjectModalComponent;
    @ViewChild('dataTable') dataTable: Table;
    @ViewChild('paginator') paginator: Paginator;

    /**
     * tạo các biến dể filters
     */
    filterText: string;
    //permission cho duyệt, thêm, xóa, sửa: Admin và Department tạo project đó.
    // duyệt: chỉ mỗi Admin đc duyệt
    // sửa, đóng: department tạo ra project đó và Admin.
    // thêm: ai thêm cũng đc, ko phân quyền
    public isPermissionEditClose = false;

    public createDatePickerOptions: IMyDpOptions = {
        selectorWidth: '240px',
        dateFormat: 'dd/mm/yyyy',
        showTodayBtn: true,
        todayBtnTxt: 'Now',
        showClearDateBtn: true,
        alignSelectorRight: true,
        openSelectorOnInputClick: true,
        inline: false,
        editableDateField: false,
        selectionTxtFontSize: '13px',
        height: '37px',
        firstDayOfWeek: 'su',
        sunHighlight: true,
        disableSince: {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            day: new Date().getDate() + 1
        }
    };
    // public model: any = { date: { year: new Date().getFullYear(), month: new Date().getMonth(), day: new Date().getDate() } };
    // public model = new Date();
    public creatDateString = '';
    public projectCodeFilter = '';
    public projectNameFilter = '';

    // -những dự án của năm cũ, sẽ tự động close (mỗi lần đến 1/1/newyear, sẽ trigger cho nó close hết projects năm cũ),
    //      dù có đc approved hay chưa.
    // -những dự án của năm hiện tại: chỉ dc phép close khi nó chưa đc approved.
    public projectFakes = [
        {
            code: 'SA01',
            name: 'Purchase early in the year',
            createDate: '12/02/2017',
            approvedDate: '',
            status: 3
        },
        {
            code: 'SA02',
            name: 'Purchase for building B',
            createDate: '20/04/2017',
            approvedDate: '28/04/2017',
            status: 3
        },
        {
            code: 'ES01',
            name: 'Purchase early in the year',
            createDate: '12/02/2018',
            approvedDate: '',
            status: 3
        },
        {
            code: 'ES02',
            name: 'Purchase for building B',
            createDate: '11/03/2019',
            approvedDate: '',
            status: 2
        },
        {
            code: 'AD01',
            name: 'Purchase for building B',
            createDate: '11/03/2019',
            approvedDate: '23/05/2019',
            status: 1
        },
        {
            code: 'AD02',
            name: 'Purchase for building B',
            createDate: '25/05/2019',
            approvedDate: '',
            status: 2
        },
        {
            code: 'TE01',
            name: 'Purchase for building B',
            createDate: '11/03/2019',
            approvedDate: '',
            status: 2
        },
        {
            code: 'TE02',
            name: 'Purchase for building B',
            createDate: '11/03/2019',
            approvedDate: '23/05/2019',
            status: 1
        },
        {
            code: 'GH01',
            name: 'Purchase for building B',
            createDate: '25/05/2019',
            approvedDate: '',
            status: 2
        },
        {
            code: 'GH02',
            name: 'Purchase for building B',
            createDate: '25/05/2019',
            approvedDate: '',
            status: 2
        }
    ];

    public approvalStatusEnum = ApprovalStatusEnum;

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
        this.isPermissionEditClose = true;
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
     * Hàm get danh sách Project
     * @param event
     */
    getProjects(event?: LazyLoadEvent) {
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

        this.primengTableHelper.totalRecordsCount = 16;
        this.primengTableHelper.records = this.projectFakes;

        this.primengTableHelper.records.forEach((item) => {
            item.isEdit = false;
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

    reloadPage(): void {
        this.paginator.changePage(this.paginator.getPage());
    }

    applyFilters(): void {
        //truyền params lên url thông qua router
        this._router.navigate(['app/gwebsite/project', {
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
        if (this.createOrEditModal.project.id) {
            for (let i = 0; i < this.primengTableHelper.records.length; i++) {
                if (this.primengTableHelper.records[i].id === this.createOrEditModal.project.id) {
                    this.primengTableHelper.records[i] = this.createOrEditModal.project;
                    return;
                }
            }
        } else { this.reloadPage(); }
    }

    //hàm show view create Project
    createProject() {
        this.createOrEditModal.show();
    }

    public searchProject(): void {
        // filter, values default = ''
        console.log(this.creatDateString + '--' + this.projectCodeFilter + '--' + this.projectNameFilter);
    }

    public onDateChangedBy(event: IMyDateModel): void {
        const date = Object.assign({}, event);
        this.creatDateString = date.jsdate ? moment(date.jsdate).format('YYYY-MM-DDTHH:mm:ss') : '';
    }

    public actionEdit(row: any, $event: Event): void {
        $event.stopPropagation();
        row.isEdit = true;
    }

    public saveEditItem(id: number, row: any, $event: Event): void {
        $event.stopPropagation();

        if (this.isPermissionEditClose && row.name && row.name !== '') {
            //call api edit name thông qua id truyền vào

            // vì bên html đã tự bind [(ngModel)] vào row.name và row.note rồi, nên ở đây ta chỉ cần lấy ra giá trị để update
            console.log(id + '---' + row.name);

            //save thành công
            row.isEdit = false;
        }

    }

    public cancelEdit(row: any, $event: Event): void {
        $event.stopPropagation();
        row.isEdit = false;
    }

    public closeItem(id: number, row: any, $event: Event): void {
        $event.stopPropagation();

        if (this.isPermissionEditClose && row.status === ApprovalStatusEnum.AwaitingApproval) {
            // dựa vào id, set status cho project là close

            //sau khi set success
            row.status = ApprovalStatusEnum.Close;
        }
    }
}
