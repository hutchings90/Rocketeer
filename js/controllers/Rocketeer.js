function RocketeerController() {
	// console.log('RocketeerController');
	this.gamepadReadInterval = null;
	this.rocketeer = new Rocketeer();
	this.view = View.prototype;
	this.gpInputs = [{ axis: 0, buttons: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }];
	this.state = '';
	this.mainScreen = this.view.getElement('#main-screen');
	this.pauseScreen = this.view.getElement('#pause-screen');
	this.endScreen = this.view.getElement('#end-screen');
	this.mainMenu = this.view.getElement('#main-menu');
	this.pauseMenu = this.view.getElement('#pause-menu');
	this.endMenu = this.view.getElement('#end-menu');
	this.activeOption = 0;
	this.processButtons = this.mainMenuButtonProcessor;
	this.axesAfterProcess = this.menuProcessAxes;
	this.move = this.moveMenu;
	this.buttonPressedMax = 16;
	this.buttonPressedMin = 8;
	this.enemyTimer = null;
	this.TICK = 20;
	this.ONE_SECOND = 1000 / this.TICK;
	this.FIVE_SECONDS = this.ONE_SECOND * 5;
	this.THIRTY_SECONDS = this.ONE_SECOND * 30;
	this.SIXTY_SECONDS = this.ONE_SECOND * 60;
	this.ticksSinceLastGroup = 0;
	this.ticksToNewGroup = -1;
	this.ticksSinceLastPowerUp = 0;
	this.ticksToNewPowerUp = -1;
	this.ticksSinceUpdate = 0;
	this.playerAttacks = [];
	this.start();
}

RocketeerController.prototype.start = function() {
	// console.log('start');
	this.state = 'main-menu';
	this.processButtons = this.mainMenuButtonProcessor;
	this.axesAfterProcess = this.menuProcessAxes;
	this.activeOption = 0;
	this.buttonPressedMax = 16;
	this.buttonPressedMin = 0;
	this.view.removeClassName(this.mainScreen, 'hide');
	this.startPlayer();
	this.activateGamepadRead();
};

RocketeerController.prototype.startPlayer = function() {
	// console.log('startPlayer');
	this.setPlayerPos(50, 280)
};

RocketeerController.prototype.activateGamepadRead = function() {
	// console.log('activateGamepadRead');
	var me = this;
	this.deactivateGamepadRead();
	me.gamepadReadInterval = setInterval(function() {
		me.readGamepads();
		me.ticksSinceUpdate++;
		me.ticksSinceLastGroup++;
		me.ticksSinceLastPowerUp++;
		if (me.shouldUpdate()) me.update();
	}, me.TICK);
};

RocketeerController.prototype.deactivateGamepadRead = function() {
	// console.log('deactivateGamepadRead');
	clearInterval(this.gamepadReadInterval);
	this.gamepadReadInterval = null;
};

RocketeerController.prototype.readGamepads = function() {
	// console.log('readGamepads');
	var gps = navigator.getGamepads();
	if (!gps[0]) return;
	var gp = gps[0];
	this.processAxes(gp);
	this.processButtons(gp.buttons);
};

RocketeerController.prototype.processAxes = function(gp) {
	// console.log('processAxes');
	var dx = 0;
	var dy = 0;
	switch (gp.axes[0]) {
	case -1: dx = -1; break;
	case 1: dx = 1; break;
	}
	switch (gp.axes[1]) {
	case -1: dy = -1; break;
	case 1: dy = 1; break;
	}
	this.axesAfterProcess(gp, dx, dy);
};

RocketeerController.prototype.menuProcessAxes = function(gp, dx, dy) {
	// console.log('menuProcessAxes');
	if (!dx && !dy) gp.axis = 0;
	else if (gp.axis == 16) {
		gp.axis = 8;
		this.moveMenu(dx, dy);
	}
	else {
		if (gp.axis == 0) this.moveMenu(dx, dy);
		gp.axis++;
	}
};

RocketeerController.prototype.playingProcessAxes = function(gp, dx, dy) {
	// console.log('playingProcessAxes');
	this.movePlayer(dx, dy);
};

RocketeerController.prototype.moveMenu = function(dx, dy) {
	// console.log('moveMenu');
	if (this.state == 'pause-menu') this.movePauseMenu(dy);
};

RocketeerController.prototype.movePauseMenu = function(d) {
	// console.log('movePauseMenu');
	var options = this.pauseMenu.children;
	var i = this.activeOption + d;
	if (i < 0) i = options.length - 1;
	if (i > options.length - 1) i = 0;
	this.view.removeClassName(options[this.activeOption], 'active');
	this.view.addClassName(options[i], 'active');
	this.activeOption = i;
};

