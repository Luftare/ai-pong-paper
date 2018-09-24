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
  round = 0;
  generationCounter++;
	ball.init();
  agents = getNewGeneration();
  updateElement("#populationSize", agents.length);
  updateElement("#agentsAlive", agents.length);
  updateElement("#generation", generationCounter);
}

function getPopulationElite(pop) {
  return [...pop].sort((a, b) => b.score - a.score).filter(a => a.score >= maxRounds);
}

function handleAllAgentsFail() {
  const shouldStartNewGeneration = round >= maxRounds;
  if(shouldStartNewGeneration) {
    startNewGeneration();
  } else {
    startNewRoundWithExistingGeneration();
  }
}

function startNewRoundWithExistingGeneration() {
  round++;
  ball.init();
  agents.forEach(agent => {
    agent.failed = false;
    agent.x = canvas.scrollWidth / 2;
  });
}

function getNewGeneration() {
  const elite = getPopulationElite(agents);
  scoreLog.push(score);
  if(scoreLog.length > 70) scoreLog.shift();
  plot(scoreLog);
  if(score > highscore) {
    highscore = score;
    updateElement("#highscore", highscore);
  }
  updateElement("#score", score = 0);
  const newPopulation = elite.length > 0
    ? [...[...Array(generationSize / 2)].map((_, index) => elite[index % elite.length].clone()).map((a, index) => a.mutate(index)), ...generateRandomGeneration(generationSize / 2)]
    : generateRandomGeneration(generationSize);
	return newPopulation;
}

function updateElement(query, txt) {
  document.querySelector(query).innerHTML = txt;
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
    if(updateIndex >= maxUpdateIndex) {
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