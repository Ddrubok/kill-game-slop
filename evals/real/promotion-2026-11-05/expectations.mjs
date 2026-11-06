import { isDeepStrictEqual } from 'node:util';

// Exact historical signatures: an unrelated failure must not count as reproduction.
export function promotionChecks({ conditions, reducedState, reducedCalls }, expectBroken = false) {
  const checks = [];
  const check = (name, actual, expected) => checks.push({ name, passed: isDeepStrictEqual(actual, expected) });
  check('viewports', conditions.map(c => c.width), [360, 960]);
  for (const c of conditions) {
    check(`${c.width}: double click`, c.doubleClick, expectBroken ? ['Queen', 'Queen'] : ['Queen']);
    check(`${c.width}: stale callback`, c.staleClose, expectBroken ? ['Knight'] : []);
    check(`${c.width}: replacement exists`, c.replacementVisible, true);
    check(`${c.width}: current choice`, c.currentChoice, expectBroken ? ['Knight', 'Rook'] : ['Rook']);
    check(`${c.width}: option count`, c.options.length, 4);
  }
  check('reduced motion: animation', reducedState.animation, expectBroken ? 'promotionModalOut' : 'none');
  check('reduced motion: disabled options', reducedState.disabled, expectBroken ? 0 : 4);
  check('reduced motion: selection', reducedState.selected, expectBroken ? null : 'Bishop');
  check('reduced motion: outline', reducedState.outline, expectBroken ? 'none' : 'solid');
  check('reduced motion: pending callback', reducedState.callsBeforeClose, []);
  check('reduced motion: completed callback', reducedCalls, ['Bishop']);
  return checks;
}
