export function normalizeWeeklyBudget(value, minimum = 500) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return minimum;
  }

  return Math.max(numericValue, minimum);
}

export function calculateBudgetSummary(items = [], weeklyBudget) {
  const safeBudget = normalizeWeeklyBudget(weeklyBudget, 500);
  const estimatedCost = (items || []).reduce((sum, item) => sum + (Number(item?.cost) || 0), 0);

  return {
    weeklyBudget: safeBudget,
    estimatedCost,
    remainingBudget: safeBudget - estimatedCost,
    isOverBudget: estimatedCost > safeBudget
  };
}
