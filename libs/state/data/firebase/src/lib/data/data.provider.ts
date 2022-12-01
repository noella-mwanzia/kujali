import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { IObject } from '@iote/bricks';
import { BaseDataProvider, UserService } from '@ngfi/angular';

import { KuUser } from '@app/model/common/user';
import { TransactionPlan } from '@app/model/finance/planning/budget-items';


/**
 * Service that creates repositories.
 *
 * Use: Have single point of database table configuration.
 */
@Injectable({ providedIn: 'root' })
export class DataProvider extends BaseDataProvider
{

  constructor(_db: AngularFirestore,
              _userService: UserService<KuUser>)
  { super(_db, _userService); }



  getPlannedTransactionRepo = (orgId: string, budgetId: string) => this.getRepo<TransactionPlan>(`orgs/${orgId}/budgets/${budgetId}/plans`);

  /**
   * Newer version of the data service.
   * It makes more sense to store collection names in the services responsible to manage them. We want to get rid
   * of collection definition bottleneck.
   *
   * @param collectionName: The collection name.
   */
  getRepo<T extends IObject>(collectionName) {
    return this._createRepo<T>(collectionName);
  }
}