const {Architect, Neuron, Layer, Network, Trainer} = synaptic;

function Agent(network, isHuman = false) {
	this.isHuman = isHuman;
	this.humanInput = [0.5];
	this.width = Agent.width;
	this.height = Agent.height;
	this.failed = false;
	this.network = network || new Architect.Perceptron(5, 2, 1);
	this.x = canvas.scrollWidth / 2;
	this.vX = 0;
	this.score = 0;
	this.maxSpeed = 20;
}

Agent.width = 60;
Agent.height = 5;

Agent.prototype = {
	update() {
		if(this.score >= maxScore) this.failed = true;
		if(this.failed) return;
		if(this.isHuman) {
			this.handleExternalInput();
		} else {
			this.think();
		}
		this.move();
		this.bound();
	},
	mutate(quality) {
		const learningRate = 0.000005;
		const input = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random()].map((val, i) => this.inputGains[i] * val);
		const output = [Math.random()];
		for (var i = 0; i < quality * 8; i++) {
			this.network.activate(input);
			this.network.propagate(learningRate, output);
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
		this.vX = Math.pow(Math.abs(output[0] - 0.5), 0.1) * sign * this.maxSpeed;
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
	inputGains: [6, 6, 1, 1, 1],
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
