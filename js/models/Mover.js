function Mover(name, x, y, speed) {
	// console.log('Mover');
	this.name = name;
	this.x = x || 0;
	this.y = y || 0;
	this.speed = speed || 5;
}

Mover.prototype.setPos = function(x, y, e) {
	// console.log('setPos');
	var bottom = 0 - e.height;
	if (x < 0 - e.width) return true;
	if (y < 0 - e.height) y = View.prototype.FIELD_HEIGHT;
	else if (y > View.prototype.FIELD_HEIGHT) y = bottom;
	this.x = x;
	this.y = y;
	e.style.left = this.x + 'px';
	e.style.top = this.y + 'px';
	return false;
};