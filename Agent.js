const {Architect, Neuron, Layer, Network, Trainer} = synaptic;

function Agent(network, isHuman = false) {
	this.isHuman = isHuman;
	this.humanInput = [0.5];
	this.width = Agent.width;
	this.height = Agent.height;
	this.failed = false;
	this.network = network || new Architect.Perceptron(...AGENT_NETWORK_LAYERS);
	this.x = canvas.scrollWidth / 2;
	this.vX = 0;
	this.score = 0;
}

Agent.width = AGENT_WIDTH;
Agent.height = AGENT_HEIGHT;

Agent.prototype = {
	update() {
		if(this.score >= MAX_SCORE) this.failed = true;
		if(this.failed) return;
		if(this.isHuman) {
			this.handleExternalInput();
		} else {
			this.think();
		}
		this.move();
		this.bound();
	},
	mutate(amount) {
		const input = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random()].map((val, i) => this.inputGains[i] * val);
		const output = [Math.random()];
		for (var i = 0; i < amount; i++) {
			this.network.activate(input);
			this.network.propagate(AGENT_LEARNING_RATE, output);
		}
		return this;
	},
	handleExternalInput() {
		this.applyOutputToVelocity(this.humanInput);
	},
	think() {
		const input = this.getInput();
		const output = this.network.activate(input);
		this.applyOutputToVelocity(output);
	},
	applyOutputToVelocity(output) {
		const sign = output[0] > 0.5 ? 1 : -1;
		this.vX = Math.pow(Math.abs(output[0] - 0.5), 0.1) * sign * AGENT_MAX_SPEED;
	},
	getNormalizedInput() {
		return [
			(this.x / canvas.scrollWidth),
			(ball.x / canvas.scrollWidth),
			(ball.y / canvas.scrollHeight),
			((ball.maxXYSpeed + ball.vX) / (2 * ball.maxXYSpeed)),
			((ball.maxXYSpeed + ball.vY) / (2 * ball.maxXYSpeed))
		];
	},
	clone() {
		const network = this.network.toJSON();
		return new Agent(Network.fromJSON(network));
	},
  getInput() {
    return this.getNormalizedInput().map((v, i) => v * this.inputGains[i]);
  },
	inputGains: AGENT_INPUT_GAINS,
	move() {
		this.x += this.vX;
	},
	bound() {
		this.x = Math.max(Math.min(this.x, canvas.width - this.width / 2), this.width / 2);
	},
	draw() {
		ctx.fillStyle = this.isHuman ? "red" : "black";
		ctx.fillRect(this.x - this.width / 2, canvas.height, this.width, -this.height);
    ctx.fillRect(this.x, canvas.scrollHeight - this.height, 1, -5);
	}
};
