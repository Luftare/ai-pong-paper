const canvas = document.getElementById("simulation");
const ctx = canvas.getContext("2d");

document.getElementById("disable-rendering").addEventListener("click", () => {
  disableRendering = true;
});

document.getElementById("enable-rendering").addEventListener("click", () => {
  disableRendering = false;
});

const generationSize = 50;
let eliteNetworks = [];
let scoreLog = [];
let agents = [];
let generationCounter = 1;
let score = 0;
let highscore = 0;
const maxRounds = 8;
let round = 0;
const maxScore = 10;
let updateIndex = 0;
const maxUpdateIndex = 100;
let disableRendering = false;

window.onload = () => {
	ball.init();
	agents = generateRandomGeneration(generationSize);
  updateElement("#populationSize", agents.length);
  updateElement("#agentsAlive", agents.length);
  updateElement("#generation", generationCounter);
  loop();
};