RocketeerController.prototype.mainMenuButtonProcessor = function(buttons) {
	// console.log('mainMenuButtonProcessor');
	if (buttons[8].pressed && this.processButton(8)) this.endMainMenu();
};

RocketeerController.prototype.endMainMenu = function() {
	// console.log('endMainMenu');
	this.view.addClassName(this.mainScreen, 'hide');
	this.startPlaying();
};

RocketeerController.prototype.startPlaying = function() {
	// console.log('startPlaying');
	this.processButtons = this.playingButtonProcessor;
	this.axesAfterProcess = this.playingProcessAxes;
	this.move = this.movePlayer;
	this.state = 'playing';
	this.buttonPressedMax = 16;
	this.buttonPressedMin = 1;
	this.ticksSinceLastGroup = 0;
	this.ticksToNewGroup = 250;
	this.ticksSinceLastPowerUp = 0;
	this.ticksToNewPowerUp = this.THIRTY_SECONDS;
};

RocketeerController.prototype.playingButtonProcessor = function(buttons) {
	// console.log('playingButtonProcessor');
	var po = this.rocketeer.player.obj;
	var pe = this.rocketeer.player.e;
	for (var i = 0; i < 8; i++) {
		if (buttons[i].pressed) {
			if (po.attack(i)) {
				this.playerAttacks.push(po.attacks[i].make(po.x + pe.width, po.y + (pe.height / 2)));
			}
		}
		else po.tickToClearAttack(i);
	}
	if (buttons[9].pressed && !this.processButton(9)) this.pause();
};

RocketeerController.prototype.processButton = function(i) {
	// console.log('processButton');
	var ret = false;
	if (this.gpInputs[0].buttons[i] == this.buttonPressedMax) {
		this.gpInputs[0].buttons[i] = this.buttonPressedMin;
		ret = true;
	}
	else {
		if (this.gpInputs[0].buttons[i] == 0) ret = true;
		this.gpInputs[0].buttons[i]++;
	}
	return ret;
};

RocketeerController.prototype.pause = function() {
	// console.log('pause');
	this.state = 'pause-menu';
	this.processButtons = this.pauseMenuButtonProcessor;
	this.axesAfterProcess = this.menuProcessAxes;
	this.move = this.moveMenu;
	this.buttonPressedMax = 16;
	this.buttonPressedMin = 0;
	this.view.removeClassName(this.pauseScreen, 'hide');
	this.activeOption = 0;
	this.view.addClassName(this.pauseMenu.children[0], 'active');
	this.view.removeClassName(this.pauseMenu.children[0], 'selected');
	this.view.removeClassName(this.pauseMenu.children[1], 'active');
	this.view.removeClassName(this.pauseMenu.children[1], 'selected');
};

RocketeerController.prototype.pauseMenuButtonProcessor = function(buttons) {
	// console.log('pauseMenuButtonProcessor');
	if (buttons[8].pressed && this.processButton(8)) {
		switch (this.activeOption) {
		case 0: this.endPause(); break;
		case 1:
			this.view.addClassName(this.pauseScreen, 'hide');
			this.endGame();
			break;
		}
	}
};

RocketeerController.prototype.endPause = function() {
	// console.log('endPause');
	this.view.addClassName(this.pauseScreen, 'hide');
	this.startPlaying();
};

RocketeerController.prototype.restart = function() {
	// console.log('restart');
	var me = this;
	me.processButtons = function() {};
	me.state = 'main-menu';
	me.activeOption = 0;
	me.view.addClassName(me.pauseScreen, 'hide');
	setTimeout(function() {
		me.view.removeClassName(me.mainScreen, 'hide');
		me.processButtons = me.mainMenuButtonProcessor;
	}, 500);
};

RocketeerController.prototype.endMenuButtonProcessor = function(buttons) {
	// console.log('endMenuButtonProcessor');
	if (buttons[8].pressed && this.processButton(8) && this.activeOption == 0) {
		this.view.addClassName(this.endScreen, 'hide');
		this.restart();
	}
};

RocketeerController.prototype.makeEnemyGroup = function() {
	// console.log('makeEnemyGroup');
	this.rocketeer.makeEnemyGroup();
	this.ticksSinceLastGroup = 0;
	this.ticksToNewGroup = Math.floor(Math.random() * this.FIVE_SECONDS) + this.ONE_SECOND;
};

RocketeerController.prototype.makePowerUp = function() {
	// console.log('makePowerUp');
	this.rocketeer.makePowerUp();
	this.ticksSinceLastPowerUp = 0;
	this.ticksToNewPowerUp = Math.floor(Math.random() * this.SIXTY_SECONDS) + this.THIRTY_SECONDS;
};

