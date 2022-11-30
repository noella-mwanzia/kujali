import { FormBuilder, FormGroup, Validators } from "@angular/forms"

import { YEARS, MONTHS } from "@app/model/finance/planning/time"

export function CreateTransactionFormGroup (_fb: FormBuilder): FormGroup {
  return _fb.group({

    // Section 1: Transaction
    pTNameFormGroup: _fb.group({
      type: ['', Validators.required],
      name: ['', Validators.required],
      budgetId: ['']
    }),

    // Section 2: Value base
    pTValueBaseFormGroup: _fb.group({
      amount: [0, Validators.required],
      units: [0, Validators.required]
    }),

    // Section 3: Occurence
    pTOccurenceFormGroup: _fb.group({
      fromYear: [YEARS[0], Validators.required],
      fromMonth: [MONTHS[0], Validators.required],
      frequency: ['Once', Validators.required],
      xTimesInterval: [0]
    }),

    // Section 4: determined by section 3 frequency
    pTIncreaseFormGroup: _fb.group({
      hasIncrease: [false],
      amountIncreaseFrequency: [0],
      xTimesAmountIncreaseInterval: [0, Validators.required],

      amntIncrConfig: [''],
      amountIncreaseRate: [0, Validators.required],

      unitIncrConfig: [''],
      unitIncreaseRate: [0, Validators.required],
      unitIncreaseFrequency: [0],
      xTimesUnitIncreaseInterval: [0],
    })

  })
}