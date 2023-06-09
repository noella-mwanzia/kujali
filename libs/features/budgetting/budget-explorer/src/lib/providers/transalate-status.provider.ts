export function GET_BUDGET_STATUS(status: number) {
  switch (status) {
    case 1:
      return 'BUDGET.STATUS.ACTIVE';

    case 0:
      return 'BUDGET.STATUS.DESIGN';

    case 9:
      return 'BUDGET.STATUS.NO-USE';

    case -1:
      return 'BUDGET.STATUS.DELETED';

    default:
      return '';
  }
}