import { FormBuilder, FormGroup, Validators } from "@angular/forms"

import { YEARS, MONTHS } from "@app/model/finance/planning/time"

export function CreateTransactionFormGroup (_fb: FormBuilder, month: number): FormGroup {
  return _fb.group({

    // Section 1: Transaction
    pTNameFormGroup: _fb.group({
      category: ['', Validators.required],
      type: ['', Validators.required],
      lineName: ['', Validators.required],
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
      fromMonth: [MONTHS[month - 1] ?? MONTHS[0], Validators.required],
      frequency: ['Once', Validators.required],
      xTimesInterval: [0]
    }),

    // Section 4: determined by section 3 frequency
    pTIncreaseFormGroup: _fb.group({
      hasIncrease: [false],

      amntIncrConfig: ['value'],
      amountIncreaseFrequency: [0],
      xTimesAmountIncreaseInterval: [0, Validators.required],
      amountIncreaseRate: [0, Validators.required],

      unitIncrConfig: ['value'],
      unitIncreaseRate: [0, Validators.required],
      unitIncreaseFrequency: [0],
      xTimesUnitIncreaseInterval: [0],
    })

  })
}

export function CreateUpdateTransactionFormGroup (_fb: FormBuilder, plan: any ): FormGroup {
  return _fb.group({
    // Section 1: Transaction
    pTNameFormGroup: _fb.group({
      id: [''],
      lineId: [plan.lineId],
      category: [plan.category.id, Validators.required],
      type: [plan.type.id, Validators.required],
      lineName: [plan.lineName, Validators.required],
      budgetId: [plan.budgetId]
    }),

    // Section 2: Value base
    pTValueBaseFormGroup: _fb.group({
      amount: [plan.amount, Validators.required],
      units: [plan.units, Validators.required]
    }),

    // Section 3: Occurence
    pTOccurenceFormGroup: _fb.group({
      fromYear: [plan.fromYear, Validators.required],
      fromMonth: [plan.fromMonth ?? MONTHS[0], Validators.required],
      frequency: [GetBudgetFrequency(plan.frequency), Validators.required],
      xTimesInterval: [plan.xTimesInterval]
    }),

    // Section 4: determined by section 3 frequency
    pTIncreaseFormGroup: _fb.group({
      hasIncrease: [plan.hasIncrease],

      amntIncrConfig: [plan.amntIncrConfig.incrStyle],
      amountIncreaseFrequency: [plan.amntIncrConfig.incrFreq],
      xTimesAmountIncreaseInterval: [plan.amntIncrConfig.interval, Validators.required],
      amountIncreaseRate: [plan.amntIncrConfig.incrRate, Validators.required],

      unitIncrConfig: [plan.unitIncrConfig],
      unitIncreaseRate: [plan.unitIncreaseRate, Validators.required],
      unitIncreaseFrequency: [plan.unitIncreaseFrequency],
      xTimesUnitIncreaseInterval: [plan.xTimesUnitIncreaseInterval],
    })

  })
}

function GetBudgetFrequency(frequency: number): string {
  switch (frequency) {
    case -1:
      return 'Never';
    case 0:
      return 'Once';
    case 1:
      return 'Monthly';
    case 90:
      return 'Quarterly';
    case 365:
      return 'Yearly';
    case 999:
      return 'EveryXTimes';
    default:
      return ''
  }
}