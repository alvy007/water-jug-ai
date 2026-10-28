import { solveWaterJug, MAX_CAPACITY } from './solver.mjs';

const $ = (id) => document.getElementById(id);
const form = $('puzzle-form');
let result = null;
let currentStep = 0;
let timer = null;
let config = { a: 4, b: 3, target: 2, algorithm: 'bfs' };

function stopPlayback() {
  if (timer !== null) window.clearInterval(timer);
  timer = null;
  $('play-label').textContent = 'Play';
  $('play-pause').setAttribute('aria-label', 'Play solution');
  $('play-pause').classList.remove('is-playing');
}

function displayWater(a, b) {
  for (const [jug, amount, capacity] of [['a', a, config.a], ['b', b, config.b]]) {
    $(`water-${jug}`).style.height = `${(amount / capacity) * 100}%`;
    const level = $(`level-${jug}`);
    level.textContent = String(amount);
    const unit = document.createElement('span');
    unit.textContent = ' L';
    level.append(unit);
    $(`jug-${jug}-vessel`).setAttribute('aria-label', `Jug ${jug.toUpperCase()}: ${amount} of ${capacity} litres`);
    $(`capacity-${jug}-label`).textContent = `CAPACITY ${capacity} L`;
  }
}

function displayStep(index, shouldScroll = false) {
  if (!result || result.status !== 'solved') return;
  currentStep = Math.max(0, Math.min(index, result.steps.length - 1));
  const step = result.steps[currentStep];
  displayWater(...step.state);
  $('step-action').textContent = step.detail;
  $('step-position').textContent = `Step ${currentStep} of ${result.steps.length - 1}`;
  $('previous-step').disabled = currentStep === 0;
  $('next-step').disabled = currentStep === result.steps.length - 1;
  const cards = document.querySelectorAll('.step-card');
  cards.forEach((card, i) => {
    card.classList.toggle('active', i === currentStep);
    card.setAttribute('aria-current', String(i === currentStep ? 'step' : 'false'));
  });
  const active = cards[currentStep];
  if (active && shouldScroll) active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function setMetric(id, value) { $(id).textContent = String(value); }

function renderSteps(steps) {
  const list = $('step-list');
  list.replaceChildren();
  const fragment = document.createDocumentFragment();
  steps.forEach((step, i) => {
    const item = document.createElement('li');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'step-card';
    const number = document.createElement('span');
    number.className = 'step-number';
    number.textContent = String(i).padStart(2, '0');
    const text = document.createElement('span');
    text.className = 'step-text';
    const title = document.createElement('strong');
    title.textContent = step.action;
    const detail = document.createElement('small');
    detail.textContent = step.detail;
    text.append(title, detail);
    const state = document.createElement('span');
    state.className = 'step-state';
    state.textContent = `(${step.state[0]}, ${step.state[1]})`;
    button.append(number, text, state);
    button.addEventListener('click', () => { stopPlayback(); displayStep(i, true); });
    item.append(button);
    fragment.append(item);
  });
  list.append(fragment);
}

function setMessage(text, type) {
  const message = $('message');
  message.textContent = text;
  message.className = `message ${type || ''}`.trim();
  message.hidden = false;
}

function runSolver(event) {
  if (event) event.preventDefault();
  stopPlayback();
  const a = Number($('capacity-a').value);
  const b = Number($('capacity-b').value);
  const target = Number($('target').value);
  const algorithm = form.elements.algorithm.value;
  if ([$('capacity-a'), $('capacity-b'), $('target')].some(input => input.value.trim() === '')) {
    setMessage('Please enter both jug capacities and a target.', 'error');
    $('result-pill').textContent = 'INVALID INPUT';
    $('result-pill').className = 'result-pill error-pill';
    return;
  }
  const nextResult = solveWaterJug(a, b, target, algorithm);
  if (nextResult.status === 'invalid') {
    setMessage(nextResult.reason, 'error');
    $('result-pill').textContent = 'INVALID INPUT';
    $('result-pill').className = 'result-pill error-pill';
    return;
  }
  config = { a, b, target, algorithm };
  result = nextResult;
  currentStep = 0;
  displayWater(0, 0);
  setMetric('moves-count', nextResult.status === 'solved' ? nextResult.steps.length - 1 : '0');
  setMetric('explored-count', nextResult.explored);
  setMetric('discovered-count', nextResult.discovered);
  setMetric('frontier-count', nextResult.maxFrontier);
  $('play-pause').disabled = nextResult.status !== 'solved' || nextResult.steps.length <= 1;
  $('steps-badge').textContent = nextResult.status === 'solved' ? `${nextResult.steps.length - 1} MOVES FOUND` : 'NO SOLUTION';
  if (nextResult.status === 'solved') {
    $('result-pill').textContent = 'SOLUTION FOUND';
    $('result-pill').className = 'result-pill success-pill';
    const moves = nextResult.steps.length - 1;
    setMessage(`${algorithm.toUpperCase()} found ${moves} move${moves === 1 ? '' : 's'} to reach ${target} L. Select any step below or use the playback controls.`, 'success');
    renderSteps(nextResult.steps);
    displayStep(0);
  } else {
    $('result-pill').textContent = 'UNREACHABLE';
    $('result-pill').className = 'result-pill error-pill';
    $('step-list').replaceChildren();
    $('step-action').textContent = 'No valid solution';
    $('step-position').textContent = 'Try a different target';
    $('previous-step').disabled = true;
    $('next-step').disabled = true;
    setMessage(nextResult.reason, 'error');
  }
}

form.addEventListener('submit', runSolver);
$('reset-button').addEventListener('click', () => {
  $('capacity-a').value = 4;
  $('capacity-b').value = 3;
  $('target').value = 2;
  form.elements.algorithm.value = 'bfs';
  runSolver();
});
$('previous-step').addEventListener('click', () => { stopPlayback(); displayStep(currentStep - 1); });
$('next-step').addEventListener('click', () => { stopPlayback(); displayStep(currentStep + 1); });
$('play-pause').addEventListener('click', () => {
  if (!result || result.status !== 'solved') return;
  if (timer !== null) { stopPlayback(); return; }
  if (currentStep === result.steps.length - 1) displayStep(0);
  $('play-label').textContent = 'Pause';
  $('play-pause').setAttribute('aria-label', 'Pause solution');
  $('play-pause').classList.add('is-playing');
  timer = window.setInterval(() => {
    if (currentStep >= result.steps.length - 1) { stopPlayback(); return; }
    displayStep(currentStep + 1);
    if (currentStep === result.steps.length - 1) stopPlayback();
  }, 1000);
});
// Open with an example already solved, while keeping controls fully editable.
runSolver();
