const {Architect, Neuron, Layer, Network, Trainer} = synaptic;

function Agent(network) {
	this.width = Agent.width;
	this.height = Agent.height;
	this.failed = false;
	this.network = network || new Architect.Perceptron(5, 5, 1);
	this.x = canvas.scrollWidth / 2;
	this.vX = 0;
	this.score = 0;
	this.maxSpeed = 5000;
}

Agent.width = 100;
Agent.height = 5;

Agent.prototype = {
	update() {
		if(this.score >= maxScore) this.failed = true;
		if(this.failed) return;
		this.think();
		this.move();
		this.bound();
	},
	mutate(quality) {
		const learningRate = 0.0001 * quality;
		const input = [Math.random(), Math.random(), Math.random(), Math.random(), Math.random()].map((val, i) => this.inputGains[i] * val);
		const output = [Math.random()];
		for (var i = 0; i < 5; i++) {
			this.network.activate(input);
			this.network.propagate(learningRate, output);
		}
		return this;
	},
	think() {
		const input = this.getInput();
		const output = this.network.activate(input);
		this.vX = (output[0] - 0.5) * this.maxSpeed;
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
  inputGains: [20, 20, 1, 1, 1],
	move() {
		this.x += this.vX;
	},
	bound() {
		this.x = Math.max(Math.min(this.x, canvas.width - this.width / 2), this.width / 2);
	},
	draw() {
		ctx.fillRect(this.x - this.width / 2, canvas.height, this.width, -this.height);
    ctx.fillRect(this.x, canvas.scrollHeight - this.height, 1, -5);
	}
};
