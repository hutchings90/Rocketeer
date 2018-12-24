function Explosion(e, x, y, duration) {
	// console.log('Explosion');
	e.style.left = x + 'px';
	e.style.top = y + 'px';
	this.x = x;
	this.y = y;
	this.e = e;
	this.ticks = 0;
	this.duration = duration || 50;
}