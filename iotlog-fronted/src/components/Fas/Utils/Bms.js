import { floatToStringExtendDot } from "../../Utils";

export const getExpensesTotalValue = (expenses) => {
      if (!expenses.length) return 0;

    const total = expenses.reduce((acc, expense) => {
        return acc + parseFloat((expense.value || 0) * (expense.amount || 0));
    }, 0);
    return floatToStringExtendDot(total);
}
