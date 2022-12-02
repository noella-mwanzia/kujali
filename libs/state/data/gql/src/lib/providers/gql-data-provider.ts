import { Injectable } from '@angular/core';

/**
 * Service that creates repositories.
 *
 * Use: Have single point of database table configuration.
 */
@Injectable({ providedIn: 'root' })

export class GqlDataProvider {

  constructor() { }

  getAllBudgets = () => `{id name startMonth startYear status duration parentBudgetId parentOverrideId createdBy createdOn}`;

  getAllTransactions = () => `{id orgId budgetId amount units fromYear 
                              fromMonth frequency xTimesInterval king lineId lineName 
                              mode trTypeId trCatId hasIncrease amntIncrConfig unitIncrConfig}`;

}