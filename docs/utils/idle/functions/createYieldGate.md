[**nimbi-cms**](../../../README.md)

***

[nimbi-cms](../../../README.md) / [utils/idle](../README.md) / createYieldGate

# Function: createYieldGate()

> **createYieldGate**(`budgetMs?`): () => `Promise`\<`void`\>

Create a time-budgeted yield gate.

The count-based [yieldIfNeeded](yieldIfNeeded.md) yields every N iterations regardless
of how long each iteration takes. That is a poor proxy: a loop doing cheap
string work yields far more often than it needs to, while a loop doing
per-iteration I/O can block for seconds between yields. The nine call sites
in this codebase use thresholds from 8 to 128, which is the symptom.

A gate created here yields once per `budgetMs` of *elapsed time* instead,
so the yield rate adapts to the actual cost of the work.

## Parameters

### budgetMs?

`number` = `16`

Minimum elapsed time between yields. 16ms
  is roughly one animation frame, which keeps the main thread responsive
  without yielding so often that throughput collapses.

## Returns

Call once per loop iteration.

() => `Promise`\<`void`\>
