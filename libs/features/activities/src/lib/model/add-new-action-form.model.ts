import { FormBuilder, Validators } from "@angular/forms";
import { _AddNewActionValidator } from "@app/elements/forms/validators";

export function __CreateAddNewActionForm(_fb: FormBuilder) 
{
  return _fb.group(
    {
      id: [''],
      title: [''],
      activityOwnerId: [''],
      domainId: [''],
      completed: [false],
      desc: [''],
      type: [''],
      startDate: [new Date()],
      endDate: [new Date()],
      assignTo: [[]],
    },
    {
      validators: _AddNewActionValidator('title', 'desc', 'type', 'startDate', 'endDate', 'assignTo')
    }
  );
}