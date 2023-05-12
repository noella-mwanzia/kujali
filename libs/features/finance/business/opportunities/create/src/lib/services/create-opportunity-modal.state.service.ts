import { take } from "rxjs/operators";

import { Injectable } from "@angular/core";
import { FormBuilder } from "@angular/forms";

import { Logger } from "@iote/bricks-angular";

import { ActiveOrgStore } from "@app/state/organisation";
import { CompaniesStore } from "@app/state/finance/companies";
import { OpportunitiesService } from "@app/state/finance/opportunities";

import { CreateOpportunityModalModel } from "../model/create-opportunity-modal.model";

import { AddOpportunityModalData } from "../model/add-opportunity-modal-data.model";

import { Tags } from "@app/model/tags";

@Injectable()
export class CreateOpportunityModalStateService 
{
  private _state: CreateOpportunityModalModel | null;
  
  constructor(private _org$$: ActiveOrgStore,
              private _opportunities$$: OpportunitiesService,
              private _companies$$: CompaniesStore,

              private _fb: FormBuilder,
              private _logger: Logger) 
  { }

  initModalState(_source: 'companies' | 'contacts',
                 _data: AddOpportunityModalData) 
    : CreateOpportunityModalModel
  {
    if(!this._state) 
    {
      // Get active org. Org can never change as long as the modal is open as it requires a page navigation.
      // const org$ = this._org$$.get();
      // const model$ = org$.pipe(map(org => new CreateOpportunityModalModel(source, data, this._companies$$, this._fb)));
      const model = new CreateOpportunityModalModel(_source, _data, this._opportunities$$, this._companies$$, this._fb);
      
      // Once the model is loaded (which means first we need to load the organisation ref. the map above),
      //     assign it to the active state.
      this._state = model; //await model$.toPromise();
    }

    return this._state as CreateOpportunityModalModel;
  }

  getModalState() : CreateOpportunityModalModel
  {
    if(!this._state)
      throw new Error('[CreateOpportunityModalStateService] State not initialised.')

    return this._state as CreateOpportunityModalModel;
  }

  createOpportunity(selectedTags: string[])
  {
    return this._org$$.get()
            .pipe(take(1))
            .subscribe(o => this._state?.createOpportunity(o.id as string, selectedTags));
  }


  endModalState() 
  {
    this._state = null;
  }

}