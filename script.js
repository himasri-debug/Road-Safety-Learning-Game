const questionBank = {
  beginner: [
    { icon: '🛑', question: 'What should you do at a STOP sign?', hint: 'Think about the safest action at an intersection.', answers: ['Slow down and keep moving', 'Come to a complete stop', 'Honk and proceed', 'Stop only if traffic is coming'], correct: 1, explanation: 'A STOP sign means you must come to a complete stop and proceed only when it is safe and lawful.' },
    { icon: '🚦', question: 'What does a steady red traffic light mean?', hint: 'Traffic signals tell road users when to stop or go.', answers: ['Stop before the stop line', 'Speed up to cross quickly', 'Go if the road looks empty', 'Only pedestrians must stop'], correct: 0, explanation: 'A steady red signal means stop before the stop line and wait until you may proceed.' },
    { icon: '🪖', question: 'Why should a two-wheeler rider wear a helmet?', hint: 'Think about protection in a crash.', answers: ['It makes the ride faster', 'It replaces safe riding', 'It helps protect the head', 'It is needed only at night'], correct: 2, explanation: 'A properly fitted, approved helmet helps reduce the risk of serious head injury.' },
    { icon: '📵', question: 'What is the safest choice when driving and your phone rings?', hint: 'Your attention should stay on the road.', answers: ['Read the message quickly', 'Answer while steering', 'Look down at the screen', 'Wait until safely parked'], correct: 3, explanation: 'Avoid handling a phone while driving. Pull over safely and legally before using it.' }
  ],
  intermediate: [
    { icon: '🚸', question: 'You approach a pedestrian crossing. What should you do?', hint: 'People crossing the road may be difficult to see.', answers: ['Accelerate past it', 'Slow down and be ready to stop', 'Honk continuously', 'Overtake the vehicle ahead'], correct: 1, explanation: 'Reduce speed, watch for people crossing, and stop when required by local rules.' },
    { icon: '🌧️', question: 'What should you do on a wet, slippery road?', hint: 'Tyres may have less grip than usual.', answers: ['Follow other vehicles closely', 'Brake harshly at every turn', 'Reduce speed and increase following distance', 'Use high speed to avoid skidding'], correct: 2, explanation: 'Lower speed and a larger following distance give you more time to react on slippery roads.' },
    { icon: '🚑', question: 'An emergency vehicle approaches with its siren on. What should you do?', hint: 'Make room safely without creating another hazard.', answers: ['Race ahead of it', 'Block the road', 'Follow closely behind it', 'Safely give way as local rules require'], correct: 3, explanation: 'Stay calm, observe your surroundings, and give way safely according to local traffic rules.' },
    { icon: '↔️', question: 'Before changing lanes, what should you do?', hint: 'Mirrors alone may not show every nearby road user.', answers: ['Signal, check mirrors and blind spot', 'Move immediately if you signal', 'Only check the rear-view mirror', 'Brake suddenly without checking'], correct: 0, explanation: 'Signal in advance, check mirrors and blind spots, and change lanes only when safe.' }
  ],
  expert: [
    { icon: '🚗', question: 'A vehicle ahead brakes suddenly. What is the best way to reduce this risk in future?', hint: 'Think about the space you leave between vehicles.', answers: ['Drive closer to see better', 'Keep a safe following distance', 'Use the horn continuously', 'Watch only the vehicle beside you'], correct: 1, explanation: 'A safe following distance gives you time and space to respond when traffic changes suddenly.' },
    { icon: '🌙', question: 'When driving at night, how should you respond to glare from oncoming headlights?', hint: 'Avoid staring directly into bright lights.', answers: ['Turn on high beams at the other driver', 'Look directly at the headlights', 'Reduce speed if needed and look toward the road edge', 'Close one eye while driving'], correct: 2, explanation: 'Avoid looking directly into glare, use appropriate speed, and keep attention on your path. Follow local headlight rules.' },
    { icon: '🛣️', question: 'You miss your highway exit. What should you do?', hint: 'A missed exit is not an emergency.', answers: ['Reverse along the shoulder', 'Stop suddenly and turn across lanes', 'Make a quick U-turn', 'Continue to the next exit and reroute'], correct: 3, explanation: 'Never reverse or make a sudden manoeuvre on a highway. Continue safely to the next exit.' },
    { icon: '🍺', question: 'What is the safest plan if you have consumed alcohol?', hint: 'Judgement and reaction time can be impaired.', answers: ['Arrange a sober driver or other safe transport', 'Drive slowly and open a window', 'Drink coffee before driving', 'Drive only on quiet roads'], correct: 0, explanation: 'Do not drive after drinking. Arrange a sober driver, taxi, public transport, or another safe option.' }
  ]
};

const levelDetails = {
  beginner: { label: 'BEGINNER', seconds: 20 },
  intermediate: { label: 'INTERMEDIATE', seconds: 15 },
  expert: { label: 'EXPERT', seconds: 12 }
};
const levelScreen = document.getElementById('levelScreen');
const questionScreen = document.getElementById('questionScreen');
const resultScreen = document.getElementById('resultScreen');
const questionCount = document.getElementById('questionCount');
const timerText = document.getElementById('timerText');
const progressFill = document.getElementById('progressFill');
const questionSymbol = document.getElementById('questionSymbol');
const questionText = document.getElementById('questionText');
const questionHint = document.getElementById('questionHint');
const answerList = document.getElementById('answerList');
const feedback = document.getElementById('feedback');
const nextButton = document.getElementById('nextButton');
const levelLabel = document.getElementById('levelLabel');
let currentLevel = 'beginner';
let questions = [];
let questionIndex = 0;
let score = 0;
let correctAnswers = 0;
let secondsLeft = 20;
let timerId = null;
let answered = false;

