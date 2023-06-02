import { FormBuilder, FormGroup } from "@angular/forms";

import { SubSink } from "subsink";

import { Company } from '@app/model/finance/companies';
import { Opportunity } from "@app/model/finance/opportunities";

import { OpportunitiesService } from "@app/state/finance/opportunities";

import { CreateOpportunityForm, PatchOpportunityForm } from "./opportunities-edit-forms.model";

export class OpportunitiesEditModel {
  private _sbS = new SubSink();

  opportunityForm: FormGroup;
  oppsData: Opportunity;

  companyList: Company[];
  filteredCompanyList: Company[];

  contactList: any[];
  filteredContactList: any[];

  pageDataHasLoaded: boolean;

  constructor(private _fb: FormBuilder,
              private _oppsService: OpportunitiesService
  )
  {
    this.opportunityForm = CreateOpportunityForm(this._fb);
  }

  getFormData () {
    this._sbS.sink = this._oppsService.getCompanyAndContacts().subscribe(([opps, companies, contacts]) => {
      if (opps && companies && contacts) {
        this.oppsData = opps;
  
        this.companyList = companies;
        this.filteredCompanyList = this.companyList.slice();
  
        this.contactList = contacts.map(c => ({ ...c, fullName: `${c.fName} ${c.lName}` }))
        this.filteredContactList = this.contactList.filter((co) => co.company === opps.company);

        this.opportunityForm = PatchOpportunityForm(this._fb, this.oppsData);
  
        if (opps.company) {
          this.patchOppsCompany(this.oppsData.company);
        }

        if (opps.contact) {
          this.patchOppsContact(this.oppsData.contact);
        }

        this.pageDataHasLoaded = true;
      }
    });
  }

  patchOppsContact(contactId: string) {
    if (this.contactList) {
      this.contactList.filter((contact) => {
        if (contact.id == contactId) {
          this.opportunityForm.patchValue({contact: contact});
        }
      });
    }
  }

  patchOppsCompany(companyId: string) {
    this.companyList.filter((company) => {
      if (company.id == companyId) {
        this.opportunityForm.patchValue({company: company});
      }
    });
  }
}