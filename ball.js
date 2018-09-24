var ball = {
	acceleration: 1.0005,
	r: 5,
	maxXYSpeed: 15,
	init() {
		const speed = 2;
    const sign = Math.random() > 0.5? 1 : -1;
		this.vY = (Math.random() + 1) * speed;
		this.vX = sign * (0.1 + Math.random()) * speed * 3;
		this.x = canvas.width / 2;
		this.y = 0;
	},
	handleCollisions() {
		if(this.x - this.r < 0) {//left wall
			this.vX = Math.abs(this.vX);
			this.x = this.r;
		}
		if(this.x + this.r > canvas.width) {//right wall
			this.vX = -Math.abs(this.vX);
			this.x = canvas.width - this.r;
		}
		if(this.y - this.r < 0) {//ceiling
			this.vY = Math.abs(this.vY);
			this.y = this.r;
		}
		if(this.y + this.r + Agent.height > canvas.height) {//floor
			const bounced = this.handlePaddleCollisions(agents);
      if(bounced) {
				this.vY = -Math.abs(this.vY);
				this.y = canvas.height - Agent.height - this.r;
        updateElement("#score", ++score);
				updateElement("#agentsAlive", agents.filter(a => !a.failed).length);
      } else {
				handleAllAgentsFail();
      }
		}
	},
	handlePaddleCollisions(agents) {
		let bounced = false;
		agents.forEach(a => {
			if(this.isAlignedWithPaddle(a)) {
				if(!a.failed) {
					a.score++;
					bounced = true;
				}
			} else {
				a.failed = true;
			}
		});
		return bounced;
	},
	isAlignedWithPaddle(paddle) {
		return paddle.x + paddle.width / 2 > this.x - this.r && this.x + this.r > paddle.x - paddle.width / 2;
	},
	move() {
		this.x += this.vX;
		this.y += this.vY;
	},
	accelerate() {
		this.vX *= this.acceleration;
		this.vY *= this.acceleration;
	},
	update() {
		this.accelerate();
		this.move();
		this.handleCollisions();
	},
	draw(){
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
		ctx.fill();
	}
};
