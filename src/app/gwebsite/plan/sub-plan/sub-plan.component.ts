import { AfterViewInit, Component, ElementRef, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { AppComponentBase } from '@shared/common/app-component-base';
import * as _ from 'lodash';
import { LazyLoadEvent } from 'primeng/components/common/lazyloadevent';
import { Paginator } from 'primeng/components/paginator/paginator';
import { Table } from 'primeng/components/table/table';
import { WebApiServiceProxy, IFilter } from '@shared/service-proxies/webapi.service';
import { ApprovalStatusEnum } from '../dto/plan.dto';

@Component({
  selector: 'app-sub-plan',
  templateUrl: './sub-plan.component.html',
  styleUrls: ['./sub-plan.component.css'],
  animations: [appModuleAnimation()]
})
export class SubPlanComponent extends AppComponentBase implements AfterViewInit, OnInit {

  /**
   * @ViewChild là dùng get control và call thuộc tính, functions của control đó
   */
  @ViewChild('textsTable') textsTable: ElementRef;
  @ViewChild('dataTable') dataTable: Table;
  @ViewChild('paginator') paginator: Paginator;

  /**
   * tạo các biến dể filters
   */
  public filterText: string;
  public planId = 100;
  public yearImplement = 2019; //get by plan id
  public YearImplementList = [this.yearImplement];
  public approvalStatus = ApprovalStatusEnum.AwaitingApproval;
  public ApprovalStatusList = [
    {
      id: this.approvalStatus,
      name: this.approvalStatus === 1 ? 'Approved' : 'Awaiting Approval'
    }
  ];
  public effectiveDate = '10/05/2019';
  public totalPrice = 56000000;
  public implementPrice = 30000000;
  public residualPrice = +this.totalPrice - +this.implementPrice;

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
   * Hàm get danh sách SubPlan
   * @param event
   */
  getSubPlans(event?: LazyLoadEvent) {
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

  /**
   * Tạo pipe thay vì tạo từng hàm truncate như thế này
   * @param text
   */
  truncateString(text): string {
    return abp.utils.truncateStringWithPostfix(text, 32, '...');
  }

  public SearchSubPlan(): void {
    console.log(this.approvalStatus + '___' + this.yearImplement + '__');
  }
  public ApprovedPlan(): void {
    if (this.approvalStatus === 2) {

    }
    //call api approved plan
    //if approved successful
    if (1) {
      this.approvalStatus = 1;
      this.ApprovalStatusList[0].id = 1;
      this.ApprovalStatusList[0].name = 'Approved';
    }
  }
}
