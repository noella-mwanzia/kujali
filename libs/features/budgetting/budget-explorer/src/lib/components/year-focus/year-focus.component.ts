import { Component, Output, EventEmitter, Input } from '@angular/core';


@Component({
  selector: 'app-year-focus',
  templateUrl: './year-focus.component.html'
})
/** 
 * Component on the side of the page which offers easy navigation between financial years.
 */
export class YearFocusComponent
{
  @Input() title!: string;

  @Output() navigateYearPressed = new EventEmitter<string>();

  navigateYear(nav: 'prev' | 'next') {
    this.navigateYearPressed.emit(nav);
  } 
}
