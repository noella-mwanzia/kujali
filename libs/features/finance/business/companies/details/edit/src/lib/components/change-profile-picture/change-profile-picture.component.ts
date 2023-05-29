import {Component, OnDestroy, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { SubSink } from 'subsink';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { ToastService } from '@iote/bricks-angular';

import { TranslateService } from '@ngfi/multi-lang';

import { Company } from '@app/model/finance/companies';

import { OrganisationService } from '@app/state/organisation';
import { ActiveCompanyStore, CompaniesStore } from '@app/state/finance/companies';

// import { FileStorageService } from '@app/features/finance/files';

@Component({
  selector: 'change-profile-picture',
  templateUrl: './change-profile-picture.component.html',
  styleUrls: ['./change-profile-picture.component.scss']
})

export class ChangeProfilePictureComponent implements OnInit, OnDestroy{

  private _sbS = new SubSink();
  isLoaded = true;
  isSaving = false;

  company$: Observable<Company>;
  company: Company;

  n = Date.now();
  disableBtn = true;

  acceptedFileTypes: string = "image/png, image/gif, image/jpeg"

  constructor(private _dialogRef: MatDialogRef<ChangeProfilePictureComponent>,
              // private _fileStorage$$: FileStorageService,
              private _toastService: ToastService,
              private _trl: TranslateService,
              private fireStorage: AngularFireStorage,
              private _company$$: ActiveCompanyStore,
              private _companies$$: CompaniesStore,
              private _activeOrg$$: OrganisationService
  ) { }

  ngOnInit(): void {
    this.isLoaded = true;
    this.company$ = this._company$$.get()
    this._sbS.sink = this.company$.subscribe((company) => {this.company = company})
  }

  checkFileExtension(extension: string) {
    return extension == 'png' || 'jpeg' || 'gif' || 'jpg' ? true : false
  }

  onFileSelected(event) {
    const fileName = event.target.files[0].name;
    const fileExtension = fileName.split('.').pop();

    if (this.checkFileExtension(fileExtension)) {
      this.disableBtn = false;
      return this.sendPhoto(event, fileName);
    } else {
      this.disableBtn = true;
      this._toastService.doSimpleToast(this._trl.translate('ALLOWED.FILE.TYPE'))
      return;
    }
  }

  async sendPhoto(event, fileName: string) {
    // this._activeOrg$$.getActiveOrg().pipe(take(1)).subscribe(async (org) => {
    //   if (org) {
    //     let uploadPath = `orgs/${org.id}/companies/profileImages/${this.n}${fileName}`
    //     let ref = await this._fileStorage$$.uploadSingleFile(uploadPath, event.target.files[0]);
    //     let downloadURL = await ref.getDownloadURL();
    //     if (downloadURL) {
    //       this.updatePhotoUrl(downloadURL);
    //     }
    //   }
    // })
  }

  onUploadProfilePic() {
    this.exitModal();
  }

  updatePhotoUrl(url: string) {
    if (this.company.logoImgUrl && this.company.logoImgUrl != '') {
      // this._fileStorage$$.deleteSingleFile(this.company.logoImgUrl!).subscribe();
    }
    this.company.logoImgUrl = url;
    this._sbS.sink = this._companies$$.update(this.company)
          .subscribe((c => { this.company = c; this.isSaving = false; }));
  }

  exitModal = () => this._dialogRef.close();

  ngOnDestroy = () => this._sbS.unsubscribe();
}
