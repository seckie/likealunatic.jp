/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	/**
	 * Scripts for likealunatic.jp
	 *
	 * @author     Naoki Sekiguchi (https://likealunatic.jp)
	 * @copyright  Naoki Sekiguchi (https://likealunatic.jp)
	 * @require    jQuery JavaScript Framework (http://jquery.com/)
	 * @version    1.0
	 * @since      2012-01-02
	 */

	var _TwitterUserTimeline = __webpack_require__(1);

	var _TwitterUserTimeline2 = _interopRequireDefault(_TwitterUserTimeline);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// add CSS rule to hide default contents
	var mysheet = document.styleSheets[0];
	var totalrules = mysheet.cssRules ? mysheet.cssRules.length : mysheet.rules.length;
	if (mysheet.insertRule) {
	  mysheet.insertRule('div.contents-index {visibility: hidden}', totalrules);
	} else if (mysheet.addRule) {
	  //for msie
	  mysheet.addRule('div.contents-index', 'visibility: hidden');
	}

	/**
	 * dom ready
	 */
	$(function () {
	  // shuffle and sort
	  var $container = $('div.area_bd').find('div.contents-index');

	  // Add 'table' classNames to tables in article
	  $('article.post table').each(function (i, table) {
	    $(table).addClass('table');
	  });

	  // Twitter user timeline
	  new _TwitterUserTimeline2.default({
	    el: '.tweets-contents',
	    jsonURL: '/api/get_user_tl.php',
	    complete: function complete() {
	      $container.sortContents('article, .tweet').remove();
	      // masonry
	      $('div.area_bd').find('div.contents-index').masonry({
	        itemSelector: 'article, .tweet',
	        columnWidth: 220,
	        gutterWidth: 15,
	        isResizable: true,
	        animateOptions: {
	          complete: function complete() {}
	        }
	      });
	      // set contents visible
	      $('div.area_bd').find('div.contents-index').showVisibility();
	    }
	  });

	  /**
	   * control bootstrap-modal
	   */
	  $('a[href$=".jpg"], a[href$=".gif"], a[href$=".png"]').each(function (i, trigger) {
	    if (!trigger.href) {
	      return this;
	    }

	    var $box = $('<div class="modal fade" role="dialog"/>');
	    var $img = $(this).find('img');
	    var title = this.title || $img.attr('title') || $img.attr('alt');
	    var titleElement = title ? '<h4 class="modal-title">' + title + '</h4>' : '';
	    var content = '\n  <div class="modal-dialog" role="document">\n    <div class="modal-content">\n      <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n        ' + titleElement + '\n      </div>\n      <div class="modal-body"><img src="' + this.href + '" alt="" /></div>\n      <div class="modal-footer">\n        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n      </div>\n    </div>\n  </div>\n</div>\n    ';
	    $box.html(content).appendTo(document.body).modal({
	      backdrop: true,
	      keyboard: true,
	      show: false
	    });

	    // preload image
	    preloadImg(this.href).then(function ($img) {
	      var baseWidth = $img.width();
	      // set dialog width
	      var $modalBody = $box.find('.modal-body');
	      var hPadding = parseInt($modalBody.css('padding-left'), 10) + parseInt($modalBody.css('padding-right'), 10);
	      $box.find('.modal-dialog').width(baseWidth + hPadding);
	    });

	    // bind event
	    $(trigger).on('click', function (e) {
	      e.preventDefault();
	      $box.modal('toggle');
	    });
	  });

	  function preloadImg(href) {
	    return new Promise(function (resolve, reject) {
	      var $wrapper = $('<div class="preload-wrapper"/>').css({
	        'width': 0,
	        'height': 0,
	        'overflow': 'hidden',
	        'position': 'absolute'
	      });
	      var $img = $('<img src="' + href + '" alt="" />');
	      $img.css('visibility', 'hidden').appendTo($wrapper);
	      $wrapper.appendTo(document.body);
	      // timeout
	      var timeoutTimer = setTimeout(function () {
	        reject();
	        throw new Error('Timed out to load ' + href);
	      }, 5000);
	      $img.on('load', function () {
	        resolve($img);
	        setTimeout(function () {
	          return $wrapper.remove();
	        }, 500);
	        clearTimeout(timeoutTimer);
	      });
	    });
	  }
	  /*
	  function layoutModal($box, $img) {
	    var imgWidth = $img.width();
	    var imgHeight = $img.height();
	    var winHeight = $(window).height();
	     // when a large image overflow from window
	    if (winHeight < imgHeight + 30) {
	      $box.css({
	        'position': 'absolute',
	        'top': (document.documentElement.scrollTop || document.body.scrollTop) + (winHeight / 2)
	      });
	    }
	     $box.css({
	      'width': imgWidth + 30,
	      'margin-top': -1 * Math.min(winHeight / 2, (imgHeight + 60) / 2),
	      'margin-left': -1 * (imgWidth + 30) / 2
	    });
	  }
	  */
	});

	/**
	 * extend jQuery function
	 */

	$.fn.hideVisibility = function () {
	  this.css({ 'visibility': 'hidden' });
	  return this;
	};
	$.fn.showVisibility = function () {
	  this.css({ 'visibility': 'visible' });
	  return this;
	};

	/**
	 * sort contents
	 */
	$.fn.sortContents = function (itemSelector) {
	  return this.each(function () {
	    var items = $(this).find(itemSelector);
	    var newContainer = $(this).clone().empty();
	    var dates = [];
	    items.each(function (i, item) {
	      var text = $(item).find('.date').text();
	      $(item).data('date', text);
	      dates.push(text);
	    });
	    dates.sort();
	    dates.reverse();

	    $.each(dates, function (i, date) {
	      items.each(function (j, item) {
	        if ($(item).data('date') === date) {
	          newContainer.append(item);
	        }
	      });
	    });
	    newContainer.insertBefore(this);
	  });
	};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var STYLESHEET_DIRECTORY = window.STYLESHEET_DIRECTORY || '';

	/**
	 * Twitter user timeline list
	 */

	var TwitterUserTimeline = function () {
	  function TwitterUserTimeline(_ref) {
	    var _ref$jsonURL = _ref.jsonURL,
	        jsonURL = _ref$jsonURL === undefined ? '' : _ref$jsonURL,
	        _ref$el = _ref.el,
	        el = _ref$el === undefined ? document.body : _ref$el,
	        _ref$complete = _ref.complete,
	        complete = _ref$complete === undefined ? function () {} : _ref$complete;

	    _classCallCheck(this, TwitterUserTimeline);

	    this.opt = { jsonURL: jsonURL, el: el, complete: complete };
	    this.$el = $(this.opt.el);
	    this.initialize();
	  }

	  _createClass(TwitterUserTimeline, [{
	    key: 'initialize',
	    value: function initialize() {
	      var _this = this;

	      $.ajax(this.opt.jsonURL, {
	        success: function success(data) {
	          var dataset = typeof data === 'string' ? JSON.parse(data) : data;
	          var html = dataset.reduce(function (str, current, i) {
	            return str + _this.buildItem(current, i);
	          }, '');
	          _this.$el.html(html);
	          _this.opt.complete();
	        }
	      });
	    }
	  }, {
	    key: 'buildItem',
	    value: function buildItem(data, i) {
	      var text = data.text;
	      text = this.createURLLink(text);
	      text = this.createReplyLink(text);
	      text = this.createTagLink(text);
	      var isInstagram = function isInstagram() {
	        return (/Instagram/.test(data.source)
	        );
	      };
	      var iconName = isInstagram() ? 'instagram' : 'twitter';
	      var iconAlt = isInstagram() ? 'Instagram' : 'Twitter';
	      var html = '\n    <div class="tweet tweet' + i + '">\n      <div class="img">\n        <a href="http://twitter.com/' + data.user.screen_name + '" target="_blank">\n          <img src="' + STYLESHEET_DIRECTORY + '/libs/social-media-icons/32px/' + iconName + '.png" alt="' + iconAlt + '" width="32" height="32" />\n        </a>\n      </div>\n      <div class="content">\n        <div class="contentInner">\n          <div class="contentInner2">\n            <p class="text">' + text + '</p>\n            <div class="footer">\n              <p class="author">\n                <a target="_blank" href="http://twitter.com/' + data.user.screen_name + '">\n                  ' + data.user.screen_name + '</a>\n              </p>\n              <p class="date">\n                <a href="http://twitter.com/' + data.user.screen_name + '/status/' + data.id + '" target="_blank">\n                [' + data.created_at + ']</a>\n              </p>\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n    ';
	      return html;
	    }
	  }, {
	    key: 'createURLLink',
	    value: function createURLLink(text) {
	      return text.replace(/(https?:\/\/[a-zA-Z0-9\-_./]+)/, '<a href="$1" target="_blank">$1</a>');
	    }
	  }, {
	    key: 'createReplyLink',
	    value: function createReplyLink(text) {
	      return text.replace(/@([\w_]+)/, '<a href="http://twitter.com/$1" target="_blank">@$1</a>');
	    }
	  }, {
	    key: 'createTagLink',
	    value: function createTagLink(text) {
	      return text.replace(/#([\w_]+)/, '<a href="http://twitter.com/#search?q=%23$1" target="_blank">#$1</a>');
	    }
	  }]);

	  return TwitterUserTimeline;
	}();

	exports.default = TwitterUserTimeline;

/***/ })
/******/ ]);