RocketeerController.prototype.shouldUpdate = function() {
	// console.log('shouldUpdate');
	return this.state == 'playing' && this.ticksSinceUpdate >= 2;
};

RocketeerController.prototype.update = function() {
	// console.log('update');
	this.ticksSinceUpdate = 0;
	this.movePlayerAttacks();
	this.moveEnemyGroups();
	this.movePowerUps();
	if (this.ticksSinceLastGroup >= this.ticksToNewGroup) this.makeEnemyGroup();
	if (this.ticksSinceLastPowerUp >= this.ticksToNewPowerUp) this.makePowerUp();
};

RocketeerController.prototype.movePlayer = function(dx, dy) {
	// console.log('movePlayer');
	var player = this.rocketeer.player.obj;
	this.setPlayerPos(player.x + (dx * player.speed), player.y + (dy * player.speed));
};

RocketeerController.prototype.setPlayerPos = function(x, y) {
	// console.log('setPlayerPos');
	var player = this.rocketeer.player;
	if (x < 0) x = 0;
	else if (x > 460) x = 460
	player.obj.setPos(x, y, player.e);
};

RocketeerController.prototype.moveEnemyGroups = function() {
	// console.log('moveEnemyGroups');
	var groups = this.rocketeer.enemyGroups;
	var player = this.rocketeer.player;
	var pobj = player.obj;
	var pe = player.e;
	var pl = pobj.x;
	var pt = pobj.y;
	var pr = pl + pe.width;
	var pb = pt + pe.height;
	for (var i = groups.length - 1; i >= 0; i--) {
		var group = groups[i];
		var enemies = group.enemies
		var pattern = group.pattern;
		var x = group.x;
		var y = group.y;
		for (var j = enemies.length - 1; j >= 0; j--) {
			var enemy = enemies[j];
			var obj = enemy.obj;
			var e = enemy.e;
			if (Enemy.prototype[e.x > x ? 'straight' : pattern](obj, e) == -1) {
				enemies.splice(j, 1);
				View.prototype.removeElement(e);
				if (enemies.length < 1) groups.splice(i, 1);
			}
			else if (!(obj.x > pr || obj.x + e.width < pl || obj.y > pb || obj.y + e.height < pt)) {
				this.endGame();
				return;
			}
		}
	}
};

RocketeerController.prototype.movePowerUps = function() {
	// console.log('movePowerUps');
	var ups = this.rocketeer.powerUps;
	for (var i = ups.length - 1; i >= 0; i--) {
		var up = ups[i];
		if (PowerUp.prototype.move(up.obj, up.e) == -1) {
			ups.splice(i, 1);
			View.prototype.removeElement(up.e);
		}
	}
};

RocketeerController.prototype.movePlayerAttacks = function() {
	// console.log('movePlayerAttacks');
	var attacks = this.playerAttacks;
	for (var i = attacks.length - 1; i >= 0; i--) {
		var attack = attacks[i];
		if (attack.move() == 1) {
			attacks.splice(i, 1);
			View.prototype.removeElement(attack.e);
		}
	}
};

RocketeerController.prototype.removeGroups = function() {
	// console.log('removeGroups');
	var groups = this.rocketeer.enemyGroups;
	for (var i = groups.length - 1; i >= 0; i--) {
		var group = groups[i];
		var enemies = group.enemies;
		for (var j = enemies.length - 1; j >= 0; j--)
			View.prototype.removeElement(enemies[j].e);
		groups.pop();
	}
};

RocketeerController.prototype.removePowerUps = function() {
	// console.log('removePowerUps');
	var powerUps = this.rocketeer.powerUps;
	for (var i = powerUps.length - 1; i >= 0; i--) {
		View.prototype.removeElement(powerUps[i].e);
		powerUps.pop();
	}
};

RocketeerController.prototype.removePlayerAttacks = function() {
	// console.log('removePowerUps');
	var playerAttacks = this.playerAttacks;
	for (var i = playerAttacks.length - 1; i >= 0; i--) {
		View.prototype.removeElement(playerAttacks[i].e);
		playerAttacks.pop();
	}
};

RocketeerController.prototype.endGame = function() {
	// console.log('endGame');
	var me = this;
	me.state = 'end-menu';
	me.processButtons = function() {};
	me.axesAfterProcess = me.menuProcessAxes;
	me.activeOption = 0;
	me.buttonPressedMax = 16;
	me.buttonPressedMin = 0;
	setTimeout(function() {
		me.removeGroups();
		me.removePowerUps();
		me.removePlayerAttacks();
		me.startPlayer();
		me.view.removeClassName(me.endScreen, 'hide');
		me.processButtons = me.endMenuButtonProcessor;
	}, 500);
};