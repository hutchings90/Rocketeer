function Attack(name, delay) {
	// console.log('Attack');
	this.name = name;
	this.ticks = 0;
	this.delay = delay;
}

Attack.prototype.clear = function() {
	// console.log('clear');
	this.ticks = 0;
};

Attack.prototype.isDone = function() {
	// console.log('isDone');
	return this.ticks >= this.delay;
};

Attack.prototype.tick = function() {
	// console.log('tick');
	this.ticks++;
	if (!this.isDone()) return false;
	this.ticks = 1;
	return true;
};