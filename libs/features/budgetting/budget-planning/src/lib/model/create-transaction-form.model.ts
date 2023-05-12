import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { TransactionPlan } from "@app/model/finance/planning/budget-items"

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
      frequency: [0, Validators.required],
      xTimesInterval: [0]
    }),

    // Section 4: determined by section 3 frequency
    pTIncreaseFormGroup: _fb.group({
      hasIncrease: [false],

      amntIncrConfig: ['percentage'],
      amountIncreaseFrequency: [-1],
      xTimesAmountIncreaseInterval: [0, Validators.required],
      amountIncreaseRate: [0, Validators.required],

      unitIncrConfig: ['value'],
      unitIncreaseFrequency: [-1],
      unitIncreaseRate: [0, Validators.required],
      xTimesUnitIncreaseInterval: [0],
    })

  })
}

export function CreateUpdateTransactionFormGroup (_fb: FormBuilder, plan: TransactionPlan, isEdit: boolean, month: any): FormGroup {  
  return _fb.group({
    // Section 1: Transaction
    pTNameFormGroup: _fb.group({
      id: [isEdit ? plan.id : ''],
      lineId: [plan.lineId],
      category: [plan.trCatId, Validators.required],
      type: [plan.trTypeId, Validators.required],
      lineName: [plan.lineName, Validators.required],
      budgetId: [plan.budgetId],
      king: [isEdit && plan.king ? plan.king : false]
    }),

    // Section 2: Value base
    pTValueBaseFormGroup: _fb.group({
      amount: [plan.amount, Validators.required],
      units: [plan.units, Validators.required]
    }),

    // Section 3: Occurence
    pTOccurenceFormGroup: _fb.group({
      fromYear: [plan.fromYear, Validators.required],
      fromMonth: [isEdit ? plan.fromMonth : month ?? MONTHS[0], Validators.required],
      frequency: [plan.frequency, Validators.required],
      xTimesInterval: [plan.xTimesInterval]
    }),

    // Section 4: determined by section 3 frequency
    pTIncreaseFormGroup: _fb.group({
      hasIncrease: [plan.hasIncrease],

      amntIncrConfig: [plan.amntIncrConfig!.incrStyle],
      amountIncreaseFrequency: [plan.amntIncrConfig!.incrFreq],
      xTimesAmountIncreaseInterval: [plan.amntIncrConfig!.interval, Validators.required],
      amountIncreaseRate: [plan.amntIncrConfig!.incrRate, Validators.required],

      unitIncrConfig: [plan.unitIncrConfig!.incrStyle],
      unitIncreaseRate: [plan.unitIncrConfig!.incrRate, Validators.required],
      unitIncreaseFrequency: [plan.unitIncrConfig!.incrFreq],
      xTimesUnitIncreaseInterval: [plan.unitIncrConfig!.interval],
    })

  })
}