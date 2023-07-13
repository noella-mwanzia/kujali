import { Injectable } from '@angular/core';

import { take } from 'rxjs/operators';

import { InvoicesPrefixService } from '@app/state/finance/invoices';
import { OrganisationService } from '@app/state/organisation';

// import { FileStorageService } from '@app/features/files';

@Injectable({
  providedIn: 'root'
})
export class ConfigInvoicesService {

  n = Date.now();

  constructor(
              // private _fileStorage$$: FileStorageService,
              private _activeOrg$$: OrganisationService,
              private _invoicePrefixService$$: InvoicesPrefixService
  ) { }

  uploadTermsPdf(event) {
    const fileName = event.target.files[0].name;
    const fileExtension = fileName.split('.').pop();

    this._activeOrg$$.getActiveOrg().pipe(take(1)).subscribe(async (org) => {
      if (org) {
        let uploadPath = `orgs/${org.id}/invoices/terms/${fileName}`
        // let ref = await this._fileStorage$$.uploadSingleFile(uploadPath, event.target.files[0]);
        // let downloadURL = await ref.getDownloadURL();
        // if (downloadURL) {
        //   this.updateInvoiceTermsDoc(downloadURL);
        // }
      }
    })
  }

  deleteTermsPdf() {
    this._invoicePrefixService$$.getInvoicePrefix().pipe(take(1)).subscribe((prefixData) => {
      if (prefixData) {
        if (prefixData.termsAndConditionsDocUrl && prefixData.termsAndConditionsDocUrl != '') {
          // this._fileStorage$$.deleteSingleFile(prefixData.termsAndConditionsDocUrl);
          prefixData.termsAndConditionsDocUrl = '';
          this._invoicePrefixService$$.saveInvoicePrefix(prefixData);
        }
      }
    })
  }

  updateInvoiceTermsDoc(docUrl: string) {
    this._invoicePrefixService$$.getInvoicePrefix().pipe(take(1)).subscribe((prefixData) => {
      if (prefixData) {
        if (prefixData.termsAndConditionsDocUrl && prefixData.termsAndConditionsDocUrl != '') {
          // this._fileStorage$$.deleteSingleFile(prefixData.termsAndConditionsDocUrl);
        }
        prefixData.termsAndConditionsDocUrl = docUrl;
        this._invoicePrefixService$$.saveInvoicePrefix(prefixData);
      }
    })
  }
}
