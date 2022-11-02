import { Injectable } from "@angular/core";

import { orderBy as ___orderBy } from 'lodash';
import { filter, map, switchMap, tap } from "rxjs/operators";

import { Logger } from "@iote/bricks-angular";
import { Query } from "@ngfi/firestore-qbuilder";
import { DataService, Repository } from "@ngfi/angular";
import { DataStore } from "@ngfi/state";

import { Organisation } from "@app/model/organisation";
import { Budget } from "@app/model/finance/planning/budgets";

import { ActiveOrgStore } from "@app/state/organisation";

@Injectable()
export class BudgetsStore extends DataStore<Budget>
{
  private _org!: Organisation;
  protected _activeRepo!: Repository<Budget>;
  protected store!: string; 

  constructor(org$$: ActiveOrgStore,
              dataService: DataService,
              _logger: Logger)
  {
    super('always', _logger);

    org$$.get()
      .pipe(
        tap(o => this._org = o),
        tap(o => this._activeRepo = dataService.getRepo<Budget>(`orgs/${o.id}/budgets`)),
        switchMap(
          () => this._activeRepo.getDocuments(new Query())),
        map((budgets: Budget[]) => ___orderBy(budgets, 'createdOn', 'asc')))
    
      .subscribe(budgets => {
        this.set(budgets, 'FROM DB');
      });
  }

  /** 
   * @returns {Observable<Budget[]>} 
   *    - All budgets a user has access too (non-hierachrical representation) 
   *       
   * @note - For a hierarchical representation. @see {OrgBudgetsStore}                           
   */
  override get = () => super.get().pipe(filter(bs => !!bs));

  override add(budget: Budget)
  {
    budget.orgId = this._org.id as string;

    return super.add(budget);
  }
  

  // add(budget: Budget): Observable<Budget>
  // {
  //   const bCreated$ = this._budgetRepo.create(budget);
    
  //   // Set initial Owner
  //   return combineLatest(bCreated$, this._userService.getUser())
  //           .pipe(take(1),
  //                 switchMap(([budget, user]) => this._setBudgetOwner(budget, user)));
  // }

  // private _setBudgetOwner(budget: Budget, user: Emp)
  // {
  //   if (user.profile.budgets == null)
  //     user.profile.budgets = {};
    
  //   user.profile.budgets[budget.id] = { owner: true };

  //   return from(this._userService.updateUser(user).then(_ => budget));
  // }

  // getBudgets(): Observable<ReadBudget[]>
  // {
  //   return this._userService
  //              .getUser()
  //              .pipe(switchMap(u => this._getBudgetsOfUser(u)),
  //                    map((budgets: ReadBudget[]) => _.orderBy(budgets, 'createdOn', 'asc')));
  // } 

  // private _getBudgetsOfUser(u: Emp)
  // {
  //   // Get all the budgets the user has access to.
  //   if (u.profile.budgets && Object.keys(u.profile.budgets).length > 0)
  //   {

  //     const budgets$ = combineLatest(Object.keys(u.profile.budgets)
  //                                          .map(bId => this.getBudget(bId)))                                      
      
  //     return budgets$.pipe(map(budgets => budgets.map(b => {
  //                                           const bR = <ReadBudget> b;
  //                                           bR.access = u.profile.budgets[b.id]; 
  //                                           bR.canBeActivated = b.status == 'open' && u.roles.finance;
  //                                           return bR; 
  //                                         })));
  //   }
  //   else
  //     return of([])                 
  // }
  
  // getUserBudgets(user: Emp): Observable<Budget[]> 
  // {
  //   if(user.profile) {
  //     const budgets$ = this._budgetRepo.getDocuments()
  //                          .pipe(map(budgets => _.filter(budgets, b => Object.keys(user.profile.budgets).includes(b.id))));

  //     return budgets$.pipe(map(budgets => budgets.map(b => {
  //                                     const bR = <ReadBudget> b;
  //                                     bR.access = user.profile.budgets[b.id]; 
  //                                     bR.canBeActivated = b.status == 'open' && user.roles.finance;
  //                                     return b; 
  //                                   })));
  //   } else
  //     throw "The user profile could not be found";
  // }

  // /** Child budgets that can still be added to the budget. 
  //   *   Inefficient algo due to no NOT_IN SQL syntax in firebase.
  //   */
  // getChildBudgetsAddable(budget: Budget)
  // {
  //   return this._budgetRepo.getDocuments()
  //                          .pipe(map(budgets => _.filter(budgets, b => budget.id != b.id
  //                                                                       && ! _.includes(budget.childrenList, b.id)
  //                                                                       && ! _.includes(budget.overrideList, b.id))));
  // }

  // updateBudget(budget: Budget) {
  //   return this._budgetRepo.update(budget);
  // }
}
