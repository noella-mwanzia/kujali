import { FormBuilder } from "@angular/forms"

export function CreateTransactionForm (_fb: FormBuilder) {
  return _fb.group({
    createdBy: [''],

    type: [],
    name: [''],
  
    budgetId: [''],
  
    amount: [0],
    units: [0],
  
    yearFrom: [0],
    monthFrom: [],
  
    frequency: [0],
    xTimesInterval: [0],
  
    transactionId: [''],
  
    baseTypeMultiplier: [0],
  
    hasIncrease: [false],
    amountIncreaseConfig: [false] ,
    amountIncreaseFrequency: [0],
    amountIncreaseRate: [0],
    xTimesAmountIncreaseInterval: [0],
  
    unitIncreaseConfig: [false],
    unitIncreaseFrequency: [0],
    unitIncreaseRate: [0],
    xTimesUnitIncreaseInterval: [0],
  })
}