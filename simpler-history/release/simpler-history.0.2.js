var SH = {};
SH.info = {
	page : '',
	pageArgs : [],
	domain : '',
	holdingDomain : '',
	lastPage: '',
	root: '/'
};
SH.refOpenFunc = function(){return false;};
SH.pages = {
	home:[],
	pagenotfound:[]
};
SH.loadPage = function(page,args) {
	if(typeof args == 'undefined') {
		args = ''
	}
	SH.info.page = page;
	SH.info.pageArgs = args;
	SH.refOpenFunc(page,args);
	return false;
};
SH.history = {};
SH.history.currentPage;
SH.history.currentPageArgs = [];
SH.history.stop = false;
SH.open = function(name) {
	if(SH.history.pushState) {
		window.history.pushState('', name, root+name);
	} else {
		document.location.hash = '#!/' + name;
	}
};
SH.history.manage = function() {
	var manangeChange = function() {
		if(typeof SH.pages[state] !== 'undefined') {
			if(typeof SH.pages[state][0] !== 'undefined' && typeof SH.pages[state][0].sub !== 'undefined') {
				if(typeof SH.pages[state][0].sub[subPageTest] !== 'undefined') {
					SH.info.page = state+'_'+subPageTest;
					SH.loadPage(state+'_'+subPageTest,args);
				} else {
					if(typeof SH.pages[state] !== 'undefined') {
						SH.loadPage(state,args);
					} else {
						SH.open('pagenotfound');
					}
				}
			} else {
				SH.loadPage(state,args);
			}
			SH.info.lastPage = SH.history.currentPage;
			SH.history.currentPage = state;
		} else {
			SH.open('pagenotfound');
		}
	}
	if(SH.history.pushState == true && document.location.hash.substr(0,3) !== '#!/') {
		var state = window.location.pathname;
		var fullState = '';
		if(state.substr(0,1) == '/') {
			state = state.substr(1);
		}
		fullState = state.split(':')[0];

		if(state !== null && state !== '' && state !== '/') {
			if(state.split(':')[1] !== 'undefined') {
				SH.history.currentPageArgs = [];
				SH.history.currentPageArgs.push(state.split(':')[1]);
			}

			state = state.split(':')[0];
			var subPageTest = state.split('/')[1], 
				args = state.split('/');
			state = state.split('/')[0];

			if(fullState !== SH.info.pageArgs.join('/')) {
				manangeChange();
			}
		} else {
			SH.info.page = 'home';
			SH.open('home');
		}
	} else {
		var hash = document.location.hash;
		if(SH.history.pushState == true) {
			SH.open(hash.substr(3));
			return false;
		}
		if(hash.length > 1 && window.location.pathname == '/') {
			if(hash.substr(0,3) == '#!/') {
				hash = hash.substr(3).split('#')[0];
				if(hash.split(':')[1] !== 'undefined') {
					SH.history.currentPageArgs = [];
					SH.history.currentPageArgs.push(hash.split(':')[1])
				}
				hash = hash.split(':')[0];
				var subPageTest = hash.split('/')[1];
				hash = hash.split('/')[0];
				var args = document.location.hash.substr(3).split('/');
				if(document.location.hash.substr(3) !== SH.info.pageArgs.join('/')) {
				  	manangeChange();
				}
			}
		} else if(window.location.pathname !== '/') {
			SH.history.stop = true;
			window.location.assign( '/#!/' +window.location.pathname.substr(1));
		} else {
			SH.info.page = 'home';
			SH.open('home');
		}
	}
};

SH.history.patrol = function(callback) {
	SH.history.manage();
	var run = setInterval(function() {
		if(SH.history.stop == false) {
			SH.history.manage();
		}
	},200);
	callback(true);
};

SH.init = function(refOpenFunc,pushState) {
	var pushState = pushState;
	//to override or not to override
	if(typeof pushState == 'undefined') { pushState = true; }
	SH.history.pushState = false;
	if (history.pushState && pushState == true) {
		SH.history.pushState = true;
	}
	if(typeof refOpenFunc == 'undefined') {
		console.log('Simpler History: You must declare the main handler as the first argument of SH.init.');
	} else {
		SH.refOpenFunc = refOpenFunc;
		SH.history.patrol(function(test) {
			if(test == true) {
				console.log('Simpler History Initialized...');
			}
		});
	}
	return;
};