import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";

import { SubSink } from "subsink";
import { combineLatest, Observable } from "rxjs";

import { Organisation, KujaliPermissions } from "@app/model/organisation";

import { OrganisationService } from "@app/state/organisation";

import { __CreatePermissionsMainForm} from "./permissions-forms.model";

import { PermissionsFormsService } from "../services/permissions-forms.service";

export class PermissionsModel 
{
  private _sbS = new SubSink();

  org$: Observable<Organisation>;
  permissions$: Observable<KujaliPermissions>;
  
  _fb: FormBuilder;
  permissionsFormGroup: FormGroup;

  roles: string[];
  permissionsLoaded: boolean;
  permissions: KujaliPermissions;

  constructor(_fb: FormBuilder,
              _page: string,
              private _permissionsFormService$$: PermissionsFormsService,
              private _orgService$$: OrganisationService
  )
  {
    this._fb = _fb;

    this.org$ = this._orgService$$.getActiveOrg();
    this.permissions$ = this._orgService$$.getOrgPermissions();
    
    this.permissionsFormGroup = __CreatePermissionsMainForm(_fb);
  }


  getUserRolesAndPermissions() {
    this._sbS.sink = combineLatest(([this.org$, this.permissions$])).subscribe(([activeOrg, permissions]) => {
      if (activeOrg && permissions) {
        this.roles = activeOrg.roles.sort();
        this.permissions = permissions;
        this.permissionsLoaded = true;

        this._permissionsFormService$$._initPermissionsFormGroup(this.permissionsFormGroup, permissions);

        this.permissionsFormGroup.disable();
      }
    })
  }
}