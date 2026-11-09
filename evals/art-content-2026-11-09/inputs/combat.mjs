export function attack(unit, enemies) {
  const inRange = enemies.filter(e => e.distance <= unit.range);
  const targets = unit.targeting === 'all-in-range' ? inRange : inRange.slice(0, 1);
  return targets.map(e => ({ id: e.id, damage: unit.damage, slow: unit.slow ?? 0 }));
}
