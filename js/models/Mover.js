function Mover(name, speed, x, y) {
	// console.log('Mover');
	this.name = name;
	this.speed = speed || 5;
	this.x = x || 0;
	this.y = y || 0;
}

Mover.prototype.setPos = function(x, y, e) {
	// console.log('setPos');
	var bottom = 0 - e.height;
	if (x < this.x && x < 0 - e.width) return -1;
	if (x > this.x && x > View.prototype.FIELD_WIDTH) return 1;
	if (y < 0 - e.height) y = View.prototype.FIELD_HEIGHT;
	else if (y > View.prototype.FIELD_HEIGHT) y = bottom;
	this.x = x;
	this.y = y;
	e.style.left = this.x + 'px';
	e.style.top = this.y + 'px';
	return 0;
};