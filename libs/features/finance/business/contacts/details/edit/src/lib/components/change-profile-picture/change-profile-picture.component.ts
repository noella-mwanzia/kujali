import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { SubSink } from 'subsink';

import { take } from 'rxjs/operators';

import { ToastService } from '@iote/bricks-angular';

import { TranslateService } from '@ngfi/multi-lang';

import { OrganisationService } from '@app/state/organisation';
import { ContactsService } from '@app/state/finance/contacts';

// import { FileStorageService } from '@app/features/finance/files';

@Component({
  selector: 'change-profile-picture',
  templateUrl: './change-profile-picture.component.html',
  styleUrls: ['./change-profile-picture.component.scss'],
})
export class ChangeProfilePictureComponent implements OnInit {
  private _sbS = new SubSink();
  fileUrl: string;

  n = Date.now();

  disableBtn = true;

  acceptedFileTypes: string = 'image/png, image/gif, image/jpeg';

  constructor(private _dialogRef: MatDialogRef<ChangeProfilePictureComponent>,
              // private _fileStorage: FileStorageService,
              private _toastService: ToastService,
              private _trl: TranslateService,
              private _contactService: ContactsService,
              private _activeOrg$$: OrganisationService
  ) {}

  ngOnInit(): void {}

  checkFileExtension(extension: string): boolean {
    return extension == 'png' || 'jpeg' || 'gif' || 'jpg' ? true : false;
  }

  onFileSelected(event) {
    const fileName = event.target.files[0].name;
    const fileExtension = fileName.split('.').pop();

    if (this.checkFileExtension(fileExtension)) {
      this.disableBtn = false;
      return this.sendPhoto(event, fileName);
    } else {
      this.disableBtn = true;
      this._toastService.doSimpleToast(
        this._trl.translate('ALLOWED.FILE.TYPE')
      );
      return;
    }
  }

  async sendPhoto(event, fileName: string) {
    this._activeOrg$$.getActiveOrg().pipe(take(1)).subscribe(async (org) => {
      if (org) {
        // let uploadPath = `orgs/${org.id}/contacts/profileImages/${this.n}${fileName}`
        // let ref = await this._fileStorage.uploadSingleFile(uploadPath, event.target.files[0]);
        // let downloadURL = await ref.getDownloadURL();
        // if (downloadURL) {
        //   this.updatePhotoUrl(downloadURL);
        // }
      }
    })
  }

  onUploadProfilePic() {
    this.exitModal();
  }

  updatePhotoUrl(url: string) {
    this._contactService.updatePhotoUrl(url);
  }

  exitModal = () => this._dialogRef.close();

  ngOnDestroy = () => this._sbS.unsubscribe();
}
