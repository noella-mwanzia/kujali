import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatDialog } from '@angular/material/dialog';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

import { SubSink } from 'subsink';

import { combineLatest, Observable } from 'rxjs';

import { FinancialExplorerState } from '@app/model/finance/planning/budget-rendering-state';
import { RenderedBudget } from '@app/model/finance/planning/budget-rendering';
import { Budget } from '@app/model/finance/planning/budgets';

import { LinkBudgetModalComponent } from '../link-budget-modal/link-budget-modal.component';
import { ChecklistDatabase, TodoItemFlatNode, TodoItemNode } from '../../providers/budget-tree.provider';

@Component({
  selector: 'app-budget-hierarchy-tree',
  templateUrl: './budget-hierarchy-tree.component.html',
  styleUrls: ['./budget-hierarchy-tree.component.scss'],
})
export class BudgetHierarchyTreeComponent implements OnInit, OnDestroy {

  private _sbS = new SubSink();

  @Input() state$: Observable<FinancialExplorerState>;
  @Input() budget$: Observable<RenderedBudget>;

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  activeBudget: Budget;

  constructor(private _dialog: MatDialog,
              private _database: ChecklistDatabase
  ) {}
  
  ngOnInit(): void {
    this._sbS.sink = combineLatest([this.state$, this.budget$]).subscribe(([s, b]) => {
      if (s && b) {
        this.activeBudget = b;

        this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
        this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    
        this._sbS.sink = this._database.dataChange.subscribe(data => {
          this.dataSource.data = data;
        });
      }
    })
  }

  getBudgetName(budgetId: string): string {
    return this._database.allBudgets.find((b) => b.id === budgetId)?.name!;
  }
  
  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.item === node.item ? existingNode : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  /* Get the parent node of a node */
  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  /** Select the category so we can insert the new item. */
  addNewItem(node: TodoItemFlatNode) {
    this._dialog.open( LinkBudgetModalComponent, { data: node.item }).afterClosed();
  }
  
  ngOnDestroy(): void {
    this._sbS.unsubscribe();
  }
}
