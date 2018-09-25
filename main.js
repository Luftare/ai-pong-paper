const GENERATION_SIZE = 50;
const ROUNDS_PER_GENERATION = 8;
const MAX_SCHEDULED_UPDATED = 100;
const MAX_SCORE = 5000;

const canvas = document.getElementById("simulation");
const ctx = canvas.getContext("2d");

let scoreLog = [];
let agents = [];
let generationCounter = 1;
let score = 0;
let highscore = 0;
let currentRoundOfGeneration = 0;
let updateIndex = 0;
let disableRendering = false;
let humanIsReadyToPlay = false;

function setEventListeners() {
  document.getElementById("disable-rendering").addEventListener("click", () => {
    disableRendering = true;
  });
  
  document.getElementById("enable-rendering").addEventListener("click", () => {
    disableRendering = false;
  });
  
  document.getElementById("simulation").addEventListener("mousemove", (e) => {
    const bounds = e.target.getBoundingClientRect();
    const canvasX = e.pageX - bounds.x;
    const canvasRelativeX = canvasX / bounds.width;
    const humanAgent = agents.find(agent => agent.isHuman);
    if(humanAgent) {
      humanAgent.humanInput = [canvasRelativeX];
    }
  });
  
  document.getElementById("simulation").addEventListener("mouseenter", () => {
    humanIsReadyToPlay = true;
  });
  
  document.getElementById("simulation").addEventListener("mouseleave", () => {
    humanIsReadyToPlay = false;
  });
}

window.onload = () => {
  setEventListeners();
	ball.init();
	agents = generateRandomGeneration(GENERATION_SIZE);
  updateElement("#populationSize", agents.length);
  updateElement("#agentsAlive", agents.length);
  updateElement("#generation", generationCounter);
  loop();
};
