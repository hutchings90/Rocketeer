function RocketeerController() {
	// console.log('RocketeerController');
	this.gamepadReadInterval = null;
	this.rocketeer = new Rocketeer();
	this.view = View.prototype;
	this.gpInputs = [{ axis: 0, buttons: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }];
	this.state = '';
	this.mainMenu = this.view.getElement('#main-menu');
	this.pauseMenu = this.view.getElement('#pause-menu');
	this.activeOption = 0;
	this.buttonProcessor = this.mainMenuButtonProcessor;
	this.start();
}

RocketeerController.prototype.start = function() {
	// console.log('start');
	this.view.removeClassName(this.mainMenu, 'hide');
	this.view.addClassName(this.mainMenu.children[0], 'active');
	this.state = 'main-menu';
	this.activateGamepadRead();
};

RocketeerController.prototype.activateGamepadRead = function() {
	// console.log('activateGamepadRead');
	var me = this;
	this.deactivateGamepadRead();
	me.gamepadReadInterval = setInterval(function() {
		me.readGamepads();
	}, 20);
};

RocketeerController.prototype.deactivateGamepadRead = function() {
	// console.log('deactivateGamepadRead');
	clearInterval(this.gamepadReadInterval);
	this.gamepadReadInterval = null;
};

RocketeerController.prototype.readGamepads = function() {
	// console.log('readGamepads');
	var gps = navigator.getGamepads();
	if (gps.length < 1) return;
	var gp = gps[0];
	this.processAxes(gp);
	this.processButtons(gp);
	if (this.state == 'playing') this.update();
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
	if (dx || dy) {
		if (this.gpInputs[0].axis == 16) {
			this.gpInputs[0].axis = 8;
			this.moveHorizontal(dx);
			this.moveVertical(dy);
		}
		else {
			if (this.gpInputs[0].axis == 0) {
				this.moveHorizontal(dx);
				this.moveVertical(dy);
			}
			this.gpInputs[0].axis++;
		}
	}
	else this.gpInputs[0].axis = 0;
};

RocketeerController.prototype.processButtons = function(gp) {
	// console.log('processButtons');
	for (var i in gp.buttons) {
		i = Number(i);
		if (gp.buttons[i].pressed) this.buttonProcessor(i);
	}
};

RocketeerController.prototype.moveHorizontal = function(d) {
	// console.log('moveHorizontal');
	switch(this.state) {
	case 'main-menu':
	case 'pause-menu': break;
	case 'playing': ; break;
	}
};

RocketeerController.prototype.moveVertical = function(d) {
	// console.log('moveVertical');
	switch(this.state) {
	case 'main-menu': break;
	case 'pause-menu': this.movePauseMenu(d); break;
	case 'playing': ; break;
	}
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

RocketeerController.prototype.mainMenuButtonProcessor = function(i) {
	// console.log('mainMenuButtonProcessor');
	if (i == 8) this.endMainMenu();
};

RocketeerController.prototype.endMainMenu = function() {
	// console.log('endMainMenu');
	this.view.addClassName(this.mainMenu, 'hide');
	this.buttonProcessor = this.playingButtonProcessor;
	this.state = 'playing';
};

RocketeerController.prototype.playingButtonProcessor = function(i) {
	// console.log('playingButtonProcessor');
	if (!this.processButton(i)) return;
	switch (i) {
	case 9: this.pause(); break;
	case 0: console.log('smart bomb'); break;
	case 1: console.log('laser'); break;
	case 2: console.log(''); break;
	case 3: console.log('bomb'); break;
	case 4:
	case 5:
		console.log('tractor beam'); break;
	case 6:
	case 7:
		console.log('shield'); break;
	}
};

RocketeerController.prototype.processButton = function(i) {
	// console.log('processButton');
	var ret = false;
	if (this.gpInputs[0].buttons[i] == 16) {
		this.gpInputs[0].buttons[i] = 8;
		ret = true;
	}
	else {
		if (this.gpInputs[0].buttons[i] == 0) ret = true;
		this.gpInputs[0].buttons[i]++;
	}
	if (ret) console.log(this.gpInputs[0].buttons[i]);
	return ret;
};

RocketeerController.prototype.pause = function() {
	// console.log('pause');
	this.state = 'pause-menu';
	this.buttonProcessor = this.pauseMenuButtonProcessor
	this.view.removeClassName(this.pauseMenu, 'hide');
	this.activeOption = 0;
	this.view.addClassName(this.pauseMenu.children[0], 'active');
	this.view.removeClassName(this.pauseMenu.children[0], 'selected');
	this.view.removeClassName(this.pauseMenu.children[1], 'active');
	this.view.removeClassName(this.pauseMenu.children[1], 'selected');
};

RocketeerController.prototype.pauseMenuButtonProcessor = function(i) {
	// console.log('pauseMenuButtonProcessor');
	if (i == 8) {
		switch(this.activeOption) {
		case 0: this.endPause(); break;
		case 1: this.endGame(); break;
		}
	}
};

RocketeerController.prototype.endPause = function() {
	// console.log('endPause');
	this.view.addClassName(this.pauseMenu, 'hide');
	this.state = 'playing';
	this.buttonProcessor = this.playingButtonProcessor;
};

RocketeerController.prototype.endGame = function() {
	// console.log('endGame');
	this.state = 'main-menu';
};

RocketeerController.prototype.update = function() {
	console.log('update');
};