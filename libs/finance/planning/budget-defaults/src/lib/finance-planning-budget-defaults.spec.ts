import { financePlanningBudgetDefaults } from './finance-planning-budget-defaults';

describe('financePlanningBudgetDefaults', () => {
  it('should work', () => {
    expect(financePlanningBudgetDefaults()).toEqual(
      'finance-planning-budget-defaults'
    );
  });
});
