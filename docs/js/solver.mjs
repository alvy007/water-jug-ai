/**
 * Classical AI: Water Jug state-space search.
 * Each state [a, b] represents the amount of water in jug A and B.
 * Every legal operation has equal cost (one move).
 */
export const MAX_CAPACITY = 30;

const key = ([a, b]) => `${a},${b}`;

export function gcd(a, b) {
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}

export function validateProblem(capA, capB, target, algorithm = 'bfs') {
  for (const [name, value] of [['Jug A capacity', capA], ['Jug B capacity', capB], ['Target', target]]) {
    if (!Number.isInteger(value)) return `${name} must be a whole number.`;
  }
  if (capA < 1 || capB < 1) return 'Jug capacities must be at least 1 litre.';
  if (capA > MAX_CAPACITY || capB > MAX_CAPACITY) return `Jug capacities cannot exceed ${MAX_CAPACITY} litres in this demo.`;
  if (target < 0) return 'Target cannot be negative.';
  if (target > Math.max(capA, capB)) return 'The target must fit in at least one jug.';
  if (!['bfs', 'dfs'].includes(algorithm)) return 'Choose either BFS or DFS.';
  return null;
}

/** Enumerate legal actions, omitting no-ops. */
export function getSuccessors(state, capA, capB) {
  const [a, b] = state;
  const aToB = Math.min(a, capB - b);
  const bToA = Math.min(b, capA - a);
  const candidates = [
    { state: [capA, b], action: 'Fill jug A', detail: `Fill jug A to ${capA} L` },
    { state: [a, capB], action: 'Fill jug B', detail: `Fill jug B to ${capB} L` },
    { state: [0, b], action: 'Empty jug A', detail: 'Empty jug A completely' },
    { state: [a, 0], action: 'Empty jug B', detail: 'Empty jug B completely' },
    { state: [a - aToB, b + aToB], action: 'Pour A → B', detail: `Pour ${aToB} L from A into B` },
    { state: [a + bToA, b - bToA], action: 'Pour B → A', detail: `Pour ${bToA} L from B into A` },
  ];
  return candidates.filter(({ state: next }) => next[0] !== a || next[1] !== b);
}

/**
 * Find a path to a state where EITHER jug has the target amount.
 * BFS yields a shortest action sequence for the unweighted graph.
 * DFS yields some solution, potentially using more actions.
 */
export function solveWaterJug(capA, capB, target, algorithm = 'bfs') {
  const error = validateProblem(capA, capB, target, algorithm);
  if (error) return { status: 'invalid', reason: error, steps: [], explored: 0, discovered: 0, maxFrontier: 0 };

  const start = [0, 0];
  if (target === 0) {
    return { status: 'solved', reason: '', algorithm, steps: [{ state: start, action: 'Initial state', detail: 'Both jugs start empty' }], explored: 1, discovered: 1, maxFrontier: 1 };
  }

  if (target % gcd(capA, capB) !== 0) {
    return {
      status: 'unreachable',
      reason: `Impossible with ${capA} L and ${capB} L jugs: ${target} is not a multiple of their greatest common divisor (${gcd(capA, capB)}).`,
      algorithm, steps: [], explored: 0, discovered: 0, maxFrontier: 0,
    };
  }

  const stack = [start];
  let head = 0;
  const seen = new Set([key(start)]);
  const parents = new Map([[key(start), null]]);
  let explored = 0;
  let maxFrontier = 1;

  while ((algorithm === 'bfs' ? head < stack.length : stack.length > 0)) {
    const current = algorithm === 'bfs' ? stack[head++] : stack.pop();
    explored++;
    if (current[0] === target || current[1] === target) {
      const steps = [];
      let nodeKey = key(current);
      while (nodeKey !== null) {
        const record = parents.get(nodeKey);
        const state = nodeKey.split(',').map(Number);
        steps.push(record ? { state, action: record.action, detail: record.detail } : { state, action: 'Initial state', detail: 'Both jugs start empty' });
        nodeKey = record ? record.from : null;
      }
      steps.reverse();
      return { status: 'solved', reason: '', algorithm, steps, explored, discovered: seen.size, maxFrontier };
    }

    const successors = getSuccessors(current, capA, capB);
    // DFS reverses insertion order so its first expanded action mirrors the BFS ordering.
    if (algorithm === 'dfs') successors.reverse();
    for (const next of successors) {
      const id = key(next.state);
      if (seen.has(id)) continue;
      seen.add(id);
      parents.set(id, { from: key(current), action: next.action, detail: next.detail });
      stack.push(next.state);
    }
    const frontier = algorithm === 'bfs' ? stack.length - head : stack.length;
    maxFrontier = Math.max(maxFrontier, frontier);
  }

  return {
    status: 'unreachable',
    reason: 'The search exhausted all reachable states without finding the target.',
    algorithm, steps: [], explored, discovered: seen.size, maxFrontier,
  };
}
