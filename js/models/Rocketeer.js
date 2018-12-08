function Rocketeer() {
	// console.log('Rocketeer');
	this.player = new Player('1');
	this.enemyGroups = [];
	this.powerUps = [];
}

Rocketeer.prototype.makeEnemyGroup = function(obj, n) {
	// console.log('makeEnemyGroup');
	var e = ContentManager.prototype.getImage(obj.name);
	var width = View.prototype.FIELD_WIDTH / 2;
	var y = Math.floor(Math.random() * (View.prototype.FIELD_HEIGHT - e.height));
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
	for (var i = 0; i < n; i++) enemies.push(this.makeEnemy(Object.create(obj), e.cloneNode(true), fieldWidth + (spacing * i), y));
	return enemies;
};

Rocketeer.prototype.makeEnemy = function(obj, e, left, top) {
	// console.log('makeEnemy');
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