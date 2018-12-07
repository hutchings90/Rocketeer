function Rocketeer() {
	// console.log('Rocketeer');
	this.player = new Player('1');
	this.enemies = [];
	this.powerUps = [];
}

Rocketeer.prototype.makeEnemyGroup = function(obj, n, pattern) {
	// console.log('makeEnemyGroup');
	var e = ContentManager.prototype.getImage(obj.name);
	var width = View.prototype.FIELD_WIDTH / 2;
	var y = Math.floor(Math.random() * (View.prototype.FIELD_HEIGHT - e.height));
	return {
		group: this.makeEnemies(obj, e, n, y),
		pattern: pattern,
		y: y,
		x: Math.floor((Math.random() * width) + width)
	};
};

Rocketeer.prototype.makeEnemies = function(obj, e, n, y) {
	// console.log('makeEnemies');
	var fieldWidth = View.prototype.FIELD_WIDTH;
	var spacing = e.width * 2;
	var enemies = [];
	for (var i = 0; i < n; i++) enemies.push(this.makeEnemy(obj, e.cloneNode(true)), fieldWidth + (spacing * i), y);
	return enemies;
};

Rocketeer.prototype.makeEnemy = function(obj, e, left, top) {
	e.style.left = left + 'px';
	e.style.top = top + 'px';
	View.prototype.addGameObject(e);
	return {
		obj: Object.create(obj),
		e: e
	};
};