function getBestScore() {
  try { return Number(localStorage.getItem('roadwiseBestScore')) || 0; }
  catch { return 0; }
}
function updateBestScore() { document.getElementById('bestScore').textContent = `${getBestScore()} pts`; }
function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
function stopTimer() { if (timerId !== null) clearInterval(timerId); timerId = null; }
function startGame(level) {
  stopTimer();
  currentLevel = level;
  questions = shuffle(questionBank[level]);
  questionIndex = 0;
  score = 0;
  correctAnswers = 0;
  levelScreen.classList.add('hidden');
  resultScreen.classList.add('hidden');
  questionScreen.classList.remove('hidden');
  renderQuestion();
}
function renderQuestion() {
  stopTimer();
  answered = false;
  const question = questions[questionIndex];
  const total = questions.length;
  secondsLeft = levelDetails[currentLevel].seconds;
  questionCount.textContent = `QUESTION ${questionIndex + 1} / ${total}`;
  timerText.textContent = secondsLeft;
  progressFill.style.width = `${(questionIndex / total) * 100}%`;
  questionSymbol.textContent = question.icon;
  questionText.textContent = question.question;
  questionHint.textContent = question.hint;
  levelLabel.textContent = `${levelDetails[currentLevel].label} LEVEL`;
  feedback.className = 'feedback hidden';
  feedback.textContent = '';
  nextButton.classList.add('hidden');
  nextButton.textContent = questionIndex === total - 1 ? 'See results →' : 'Next question →';
  answerList.replaceChildren();
  question.answers.forEach((answer, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'answer-option';
    button.innerHTML = `<span class="answer-letter">${String.fromCharCode(65 + index)}</span><span></span>`;
    button.querySelector('span:last-child').textContent = answer;
    button.addEventListener('click', () => chooseAnswer(index));
    answerList.appendChild(button);
  });
  timerId = setInterval(() => {
    secondsLeft -= 1;
    timerText.textContent = secondsLeft;
    if (secondsLeft <= 5) timerText.parentElement.style.background = '#fff0f0';
    if (secondsLeft <= 0) {
      stopTimer();
      chooseAnswer(-1);
    }
  }, 1000);
}
function chooseAnswer(selectedIndex) {
  if (answered) return;
  answered = true;
  stopTimer();
  const question = questions[questionIndex];
  const buttons = [...answerList.querySelectorAll('button')];
  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === question.correct) button.classList.add('correct');
    if (index === selectedIndex && selectedIndex !== question.correct) button.classList.add('incorrect');
  });
  const isCorrect = selectedIndex === question.correct;
  if (isCorrect) {
    correctAnswers += 1;
    score += 100 + Math.max(0, secondsLeft) * 5;
    feedback.textContent = `Correct! ${question.explanation}`;
    feedback.className = 'feedback good';
  } else {
    feedback.textContent = `${selectedIndex === -1 ? 'Time is up!' : 'Not quite.'} ${question.explanation}`;
    feedback.className = 'feedback bad';
  }
  progressFill.style.width = `${((questionIndex + 1) / questions.length) * 100}%`;
  nextButton.classList.remove('hidden');
}
function showResults() {
  stopTimer();
  questionScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');
  const total = questions.length;
  const accuracy = Math.round((correctAnswers / total) * 100);
  document.getElementById('finalScore').textContent = score;
  document.getElementById('correctCount').textContent = `${correctAnswers}/${total}`;
  document.getElementById('accuracy').textContent = `${accuracy}%`;
  const badge = accuracy === 100 ? 'Road Star' : accuracy >= 75 ? 'Safe Driver' : accuracy >= 50 ? 'Road Learner' : 'Rookie';
  document.getElementById('earnedBadge').textContent = badge;
  document.getElementById('resultMedal').textContent = accuracy === 100 ? '🏆' : accuracy >= 75 ? '🥇' : accuracy >= 50 ? '🥈' : '🚦';
  document.getElementById('resultTitle').textContent = accuracy === 100 ? 'Perfect score!' : accuracy >= 75 ? 'Great driving!' : accuracy >= 50 ? 'Good progress!' : 'Keep practising!';
  document.getElementById('resultMessage').textContent = accuracy >= 75 ? 'You are building strong road safety knowledge.' : 'Review the explanations and try the challenge again.';
  if (score > getBestScore()) {
    try { localStorage.setItem('roadwiseBestScore', String(score)); } catch { /* Storage may be unavailable. */ }
  }
  updateBestScore();
}
nextButton.addEventListener('click', () => {
  if (!answered) return;
  if (questionIndex < questions.length - 1) {
    questionIndex += 1;
    timerText.parentElement.style.background = '';
    renderQuestion();
  } else showResults();
});
document.querySelectorAll('.level-card').forEach(button => button.addEventListener('click', () => startGame(button.dataset.level)));
document.getElementById('retryButton').addEventListener('click', () => startGame(currentLevel));
document.getElementById('levelsButton').addEventListener('click', () => {
  stopTimer();
  resultScreen.classList.add('hidden');
  questionScreen.classList.add('hidden');
  levelScreen.classList.remove('hidden');
});
document.getElementById('year').textContent = new Date().getFullYear();
updateBestScore();