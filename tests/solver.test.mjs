import test from 'node:test';
import assert from 'node:assert/strict';
import { solveWaterJug, getSuccessors, validateProblem, gcd, MAX_CAPACITY } from '../js/solver.mjs';

const solved = (a,b,target,algorithm='bfs') => solveWaterJug(a,b,target,algorithm);
function assertLegalPath(result, capA, capB, target) {
  assert.equal(result.status, 'solved');
  assert.deepEqual(result.steps[0].state, [0, 0]);
  for (let i = 1; i < result.steps.length; i++) {
    const previous = result.steps[i-1].state;
    const current = result.steps[i].state;
    assert.ok(getSuccessors(previous,capA,capB).some(v => v.state[0]===current[0]&&v.state[1]===current[1]), `Illegal state transition ${previous} -> ${current}`);
  }
  assert.ok(result.steps.at(-1).state.includes(target));
}

test('gcd returns correct divisors', () => { assert.equal(gcd(4, 3), 1); assert.equal(gcd(6, 4), 2); assert.equal(gcd(12, 8), 4); });
test('classic 4L / 3L target 2: BFS finds 4-move shortest path', () => {
  const result=solved(4,3,2);
  assertLegalPath(result,4,3,2);
  assert.equal(result.steps.length-1,4);
  assert.ok(result.explored >= 1);
});
test('DFS returns a valid sequence', () => assertLegalPath(solved(4,3,2,'dfs'),4,3,2));
test('BFS is no longer than DFS on the same problem', () => {
  assert.ok(solved(4,3,2,'bfs').steps.length <= solved(4,3,2,'dfs').steps.length);
});
test('goal may be in jug A or B', () => { assertLegalPath(solved(5,3,3),5,3,3); assertLegalPath(solved(5,3,5),5,3,5); });
test('zero target already solved with zero moves', () => {const r=solved(4,3,0);assert.equal(r.status,'solved');assert.equal(r.steps.length,1);});
test('target larger than both capacities is invalid', () => assert.equal(solved(4,3,5).status,'invalid'));
test('negative, zero, noninteger and over-limit capacities rejected', () => {
  for (const a of [-1,0,1.5,MAX_CAPACITY+1]) assert.ok(validateProblem(a,3,2));
});
test('non-integer and negative targets rejected', () => {
  for (const t of [-1,1.2,NaN]) assert.equal(solved(4,3,t).status,'invalid');
});
test('invalid algorithm rejected', () => assert.equal(solved(4,3,2,'random').status,'invalid'));
test('impossible gcd case returns explicit reason', () => {const r=solved(6,4,3);assert.equal(r.status,'unreachable');assert.match(r.reason,/greatest common divisor/);});
test('equal-capacity jugs work', () => assertLegalPath(solved(5,5,5),5,5,5));
test('successors stay in bounds and contain no no-op', () => {
  for (let a=0;a<=4;a++)for(let b=0;b<=3;b++){
    const result=getSuccessors([a,b],4,3);
    for(const {state:[x,y]} of result){assert.ok(x>=0&&x<=4&&y>=0&&y<=3);assert.ok(x!==a||y!==b);}
  }
});
test('search discovers bounded number of states', () => {
  const r=solved(29,30,17);
  assertLegalPath(r,29,30,17);
  assert.ok(r.discovered <= 30*31);
  assert.ok(r.maxFrontier <= r.discovered);
});
