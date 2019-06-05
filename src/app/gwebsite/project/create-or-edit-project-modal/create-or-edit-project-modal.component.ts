import { Component, ElementRef, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { WebApiServiceProxy } from '@shared/service-proxies/webapi.service';
import { ComboboxItemDto } from '@shared/service-proxies/service-proxies';
import { ProjectDto, ApprovalStatusEnum, NewPJDto } from '../dto/project.dto';
import * as moment from 'moment';

@Component({
    selector: 'createOrEditProjectModal',
    templateUrl: './create-or-edit-project-modal.component.html',
    styleUrls: ['./create-or-edit-project-modal.component.css']
})
export class CreateOrEditProjectModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal') modal: ModalDirective;
    // @ViewChild('projectCombobox') projectCombobox: ElementRef;
    @ViewChild('iconCombobox') iconCombobox: ElementRef;

    /**
     * @Output dùng để public event cho component khác xử lý
     */
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    project: ProjectDto = new ProjectDto();
    projects: ComboboxItemDto[] = [];

    public pjCode = '';
    public pjName = '';
    public pjCreateDate = '';
    public pjActiveDate = '';
    public isCheckActive = false;
    public statusEnum = ApprovalStatusEnum;
    public newProject: NewPJDto;

    constructor(
        injector: Injector,
        private _apiService: WebApiServiceProxy
    ) {
        super(injector);
    }

    show(projectId?: number | null | undefined): void {
        this.active = true;
        this.saving = false;

        this.pjCode = '';
        this.pjName = '';
        this.isCheckActive = false;

        let now = new Date();
        this.pjCreateDate = moment(now).format('DD/MM/YYYY');

        this._apiService.getForEdit('api/MenuClient/GetMenuClientForEdit', projectId).subscribe(result => {
            this.project = result.menuClient;
            this.projects = result.menuClients;
            this.modal.show();
            // setTimeout(() => {
            //     $(this.projectCombobox.nativeElement).selectpicker('refresh');
            // }, 0);
        });
    }

    save(): void {
        if (this.pjCode && this.pjCode !== '' && this.pjName && this.pjName !== '') {
            this.saving = true;

            let status = this.isCheckActive ? this.statusEnum.Active : this.statusEnum.Inactive;

            this.newProject = new NewPJDto(this.pjCode, this.pjName, status);

            console.log(this.newProject.code + '--' + this.newProject.name
                + '--' + this.newProject.status);

            // this.insertProject();

            // call api create product category theo code,nam,status
            // add xuống, id tự tạo

            //trước khi add nhớ check duplicat code.


            this.close();
        }
    }

    insertProject() {
        // tiennnnnnnnnnnnnnnnnnnnnnnnnnnnn
        this._apiService.post('api/MenuClient/CreateMenuClient', this.project)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
            });
    }

    updateProject() {
        // tiennnnnnnnnnnnnnnnnnnnnnnnnnnnn
        this._apiService.put('api/MenuClient/UpdateMenuClient', this.project)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
            });
    }

    close(): void {
        this.active = false;
        this.modal.hide();
    }

    activeNewPrj(event: Event): void {
        if (this.isCheckActive) {
            this.pjActiveDate = this.pjCreateDate;
        }
    }
}
