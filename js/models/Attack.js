function Attack(name, delay, speed) {
	// console.log('Attack');
	this.name = name;
	this.ticks = 0;
	this.level = 1;
	this.delay = delay;
	this.speed = speed;
}

Attack.prototype.clear = function() {
	// console.log('clear');
	this.ticks = 0;
};

Attack.prototype.tickToClear = function() {
	// console.log('isActive');
	if (this.ticks < 1) return false;
	return this.tick() == 1;
};

Attack.prototype.isDone = function() {
	// console.log('isDone');
	return this.ticks >= this.delay;
};

Attack.prototype.tick = function() {
	// console.log('tick');
	if (++this.ticks == 1) return true;
	if (!this.isDone()) return false;
	this.ticks = 1;
	return true;
};

Attack.prototype.getFilename = function() {
	// console.log('getFilename');
	var names = this.name.split(' ');
	names[0] = names[0][0].toLowerCase() + names[0].substring(1, names[0].length);
	return names.join('') + this.level;
};

Attack.prototype.make = function(speed, x, y) {
	// console.log('make');
	var filename = this.getFilename();
	var obj = new Mover(filename, speed);
	var e = ContentManager.prototype.getImage(filename);
	y = (y - (e.height / 2));
	obj.x = x;
	obj.y = y;
	e.style.left = x + 'px';
	e.style.top = y + 'px';
	View.prototype.addGameObject(e);
	return {
		obj: obj,
		e: e,
		move: this.move
	};
};

Attack.prototype.move = function() {
	// console.log('move');
	return this.obj.setPos(this.obj.x + this.obj.speed, this.obj.y, this.e);
};