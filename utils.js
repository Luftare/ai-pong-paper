function generateRandomGeneration(count) {
	return [...Array(count)].map(() => new Agent());
}

function arrayMax(arr) {
  let max = 0;
  arr.forEach(v => {
    if(v > max) max = v;
  }) 
  return max;
}

function startNewGeneration() {
  currentRoundOfGeneration = 0;
  generationCounter++;
	ball.init();
  agents = getNewGeneration();
  updateHighscore();
  updateElement("#populationSize", agents.length);
  updateElement("#agentsAlive", agents.length);
  updateElement("#generation", generationCounter);
}

function getPopulationElite(pop) {
  return [...pop].sort((a, b) => b.score - a.score).filter(a => a.score >= ROUNDS_PER_GENERATION).filter(a => !a.isHuman).filter((_, index) => index < MAX_ELITE_COUNT);
}

function handleAllAgentsFail() {
  const shouldStartNewGeneration = currentRoundOfGeneration >= ROUNDS_PER_GENERATION;
  if(shouldStartNewGeneration) {
    startNewGeneration();
  } else {
    startNewRoundWithExistingGeneration();
  }
  if(humanIsReadyToPlay && !agents.find(agent => agent.isHuman)) {
    agents.push(new Agent(null, true));
  }
}

function startNewRoundWithExistingGeneration() {
  currentRoundOfGeneration++;
  ball.init();
  agents.forEach(agent => {
    agent.failed = false;
    agent.x = canvas.scrollWidth / 2;
  });
}

function getNewGeneration() {
  const elite = getPopulationElite(agents);
  const newPopulation = elite.length > 0
    ? [...[...Array(GENERATION_SIZE / 2)].map((_, index) => elite[index % elite.length].clone()).map((a, index) => a.mutate(index)), ...generateRandomGeneration(GENERATION_SIZE / 2)]
    : generateRandomGeneration(GENERATION_SIZE);

	return newPopulation;
}

function updateElement(query, txt) {
  document.querySelector(query).innerHTML = txt;
}

function updateHighscore() {
  scoreLog.push(score);
  if(scoreLog.length > 70) scoreLog.shift();
  plot(scoreLog);
  if(score > highscore) {
    highscore = score;
    updateElement("#highscore", highscore);
  }
  score = 0;
  updateElement("#score", score);
}

function update() {
  ball.update();
	agents.filter(a => !a.failed).forEach(a => a.update());
}

function render() {
	canvas.width = canvas.scrollWidth;
	canvas.height = canvas.scrollHeight;
	ball.draw();
  agents.filter(a => !a.failed).forEach(a => a.draw());
}

function loop() {
 	update();
  if(disableRendering) {
    updateIndex++;
    if(updateIndex >= MAX_SCHEDULED_UPDATES) {
      setTimeout(loop, 0);
      updateIndex = 0;
    } else {
      loop();
    }
  } else {
    render();
    requestAnimationFrame(loop);
  }
}