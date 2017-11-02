/**
 * @author Xin Wang
 * @date 02/1102017
 * test for Steven
 */
(function(angular) {
	'use strict';

	var $ = require('jquery');
	var names = require('./mock-data/names');
	var devTest1 = angular.module('devTest1', []);

	/**
	 * 
	 * @param {}
	 */
	var mockData = (function(names) {
		return devTest1.factory('mockData', [function() {
			names = names.slice(0, 200);
			var n;
			for(var i = 0, ln = names.length; i < ln; i++) {
				n = names[i];
				n.email = 'mockemail@domain.com';
				n.selected = false;
				n.nm = n.nm.toLowerCase();
			}
			return names;
		}]);
	})(names);

	/**
	 * 
	 * @param {}
	 */
	devTest1.factory('PeopleModel', [function() {
		function PeopleModel(config) {
			this.config = config || {};
			this.data = this.config.data || [];
			this.activeData = [];
			this.limit = 200;
			this.init();
		}

		var p = PeopleModel.prototype;
		/**
		 * 
		 * @param {}
		 */
		p.init = function() {
			this.activeData = this.data;
		};

		/**
		 * 
		 * @param {}
		 */
		p.filterByName = function(name) {
			var cache = [], p, i = 0, ln = this.data.length;
			for(; i < ln; i++  ) {
				p = this.data[i];
				if(p.nm.indexOf(name) > -1) cache.push(p);
			}
			this.activeData = cache;
		};

		/**
		 * 
		 * @param {}
		 */
		p.filterByFirstChar = function(selectedChar) {
			var cache = [], p, i = 0, ln = this.data.length;
			selectedChar = selectedChar.toLowerCase();

			for(; i < ln; i++  ) {
				p = this.data[i];
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

		console.log($scope.peopleModel);

		$scope.onClickMagnifyingGlass = function() {
			$scope.showSearchBar = !$scope.showSearchBar;
		};
	}]);

	/**
	 * search bar
	 * @param {}
	 */
	var searchBar = devTest1.directive('searchBar', [function() {
		var linker = function(s, e) {
			e = $(e[0]);
		};
		return {
			link: linker,
			scope: false,
			template: [
				'<div>',
					'<div>content drop down</div>',
					'<div><input placeholder="search for..."/></div>',
					'<div><button>GO</button></div>',
				'</div>'
			].join('')
		};
	}]);

	/**
	 * 
	 * @param {}
	 */
	var menu = devTest1.directive('menu', [function() {
		var linker = function(s) {
			s.onClickCog = function() {
				s.showMenu = true;
			};
		};
		return {
			link: linker,
			scope: false,
			template: [
				'<div>',
					'<div>icon</div>',
					'<div>random text</div>',
					'<div ng-click="onClickCog()">cog</div>',
				'</div>'
			].join('')
		};
	}]);

	/**
	 * 
	 * @param {}
	 */
	var listDisplay = devTest1.directive('listDisplay', ['$timeout', function($timeout) {
		var linker = function(s) {
			var _charCodeStart = 65;
			var _charCodeEnd = 90;

			s.alphabets = [];
			s.filterValue = '';

			/**
			 * 
			 * @param {}
			 */
			s.onClickAlphabet = function(char) {
				$timeout(function(){
					s.peopleModel.filterByFirstChar(char);
					console.log(char);
				}, 500);
			};

			/**
			 * 
			 * @param {}
			 */
			s.onKeyupFilter = function(filterValue) {
				$timeout(function(){
					s.peopleModel.filterByName(filterValue);
					console.log(filterValue);
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
					'<div class="dt-home__people-list-display__control-panel">',
						'<div><input ng-model="filterValue" ng-keyup="onKeyupFilter(filterValue)" placeholder="filter"/></div>',
							'<ul>',
								'<li class="dt-home__people-list-display__control-panel__char" ng-repeat="char in alphabets" ng-click="onClickAlphabet(char)">{{char}}</li>',
							'</ul>',
					'</div>',
					'<div class="dt-home__people-list-display__list">',
						'<people-item ng-repeat="p in peopleModel.activeData" person="p"></people-item>',
					'</div>',
				'</div>'
			].join('')
		};


	}]);

	devTest1.directive('peopleItem', [function() {
		var linker = function(s) {
			s.selected = false;
		};
		return {
			link: linker,
			scope: {
				person: '='
			},
			template:[
				'<div class="person-item">',
					'<div class="person-img"></div>',
					'<div>{{person.nm}}</div>',
					'<div>{{person.email}}</div>',
					'<div class="person-select"><input ng-model="selected" type="checkbox"/></div>',
				'</div>'
			].join('')
		};
	}]);
	
})(angular);