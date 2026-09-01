import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeWeeklyBudget, calculateBudgetSummary } from './budgetPlanner.js';

test('normalizeWeeklyBudget enforces a 500 minimum', () => {
  assert.equal(normalizeWeeklyBudget(250), 500);
  assert.equal(normalizeWeeklyBudget('1200'), 1200);
  assert.equal(normalizeWeeklyBudget(800), 800);
});

test('calculateBudgetSummary respects budget and exposes remaining amount', () => {
  const summary = calculateBudgetSummary([
    { cost: 240 },
    { cost: 180 },
    { cost: 110 }
  ], 500);

  assert.equal(summary.weeklyBudget, 500);
  assert.equal(summary.estimatedCost, 530);
  assert.equal(summary.remainingBudget, -30);
  assert.equal(summary.isOverBudget, true);
});
