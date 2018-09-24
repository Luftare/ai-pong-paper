function generateRandomGeneration(count) {
	return (new Array(count)).fill(1).map((a, i) => {
    let network;
    if(eliteNetworks.length) {
      network = Network.fromJSON(eliteNetworks[i % eliteNetworks.length]);
    } else {
      network = new Architect.Perceptron(5, 6, 2);
    }
    const agent = new Agent(network);
    agent.mutate(i);
		return agent;
	});
}

function arrayMax(arr) {
  let max = 0;
  arr.forEach(v => {
    if(v > max) max = v;
  })
  return max;
}

function startNewGeneration() {
  generationCounter++;
	ball.init();
	agents = getNewGeneration();
  updateElement("#populationSize", agents.length);
  updateElement("#agentsAlive", agents.length);
  updateElement("#generation", generationCounter);
}

function getPopulationElite(pop) {
	const elite = [...pop].sort((a, b) => b.score - a.score).filter(a => a.score > 1);
	return elite.length > 0
		? pop.map((a, i) => elite[i % elite.length])
		: [];
}

function getNewGeneration() {
  const elite = getPopulationElite(agents);
  scoreLog.push(score);
  if(scoreLog.length > 70) scoreLog.shift();
  plot(scoreLog);
  if(score > highscore) {
    elite.length > 0 && eliteNetworks.push(elite[0].network.toJSON());
    highscore = score;
    updateElement("#highscore", highscore);
  }
  updateElement("#score", score = 0);
	return elite.length > 0
		? (elite
			.map(a => a.network.toJSON())
			.map((n, i) => new Agent(Network.fromJSON(n)))
			.map((a, i) => a.mutate(i)))
		: generateRandomGeneration(generationSize);
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
	render();
  requestAnimationFrame(loop);
}