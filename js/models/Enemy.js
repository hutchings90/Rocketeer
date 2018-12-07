function Enemy() {}

Enemy.prototype.get = function() {
	return Object.create(Enemy.prototype.enemies[Math.floor(Math.random() * Enemy.prototype.enemies.length)]);
};

Enemy.prototype.enemies = [new Mover('ship01'), new Mover('ship02'), new Mover('ship03')];