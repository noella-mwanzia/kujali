import { FormBuilder, FormGroup } from "@angular/forms";

import { __CreateAddNewActionForm } from "./add-new-action-form.model";

export class AddNewActionModel 
{
  addNewActionFormGroup: FormGroup;

  constructor(_fb: FormBuilder,
              _page: string,
  )
  {
    this.addNewActionFormGroup = __CreateAddNewActionForm(_fb);
  }
}