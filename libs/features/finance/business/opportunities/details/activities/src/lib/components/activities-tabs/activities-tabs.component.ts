import { Component, OnInit } from '@angular/core';

import { SubSink } from 'subsink';
import { take } from 'rxjs/operators';

import { KujaliPermissions } from '@app/model/organisation';

// import { PermissionsStateService } from '@app/state/organisation';

@Component({
  selector: 'activities-tabs',
  templateUrl: './activities-tabs.component.html',
  styleUrls: ['./activities-tabs.component.scss']
})
export class ActivitiesTabsComponent implements OnInit {

  private _sbS = new SubSink();
  quotesLen: string;

  canViewActions: boolean = false;
  canViewQuotes: boolean = false;

  permissionsChecked: boolean = false;

  // constructor(private _permissionsService: PermissionsStateService) { }
  constructor() { }

  ngOnInit(): void {
    this._checkPermissions();
  }

  private _checkPermissions() {
    // this._sbS.sink = this._permissionsService
    //   .checkAccessRight((p: any) => p.OpportunitiesSettings.CanViewOpportunitiesActions)
    //   .pipe(take(1))
    //   .subscribe((permissions) => {
    //     if (permissions == true) {
    //       this.canViewActions = permissions;
    //     } else {
    //       this._permissionsService.throwInsufficientPermissions();
    //     }

    //   });
  }
}
