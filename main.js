const canvas = document.getElementById("simulation");
const ctx = canvas.getContext("2d");

const generationSize = 50;
let eliteNetworks = [];
let scoreLog = [];
let agents = [];
let generationCounter = 1;
let score = 0;
let highscore = 0;

window.onload = () => {
	ball.init();
	agents = generateRandomGeneration(generationSize);
  updateElement("#populationSize", agents.length);
  updateElement("#agentsAlive", agents.length);
  updateElement("#generation", generationCounter);
  loop();
};
