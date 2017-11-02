/**
 * @author Xin Wang
 * @date 02/1102017
 * test for Steven
 */
(function(angular) {
	'use strict';

	var jquery = require('jquery');
	var names = require('./mock-data/names');
	var devTest1 = angular.module('devTest1', []);

	/**
	 * 
	 * @param {}
	 */
	var mockData = (function(names) {
		return devTest1.factory('mockData', [function() {
			var n, i = 0, ln = names.length;
			for(; i < ln; i++) {
				n = names[i];
				n.email = 'mockemail@domain.com';
				n.selected = false;
				n.nm = n.nm.toLowerCase();
			}
			return names;
		}]);
	})(names);

	/**
	 * fulll jquery as a service in the angular application
	 * @param {}
	 */
	(function(jquery) {
		devTest1.factory('dt$', [function() {
			return jquery;
		}]);
	})(jquery);

	/**
	 * 
	 * @param {}
	 */
	devTest1.factory('PeopleModel', [function() {
		function PeopleModel(config) {
			this.config = config || {};
			this.data = this.config.data || [];
			this.usedData = [];
			this.activeData = [];
			this.lazyLoadInterval = 18;
			this.limit = 200;
			this.currentIndex = 0;
			this.init();
		}

		var p = PeopleModel.prototype;

		/**
		 * 
		 * @param {}
		 */
		p.init = function() {
			this.usedData = this.data.slice(0, this.lazyLoadInterval);
			this.activeData = this.usedData;
		};

		p.loadMore = function() {
			this.currentIndex += this.lazyLoadInterval;
			this.usedData = this.usedData.concat(this.data.slice(this.currentIndex, this.currentIndex + this.lazyLoadInterval));
			this.activeData = this.usedData;
		};

		/**
		 * 
		 * @param {}
		 */
		p.filterByName = function(name) {
			var cache = [], p, i = 0, ln = this.usedData.length;
			for(; i < ln; i++  ) {
				p = this.usedData[i];
				if(p.nm.indexOf(name) > -1) cache.push(p);
			}
			this.activeData = cache;
		};

		/**
		 * 
		 * @param {}
		 */
		p.filterByFirstChar = function(selectedChar) {
			var cache = [], p, i = 0, ln = this.usedData.length;
			selectedChar = selectedChar.toLowerCase();

			for(; i < ln; i++  ) {
				p = this.usedData[i];
				if(p.nm.charAt(0) === selectedChar) cache.push(p);
			}
			this.activeData = cache;
		};

		return PeopleModel;
	}]);

	/**
	 * dev test 1 controller
	 */
	var homeController = devTest1.controller('homeController', [
		'$scope', 'mockData', 'PeopleModel', 
		function($scope, mockData, PeopleModel) {
			$scope.showSearchBar = false;
			$scope.showMenu = false;
			$scope.peopleModel = new PeopleModel({data: mockData});
			$scope.showMask = false;

			/**
			 * 
			 * @param {}
			 */
			$scope.onClickMagnifyingGlass = function() {
				$scope.showSearchBar = !$scope.showSearchBar;
			};

			/**
			 * 
			 * @param {}
			 */
			$scope.onClickLoadMoreBtn = function() {
				$scope.peopleModel.loadMore();
			};

			/**
			 * 
			 * @param {}
			 */
			$scope.onClickMask = function() {
				$scope.showMenu = false;
			};
		}
	]);

	/**
	 * search bar
	 * @param {}
	 */
	var searchBar = devTest1.directive('searchBar', ['dt$', function($) {
		var linker = function(s, e) {
			e = $(e[0]);
		};
		return {
			link: linker,
			scope: false,
			template: [
				'<div class="dt-search-bar">',
					'<div class="d-flex">',
						'<div class="dt-search-bar__dropdown">',
					    	'<button class="btn btn-primary dropdown-toggle dt-search-bar__dropdown__btn" type="button" data-toggle="dropdown">content',
					    	'<span class="caret"></span></button>',
						    '<ul class="dropdown-menu">',
						      '<li><a href="#">HTML</a></li>',
						      '<li><a href="#">CSS</a></li>',
						      '<li><a href="#">JavaScript</a></li>',
						    '</ul>',
					  	'</div>',
						'<div class="dt-search-bar__search-input"><input class="form-control" placeholder="search for..."/></div>',
						'<div class="dt-search-bar__go-btn"><button class="dt-search-bar__go-btn__btn btn btn-secondary">GO</button></div>',
				  	'</div>',
				'</div>'
			].join('')
		};
	}]);

	/**
	 * 
	 * @param {}
	 */
	devTest1.directive('mask', [function(){
		var linker = function(s) {
			s.onClickMask = function() {
				s.showMask = false;
				s.onClick();
			};
		};
		return {
			link: linker,
			scope: {
				onClick: '=',
				showMask: '='
			},
			template: [
				'<div class="dt-mask" ng-click="onClickMask()" ng-show="showMask"></div>'
			].join('')
		};
	}]);

	/**
	 * 
	 * @param {}
	 */
	devTest1.directive('menu', [function(){
		var linker = function(s) {
			s.visibleCls = 'menu--visible';
			s.invisibleCls = 'menu--invisible';
			s.menuItems = ['item 1', 'item 2', 'item 3', 'item 5'];
		};
		return {
			link: linker,
			scope: false,
			template: [
				'<div class="dt-menu" ng-class="showMenu ? visibleCls : invisibleCls">',
					'<div ng-repeat="it in menuItems">{{it}}</div>',
				'</div>',
			].join('')
		};
	}]);

	/**
	 * 
	 * @param {}
	 */
	devTest1.directive('statementBanner', [function() {
		var linker = function(s) {
			s.onClickCog = function() {
				s.showMenu = true;
				s.showMask = true;
			};
		};
		return {
			link: linker,
			scope: false,
			template: [
				'<div class="row dt-statement-banner d-flex align-items-center justify-content-around">',
					'<div class="col-sm-2">',
						'<div class="dt-statement-banner__icon--crown"></div>',
					'</div>',
					'<div class="col-sm-8 dt-statement-banner__statement" text-center>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris...</div>',
					'<div>',
					'<i class="fa fa-cog fa-2x" aria-hidden="true" ng-click="onClickCog()"></i>',
					'</div>',
				'</div>'
			].join('')
		};
	}]);

	/**
	 * 
	 * @param {}
	 */
	var listDisplay = devTest1.directive('listDisplay', ['$timeout', 'dt$', function($timeout, dt$) {
		var linker = function(s, e) {
			var _charCodeStart = 65;
			var _charCodeEnd = 90;
			var planeIconEle;

			s.showPopup = false;
			s.popupCls = 'show-pop-up';
			s.alphabets = [];
			s.filterValue = '';
			
			/**
			 * 
			 * @param {}
			 */
			s.onClickAlphabet = function(char) {
				// in case people type too fase
				$timeout(function(){
					s.peopleModel.filterByFirstChar(char);
				}, 500);
			};

			/**
			 * 
			 * @param {}
			 */
			s.onMouseOverPlaneIcon = function() {
				s.showPopup = true;
			};

			/**
			 * 
			 * @param {}
			 */
			s.onMouseoutPlaneIcon = function() {
				s.showPopup = false;
			};

			/**
			 * 
			 * @param {}
			 */
			s.onKeyupFilter = function(filterValue) {
				// put this filter to the event stack
				// to avoid heavy processing blocking on the call stach
				$timeout(function(){
					s.peopleModel.filterByName(filterValue);
				}, 0);
			};

			/**
			 * 
			 * @param {}
			 */
			function _initAlphabetsLooup() {
				for(var i = _charCodeStart; i <= _charCodeEnd; i++) 
					s.alphabets.push(String.fromCharCode(i));
			}
			
			_initAlphabetsLooup();
		};

		return {
			link: linker,
			scope: false,
			template: [
				'<div class="dt-home__people-list-display">',
					'<div class="d-flex justify-content-between dt-home__people-list-display__control-panel">',
						'<div><input ng-model="filterValue" ng-keyup="onKeyupFilter(filterValue)" placeholder="filter"/></div>',
						'<div>',
							'<div class="dt-home__people-list-display__control-panel__char-list">',
								'<div class=" d-inline-flex dt-home__people-list-display__control-panel__char" ng-repeat="char in alphabets" ng-click="onClickAlphabet(char)">{{char}}</div>',
							'</div>',
						'</div>',
						'<div class="dt-plane-icon fa fa-paper-plane fa-2x" title="Popover Header" data-content="email selected members" ng-mouseout="onMouseoutPlaneIcon()" ng-mouseover="onMouseOverPlaneIcon()" ng-class="showPopup ? popupCls : \'\'"></div>',
					'</div>',
					'<div class="dt-home__people-list-display__list row d-flex justify-content-center">',
						'<people-item class="" ng-repeat="p in peopleModel.activeData" person="p"></people-item>',
					'</div>',
				'</div>'
			].join('')
		};


	}]);

	devTest1.directive('peopleItem', [function() {
		var linker = function(s) {
			s.selectedCls = 'dt-person-state__bg--selected';
		};
		return {
			link: linker,
			replace: true,
			scope: {
				person: '='
			},
			template:[
				'<div class="dt-person-item col-lg-4 d-flex align-items-center">',
					'<div class="person-img">',
						'<div class="dt-person-state__bg d-flex justify-content-center" ng-class="person.selected ? selectedCls : \'\'">',
							'<input ng-model="person.selected" type="checkbox"/>',
						'</div>',
					'</div>',
					'<div>',
						'<div class="person-name">{{person.nm}}</div>',
						'<div>{{person.email}}</div>',
					'</div>',
				'</div>'
			].join('')
		};
	}]);
	
})(angular);