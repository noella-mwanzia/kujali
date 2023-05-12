import { Injectable } from "@angular/core";

import { SubSink } from "subsink";

import { BehaviorSubject, combineLatest } from "rxjs";

import { Budget } from "@app/model/finance/planning/budgets";

import { ActiveBudgetStore, BudgetsStore } from "@app/state/finance/budgetting/budgets";

/**
 * Node for to-do item
 */
export class TodoItemNode {
  children: TodoItemNode[];
  item: string;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  item: string;
  level: number;
  expandable: boolean;
}

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {

  private _sbS = new SubSink();

  dataChange = new BehaviorSubject<TodoItemNode[]>([]);

  allBudgets: Budget[];

  activeBudget: Budget;

  constructor(private _activeBudgets$$: ActiveBudgetStore,
              private _budgets$$: BudgetsStore
    ) {
    this.initialize();
  }

  get data(): TodoItemNode[] {
    return this.dataChange.value;
  }

  initialize() {
    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    //     file node as children.

    let activeBudget$ = this._activeBudgets$$.get();
    let budgets$ = this._budgets$$.get();

    this._sbS.sink = combineLatest(([budgets$, activeBudget$])).subscribe(([bs, b]) => {
      if (bs && b) {

        this.activeBudget = b;

        let budgetsData = this.buildBudgetsTree(bs, b);

        const data = this.buildFileTree(budgetsData, 0);

        // Notify the change.
        this.dataChange.next(data);
      }
    })
  }

  buildBudgetsTree(budgets: Budget[], budget: Budget) {
    let budgetChildren = budgets.filter((b) => budget.childrenList.includes(b.id!));
    let budgetParents = budgets.filter((b) => b.childrenList.includes(budget.id!));

    this.allBudgets = budgetParents.concat(budgetChildren);
    this.allBudgets.push(budget);

    let obj = {};

    if (budgetParents.length > 0) {
      budgetParents.map((p, index: number) => {
        if (index == budgetParents.length - 1) {
          obj[p.id!] = this.createNodeWithChildren(budget);
        } else {
          obj[p.id!] = null;
        }
      })
    } else {
      obj = this.createNodeWithChildren(budget);
    }

    return obj;
  }

  getBudgetName(budgetId: string): string {
    return this.allBudgets.find((b) => b.id === budgetId)?.name!;
  }

  createNodeWithChildren(budget: Budget): {[x: string]: string[]} {
    let node = budget.childrenList.length > 0 ? {[budget.id!]: budget.childrenList} : [] as any;
    return node;
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
  buildFileTree(obj: {[key: string]: any}, level: number): TodoItemNode[] {
    return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TodoItemNode();
      node.item = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.item = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  /** Add an item to to-do list */
  insertItem(parent: TodoItemNode, name: string) {
    if (parent.children) {
      parent.children.push({item: name} as TodoItemNode);
      this.dataChange.next(this.data);
    }
  }

  updateItem(node: TodoItemNode, name: string) {
    node.item = name;
    this.dataChange.next(this.data);
  }
}