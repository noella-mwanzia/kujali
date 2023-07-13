import { FormBuilder } from "@angular/forms"
import { TypeLabel } from "@app/model/finance/opportunities"

export function CreateOpportunityTypesForm(_fb: FormBuilder) {
  return _fb.group({
    opportuniTypesArray: _fb.array([]),
  })
}

export function CreateOpportunityColorsForm(_fb: FormBuilder, type: TypeLabel) {
  return _fb.group({
    label: [type.label ?? ''],
    color: [type.color ?? '']
  })
}

export function CreateOpportunityNewColorsForm(_fb: FormBuilder) {
  return _fb.group({
    label: [''],
    color: [getRandomColor()]
  })
}

export function CreateInvoicePrefixForm(_fb: FormBuilder) {
  return _fb.group({
    invoicesPrefix: [''],
    currentInvoiceNumber: [0],
    extraNote:[''],
    termsAndConditionsDocUrl: ['']
  })
}

export function getRandomColor(): string {
  var color = Math.floor(0x1000000 * Math.random()).toString(16);
  return '#' + ('000000' + color).slice(-6);
}