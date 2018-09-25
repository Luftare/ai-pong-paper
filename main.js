const GENERATION_SIZE = 50;
const ROUNDS_PER_GENERATION = 8;
const MAX_SCHEDULED_UPDATES = 100;
const MAX_SCORE = 5000;
const AGENT_LEARNING_RATE = 0.0000003;
const AGENT_MAX_SPEED = 8;
const AGENT_WIDTH = 60;
const AGENT_HEIGHT = 5;
const AGENT_INPUT_QUANTIFICATION = 0.02;
const AGENT_INPUT_GAINS = [2, 2, 1, 1, 1];//["agent horizontal position", "ball horizontal position", "ball vertical position", "ball horizontal velocity", "ball vertical velocity"] 
const AGENT_NETWORK_LAYERS = [5, 2, 1];

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
