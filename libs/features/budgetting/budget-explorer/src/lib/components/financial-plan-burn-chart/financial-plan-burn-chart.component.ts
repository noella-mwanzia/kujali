import { Component, Input, OnInit } from '@angular/core';

import * as _ from 'lodash';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, switchMap, filter } from 'rxjs/operators';

// import { Options } from 'ng5-slider';

import { BudgetResultService } from '../../service/budget-result.service';
import { BudgetGraphService } from '../../service/budget-graph.service';

import { MONTHS, BudgetResult, Budget } from '@elewa/portal-shared';

@Component({
  selector: 'app-financial-plan-burn-chart',
  templateUrl: './financial-plan-burn-chart.component.html',
  styleUrls: ['./financial-plan-burn-chart.component.scss']
})
export class FinancialPlanBurnChartComponent implements OnInit
{
  @Input() budget$: Observable<Budget>;
  @Input() year$: Observable<number>;

  MIN_YEAR = 0;
  MAX_YEAR = 5;

  sliderMinValue = 0;
  sliderMaxValue = 5;
  sliderValues_: BehaviorSubject<{ min: number, max: number }> = new BehaviorSubject(null);
  sliderValues$ = this.sliderValues_.asObservable().pipe(filter(_ => _ != null));
  sliderOptions; //: Options = {};

  resultTable$: Observable<BudgetResult>;

  balanceLine$: Observable<number[]>;
  balanceLineDisplay: number[];

  resultBlocks$: Observable<{ label: string, data: number[] }[]>;
  resultsBlocksDisplay: { label: string, data: number[] }[];
  
  labels$: Observable<string[]>;
  labelsDisplay: string[];

  isLoaded = false;

  constructor(private _budgetResultService: BudgetResultService,
              private _budgetGraphService:  BudgetGraphService)
  { }

  private _initSliderRange(budget: Budget)
  {
    this.MIN_YEAR = budget.startYear;
    this.MAX_YEAR = budget.startYear + budget.duration;

    this.sliderOptions = {
      floor: 0, ceil: ((this.MAX_YEAR % this.MIN_YEAR) * 12) - 1, showTicks: true, tickStep: 12,
      translate: (value: number): string => { return 'Y' + Math.ceil((value + 1) / 12) + ' - ' + MONTHS[value % 12].slug; }
    };
  
    this.sliderMinValue = (new Date().getFullYear() > this.MIN_YEAR) ? ((new Date().getFullYear() % this.MIN_YEAR) * 12)
                                                                     : 0;
    this.sliderMaxValue = this.sliderMinValue + 11;                                                      
    this.rangeChange();
  }

  ngOnInit()
  {
    // Kick off slider init by setting range values
    this.budget$.subscribe(budget => this._initSliderRange(budget));
    
    this.resultTable$ = this.budget$.pipe(switchMap(budget => this._budgetResultService.getBudgetResult(budget.id)),
                                          filter(r  => r != null));
    
    // Mold the graph data to be displayable on graph
    this.balanceLine$ = this.resultTable$.pipe(map(rT => this._budgetGraphService.createGraphBalanceLine(rT.balance)));
    this.resultBlocks$ = this.resultTable$.pipe(map(rT =>this._budgetGraphService.createGraphValueBlocks(rT)));
    this.labels$ = this.resultTable$.pipe(map(rT =>this._budgetGraphService.createLabels(rT.balance.amountsYear)));
    
    // Filter the correct range of graph values based on slider settings.
    combineLatest(this.balanceLine$, this.sliderValues$)
      .subscribe(([balanceLine, slider]) => { this.balanceLineDisplay = this._valuesForSlider(balanceLine, slider) });
    
    combineLatest(this.resultBlocks$, this.sliderValues$)
      .subscribe(([resultBlocks, slider]) => { this.resultsBlocksDisplay = _.map(resultBlocks, (rB) => this._resultBlocksForSlider(rB, slider)) });
    
    combineLatest(this.labels$, this.sliderValues$)
      .subscribe(([labels, slider]) => {
        this.labelsDisplay = this._valuesForSlider(labels, slider);
        
        this.isLoaded = true;
      });
    
    this.year$.subscribe(y => this._setYear(y));
  }

  private _setYear(year: number) {
    this.sliderMinValue = (year % this.MIN_YEAR) * 12;
    this.sliderMaxValue = this.sliderMinValue + 11;

    this.rangeChange();
  }

  rangeChange() {
    this.sliderValues_.next({ min: this.sliderMinValue, max: this.sliderMaxValue });
  }

  private _resultBlocksForSlider(resultBlock: { label: string, data: number[] }, slider: { min: number, max: number })
  {
    const block = _.clone(resultBlock);
    block.data = this._valuesForSlider(block.data, slider);
    return block;
  }

  /** Take a segment of x years out of full slice. */
  private _valuesForSlider(allValues: any[], slider: {min: number, max: number}) {
    const minIndex = slider.min;
    const maxIndex = slider.max;

    return _(allValues).drop(minIndex).take(maxIndex + 1 - minIndex).value();
  }

}
