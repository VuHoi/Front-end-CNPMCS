import { Component, ElementRef, EventEmitter, Injector, Output, ViewChild } from '@angular/core';
import { AppComponentBase } from '@shared/common/app-component-base';
import { ModalDirective } from 'ngx-bootstrap';
import { finalize } from 'rxjs/operators';
import { WebApiServiceProxy } from '@shared/service-proxies/webapi.service';
import { ComboboxItemDto } from '@shared/service-proxies/service-proxies';
import { BidProfileDto } from '../dto/bidProfile.dto';

@Component({
    selector: 'createOrEditBidProfileModal',
    templateUrl: './create-or-edit-bidProfile-modal.component.html',
    styleUrls: ['./create-or-edit-bidProfile-modal.component.css']
})
export class CreateOrEditBidProfileModalComponent extends AppComponentBase {

    @ViewChild('createOrEditModal') modal: ModalDirective;
    @ViewChild('bidProfileCombobox') bidProfileCombobox: ElementRef;
    @ViewChild('iconCombobox') iconCombobox: ElementRef;

    /**
     * @Output dùng để public event cho component khác xử lý
     */
    @Output() modalSave: EventEmitter<any> = new EventEmitter<any>();

    active = false;
    saving = false;

    bidProfile: BidProfileDto = new BidProfileDto();
    bidProfiles: ComboboxItemDto[] = [];

    constructor(
        injector: Injector,
        private _apiService: WebApiServiceProxy
    ) {
        super(injector);
    }

    show(bidProfileId?: number | null | undefined): void {
        this.active = true;

        this._apiService.getForEdit('api/MenuClient/GetMenuClientForEdit', bidProfileId).subscribe(result => {
            // tiennnnnnnnnnnnnnnnnnnnnnnnnnnnn
            this.bidProfile = result.menuClient;
            this.bidProfiles = result.menuClients;
            this.modal.show();
            setTimeout(() => {
                $(this.bidProfileCombobox.nativeElement).selectpicker('refresh');
            }, 0);
        });
    }

    save(): void {
        let input = this.bidProfile;
        this.saving = true;
        if (input.id) {
            this.updateBidProfile();
        } else {
            this.insertBidProfile();
        }
    }

    insertBidProfile() {
        // tiennnnnnnnnnnnnnnnnnnnnnnnnnnnn
        this._apiService.post('api/MenuClient/CreateMenuClient', this.bidProfile)
            .pipe(finalize(() => this.saving = false))
            .subscribe(() => {
                this.notify.info(this.l('SavedSuccessfully'));
                this.close();
                this.modalSave.emit(null);
            });
    }

    updateBidProfile() {
        // tiennnnnnnnnnnnnnnnnnnnnnnnnnnnn
        this._apiService.put('api/MenuClient/UpdateMenuClient', this.bidProfile)
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
}
