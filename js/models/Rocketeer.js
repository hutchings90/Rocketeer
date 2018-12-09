function Rocketeer() {
	// console.log('Rocketeer');
	this.player = new Player('1');
	this.enemyGroups = [];
	this.powerUps = [];
}

Rocketeer.prototype.makeEnemyGroup = function() {
	// console.log('makeEnemyGroup');
	var obj = Enemy.prototype.get();
	var n = Math.floor(Math.random() * 4) + 3;
	var e = ContentManager.prototype.getImage(obj.name);
	var width = View.prototype.FIELD_WIDTH / 2;
	var y = this.randomY(e);
	this.enemyGroups.push({
		enemies: this.makeEnemies(obj, e, n, y),
		pattern: Enemy.prototype.patterns[Math.floor(Math.random() * Enemy.prototype.patterns.length)],
		x: Math.floor(Math.random() * width) + width,
		y: y
	});
};

Rocketeer.prototype.makeEnemies = function(obj, e, n, y) {
	// console.log('makeEnemies');
	var fieldWidth = View.prototype.FIELD_WIDTH;
	var spacing = e.width * 2;
	var enemies = [];
	for (var i = 0; i < n; i++) enemies.push(this.makeGameObject(Object.create(obj), e.cloneNode(true), fieldWidth + (spacing * i), y));
	return enemies;
};

Rocketeer.prototype.makeGameObject = function(obj, e, left, top) {
	// console.log('makeGameObject');
	obj.x = left;
	obj.y = top;
	e.style.left = left + 'px';
	e.style.top = top + 'px';
	View.prototype.addGameObject(e);
	return {
		obj: obj,
		e: e
	};
};

Rocketeer.prototype.makePowerUp = function() {
	// console.log('makePowerUp');
	var obj = PowerUp.prototype.get();
	var e = ContentManager.prototype.getImage(obj.name);
	this.powerUps.push(this.makeGameObject(obj, e, View.prototype.FIELD_WIDTH, this.randomY(e)));
};

Rocketeer.prototype.randomY = function(e) {
	// console.log('randomY');
	return Math.floor(Math.random() * (View.prototype.FIELD_HEIGHT - e.height));
};