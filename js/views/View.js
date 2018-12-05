function View() {}

View.prototype.makeElement = function(tagName, id, className, innerHTML) {
	// console.log('makeElement');
	var e = document.createElement(tagName);
	if (id) e.id = id;
	if (className) e.className = className;
	if (innerHTML) e.innerHTML = innerHTML;
	return e;
};

View.prototype.getElements = function(query) {
	// console.log('getElements');
	return document.querySelectorAll(query);
};

View.prototype.getElement = function(query) {
	// console.log('getElement');
	return document.querySelector(query);
};

View.prototype.removeClassName = function(e, className) {
	// console.log('removeClassName');
	if (e) e.className = e.className.replace(new RegExp(className, 'g'), '').replace(/\s+/g, '').trim();
};

View.prototype.addClassName = function(e, className) {
	// console.log('addClassName');
	if (e && !e.className.includes(className)) {
		if (e.className) e.className += ' ';
		e.className += className;
	}
};

View.prototype.toggleClassName = function(e, className) {
	// console.log('toggleClassName');
	if (e) {
		if (e.className.includes(className)) this.removeClassName(e, className);
		else this.addClassName(e, className);
	}
};

View.prototype.getGameContainer = function() {
	// console.log('getGameContainer');
	return this.getElement('#game');
};