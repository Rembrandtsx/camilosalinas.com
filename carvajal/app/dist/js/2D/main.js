(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
/* jshint laxbreak: true */

'use strict';

require('./polyfills/animFramePolyfill');
require('./polyfills/bindPolyfill');
require('./polyfills/indexOfPolyfill');

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var skrollr = (typeof window !== "undefined" ? window['skrollr'] : typeof global !== "undefined" ? global['skrollr'] : null);
require('./libs/waypointLib');
  
var HASH = require('./modules/hashModule');

var ImagesLoader = require('./classes/LoaderClass');

var Loader = require('./objects2D/LoaderObject2D');
var Menu = require('./objects2D/menuObject2D');
var Wireframe = require('./objects2D/WireframeObject2D');

function mobile () {
  return navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i);
}

jQuery(function () {
  HASH.replacePlaceholders();

  var loader = new Loader();
  var menu = new Menu();
  var imagesLoader = new ImagesLoader([
    './app/public/img/part-beam.png',
    './app/public/img/part-drop.png',
    './app/public/img/part-sphere.png',
    './app/public/img/part-grid.png',
    './app/public/img/part-field.png',
    './app/public/img/part-stars.png'
  ]);

  imagesLoader.onProgress(function (percent) {
    loader.update(percent);
  });

  imagesLoader.start();

  // heads
  skrollr.init({ skrollrBody: 'mobile-body' });

  // tails
  var wireframe = new Wireframe(jQuery('.wireframe'));

  if (!mobile()) {
    var $tails = jQuery('.tails');
    var $tailsSections = $tails.find('.tails__section');

    // prepare els
    $tailsSections.find('.tails__section__el').animate({ opacity: 0, y: 100 }, 0);

    var waypoint = $tailsSections.waypoint({
      offset: 30,
      startAt: $tails.offset().top - 1000
    });

    waypoint.start();

    $tailsSections.on('active', function () {
      var $el = jQuery(this);
      
      if ($el.attr('data-appeared')) {
        return false;
      }

      jQuery(this).find('.tails__section__el').each(function (i) {
        jQuery(this).stop().delay(i * 100).animate({ opacity: 1, y: 0 }, 500);
      });

      $el.attr('data-appeared', true);
    });

    jQuery('.tails__section--site').on('stateChange', function (e, state) {
      if (state === 'active') {
        wireframe.start();
        wireframe.in();
      } else {
        wireframe.stop();
      }
    });
  } else {
    wireframe.in();
  }

  imagesLoader.onComplete(function () {
    loader.out();

    setTimeout(function () {
      menu.in();
    }, 1500);
  });
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvbWFpbjJELmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBqc2hpbnQgbGF4YnJlYWs6IHRydWUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG5yZXF1aXJlKCcuL3BvbHlmaWxscy9hbmltRnJhbWVQb2x5ZmlsbCcpO1xucmVxdWlyZSgnLi9wb2x5ZmlsbHMvYmluZFBvbHlmaWxsJyk7XG5yZXF1aXJlKCcuL3BvbHlmaWxscy9pbmRleE9mUG9seWZpbGwnKTtcblxudmFyIGpRdWVyeSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydqUXVlcnknXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ2pRdWVyeSddIDogbnVsbCk7XG52YXIgc2tyb2xsciA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93Wydza3JvbGxyJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydza3JvbGxyJ10gOiBudWxsKTtcbnJlcXVpcmUoJy4vbGlicy93YXlwb2ludExpYicpO1xuICBcbnZhciBIQVNIID0gcmVxdWlyZSgnLi9tb2R1bGVzL2hhc2hNb2R1bGUnKTtcblxudmFyIEltYWdlc0xvYWRlciA9IHJlcXVpcmUoJy4vY2xhc3Nlcy9Mb2FkZXJDbGFzcycpO1xuXG52YXIgTG9hZGVyID0gcmVxdWlyZSgnLi9vYmplY3RzMkQvTG9hZGVyT2JqZWN0MkQnKTtcbnZhciBNZW51ID0gcmVxdWlyZSgnLi9vYmplY3RzMkQvbWVudU9iamVjdDJEJyk7XG52YXIgV2lyZWZyYW1lID0gcmVxdWlyZSgnLi9vYmplY3RzMkQvV2lyZWZyYW1lT2JqZWN0MkQnKTtcblxuZnVuY3Rpb24gbW9iaWxlICgpIHtcbiAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0FuZHJvaWQvaSlcbiAgICB8fCBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC93ZWJPUy9pKVxuICAgIHx8IG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL2lQaG9uZS9pKVxuICAgIHx8IG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL2lQYWQvaSlcbiAgICB8fCBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUG9kL2kpXG4gICAgfHwgbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvQmxhY2tCZXJyeS9pKVxuICAgIHx8IG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1dpbmRvd3MgUGhvbmUvaSk7XG59XG5cbmpRdWVyeShmdW5jdGlvbiAoKSB7XG4gIEhBU0gucmVwbGFjZVBsYWNlaG9sZGVycygpO1xuXG4gIHZhciBsb2FkZXIgPSBuZXcgTG9hZGVyKCk7XG4gIHZhciBtZW51ID0gbmV3IE1lbnUoKTtcbiAgdmFyIGltYWdlc0xvYWRlciA9IG5ldyBJbWFnZXNMb2FkZXIoW1xuICAgICcuL2FwcC9wdWJsaWMvaW1nL3BhcnQtYmVhbS5wbmcnLFxuICAgICcuL2FwcC9wdWJsaWMvaW1nL3BhcnQtZHJvcC5wbmcnLFxuICAgICcuL2FwcC9wdWJsaWMvaW1nL3BhcnQtc3BoZXJlLnBuZycsXG4gICAgJy4vYXBwL3B1YmxpYy9pbWcvcGFydC1ncmlkLnBuZycsXG4gICAgJy4vYXBwL3B1YmxpYy9pbWcvcGFydC1maWVsZC5wbmcnLFxuICAgICcuL2FwcC9wdWJsaWMvaW1nL3BhcnQtc3RhcnMucG5nJ1xuICBdKTtcblxuICBpbWFnZXNMb2FkZXIub25Qcm9ncmVzcyhmdW5jdGlvbiAocGVyY2VudCkge1xuICAgIGxvYWRlci51cGRhdGUocGVyY2VudCk7XG4gIH0pO1xuXG4gIGltYWdlc0xvYWRlci5zdGFydCgpO1xuXG4gIC8vIGhlYWRzXG4gIHNrcm9sbHIuaW5pdCh7IHNrcm9sbHJCb2R5OiAnbW9iaWxlLWJvZHknIH0pO1xuXG4gIC8vIHRhaWxzXG4gIHZhciB3aXJlZnJhbWUgPSBuZXcgV2lyZWZyYW1lKGpRdWVyeSgnLndpcmVmcmFtZScpKTtcblxuICBpZiAoIW1vYmlsZSgpKSB7XG4gICAgdmFyICR0YWlscyA9IGpRdWVyeSgnLnRhaWxzJyk7XG4gICAgdmFyICR0YWlsc1NlY3Rpb25zID0gJHRhaWxzLmZpbmQoJy50YWlsc19fc2VjdGlvbicpO1xuXG4gICAgLy8gcHJlcGFyZSBlbHNcbiAgICAkdGFpbHNTZWN0aW9ucy5maW5kKCcudGFpbHNfX3NlY3Rpb25fX2VsJykuYW5pbWF0ZSh7IG9wYWNpdHk6IDAsIHk6IDEwMCB9LCAwKTtcblxuICAgIHZhciB3YXlwb2ludCA9ICR0YWlsc1NlY3Rpb25zLndheXBvaW50KHtcbiAgICAgIG9mZnNldDogMzAsXG4gICAgICBzdGFydEF0OiAkdGFpbHMub2Zmc2V0KCkudG9wIC0gMTAwMFxuICAgIH0pO1xuXG4gICAgd2F5cG9pbnQuc3RhcnQoKTtcblxuICAgICR0YWlsc1NlY3Rpb25zLm9uKCdhY3RpdmUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJGVsID0galF1ZXJ5KHRoaXMpO1xuICAgICAgXG4gICAgICBpZiAoJGVsLmF0dHIoJ2RhdGEtYXBwZWFyZWQnKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGpRdWVyeSh0aGlzKS5maW5kKCcudGFpbHNfX3NlY3Rpb25fX2VsJykuZWFjaChmdW5jdGlvbiAoaSkge1xuICAgICAgICBqUXVlcnkodGhpcykuc3RvcCgpLmRlbGF5KGkgKiAxMDApLmFuaW1hdGUoeyBvcGFjaXR5OiAxLCB5OiAwIH0sIDUwMCk7XG4gICAgICB9KTtcblxuICAgICAgJGVsLmF0dHIoJ2RhdGEtYXBwZWFyZWQnLCB0cnVlKTtcbiAgICB9KTtcblxuICAgIGpRdWVyeSgnLnRhaWxzX19zZWN0aW9uLS1zaXRlJykub24oJ3N0YXRlQ2hhbmdlJywgZnVuY3Rpb24gKGUsIHN0YXRlKSB7XG4gICAgICBpZiAoc3RhdGUgPT09ICdhY3RpdmUnKSB7XG4gICAgICAgIHdpcmVmcmFtZS5zdGFydCgpO1xuICAgICAgICB3aXJlZnJhbWUuaW4oKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdpcmVmcmFtZS5zdG9wKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgd2lyZWZyYW1lLmluKCk7XG4gIH1cblxuICBpbWFnZXNMb2FkZXIub25Db21wbGV0ZShmdW5jdGlvbiAoKSB7XG4gICAgbG9hZGVyLm91dCgpO1xuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICBtZW51LmluKCk7XG4gICAgfSwgMTUwMCk7XG4gIH0pO1xufSk7Il19
},{"./classes/LoaderClass":2,"./libs/waypointLib":3,"./modules/hashModule":4,"./objects2D/LoaderObject2D":5,"./objects2D/WireframeObject2D":6,"./objects2D/menuObject2D":7,"./polyfills/animFramePolyfill":8,"./polyfills/bindPolyfill":9,"./polyfills/indexOfPolyfill":10}],2:[function(require,module,exports){
'use strict';

/**
 * Preload images. Notify on update/complete
 *
 * @class ImagesLoader
 * @constructor
 * @param {Array} [images=[]] Images sources
 */
function ImagesLoader (images) {
  this.images = images || [];
  this.total = this.images.length;

  var fn = function () {};
  this.progress = fn;
  this.complete = fn;
}

/**
 * Start to preload
 *
 * @method start
 */
ImagesLoader.prototype.start = function () {
  var loaded = 0;

  var updateQueue = function () {
    loaded++;

    var percent = (loaded * 100) / this.total;
    this.progress(percent);

    if (loaded === this.total) {
      this.complete();
    }
  }.bind(this);

  for (var i = 0; i < this.total; i++) {
    var image = new Image();
    image.src = this.images[i];
    image.onload = image.onerror = updateQueue;
  }
};

/**
 * Pass the update handler
 *
 * @method onProgress
 * @param {Function} [progress] 
 */
ImagesLoader.prototype.onProgress = function (progress) {
  this.progress = progress;
};

/**
 * Pass the complete handler
 *
 * @method onComplete
 * @param {Function} [complete] 
 */
ImagesLoader.prototype.onComplete = function (complete) {
  this.complete = complete;
};

module.exports = ImagesLoader;
},{}],3:[function(require,module,exports){
(function (global){
/* jshint laxbreak: true */

'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

var debounce = require('../utils/debounceUtil');

module.exports = (function ($) {
  /**
   * Trigger event on element when they enter/leave viewport
   *
   * @class waypoint
   * @constructor
   * @param {Object} [options]
   * @param {jQuery} [options.$viewport=jQuery(window)] Viewport
   * @param {Number} [options.offset=0] Offset
   * @param {Number} [options.startAt=null] Start after certain distance (for performances)
   * @requires jQuery, debounce
   */
  $.fn.waypoint = function (options) {
    var isInContainer = options.$viewport ? true : false;

    var parameters = $.extend({
      $viewport: $(window),
      offset: 0,
      startAt: null
    }, options);

    var $els = $(this);
    var $viewport = parameters.$viewport;

    var viewportHeight = $viewport.height();
    var scrollTop = $viewport.scrollTop();
    var threshold = viewportHeight * (parameters.offset / 100);

    // Store height and top on elements to avoid consecutive computations
    function cacheAttributes () {
      $els.each(function () {
        var $el = $(this);

        var height = parseInt($el.outerHeight());
        var top = isInContainer
          ? parseInt($el.position().top) + scrollTop
          : parseInt($el.offset().top);

        $el.attr({ 'data-height': height, 'data-top': top });
      });
    }

    function onResize () {
      /*jshint validthis: true */

      viewportHeight = $viewport.height();
      threshold = viewportHeight * (parameters.offset / 100);

      cacheAttributes();

      $(this).trigger('scroll');
    }

    var onScroll = debounce(function onScroll () {
      scrollTop = $(this).scrollTop();

      if (parameters.startAt && scrollTop < parameters.startAt) {
        return false;
      }

      var topLimit = scrollTop + threshold;
      var bottomLimit = scrollTop + (viewportHeight - threshold);

      $els.each(function () {
        var $el = $(this);

        var state = $el.attr('data-state');

        var height = parseInt($el.attr('data-height')) || $el.outerHeight();
        var top = isInContainer
          ? parseInt($el.attr('data-top')) + 1 || $el.position().top + 1
          : parseInt($el.attr('data-top')) + 1 || $el.offset().top + 1;
        var bottom = top + height;

        if (top > topLimit && top < bottomLimit
            || bottom > topLimit && bottom < bottomLimit
            || top < topLimit && bottom > bottomLimit) {

          if (!state) {
            $el.attr('data-state', 'visible');
            $el.trigger('active');
            $el.trigger('stateChange', 'active');
          }
        } else {
          if (state) {
            $el.attr('data-state', null);
            $el.trigger('inactive');
            $el.trigger('stateChange', 'inactive');
          }
        }

      });
    }, 20);

    return {
      /**
       * Start waypoint
       *
       * @method start
       */
      start: function () {
        $(window).on('resize', onResize);
        $viewport.on('scroll', onScroll);
        cacheAttributes();
        onScroll();
      },

      /**
       * Stop waypoint
       *
       * @method stop
       */
      stop: function () {
        $(window).off('resize', onResize);
        $viewport.off('scroll', onScroll);
      }
    };
  };

})(jQuery);
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvbGlicy93YXlwb2ludExpYi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiLyoganNoaW50IGxheGJyZWFrOiB0cnVlICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGpRdWVyeSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydqUXVlcnknXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ2pRdWVyeSddIDogbnVsbCk7XG5cbnZhciBkZWJvdW5jZSA9IHJlcXVpcmUoJy4uL3V0aWxzL2RlYm91bmNlVXRpbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoJCkge1xuICAvKipcbiAgICogVHJpZ2dlciBldmVudCBvbiBlbGVtZW50IHdoZW4gdGhleSBlbnRlci9sZWF2ZSB2aWV3cG9ydFxuICAgKlxuICAgKiBAY2xhc3Mgd2F5cG9pbnRcbiAgICogQGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAgICogQHBhcmFtIHtqUXVlcnl9IFtvcHRpb25zLiR2aWV3cG9ydD1qUXVlcnkod2luZG93KV0gVmlld3BvcnRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLm9mZnNldD0wXSBPZmZzZXRcbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnN0YXJ0QXQ9bnVsbF0gU3RhcnQgYWZ0ZXIgY2VydGFpbiBkaXN0YW5jZSAoZm9yIHBlcmZvcm1hbmNlcylcbiAgICogQHJlcXVpcmVzIGpRdWVyeSwgZGVib3VuY2VcbiAgICovXG4gICQuZm4ud2F5cG9pbnQgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgIHZhciBpc0luQ29udGFpbmVyID0gb3B0aW9ucy4kdmlld3BvcnQgPyB0cnVlIDogZmFsc2U7XG5cbiAgICB2YXIgcGFyYW1ldGVycyA9ICQuZXh0ZW5kKHtcbiAgICAgICR2aWV3cG9ydDogJCh3aW5kb3cpLFxuICAgICAgb2Zmc2V0OiAwLFxuICAgICAgc3RhcnRBdDogbnVsbFxuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgdmFyICRlbHMgPSAkKHRoaXMpO1xuICAgIHZhciAkdmlld3BvcnQgPSBwYXJhbWV0ZXJzLiR2aWV3cG9ydDtcblxuICAgIHZhciB2aWV3cG9ydEhlaWdodCA9ICR2aWV3cG9ydC5oZWlnaHQoKTtcbiAgICB2YXIgc2Nyb2xsVG9wID0gJHZpZXdwb3J0LnNjcm9sbFRvcCgpO1xuICAgIHZhciB0aHJlc2hvbGQgPSB2aWV3cG9ydEhlaWdodCAqIChwYXJhbWV0ZXJzLm9mZnNldCAvIDEwMCk7XG5cbiAgICAvLyBTdG9yZSBoZWlnaHQgYW5kIHRvcCBvbiBlbGVtZW50cyB0byBhdm9pZCBjb25zZWN1dGl2ZSBjb21wdXRhdGlvbnNcbiAgICBmdW5jdGlvbiBjYWNoZUF0dHJpYnV0ZXMgKCkge1xuICAgICAgJGVscy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyICRlbCA9ICQodGhpcyk7XG5cbiAgICAgICAgdmFyIGhlaWdodCA9IHBhcnNlSW50KCRlbC5vdXRlckhlaWdodCgpKTtcbiAgICAgICAgdmFyIHRvcCA9IGlzSW5Db250YWluZXJcbiAgICAgICAgICA/IHBhcnNlSW50KCRlbC5wb3NpdGlvbigpLnRvcCkgKyBzY3JvbGxUb3BcbiAgICAgICAgICA6IHBhcnNlSW50KCRlbC5vZmZzZXQoKS50b3ApO1xuXG4gICAgICAgICRlbC5hdHRyKHsgJ2RhdGEtaGVpZ2h0JzogaGVpZ2h0LCAnZGF0YS10b3AnOiB0b3AgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvblJlc2l6ZSAoKSB7XG4gICAgICAvKmpzaGludCB2YWxpZHRoaXM6IHRydWUgKi9cblxuICAgICAgdmlld3BvcnRIZWlnaHQgPSAkdmlld3BvcnQuaGVpZ2h0KCk7XG4gICAgICB0aHJlc2hvbGQgPSB2aWV3cG9ydEhlaWdodCAqIChwYXJhbWV0ZXJzLm9mZnNldCAvIDEwMCk7XG5cbiAgICAgIGNhY2hlQXR0cmlidXRlcygpO1xuXG4gICAgICAkKHRoaXMpLnRyaWdnZXIoJ3Njcm9sbCcpO1xuICAgIH1cblxuICAgIHZhciBvblNjcm9sbCA9IGRlYm91bmNlKGZ1bmN0aW9uIG9uU2Nyb2xsICgpIHtcbiAgICAgIHNjcm9sbFRvcCA9ICQodGhpcykuc2Nyb2xsVG9wKCk7XG5cbiAgICAgIGlmIChwYXJhbWV0ZXJzLnN0YXJ0QXQgJiYgc2Nyb2xsVG9wIDwgcGFyYW1ldGVycy5zdGFydEF0KSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgdmFyIHRvcExpbWl0ID0gc2Nyb2xsVG9wICsgdGhyZXNob2xkO1xuICAgICAgdmFyIGJvdHRvbUxpbWl0ID0gc2Nyb2xsVG9wICsgKHZpZXdwb3J0SGVpZ2h0IC0gdGhyZXNob2xkKTtcblxuICAgICAgJGVscy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyICRlbCA9ICQodGhpcyk7XG5cbiAgICAgICAgdmFyIHN0YXRlID0gJGVsLmF0dHIoJ2RhdGEtc3RhdGUnKTtcblxuICAgICAgICB2YXIgaGVpZ2h0ID0gcGFyc2VJbnQoJGVsLmF0dHIoJ2RhdGEtaGVpZ2h0JykpIHx8ICRlbC5vdXRlckhlaWdodCgpO1xuICAgICAgICB2YXIgdG9wID0gaXNJbkNvbnRhaW5lclxuICAgICAgICAgID8gcGFyc2VJbnQoJGVsLmF0dHIoJ2RhdGEtdG9wJykpICsgMSB8fCAkZWwucG9zaXRpb24oKS50b3AgKyAxXG4gICAgICAgICAgOiBwYXJzZUludCgkZWwuYXR0cignZGF0YS10b3AnKSkgKyAxIHx8ICRlbC5vZmZzZXQoKS50b3AgKyAxO1xuICAgICAgICB2YXIgYm90dG9tID0gdG9wICsgaGVpZ2h0O1xuXG4gICAgICAgIGlmICh0b3AgPiB0b3BMaW1pdCAmJiB0b3AgPCBib3R0b21MaW1pdFxuICAgICAgICAgICAgfHwgYm90dG9tID4gdG9wTGltaXQgJiYgYm90dG9tIDwgYm90dG9tTGltaXRcbiAgICAgICAgICAgIHx8IHRvcCA8IHRvcExpbWl0ICYmIGJvdHRvbSA+IGJvdHRvbUxpbWl0KSB7XG5cbiAgICAgICAgICBpZiAoIXN0YXRlKSB7XG4gICAgICAgICAgICAkZWwuYXR0cignZGF0YS1zdGF0ZScsICd2aXNpYmxlJyk7XG4gICAgICAgICAgICAkZWwudHJpZ2dlcignYWN0aXZlJyk7XG4gICAgICAgICAgICAkZWwudHJpZ2dlcignc3RhdGVDaGFuZ2UnLCAnYWN0aXZlJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChzdGF0ZSkge1xuICAgICAgICAgICAgJGVsLmF0dHIoJ2RhdGEtc3RhdGUnLCBudWxsKTtcbiAgICAgICAgICAgICRlbC50cmlnZ2VyKCdpbmFjdGl2ZScpO1xuICAgICAgICAgICAgJGVsLnRyaWdnZXIoJ3N0YXRlQ2hhbmdlJywgJ2luYWN0aXZlJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgIH0pO1xuICAgIH0sIDIwKTtcblxuICAgIHJldHVybiB7XG4gICAgICAvKipcbiAgICAgICAqIFN0YXJ0IHdheXBvaW50XG4gICAgICAgKlxuICAgICAgICogQG1ldGhvZCBzdGFydFxuICAgICAgICovXG4gICAgICBzdGFydDogZnVuY3Rpb24gKCkge1xuICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIG9uUmVzaXplKTtcbiAgICAgICAgJHZpZXdwb3J0Lm9uKCdzY3JvbGwnLCBvblNjcm9sbCk7XG4gICAgICAgIGNhY2hlQXR0cmlidXRlcygpO1xuICAgICAgICBvblNjcm9sbCgpO1xuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBTdG9wIHdheXBvaW50XG4gICAgICAgKlxuICAgICAgICogQG1ldGhvZCBzdG9wXG4gICAgICAgKi9cbiAgICAgIHN0b3A6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCh3aW5kb3cpLm9mZigncmVzaXplJywgb25SZXNpemUpO1xuICAgICAgICAkdmlld3BvcnQub2ZmKCdzY3JvbGwnLCBvblNjcm9sbCk7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxufSkoalF1ZXJ5KTsiXX0=
},{"../utils/debounceUtil":11}],4:[function(require,module,exports){
(function (global){
'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

/**
 * Extract the current hash
 * and return the corresponding name
 *
 * @module HASH
 * @requires jQuery
 */
var HASH = HASH || (function () {
  var instance = null;

  function init () {
    var agencies = {
      akqa: 'AKQA',
      hki: 'HKI',
      grouek: 'Grouek',
      mediamonks: 'Media Monks',
      soleilnoir: 'Soleil Noir',
      thread: 'Thread',
      ultranoir: 'Ultra Noir'
    };

    function getHash () {
      return window.location.hash.split('#')[1];
    }

    function getAgency (hash) {
      var agency;

      if (hash && agencies[hash]) {
        agency = agencies[hash];
      } else {
        agency = '';
      }

      return agency;
    }

    var hash = getHash();
    var agency = getAgency(hash);

    return {
      hash: hash,
      agency: agency,

      /**
       * Replace all the placeholders by correct agency name
       *
       * @method replacePlaceholders
       */
      replacePlaceholders: function () {
        var $placeholders = jQuery('.placeholder--agency');
        
        $placeholders.each(function () {
          var $placeholder = jQuery(this);

          if ($placeholder.hasClass('placeholder--agency--you')) {
            if (agency !== '') {
              $placeholder.html(agency);
            } else {
              $placeholder.html('you');
            }
          } else {
            if ($placeholder.hasClass('placeholder--agency--capital')) {
              $placeholder.html(agency.toUpperCase());
            } else {
              $placeholder.html(agency);
            }
          }
        });

        var $email = jQuery('.placeholder--email');

        var subject = hash ? '?subject=Hi from ' + agency : '?subject=Hi';
        var body = hash ? '&body=Hi V, we like your work and would love to meet you.' : '&body=Hi V';

        $email.attr('href', [
          'mailto:valentin.marmonier@gmail.com',
          subject,
          body
        ].join(''));
      }
    };
  }

  return {
    /**
     * Get HASH current instance
     *
     * @method getInstance
     * @return {HASH}
     */
    getInstance: function () {
      if (!instance) {
        instance = init();
      }

      return instance;
    }
  };
})();

module.exports = HASH.getInstance();
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvbW9kdWxlcy9oYXNoTW9kdWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgalF1ZXJ5ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ2pRdWVyeSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnalF1ZXJ5J10gOiBudWxsKTtcblxuLyoqXG4gKiBFeHRyYWN0IHRoZSBjdXJyZW50IGhhc2hcbiAqIGFuZCByZXR1cm4gdGhlIGNvcnJlc3BvbmRpbmcgbmFtZVxuICpcbiAqIEBtb2R1bGUgSEFTSFxuICogQHJlcXVpcmVzIGpRdWVyeVxuICovXG52YXIgSEFTSCA9IEhBU0ggfHwgKGZ1bmN0aW9uICgpIHtcbiAgdmFyIGluc3RhbmNlID0gbnVsbDtcblxuICBmdW5jdGlvbiBpbml0ICgpIHtcbiAgICB2YXIgYWdlbmNpZXMgPSB7XG4gICAgICBha3FhOiAnQUtRQScsXG4gICAgICBoa2k6ICdIS0knLFxuICAgICAgZ3JvdWVrOiAnR3JvdWVrJyxcbiAgICAgIG1lZGlhbW9ua3M6ICdNZWRpYSBNb25rcycsXG4gICAgICBzb2xlaWxub2lyOiAnU29sZWlsIE5vaXInLFxuICAgICAgdGhyZWFkOiAnVGhyZWFkJyxcbiAgICAgIHVsdHJhbm9pcjogJ1VsdHJhIE5vaXInXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGdldEhhc2ggKCkge1xuICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5oYXNoLnNwbGl0KCcjJylbMV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0QWdlbmN5IChoYXNoKSB7XG4gICAgICB2YXIgYWdlbmN5O1xuXG4gICAgICBpZiAoaGFzaCAmJiBhZ2VuY2llc1toYXNoXSkge1xuICAgICAgICBhZ2VuY3kgPSBhZ2VuY2llc1toYXNoXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFnZW5jeSA9ICcnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gYWdlbmN5O1xuICAgIH1cblxuICAgIHZhciBoYXNoID0gZ2V0SGFzaCgpO1xuICAgIHZhciBhZ2VuY3kgPSBnZXRBZ2VuY3koaGFzaCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgaGFzaDogaGFzaCxcbiAgICAgIGFnZW5jeTogYWdlbmN5LFxuXG4gICAgICAvKipcbiAgICAgICAqIFJlcGxhY2UgYWxsIHRoZSBwbGFjZWhvbGRlcnMgYnkgY29ycmVjdCBhZ2VuY3kgbmFtZVxuICAgICAgICpcbiAgICAgICAqIEBtZXRob2QgcmVwbGFjZVBsYWNlaG9sZGVyc1xuICAgICAgICovXG4gICAgICByZXBsYWNlUGxhY2Vob2xkZXJzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciAkcGxhY2Vob2xkZXJzID0galF1ZXJ5KCcucGxhY2Vob2xkZXItLWFnZW5jeScpO1xuICAgICAgICBcbiAgICAgICAgJHBsYWNlaG9sZGVycy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgJHBsYWNlaG9sZGVyID0galF1ZXJ5KHRoaXMpO1xuXG4gICAgICAgICAgaWYgKCRwbGFjZWhvbGRlci5oYXNDbGFzcygncGxhY2Vob2xkZXItLWFnZW5jeS0teW91JykpIHtcbiAgICAgICAgICAgIGlmIChhZ2VuY3kgIT09ICcnKSB7XG4gICAgICAgICAgICAgICRwbGFjZWhvbGRlci5odG1sKGFnZW5jeSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAkcGxhY2Vob2xkZXIuaHRtbCgneW91Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICgkcGxhY2Vob2xkZXIuaGFzQ2xhc3MoJ3BsYWNlaG9sZGVyLS1hZ2VuY3ktLWNhcGl0YWwnKSkge1xuICAgICAgICAgICAgICAkcGxhY2Vob2xkZXIuaHRtbChhZ2VuY3kudG9VcHBlckNhc2UoKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAkcGxhY2Vob2xkZXIuaHRtbChhZ2VuY3kpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyICRlbWFpbCA9IGpRdWVyeSgnLnBsYWNlaG9sZGVyLS1lbWFpbCcpO1xuXG4gICAgICAgIHZhciBzdWJqZWN0ID0gaGFzaCA/ICc/c3ViamVjdD1IaSBmcm9tICcgKyBhZ2VuY3kgOiAnP3N1YmplY3Q9SGknO1xuICAgICAgICB2YXIgYm9keSA9IGhhc2ggPyAnJmJvZHk9SGkgViwgd2UgbGlrZSB5b3VyIHdvcmsgYW5kIHdvdWxkIGxvdmUgdG8gbWVldCB5b3UuJyA6ICcmYm9keT1IaSBWJztcblxuICAgICAgICAkZW1haWwuYXR0cignaHJlZicsIFtcbiAgICAgICAgICAnbWFpbHRvOnZhbGVudGluLm1hcm1vbmllckBnbWFpbC5jb20nLFxuICAgICAgICAgIHN1YmplY3QsXG4gICAgICAgICAgYm9keVxuICAgICAgICBdLmpvaW4oJycpKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAvKipcbiAgICAgKiBHZXQgSEFTSCBjdXJyZW50IGluc3RhbmNlXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGdldEluc3RhbmNlXG4gICAgICogQHJldHVybiB7SEFTSH1cbiAgICAgKi9cbiAgICBnZXRJbnN0YW5jZTogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCFpbnN0YW5jZSkge1xuICAgICAgICBpbnN0YW5jZSA9IGluaXQoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgIH1cbiAgfTtcbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gSEFTSC5nZXRJbnN0YW5jZSgpOyJdfQ==
},{}],5:[function(require,module,exports){
(function (global){
'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

/**
 * Preloader
 *
 * @class Loader
 * @constructor
 * @requires jQuery
 */
function Loader () {
  this.$el = jQuery('.loader');
  this.$title = this.$el.find('.loader__title');
  this.$progress = this.$el.find('.loader__progress');
}

/**
 * Out animation
 *
 * @method out
 */
Loader.prototype.out = function () {
  this.$progress.stop().animate({ width: '100%' }, 1000, function () {
    this.$el.animate({ opacity: 0 }, 1000, function () {
      this.$el.css('display', 'none');
    }.bind(this));

    this.$title.animate({ top: '-10%', opacity: 0 }, 500);
    this.$progress.animate({ height: 0 }, 400);
  }.bind(this));
};

/**
 * Update the percent loaded
 *
 * @method update
 * @param {Number} [percent]
 */
Loader.prototype.update = function () {};

module.exports = Loader;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvb2JqZWN0czJEL0xvYWRlck9iamVjdDJELmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIGpRdWVyeSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydqUXVlcnknXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ2pRdWVyeSddIDogbnVsbCk7XG5cbi8qKlxuICogUHJlbG9hZGVyXG4gKlxuICogQGNsYXNzIExvYWRlclxuICogQGNvbnN0cnVjdG9yXG4gKiBAcmVxdWlyZXMgalF1ZXJ5XG4gKi9cbmZ1bmN0aW9uIExvYWRlciAoKSB7XG4gIHRoaXMuJGVsID0galF1ZXJ5KCcubG9hZGVyJyk7XG4gIHRoaXMuJHRpdGxlID0gdGhpcy4kZWwuZmluZCgnLmxvYWRlcl9fdGl0bGUnKTtcbiAgdGhpcy4kcHJvZ3Jlc3MgPSB0aGlzLiRlbC5maW5kKCcubG9hZGVyX19wcm9ncmVzcycpO1xufVxuXG4vKipcbiAqIE91dCBhbmltYXRpb25cbiAqXG4gKiBAbWV0aG9kIG91dFxuICovXG5Mb2FkZXIucHJvdG90eXBlLm91dCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy4kcHJvZ3Jlc3Muc3RvcCgpLmFuaW1hdGUoeyB3aWR0aDogJzEwMCUnIH0sIDEwMDAsIGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLiRlbC5hbmltYXRlKHsgb3BhY2l0eTogMCB9LCAxMDAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLiRlbC5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLiR0aXRsZS5hbmltYXRlKHsgdG9wOiAnLTEwJScsIG9wYWNpdHk6IDAgfSwgNTAwKTtcbiAgICB0aGlzLiRwcm9ncmVzcy5hbmltYXRlKHsgaGVpZ2h0OiAwIH0sIDQwMCk7XG4gIH0uYmluZCh0aGlzKSk7XG59O1xuXG4vKipcbiAqIFVwZGF0ZSB0aGUgcGVyY2VudCBsb2FkZWRcbiAqXG4gKiBAbWV0aG9kIHVwZGF0ZVxuICogQHBhcmFtIHtOdW1iZXJ9IFtwZXJjZW50XVxuICovXG5Mb2FkZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHt9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExvYWRlcjsiXX0=
},{}],6:[function(require,module,exports){
(function (global){
/* jshint laxbreak: true */

'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

/**
 * Animated wireframe
 *
 * @class Wireframe
 * @constructor
 * @param {jQuery} [$el] DOM element
 * @param {Object} [options]
 * @param {Number} [options.delay] Delay between frames
 * @param {Array} [options.positions] Animated scroll positions
 * @requires jQuery
 */
function Wireframe ($el, options) {
  this.parameters = jQuery.extend({
    delay: 200,
    positions: [-20, -90, -135, -200, -20, 40]
  }, options);

  this.$topLines = $el.find('.wireframe__frame--top');
  this.$bottomLines = $el.find('.wireframe__frame--bottom');
  this.$leftLines = $el.find('.wireframe__frame--left');
  this.$rightLines = $el.find('.wireframe__frame--right');
  this.$leftColumn = $el.find('.wireframe__column--left');
  this.$textLines = $el.find('.wireframe__text__line');
  this.$controlNodes = $el.find('.wireframe__controls__node');

  this.interval = null;
  this.totalPositions = this.parameters.positions.length;
  this.currentPosition = 0;
}

/**
 * In animation
 *
 * @method in
 * @param {Boolean} [out] Out instead of in?
 */
Wireframe.prototype.in = function (out) {
  // targets
  var targetLines;
  var targetTextLines;
  var targetIncompleteTextLines;
  var targetNodes;

  if (out === 0) {
    targetLines = targetTextLines = targetIncompleteTextLines = 0;
    targetNodes = 30;
  } else {
    targetLines = targetTextLines = '100%';
    targetIncompleteTextLines = '60%';
    targetNodes = 0;
  }

  // frames
  var totalFrames = this.$topLines.length;

  var setAnimation = function (index) {
    var $top = jQuery(this.$topLines[index]);
    var $bottom = jQuery(this.$bottomLines[index]);
    var $left = jQuery(this.$leftLines[index]);
    var $right = jQuery(this.$rightLines[index]);

    setTimeout(function () {
      $top.css('width', targetLines);
      $right.css('height', targetLines);
    }, (index * this.parameters.delay) + 400);

    setTimeout(function () {
      $left.css('height', targetLines);
      $bottom.css('width', targetLines);
    }, (index * this.parameters.delay) + 600);
  }.bind(this);

  // set animations for each frame
  for (var i = 0; i < totalFrames; i++) {
    setAnimation(i);
  }

  // text
  var delay = this.parameters.delay;

  this.$textLines.each(function (i) {
    var $line = jQuery(this);

    setTimeout(function () {
      $line.css('width', $line.hasClass('wireframe__text__line--incomplete')
        ? targetIncompleteTextLines
        : targetTextLines);
      
    }, i * delay);
  });

  // control nodes
  this.$controlNodes.each(function (i) {
    var $node = jQuery(this);

    setTimeout(function () {
      $node.css('top', targetNodes);
    }, i * delay);
  });
};

/**
 * Out animation
 *
 * @method out
 */
Wireframe.prototype.out = function () {
  this.$topLines.css('width', 0);
  this.$bottomLines.css('width', 0);
  this.$leftLines.css('height', 0);
  this.$rightLines.css('height', 0);
  this.$textLines.css('width', 0);
  this.$controlNodes.css('top', 30);
};

/**
 * Start animation
 *
 * @method start
 */
Wireframe.prototype.start = function () {
  if (this.interval) {
    return false;
  }

  this.interval = setInterval(function () {
    if (this.currentPosition > this.totalPositions) {
      this.currentPosition = 0;
    }

    this.$leftColumn.css('top', this.parameters.positions[this.currentPosition] + 'px');

    this.currentPosition++;
  }.bind(this), 2000);
};

/**
 * Stop animation
 *
 * @method stop
 */
Wireframe.prototype.stop = function () {
  if (!this.interval) {
    return false;
  }

  window.clearInterval(this.interval);
  this.interval = null;
};

module.exports = Wireframe;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvb2JqZWN0czJEL1dpcmVmcmFtZU9iamVjdDJELmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiLyoganNoaW50IGxheGJyZWFrOiB0cnVlICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGpRdWVyeSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydqUXVlcnknXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ2pRdWVyeSddIDogbnVsbCk7XG5cbi8qKlxuICogQW5pbWF0ZWQgd2lyZWZyYW1lXG4gKlxuICogQGNsYXNzIFdpcmVmcmFtZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge2pRdWVyeX0gWyRlbF0gRE9NIGVsZW1lbnRcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5kZWxheV0gRGVsYXkgYmV0d2VlbiBmcmFtZXNcbiAqIEBwYXJhbSB7QXJyYXl9IFtvcHRpb25zLnBvc2l0aW9uc10gQW5pbWF0ZWQgc2Nyb2xsIHBvc2l0aW9uc1xuICogQHJlcXVpcmVzIGpRdWVyeVxuICovXG5mdW5jdGlvbiBXaXJlZnJhbWUgKCRlbCwgb3B0aW9ucykge1xuICB0aGlzLnBhcmFtZXRlcnMgPSBqUXVlcnkuZXh0ZW5kKHtcbiAgICBkZWxheTogMjAwLFxuICAgIHBvc2l0aW9uczogWy0yMCwgLTkwLCAtMTM1LCAtMjAwLCAtMjAsIDQwXVxuICB9LCBvcHRpb25zKTtcblxuICB0aGlzLiR0b3BMaW5lcyA9ICRlbC5maW5kKCcud2lyZWZyYW1lX19mcmFtZS0tdG9wJyk7XG4gIHRoaXMuJGJvdHRvbUxpbmVzID0gJGVsLmZpbmQoJy53aXJlZnJhbWVfX2ZyYW1lLS1ib3R0b20nKTtcbiAgdGhpcy4kbGVmdExpbmVzID0gJGVsLmZpbmQoJy53aXJlZnJhbWVfX2ZyYW1lLS1sZWZ0Jyk7XG4gIHRoaXMuJHJpZ2h0TGluZXMgPSAkZWwuZmluZCgnLndpcmVmcmFtZV9fZnJhbWUtLXJpZ2h0Jyk7XG4gIHRoaXMuJGxlZnRDb2x1bW4gPSAkZWwuZmluZCgnLndpcmVmcmFtZV9fY29sdW1uLS1sZWZ0Jyk7XG4gIHRoaXMuJHRleHRMaW5lcyA9ICRlbC5maW5kKCcud2lyZWZyYW1lX190ZXh0X19saW5lJyk7XG4gIHRoaXMuJGNvbnRyb2xOb2RlcyA9ICRlbC5maW5kKCcud2lyZWZyYW1lX19jb250cm9sc19fbm9kZScpO1xuXG4gIHRoaXMuaW50ZXJ2YWwgPSBudWxsO1xuICB0aGlzLnRvdGFsUG9zaXRpb25zID0gdGhpcy5wYXJhbWV0ZXJzLnBvc2l0aW9ucy5sZW5ndGg7XG4gIHRoaXMuY3VycmVudFBvc2l0aW9uID0gMDtcbn1cblxuLyoqXG4gKiBJbiBhbmltYXRpb25cbiAqXG4gKiBAbWV0aG9kIGluXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvdXRdIE91dCBpbnN0ZWFkIG9mIGluP1xuICovXG5XaXJlZnJhbWUucHJvdG90eXBlLmluID0gZnVuY3Rpb24gKG91dCkge1xuICAvLyB0YXJnZXRzXG4gIHZhciB0YXJnZXRMaW5lcztcbiAgdmFyIHRhcmdldFRleHRMaW5lcztcbiAgdmFyIHRhcmdldEluY29tcGxldGVUZXh0TGluZXM7XG4gIHZhciB0YXJnZXROb2RlcztcblxuICBpZiAob3V0ID09PSAwKSB7XG4gICAgdGFyZ2V0TGluZXMgPSB0YXJnZXRUZXh0TGluZXMgPSB0YXJnZXRJbmNvbXBsZXRlVGV4dExpbmVzID0gMDtcbiAgICB0YXJnZXROb2RlcyA9IDMwO1xuICB9IGVsc2Uge1xuICAgIHRhcmdldExpbmVzID0gdGFyZ2V0VGV4dExpbmVzID0gJzEwMCUnO1xuICAgIHRhcmdldEluY29tcGxldGVUZXh0TGluZXMgPSAnNjAlJztcbiAgICB0YXJnZXROb2RlcyA9IDA7XG4gIH1cblxuICAvLyBmcmFtZXNcbiAgdmFyIHRvdGFsRnJhbWVzID0gdGhpcy4kdG9wTGluZXMubGVuZ3RoO1xuXG4gIHZhciBzZXRBbmltYXRpb24gPSBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICB2YXIgJHRvcCA9IGpRdWVyeSh0aGlzLiR0b3BMaW5lc1tpbmRleF0pO1xuICAgIHZhciAkYm90dG9tID0galF1ZXJ5KHRoaXMuJGJvdHRvbUxpbmVzW2luZGV4XSk7XG4gICAgdmFyICRsZWZ0ID0galF1ZXJ5KHRoaXMuJGxlZnRMaW5lc1tpbmRleF0pO1xuICAgIHZhciAkcmlnaHQgPSBqUXVlcnkodGhpcy4kcmlnaHRMaW5lc1tpbmRleF0pO1xuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAkdG9wLmNzcygnd2lkdGgnLCB0YXJnZXRMaW5lcyk7XG4gICAgICAkcmlnaHQuY3NzKCdoZWlnaHQnLCB0YXJnZXRMaW5lcyk7XG4gICAgfSwgKGluZGV4ICogdGhpcy5wYXJhbWV0ZXJzLmRlbGF5KSArIDQwMCk7XG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICRsZWZ0LmNzcygnaGVpZ2h0JywgdGFyZ2V0TGluZXMpO1xuICAgICAgJGJvdHRvbS5jc3MoJ3dpZHRoJywgdGFyZ2V0TGluZXMpO1xuICAgIH0sIChpbmRleCAqIHRoaXMucGFyYW1ldGVycy5kZWxheSkgKyA2MDApO1xuICB9LmJpbmQodGhpcyk7XG5cbiAgLy8gc2V0IGFuaW1hdGlvbnMgZm9yIGVhY2ggZnJhbWVcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b3RhbEZyYW1lczsgaSsrKSB7XG4gICAgc2V0QW5pbWF0aW9uKGkpO1xuICB9XG5cbiAgLy8gdGV4dFxuICB2YXIgZGVsYXkgPSB0aGlzLnBhcmFtZXRlcnMuZGVsYXk7XG5cbiAgdGhpcy4kdGV4dExpbmVzLmVhY2goZnVuY3Rpb24gKGkpIHtcbiAgICB2YXIgJGxpbmUgPSBqUXVlcnkodGhpcyk7XG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICRsaW5lLmNzcygnd2lkdGgnLCAkbGluZS5oYXNDbGFzcygnd2lyZWZyYW1lX190ZXh0X19saW5lLS1pbmNvbXBsZXRlJylcbiAgICAgICAgPyB0YXJnZXRJbmNvbXBsZXRlVGV4dExpbmVzXG4gICAgICAgIDogdGFyZ2V0VGV4dExpbmVzKTtcbiAgICAgIFxuICAgIH0sIGkgKiBkZWxheSk7XG4gIH0pO1xuXG4gIC8vIGNvbnRyb2wgbm9kZXNcbiAgdGhpcy4kY29udHJvbE5vZGVzLmVhY2goZnVuY3Rpb24gKGkpIHtcbiAgICB2YXIgJG5vZGUgPSBqUXVlcnkodGhpcyk7XG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICRub2RlLmNzcygndG9wJywgdGFyZ2V0Tm9kZXMpO1xuICAgIH0sIGkgKiBkZWxheSk7XG4gIH0pO1xufTtcblxuLyoqXG4gKiBPdXQgYW5pbWF0aW9uXG4gKlxuICogQG1ldGhvZCBvdXRcbiAqL1xuV2lyZWZyYW1lLnByb3RvdHlwZS5vdXQgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuJHRvcExpbmVzLmNzcygnd2lkdGgnLCAwKTtcbiAgdGhpcy4kYm90dG9tTGluZXMuY3NzKCd3aWR0aCcsIDApO1xuICB0aGlzLiRsZWZ0TGluZXMuY3NzKCdoZWlnaHQnLCAwKTtcbiAgdGhpcy4kcmlnaHRMaW5lcy5jc3MoJ2hlaWdodCcsIDApO1xuICB0aGlzLiR0ZXh0TGluZXMuY3NzKCd3aWR0aCcsIDApO1xuICB0aGlzLiRjb250cm9sTm9kZXMuY3NzKCd0b3AnLCAzMCk7XG59O1xuXG4vKipcbiAqIFN0YXJ0IGFuaW1hdGlvblxuICpcbiAqIEBtZXRob2Qgc3RhcnRcbiAqL1xuV2lyZWZyYW1lLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMuaW50ZXJ2YWwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB0aGlzLmludGVydmFsID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLmN1cnJlbnRQb3NpdGlvbiA+IHRoaXMudG90YWxQb3NpdGlvbnMpIHtcbiAgICAgIHRoaXMuY3VycmVudFBvc2l0aW9uID0gMDtcbiAgICB9XG5cbiAgICB0aGlzLiRsZWZ0Q29sdW1uLmNzcygndG9wJywgdGhpcy5wYXJhbWV0ZXJzLnBvc2l0aW9uc1t0aGlzLmN1cnJlbnRQb3NpdGlvbl0gKyAncHgnKTtcblxuICAgIHRoaXMuY3VycmVudFBvc2l0aW9uKys7XG4gIH0uYmluZCh0aGlzKSwgMjAwMCk7XG59O1xuXG4vKipcbiAqIFN0b3AgYW5pbWF0aW9uXG4gKlxuICogQG1ldGhvZCBzdG9wXG4gKi9cbldpcmVmcmFtZS5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKCF0aGlzLmludGVydmFsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gIHRoaXMuaW50ZXJ2YWwgPSBudWxsO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBXaXJlZnJhbWU7Il19
},{}],7:[function(require,module,exports){
(function (global){
'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

/**
 * Menu
 *
 * @class Menu
 * @constructor
 * @requires jQuery
 */
function Menu () {
  var $el = jQuery('.menu');
  var $button = $el.find('.menu__button');
  var $itemsContainer = $el.find('.menu__items');
  var $items = $el.find('.menu__item');

  var _callback = function () {};
  var timeouts = [];

  function onMouseover () {
    $items.on('click', _callback);

    $itemsContainer.css('display', 'block');

    $el.stop().animate({ left: 0 }, { duration: 400, easing: 'easeOutQuart' });
    $button.stop().animate({ opacity: 0 }, 400);

    $items.each(function (i) {
      var $el = jQuery(this);

      var timeout = window.setTimeout(function () {
        $el.stop().animate({ opacity: 1 }, 400);
      }, i * 200);

      timeouts.push(timeout);
    });

    $el.one('mouseleave', onMouseout);
  }

  function onMouseout () {
    if (timeouts) {
      for (var i = 0, j = timeouts.length; i < j; i++) {
        window.clearTimeout(timeouts[i]);
      }
      timeouts = [];
    }

    $el.stop().animate({ left: 30 }, { duration: 400, easing: 'easeOutQuart' });
    $button.stop().animate({ opacity: 0.5 }, 400);
    $items.stop().animate({ opacity: 0 }, 400, function () {
      $itemsContainer.css('display', 'none');
      $items.off('click', _callback);
    });

    $button.one('mouseover click', onMouseover);
  }

  $button.one('mouseover click', onMouseover);

  return {
    in: function () {
      $el.animate({ top: 0, opacity: 1 }, 500);
    },

    onClick: function (callback) {
      _callback = callback;
    }
  };
}

module.exports = Menu;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvb2JqZWN0czJEL21lbnVPYmplY3QyRC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIGpRdWVyeSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydqUXVlcnknXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ2pRdWVyeSddIDogbnVsbCk7XG5cbi8qKlxuICogTWVudVxuICpcbiAqIEBjbGFzcyBNZW51XG4gKiBAY29uc3RydWN0b3JcbiAqIEByZXF1aXJlcyBqUXVlcnlcbiAqL1xuZnVuY3Rpb24gTWVudSAoKSB7XG4gIHZhciAkZWwgPSBqUXVlcnkoJy5tZW51Jyk7XG4gIHZhciAkYnV0dG9uID0gJGVsLmZpbmQoJy5tZW51X19idXR0b24nKTtcbiAgdmFyICRpdGVtc0NvbnRhaW5lciA9ICRlbC5maW5kKCcubWVudV9faXRlbXMnKTtcbiAgdmFyICRpdGVtcyA9ICRlbC5maW5kKCcubWVudV9faXRlbScpO1xuXG4gIHZhciBfY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7fTtcbiAgdmFyIHRpbWVvdXRzID0gW107XG5cbiAgZnVuY3Rpb24gb25Nb3VzZW92ZXIgKCkge1xuICAgICRpdGVtcy5vbignY2xpY2snLCBfY2FsbGJhY2spO1xuXG4gICAgJGl0ZW1zQ29udGFpbmVyLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuXG4gICAgJGVsLnN0b3AoKS5hbmltYXRlKHsgbGVmdDogMCB9LCB7IGR1cmF0aW9uOiA0MDAsIGVhc2luZzogJ2Vhc2VPdXRRdWFydCcgfSk7XG4gICAgJGJ1dHRvbi5zdG9wKCkuYW5pbWF0ZSh7IG9wYWNpdHk6IDAgfSwgNDAwKTtcblxuICAgICRpdGVtcy5lYWNoKGZ1bmN0aW9uIChpKSB7XG4gICAgICB2YXIgJGVsID0galF1ZXJ5KHRoaXMpO1xuXG4gICAgICB2YXIgdGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJGVsLnN0b3AoKS5hbmltYXRlKHsgb3BhY2l0eTogMSB9LCA0MDApO1xuICAgICAgfSwgaSAqIDIwMCk7XG5cbiAgICAgIHRpbWVvdXRzLnB1c2godGltZW91dCk7XG4gICAgfSk7XG5cbiAgICAkZWwub25lKCdtb3VzZWxlYXZlJywgb25Nb3VzZW91dCk7XG4gIH1cblxuICBmdW5jdGlvbiBvbk1vdXNlb3V0ICgpIHtcbiAgICBpZiAodGltZW91dHMpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gdGltZW91dHMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGltZW91dHNbaV0pO1xuICAgICAgfVxuICAgICAgdGltZW91dHMgPSBbXTtcbiAgICB9XG5cbiAgICAkZWwuc3RvcCgpLmFuaW1hdGUoeyBsZWZ0OiAzMCB9LCB7IGR1cmF0aW9uOiA0MDAsIGVhc2luZzogJ2Vhc2VPdXRRdWFydCcgfSk7XG4gICAgJGJ1dHRvbi5zdG9wKCkuYW5pbWF0ZSh7IG9wYWNpdHk6IDAuNSB9LCA0MDApO1xuICAgICRpdGVtcy5zdG9wKCkuYW5pbWF0ZSh7IG9wYWNpdHk6IDAgfSwgNDAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAkaXRlbXNDb250YWluZXIuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICAgICRpdGVtcy5vZmYoJ2NsaWNrJywgX2NhbGxiYWNrKTtcbiAgICB9KTtcblxuICAgICRidXR0b24ub25lKCdtb3VzZW92ZXIgY2xpY2snLCBvbk1vdXNlb3Zlcik7XG4gIH1cblxuICAkYnV0dG9uLm9uZSgnbW91c2VvdmVyIGNsaWNrJywgb25Nb3VzZW92ZXIpO1xuXG4gIHJldHVybiB7XG4gICAgaW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICRlbC5hbmltYXRlKHsgdG9wOiAwLCBvcGFjaXR5OiAxIH0sIDUwMCk7XG4gICAgfSxcblxuICAgIG9uQ2xpY2s6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgX2NhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgfVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1lbnU7Il19
},{}],8:[function(require,module,exports){
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license

'use strict';

(function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
  }
 
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }
 
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
})();
},{}],9:[function(require,module,exports){
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind

'use strict';

(function () {
  if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
      if (typeof this !== 'function') {
        // closest thing possible to the ECMAScript 5
        // internal IsCallable function
        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
      }

      var aArgs   = Array.prototype.slice.call(arguments, 1),
          fToBind = this,
          fNOP    = function() {},
          fBound  = function() {
            return fToBind.apply(this instanceof fNOP && oThis
                   ? this
                   : oThis,
                   aArgs.concat(Array.prototype.slice.call(arguments)));
          };

      fNOP.prototype = this.prototype;
      fBound.prototype = new fNOP();

      return fBound;
    };
  }
})();
},{}],10:[function(require,module,exports){
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf

'use strict';

(function () {
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement /*, fromIndex */ ) {"use strict";
      if (this == null) {
        throw new TypeError();
      }
      var t = Object(this);
      var len = t.length >>> 0;
      if (len === 0) {
        return -1;
      }
      var n = 0;
      if (arguments.length > 1) {
        n = Number(arguments[1]);
        if (n != n) {// shortcut for verifying if it's NaN
          n = 0;
        } else if (n != 0 && n != Infinity && n != -Infinity) {
          n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }
      }
      if (n >= len) {
        return -1;
      }
      var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
      for (; k < len; k++) {
        if ( k in t && t[k] === searchElement) {
          return k;
        }
      }
      return -1;
    }
  }
})();
},{}],11:[function(require,module,exports){
'use strict';

/**
 * Debounce a function
 * https://github.com/jashkenas/underscore
 *
 * @method debounce
 * @param {Function} [callback]
 * @param {Number} [delay]
 * @param {Boolean} [immediate]
 * @return {Function}
 */
function debounce (callback, delay, immediate) {
  var timeout;

  return function () {
    var context = this;
    var args = arguments;

    var callLater = function () {
      timeout = null;
      if (!immediate) {
        callback.apply(context, args);
      }
    };

    var callNow = immediate && !timeout;
    window.clearTimeout(timeout);
    timeout = window.setTimeout(callLater, delay);
    if (callNow) {
      callback.apply(context, args);
    }
  };
}

module.exports = debounce; 
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsImFwcFxcc3JjXFxqc1xcbWFpbjJELmpzIiwiYXBwXFxzcmNcXGpzXFxjbGFzc2VzXFxMb2FkZXJDbGFzcy5qcyIsImFwcFxcc3JjXFxqc1xcbGlic1xcd2F5cG9pbnRMaWIuanMiLCJhcHBcXHNyY1xcanNcXG1vZHVsZXNcXGhhc2hNb2R1bGUuanMiLCJhcHBcXHNyY1xcanNcXG9iamVjdHMyRFxcTG9hZGVyT2JqZWN0MkQuanMiLCJhcHBcXHNyY1xcanNcXG9iamVjdHMyRFxcV2lyZWZyYW1lT2JqZWN0MkQuanMiLCJhcHBcXHNyY1xcanNcXG9iamVjdHMyRFxcbWVudU9iamVjdDJELmpzIiwiYXBwXFxzcmNcXGpzXFxwb2x5ZmlsbHNcXGFuaW1GcmFtZVBvbHlmaWxsLmpzIiwiYXBwXFxzcmNcXGpzXFxwb2x5ZmlsbHNcXGJpbmRQb2x5ZmlsbC5qcyIsImFwcFxcc3JjXFxqc1xccG9seWZpbGxzXFxpbmRleE9mUG9seWZpbGwuanMiLCJhcHBcXHNyY1xcanNcXHV0aWxzXFxkZWJvdW5jZVV0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xuLyoganNoaW50IGxheGJyZWFrOiB0cnVlICovXG5cbid1c2Ugc3RyaWN0JztcblxucmVxdWlyZSgnLi9wb2x5ZmlsbHMvYW5pbUZyYW1lUG9seWZpbGwnKTtcbnJlcXVpcmUoJy4vcG9seWZpbGxzL2JpbmRQb2x5ZmlsbCcpO1xucmVxdWlyZSgnLi9wb2x5ZmlsbHMvaW5kZXhPZlBvbHlmaWxsJyk7XG5cbnZhciBqUXVlcnkgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snalF1ZXJ5J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydqUXVlcnknXSA6IG51bGwpO1xudmFyIHNrcm9sbHIgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snc2tyb2xsciddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnc2tyb2xsciddIDogbnVsbCk7XG5yZXF1aXJlKCcuL2xpYnMvd2F5cG9pbnRMaWInKTtcbiAgXG52YXIgSEFTSCA9IHJlcXVpcmUoJy4vbW9kdWxlcy9oYXNoTW9kdWxlJyk7XG5cbnZhciBJbWFnZXNMb2FkZXIgPSByZXF1aXJlKCcuL2NsYXNzZXMvTG9hZGVyQ2xhc3MnKTtcblxudmFyIExvYWRlciA9IHJlcXVpcmUoJy4vb2JqZWN0czJEL0xvYWRlck9iamVjdDJEJyk7XG52YXIgTWVudSA9IHJlcXVpcmUoJy4vb2JqZWN0czJEL21lbnVPYmplY3QyRCcpO1xudmFyIFdpcmVmcmFtZSA9IHJlcXVpcmUoJy4vb2JqZWN0czJEL1dpcmVmcmFtZU9iamVjdDJEJyk7XG5cbmZ1bmN0aW9uIG1vYmlsZSAoKSB7XG4gIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9BbmRyb2lkL2kpXG4gICAgfHwgbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvd2ViT1MvaSlcbiAgICB8fCBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUGhvbmUvaSlcbiAgICB8fCBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUGFkL2kpXG4gICAgfHwgbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvaVBvZC9pKVxuICAgIHx8IG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0JsYWNrQmVycnkvaSlcbiAgICB8fCBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9XaW5kb3dzIFBob25lL2kpO1xufVxuXG5qUXVlcnkoZnVuY3Rpb24gKCkge1xuICBIQVNILnJlcGxhY2VQbGFjZWhvbGRlcnMoKTtcblxuICB2YXIgbG9hZGVyID0gbmV3IExvYWRlcigpO1xuICB2YXIgbWVudSA9IG5ldyBNZW51KCk7XG4gIHZhciBpbWFnZXNMb2FkZXIgPSBuZXcgSW1hZ2VzTG9hZGVyKFtcbiAgICAnLi9hcHAvcHVibGljL2ltZy9wYXJ0LWJlYW0ucG5nJyxcbiAgICAnLi9hcHAvcHVibGljL2ltZy9wYXJ0LWRyb3AucG5nJyxcbiAgICAnLi9hcHAvcHVibGljL2ltZy9wYXJ0LXNwaGVyZS5wbmcnLFxuICAgICcuL2FwcC9wdWJsaWMvaW1nL3BhcnQtZ3JpZC5wbmcnLFxuICAgICcuL2FwcC9wdWJsaWMvaW1nL3BhcnQtZmllbGQucG5nJyxcbiAgICAnLi9hcHAvcHVibGljL2ltZy9wYXJ0LXN0YXJzLnBuZydcbiAgXSk7XG5cbiAgaW1hZ2VzTG9hZGVyLm9uUHJvZ3Jlc3MoZnVuY3Rpb24gKHBlcmNlbnQpIHtcbiAgICBsb2FkZXIudXBkYXRlKHBlcmNlbnQpO1xuICB9KTtcblxuICBpbWFnZXNMb2FkZXIuc3RhcnQoKTtcblxuICAvLyBoZWFkc1xuICBza3JvbGxyLmluaXQoeyBza3JvbGxyQm9keTogJ21vYmlsZS1ib2R5JyB9KTtcblxuICAvLyB0YWlsc1xuICB2YXIgd2lyZWZyYW1lID0gbmV3IFdpcmVmcmFtZShqUXVlcnkoJy53aXJlZnJhbWUnKSk7XG5cbiAgaWYgKCFtb2JpbGUoKSkge1xuICAgIHZhciAkdGFpbHMgPSBqUXVlcnkoJy50YWlscycpO1xuICAgIHZhciAkdGFpbHNTZWN0aW9ucyA9ICR0YWlscy5maW5kKCcudGFpbHNfX3NlY3Rpb24nKTtcblxuICAgIC8vIHByZXBhcmUgZWxzXG4gICAgJHRhaWxzU2VjdGlvbnMuZmluZCgnLnRhaWxzX19zZWN0aW9uX19lbCcpLmFuaW1hdGUoeyBvcGFjaXR5OiAwLCB5OiAxMDAgfSwgMCk7XG5cbiAgICB2YXIgd2F5cG9pbnQgPSAkdGFpbHNTZWN0aW9ucy53YXlwb2ludCh7XG4gICAgICBvZmZzZXQ6IDMwLFxuICAgICAgc3RhcnRBdDogJHRhaWxzLm9mZnNldCgpLnRvcCAtIDEwMDBcbiAgICB9KTtcblxuICAgIHdheXBvaW50LnN0YXJ0KCk7XG5cbiAgICAkdGFpbHNTZWN0aW9ucy5vbignYWN0aXZlJywgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICRlbCA9IGpRdWVyeSh0aGlzKTtcbiAgICAgIFxuICAgICAgaWYgKCRlbC5hdHRyKCdkYXRhLWFwcGVhcmVkJykpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBqUXVlcnkodGhpcykuZmluZCgnLnRhaWxzX19zZWN0aW9uX19lbCcpLmVhY2goZnVuY3Rpb24gKGkpIHtcbiAgICAgICAgalF1ZXJ5KHRoaXMpLnN0b3AoKS5kZWxheShpICogMTAwKS5hbmltYXRlKHsgb3BhY2l0eTogMSwgeTogMCB9LCA1MDApO1xuICAgICAgfSk7XG5cbiAgICAgICRlbC5hdHRyKCdkYXRhLWFwcGVhcmVkJywgdHJ1ZSk7XG4gICAgfSk7XG5cbiAgICBqUXVlcnkoJy50YWlsc19fc2VjdGlvbi0tc2l0ZScpLm9uKCdzdGF0ZUNoYW5nZScsIGZ1bmN0aW9uIChlLCBzdGF0ZSkge1xuICAgICAgaWYgKHN0YXRlID09PSAnYWN0aXZlJykge1xuICAgICAgICB3aXJlZnJhbWUuc3RhcnQoKTtcbiAgICAgICAgd2lyZWZyYW1lLmluKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aXJlZnJhbWUuc3RvcCgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHdpcmVmcmFtZS5pbigpO1xuICB9XG5cbiAgaW1hZ2VzTG9hZGVyLm9uQ29tcGxldGUoZnVuY3Rpb24gKCkge1xuICAgIGxvYWRlci5vdXQoKTtcblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgbWVudS5pbigpO1xuICAgIH0sIDE1MDApO1xuICB9KTtcbn0pO1xufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldDp1dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbUZ3Y0M5emNtTXZhbk12YldGcGJqSkVMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3UVVGQlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJJaXdpWm1sc1pTSTZJbWRsYm1WeVlYUmxaQzVxY3lJc0luTnZkWEpqWlZKdmIzUWlPaUlpTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJdktpQnFjMmhwYm5RZ2JHRjRZbkpsWVdzNklIUnlkV1VnS2k5Y2JseHVKM1Z6WlNCemRISnBZM1FuTzF4dVhHNXlaWEYxYVhKbEtDY3VMM0J2YkhsbWFXeHNjeTloYm1sdFJuSmhiV1ZRYjJ4NVptbHNiQ2NwTzF4dWNtVnhkV2x5WlNnbkxpOXdiMng1Wm1sc2JITXZZbWx1WkZCdmJIbG1hV3hzSnlrN1hHNXlaWEYxYVhKbEtDY3VMM0J2YkhsbWFXeHNjeTlwYm1SbGVFOW1VRzlzZVdacGJHd25LVHRjYmx4dWRtRnlJR3BSZFdWeWVTQTlJQ2gwZVhCbGIyWWdkMmx1Wkc5M0lDRTlQU0JjSW5WdVpHVm1hVzVsWkZ3aUlEOGdkMmx1Wkc5M1d5ZHFVWFZsY25rblhTQTZJSFI1Y0dWdlppQm5iRzlpWVd3Z0lUMDlJRndpZFc1a1pXWnBibVZrWENJZ1B5Qm5iRzlpWVd4YkoycFJkV1Z5ZVNkZElEb2diblZzYkNrN1hHNTJZWElnYzJ0eWIyeHNjaUE5SUNoMGVYQmxiMllnZDJsdVpHOTNJQ0U5UFNCY0luVnVaR1ZtYVc1bFpGd2lJRDhnZDJsdVpHOTNXeWR6YTNKdmJHeHlKMTBnT2lCMGVYQmxiMllnWjJ4dlltRnNJQ0U5UFNCY0luVnVaR1ZtYVc1bFpGd2lJRDhnWjJ4dlltRnNXeWR6YTNKdmJHeHlKMTBnT2lCdWRXeHNLVHRjYm5KbGNYVnBjbVVvSnk0dmJHbGljeTkzWVhsd2IybHVkRXhwWWljcE8xeHVJQ0JjYm5aaGNpQklRVk5JSUQwZ2NtVnhkV2x5WlNnbkxpOXRiMlIxYkdWekwyaGhjMmhOYjJSMWJHVW5LVHRjYmx4dWRtRnlJRWx0WVdkbGMweHZZV1JsY2lBOUlISmxjWFZwY21Vb0p5NHZZMnhoYzNObGN5OU1iMkZrWlhKRGJHRnpjeWNwTzF4dVhHNTJZWElnVEc5aFpHVnlJRDBnY21WeGRXbHlaU2duTGk5dlltcGxZM1J6TWtRdlRHOWhaR1Z5VDJKcVpXTjBNa1FuS1R0Y2JuWmhjaUJOWlc1MUlEMGdjbVZ4ZFdseVpTZ25MaTl2WW1wbFkzUnpNa1F2YldWdWRVOWlhbVZqZERKRUp5azdYRzUyWVhJZ1YybHlaV1p5WVcxbElEMGdjbVZ4ZFdseVpTZ25MaTl2WW1wbFkzUnpNa1F2VjJseVpXWnlZVzFsVDJKcVpXTjBNa1FuS1R0Y2JseHVablZ1WTNScGIyNGdiVzlpYVd4bElDZ3BJSHRjYmlBZ2NtVjBkWEp1SUc1aGRtbG5ZWFJ2Y2k1MWMyVnlRV2RsYm5RdWJXRjBZMmdvTDBGdVpISnZhV1F2YVNsY2JpQWdJQ0I4ZkNCdVlYWnBaMkYwYjNJdWRYTmxja0ZuWlc1MExtMWhkR05vS0M5M1pXSlBVeTlwS1Z4dUlDQWdJSHg4SUc1aGRtbG5ZWFJ2Y2k1MWMyVnlRV2RsYm5RdWJXRjBZMmdvTDJsUWFHOXVaUzlwS1Z4dUlDQWdJSHg4SUc1aGRtbG5ZWFJ2Y2k1MWMyVnlRV2RsYm5RdWJXRjBZMmdvTDJsUVlXUXZhU2xjYmlBZ0lDQjhmQ0J1WVhacFoyRjBiM0l1ZFhObGNrRm5aVzUwTG0xaGRHTm9LQzlwVUc5a0wya3BYRzRnSUNBZ2ZId2dibUYyYVdkaGRHOXlMblZ6WlhKQloyVnVkQzV0WVhSamFDZ3ZRbXhoWTJ0Q1pYSnllUzlwS1Z4dUlDQWdJSHg4SUc1aGRtbG5ZWFJ2Y2k1MWMyVnlRV2RsYm5RdWJXRjBZMmdvTDFkcGJtUnZkM01nVUdodmJtVXZhU2s3WEc1OVhHNWNibXBSZFdWeWVTaG1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lFaEJVMGd1Y21Wd2JHRmpaVkJzWVdObGFHOXNaR1Z5Y3lncE8xeHVYRzRnSUhaaGNpQnNiMkZrWlhJZ1BTQnVaWGNnVEc5aFpHVnlLQ2s3WEc0Z0lIWmhjaUJ0Wlc1MUlEMGdibVYzSUUxbGJuVW9LVHRjYmlBZ2RtRnlJR2x0WVdkbGMweHZZV1JsY2lBOUlHNWxkeUJKYldGblpYTk1iMkZrWlhJb1cxeHVJQ0FnSUNjdUwyRndjQzl3ZFdKc2FXTXZhVzFuTDNCaGNuUXRZbVZoYlM1d2JtY25MRnh1SUNBZ0lDY3VMMkZ3Y0M5d2RXSnNhV012YVcxbkwzQmhjblF0WkhKdmNDNXdibWNuTEZ4dUlDQWdJQ2N1TDJGd2NDOXdkV0pzYVdNdmFXMW5MM0JoY25RdGMzQm9aWEpsTG5CdVp5Y3NYRzRnSUNBZ0p5NHZZWEJ3TDNCMVlteHBZeTlwYldjdmNHRnlkQzFuY21sa0xuQnVaeWNzWEc0Z0lDQWdKeTR2WVhCd0wzQjFZbXhwWXk5cGJXY3ZjR0Z5ZEMxbWFXVnNaQzV3Ym1jbkxGeHVJQ0FnSUNjdUwyRndjQzl3ZFdKc2FXTXZhVzFuTDNCaGNuUXRjM1JoY25NdWNHNW5KMXh1SUNCZEtUdGNibHh1SUNCcGJXRm5aWE5NYjJGa1pYSXViMjVRY205bmNtVnpjeWhtZFc1amRHbHZiaUFvY0dWeVkyVnVkQ2tnZTF4dUlDQWdJR3h2WVdSbGNpNTFjR1JoZEdVb2NHVnlZMlZ1ZENrN1hHNGdJSDBwTzF4dVhHNGdJR2x0WVdkbGMweHZZV1JsY2k1emRHRnlkQ2dwTzF4dVhHNGdJQzh2SUdobFlXUnpYRzRnSUhOcmNtOXNiSEl1YVc1cGRDaDdJSE5yY205c2JISkNiMlI1T2lBbmJXOWlhV3hsTFdKdlpIa25JSDBwTzF4dVhHNGdJQzh2SUhSaGFXeHpYRzRnSUhaaGNpQjNhWEpsWm5KaGJXVWdQU0J1WlhjZ1YybHlaV1p5WVcxbEtHcFJkV1Z5ZVNnbkxuZHBjbVZtY21GdFpTY3BLVHRjYmx4dUlDQnBaaUFvSVcxdlltbHNaU2dwS1NCN1hHNGdJQ0FnZG1GeUlDUjBZV2xzY3lBOUlHcFJkV1Z5ZVNnbkxuUmhhV3h6SnlrN1hHNGdJQ0FnZG1GeUlDUjBZV2xzYzFObFkzUnBiMjV6SUQwZ0pIUmhhV3h6TG1acGJtUW9KeTUwWVdsc2MxOWZjMlZqZEdsdmJpY3BPMXh1WEc0Z0lDQWdMeThnY0hKbGNHRnlaU0JsYkhOY2JpQWdJQ0FrZEdGcGJITlRaV04wYVc5dWN5NW1hVzVrS0NjdWRHRnBiSE5mWDNObFkzUnBiMjVmWDJWc0p5a3VZVzVwYldGMFpTaDdJRzl3WVdOcGRIazZJREFzSUhrNklERXdNQ0I5TENBd0tUdGNibHh1SUNBZ0lIWmhjaUIzWVhsd2IybHVkQ0E5SUNSMFlXbHNjMU5sWTNScGIyNXpMbmRoZVhCdmFXNTBLSHRjYmlBZ0lDQWdJRzltWm5ObGREb2dNekFzWEc0Z0lDQWdJQ0J6ZEdGeWRFRjBPaUFrZEdGcGJITXViMlptYzJWMEtDa3VkRzl3SUMwZ01UQXdNRnh1SUNBZ0lIMHBPMXh1WEc0Z0lDQWdkMkY1Y0c5cGJuUXVjM1JoY25Rb0tUdGNibHh1SUNBZ0lDUjBZV2xzYzFObFkzUnBiMjV6TG05dUtDZGhZM1JwZG1VbkxDQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdJQ0IyWVhJZ0pHVnNJRDBnYWxGMVpYSjVLSFJvYVhNcE8xeHVJQ0FnSUNBZ1hHNGdJQ0FnSUNCcFppQW9KR1ZzTG1GMGRISW9KMlJoZEdFdFlYQndaV0Z5WldRbktTa2dlMXh1SUNBZ0lDQWdJQ0J5WlhSMWNtNGdabUZzYzJVN1hHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lHcFJkV1Z5ZVNoMGFHbHpLUzVtYVc1a0tDY3VkR0ZwYkhOZlgzTmxZM1JwYjI1ZlgyVnNKeWt1WldGamFDaG1kVzVqZEdsdmJpQW9hU2tnZTF4dUlDQWdJQ0FnSUNCcVVYVmxjbmtvZEdocGN5a3VjM1J2Y0NncExtUmxiR0Y1S0drZ0tpQXhNREFwTG1GdWFXMWhkR1VvZXlCdmNHRmphWFI1T2lBeExDQjVPaUF3SUgwc0lEVXdNQ2s3WEc0Z0lDQWdJQ0I5S1R0Y2JseHVJQ0FnSUNBZ0pHVnNMbUYwZEhJb0oyUmhkR0V0WVhCd1pXRnlaV1FuTENCMGNuVmxLVHRjYmlBZ0lDQjlLVHRjYmx4dUlDQWdJR3BSZFdWeWVTZ25MblJoYVd4elgxOXpaV04wYVc5dUxTMXphWFJsSnlrdWIyNG9KM04wWVhSbFEyaGhibWRsSnl3Z1puVnVZM1JwYjI0Z0tHVXNJSE4wWVhSbEtTQjdYRzRnSUNBZ0lDQnBaaUFvYzNSaGRHVWdQVDA5SUNkaFkzUnBkbVVuS1NCN1hHNGdJQ0FnSUNBZ0lIZHBjbVZtY21GdFpTNXpkR0Z5ZENncE8xeHVJQ0FnSUNBZ0lDQjNhWEpsWm5KaGJXVXVhVzRvS1R0Y2JpQWdJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0FnSUhkcGNtVm1jbUZ0WlM1emRHOXdLQ2s3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmU2s3WEc0Z0lIMGdaV3h6WlNCN1hHNGdJQ0FnZDJseVpXWnlZVzFsTG1sdUtDazdYRzRnSUgxY2JseHVJQ0JwYldGblpYTk1iMkZrWlhJdWIyNURiMjF3YkdWMFpTaG1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdiRzloWkdWeUxtOTFkQ2dwTzF4dVhHNGdJQ0FnYzJWMFZHbHRaVzkxZENobWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ0lDQnRaVzUxTG1sdUtDazdYRzRnSUNBZ2ZTd2dNVFV3TUNrN1hHNGdJSDBwTzF4dWZTazdJbDE5IiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFByZWxvYWQgaW1hZ2VzLiBOb3RpZnkgb24gdXBkYXRlL2NvbXBsZXRlXG4gKlxuICogQGNsYXNzIEltYWdlc0xvYWRlclxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbaW1hZ2VzPVtdXSBJbWFnZXMgc291cmNlc1xuICovXG5mdW5jdGlvbiBJbWFnZXNMb2FkZXIgKGltYWdlcykge1xuICB0aGlzLmltYWdlcyA9IGltYWdlcyB8fCBbXTtcbiAgdGhpcy50b3RhbCA9IHRoaXMuaW1hZ2VzLmxlbmd0aDtcblxuICB2YXIgZm4gPSBmdW5jdGlvbiAoKSB7fTtcbiAgdGhpcy5wcm9ncmVzcyA9IGZuO1xuICB0aGlzLmNvbXBsZXRlID0gZm47XG59XG5cbi8qKlxuICogU3RhcnQgdG8gcHJlbG9hZFxuICpcbiAqIEBtZXRob2Qgc3RhcnRcbiAqL1xuSW1hZ2VzTG9hZGVyLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGxvYWRlZCA9IDA7XG5cbiAgdmFyIHVwZGF0ZVF1ZXVlID0gZnVuY3Rpb24gKCkge1xuICAgIGxvYWRlZCsrO1xuXG4gICAgdmFyIHBlcmNlbnQgPSAobG9hZGVkICogMTAwKSAvIHRoaXMudG90YWw7XG4gICAgdGhpcy5wcm9ncmVzcyhwZXJjZW50KTtcblxuICAgIGlmIChsb2FkZWQgPT09IHRoaXMudG90YWwpIHtcbiAgICAgIHRoaXMuY29tcGxldGUoKTtcbiAgICB9XG4gIH0uYmluZCh0aGlzKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudG90YWw7IGkrKykge1xuICAgIHZhciBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuICAgIGltYWdlLnNyYyA9IHRoaXMuaW1hZ2VzW2ldO1xuICAgIGltYWdlLm9ubG9hZCA9IGltYWdlLm9uZXJyb3IgPSB1cGRhdGVRdWV1ZTtcbiAgfVxufTtcblxuLyoqXG4gKiBQYXNzIHRoZSB1cGRhdGUgaGFuZGxlclxuICpcbiAqIEBtZXRob2Qgb25Qcm9ncmVzc1xuICogQHBhcmFtIHtGdW5jdGlvbn0gW3Byb2dyZXNzXSBcbiAqL1xuSW1hZ2VzTG9hZGVyLnByb3RvdHlwZS5vblByb2dyZXNzID0gZnVuY3Rpb24gKHByb2dyZXNzKSB7XG4gIHRoaXMucHJvZ3Jlc3MgPSBwcm9ncmVzcztcbn07XG5cbi8qKlxuICogUGFzcyB0aGUgY29tcGxldGUgaGFuZGxlclxuICpcbiAqIEBtZXRob2Qgb25Db21wbGV0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NvbXBsZXRlXSBcbiAqL1xuSW1hZ2VzTG9hZGVyLnByb3RvdHlwZS5vbkNvbXBsZXRlID0gZnVuY3Rpb24gKGNvbXBsZXRlKSB7XG4gIHRoaXMuY29tcGxldGUgPSBjb21wbGV0ZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSW1hZ2VzTG9hZGVyOyIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbi8qIGpzaGludCBsYXhicmVhazogdHJ1ZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBqUXVlcnkgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snalF1ZXJ5J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydqUXVlcnknXSA6IG51bGwpO1xuXG52YXIgZGVib3VuY2UgPSByZXF1aXJlKCcuLi91dGlscy9kZWJvdW5jZVV0aWwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKCQpIHtcbiAgLyoqXG4gICAqIFRyaWdnZXIgZXZlbnQgb24gZWxlbWVudCB3aGVuIHRoZXkgZW50ZXIvbGVhdmUgdmlld3BvcnRcbiAgICpcbiAgICogQGNsYXNzIHdheXBvaW50XG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gICAqIEBwYXJhbSB7alF1ZXJ5fSBbb3B0aW9ucy4kdmlld3BvcnQ9alF1ZXJ5KHdpbmRvdyldIFZpZXdwb3J0XG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5vZmZzZXQ9MF0gT2Zmc2V0XG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5zdGFydEF0PW51bGxdIFN0YXJ0IGFmdGVyIGNlcnRhaW4gZGlzdGFuY2UgKGZvciBwZXJmb3JtYW5jZXMpXG4gICAqIEByZXF1aXJlcyBqUXVlcnksIGRlYm91bmNlXG4gICAqL1xuICAkLmZuLndheXBvaW50ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICB2YXIgaXNJbkNvbnRhaW5lciA9IG9wdGlvbnMuJHZpZXdwb3J0ID8gdHJ1ZSA6IGZhbHNlO1xuXG4gICAgdmFyIHBhcmFtZXRlcnMgPSAkLmV4dGVuZCh7XG4gICAgICAkdmlld3BvcnQ6ICQod2luZG93KSxcbiAgICAgIG9mZnNldDogMCxcbiAgICAgIHN0YXJ0QXQ6IG51bGxcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIHZhciAkZWxzID0gJCh0aGlzKTtcbiAgICB2YXIgJHZpZXdwb3J0ID0gcGFyYW1ldGVycy4kdmlld3BvcnQ7XG5cbiAgICB2YXIgdmlld3BvcnRIZWlnaHQgPSAkdmlld3BvcnQuaGVpZ2h0KCk7XG4gICAgdmFyIHNjcm9sbFRvcCA9ICR2aWV3cG9ydC5zY3JvbGxUb3AoKTtcbiAgICB2YXIgdGhyZXNob2xkID0gdmlld3BvcnRIZWlnaHQgKiAocGFyYW1ldGVycy5vZmZzZXQgLyAxMDApO1xuXG4gICAgLy8gU3RvcmUgaGVpZ2h0IGFuZCB0b3Agb24gZWxlbWVudHMgdG8gYXZvaWQgY29uc2VjdXRpdmUgY29tcHV0YXRpb25zXG4gICAgZnVuY3Rpb24gY2FjaGVBdHRyaWJ1dGVzICgpIHtcbiAgICAgICRlbHMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciAkZWwgPSAkKHRoaXMpO1xuXG4gICAgICAgIHZhciBoZWlnaHQgPSBwYXJzZUludCgkZWwub3V0ZXJIZWlnaHQoKSk7XG4gICAgICAgIHZhciB0b3AgPSBpc0luQ29udGFpbmVyXG4gICAgICAgICAgPyBwYXJzZUludCgkZWwucG9zaXRpb24oKS50b3ApICsgc2Nyb2xsVG9wXG4gICAgICAgICAgOiBwYXJzZUludCgkZWwub2Zmc2V0KCkudG9wKTtcblxuICAgICAgICAkZWwuYXR0cih7ICdkYXRhLWhlaWdodCc6IGhlaWdodCwgJ2RhdGEtdG9wJzogdG9wIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25SZXNpemUgKCkge1xuICAgICAgLypqc2hpbnQgdmFsaWR0aGlzOiB0cnVlICovXG5cbiAgICAgIHZpZXdwb3J0SGVpZ2h0ID0gJHZpZXdwb3J0LmhlaWdodCgpO1xuICAgICAgdGhyZXNob2xkID0gdmlld3BvcnRIZWlnaHQgKiAocGFyYW1ldGVycy5vZmZzZXQgLyAxMDApO1xuXG4gICAgICBjYWNoZUF0dHJpYnV0ZXMoKTtcblxuICAgICAgJCh0aGlzKS50cmlnZ2VyKCdzY3JvbGwnKTtcbiAgICB9XG5cbiAgICB2YXIgb25TY3JvbGwgPSBkZWJvdW5jZShmdW5jdGlvbiBvblNjcm9sbCAoKSB7XG4gICAgICBzY3JvbGxUb3AgPSAkKHRoaXMpLnNjcm9sbFRvcCgpO1xuXG4gICAgICBpZiAocGFyYW1ldGVycy5zdGFydEF0ICYmIHNjcm9sbFRvcCA8IHBhcmFtZXRlcnMuc3RhcnRBdCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHZhciB0b3BMaW1pdCA9IHNjcm9sbFRvcCArIHRocmVzaG9sZDtcbiAgICAgIHZhciBib3R0b21MaW1pdCA9IHNjcm9sbFRvcCArICh2aWV3cG9ydEhlaWdodCAtIHRocmVzaG9sZCk7XG5cbiAgICAgICRlbHMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciAkZWwgPSAkKHRoaXMpO1xuXG4gICAgICAgIHZhciBzdGF0ZSA9ICRlbC5hdHRyKCdkYXRhLXN0YXRlJyk7XG5cbiAgICAgICAgdmFyIGhlaWdodCA9IHBhcnNlSW50KCRlbC5hdHRyKCdkYXRhLWhlaWdodCcpKSB8fCAkZWwub3V0ZXJIZWlnaHQoKTtcbiAgICAgICAgdmFyIHRvcCA9IGlzSW5Db250YWluZXJcbiAgICAgICAgICA/IHBhcnNlSW50KCRlbC5hdHRyKCdkYXRhLXRvcCcpKSArIDEgfHwgJGVsLnBvc2l0aW9uKCkudG9wICsgMVxuICAgICAgICAgIDogcGFyc2VJbnQoJGVsLmF0dHIoJ2RhdGEtdG9wJykpICsgMSB8fCAkZWwub2Zmc2V0KCkudG9wICsgMTtcbiAgICAgICAgdmFyIGJvdHRvbSA9IHRvcCArIGhlaWdodDtcblxuICAgICAgICBpZiAodG9wID4gdG9wTGltaXQgJiYgdG9wIDwgYm90dG9tTGltaXRcbiAgICAgICAgICAgIHx8IGJvdHRvbSA+IHRvcExpbWl0ICYmIGJvdHRvbSA8IGJvdHRvbUxpbWl0XG4gICAgICAgICAgICB8fCB0b3AgPCB0b3BMaW1pdCAmJiBib3R0b20gPiBib3R0b21MaW1pdCkge1xuXG4gICAgICAgICAgaWYgKCFzdGF0ZSkge1xuICAgICAgICAgICAgJGVsLmF0dHIoJ2RhdGEtc3RhdGUnLCAndmlzaWJsZScpO1xuICAgICAgICAgICAgJGVsLnRyaWdnZXIoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgJGVsLnRyaWdnZXIoJ3N0YXRlQ2hhbmdlJywgJ2FjdGl2ZScpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoc3RhdGUpIHtcbiAgICAgICAgICAgICRlbC5hdHRyKCdkYXRhLXN0YXRlJywgbnVsbCk7XG4gICAgICAgICAgICAkZWwudHJpZ2dlcignaW5hY3RpdmUnKTtcbiAgICAgICAgICAgICRlbC50cmlnZ2VyKCdzdGF0ZUNoYW5nZScsICdpbmFjdGl2ZScpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICB9KTtcbiAgICB9LCAyMCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgLyoqXG4gICAgICAgKiBTdGFydCB3YXlwb2ludFxuICAgICAgICpcbiAgICAgICAqIEBtZXRob2Qgc3RhcnRcbiAgICAgICAqL1xuICAgICAgc3RhcnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCBvblJlc2l6ZSk7XG4gICAgICAgICR2aWV3cG9ydC5vbignc2Nyb2xsJywgb25TY3JvbGwpO1xuICAgICAgICBjYWNoZUF0dHJpYnV0ZXMoKTtcbiAgICAgICAgb25TY3JvbGwoKTtcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogU3RvcCB3YXlwb2ludFxuICAgICAgICpcbiAgICAgICAqIEBtZXRob2Qgc3RvcFxuICAgICAgICovXG4gICAgICBzdG9wOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICQod2luZG93KS5vZmYoJ3Jlc2l6ZScsIG9uUmVzaXplKTtcbiAgICAgICAgJHZpZXdwb3J0Lm9mZignc2Nyb2xsJywgb25TY3JvbGwpO1xuICAgICAgfVxuICAgIH07XG4gIH07XG5cbn0pKGpRdWVyeSk7XG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltRndjQzl6Y21NdmFuTXZiR2xpY3k5M1lYbHdiMmx1ZEV4cFlpNXFjeUpkTENKdVlXMWxjeUk2VzEwc0ltMWhjSEJwYm1keklqb2lPMEZCUVVFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRU0lzSW1acGJHVWlPaUpuWlc1bGNtRjBaV1F1YW5NaUxDSnpiM1Z5WTJWU2IyOTBJam9pSWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaUx5b2dhbk5vYVc1MElHeGhlR0p5WldGck9pQjBjblZsSUNvdlhHNWNiaWQxYzJVZ2MzUnlhV04wSnp0Y2JseHVkbUZ5SUdwUmRXVnllU0E5SUNoMGVYQmxiMllnZDJsdVpHOTNJQ0U5UFNCY0luVnVaR1ZtYVc1bFpGd2lJRDhnZDJsdVpHOTNXeWRxVVhWbGNua25YU0E2SUhSNWNHVnZaaUJuYkc5aVlXd2dJVDA5SUZ3aWRXNWtaV1pwYm1Wa1hDSWdQeUJuYkc5aVlXeGJKMnBSZFdWeWVTZGRJRG9nYm5Wc2JDazdYRzVjYm5aaGNpQmtaV0p2ZFc1alpTQTlJSEpsY1hWcGNtVW9KeTR1TDNWMGFXeHpMMlJsWW05MWJtTmxWWFJwYkNjcE8xeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJQ2htZFc1amRHbHZiaUFvSkNrZ2UxeHVJQ0F2S2lwY2JpQWdJQ29nVkhKcFoyZGxjaUJsZG1WdWRDQnZiaUJsYkdWdFpXNTBJSGRvWlc0Z2RHaGxlU0JsYm5SbGNpOXNaV0YyWlNCMmFXVjNjRzl5ZEZ4dUlDQWdLbHh1SUNBZ0tpQkFZMnhoYzNNZ2QyRjVjRzlwYm5SY2JpQWdJQ29nUUdOdmJuTjBjblZqZEc5eVhHNGdJQ0FxSUVCd1lYSmhiU0I3VDJKcVpXTjBmU0JiYjNCMGFXOXVjMTFjYmlBZ0lDb2dRSEJoY21GdElIdHFVWFZsY25sOUlGdHZjSFJwYjI1ekxpUjJhV1YzY0c5eWREMXFVWFZsY25rb2QybHVaRzkzS1YwZ1ZtbGxkM0J2Y25SY2JpQWdJQ29nUUhCaGNtRnRJSHRPZFcxaVpYSjlJRnR2Y0hScGIyNXpMbTltWm5ObGREMHdYU0JQWm1aelpYUmNiaUFnSUNvZ1FIQmhjbUZ0SUh0T2RXMWlaWEo5SUZ0dmNIUnBiMjV6TG5OMFlYSjBRWFE5Ym5Wc2JGMGdVM1JoY25RZ1lXWjBaWElnWTJWeWRHRnBiaUJrYVhOMFlXNWpaU0FvWm05eUlIQmxjbVp2Y20xaGJtTmxjeWxjYmlBZ0lDb2dRSEpsY1hWcGNtVnpJR3BSZFdWeWVTd2daR1ZpYjNWdVkyVmNiaUFnSUNvdlhHNGdJQ1F1Wm00dWQyRjVjRzlwYm5RZ1BTQm1kVzVqZEdsdmJpQW9iM0IwYVc5dWN5a2dlMXh1SUNBZ0lIWmhjaUJwYzBsdVEyOXVkR0ZwYm1WeUlEMGdiM0IwYVc5dWN5NGtkbWxsZDNCdmNuUWdQeUIwY25WbElEb2dabUZzYzJVN1hHNWNiaUFnSUNCMllYSWdjR0Z5WVcxbGRHVnljeUE5SUNRdVpYaDBaVzVrS0h0Y2JpQWdJQ0FnSUNSMmFXVjNjRzl5ZERvZ0pDaDNhVzVrYjNjcExGeHVJQ0FnSUNBZ2IyWm1jMlYwT2lBd0xGeHVJQ0FnSUNBZ2MzUmhjblJCZERvZ2JuVnNiRnh1SUNBZ0lIMHNJRzl3ZEdsdmJuTXBPMXh1WEc0Z0lDQWdkbUZ5SUNSbGJITWdQU0FrS0hSb2FYTXBPMXh1SUNBZ0lIWmhjaUFrZG1sbGQzQnZjblFnUFNCd1lYSmhiV1YwWlhKekxpUjJhV1YzY0c5eWREdGNibHh1SUNBZ0lIWmhjaUIyYVdWM2NHOXlkRWhsYVdkb2RDQTlJQ1IyYVdWM2NHOXlkQzVvWldsbmFIUW9LVHRjYmlBZ0lDQjJZWElnYzJOeWIyeHNWRzl3SUQwZ0pIWnBaWGR3YjNKMExuTmpjbTlzYkZSdmNDZ3BPMXh1SUNBZ0lIWmhjaUIwYUhKbGMyaHZiR1FnUFNCMmFXVjNjRzl5ZEVobGFXZG9kQ0FxSUNod1lYSmhiV1YwWlhKekxtOW1abk5sZENBdklERXdNQ2s3WEc1Y2JpQWdJQ0F2THlCVGRHOXlaU0JvWldsbmFIUWdZVzVrSUhSdmNDQnZiaUJsYkdWdFpXNTBjeUIwYnlCaGRtOXBaQ0JqYjI1elpXTjFkR2wyWlNCamIyMXdkWFJoZEdsdmJuTmNiaUFnSUNCbWRXNWpkR2x2YmlCallXTm9aVUYwZEhKcFluVjBaWE1nS0NrZ2UxeHVJQ0FnSUNBZ0pHVnNjeTVsWVdOb0tHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQWdJQ0FnZG1GeUlDUmxiQ0E5SUNRb2RHaHBjeWs3WEc1Y2JpQWdJQ0FnSUNBZ2RtRnlJR2hsYVdkb2RDQTlJSEJoY25ObFNXNTBLQ1JsYkM1dmRYUmxja2hsYVdkb2RDZ3BLVHRjYmlBZ0lDQWdJQ0FnZG1GeUlIUnZjQ0E5SUdselNXNURiMjUwWVdsdVpYSmNiaUFnSUNBZ0lDQWdJQ0EvSUhCaGNuTmxTVzUwS0NSbGJDNXdiM05wZEdsdmJpZ3BMblJ2Y0NrZ0t5QnpZM0p2Ykd4VWIzQmNiaUFnSUNBZ0lDQWdJQ0E2SUhCaGNuTmxTVzUwS0NSbGJDNXZabVp6WlhRb0tTNTBiM0FwTzF4dVhHNGdJQ0FnSUNBZ0lDUmxiQzVoZEhSeUtIc2dKMlJoZEdFdGFHVnBaMmgwSnpvZ2FHVnBaMmgwTENBblpHRjBZUzEwYjNBbk9pQjBiM0FnZlNrN1hHNGdJQ0FnSUNCOUtUdGNiaUFnSUNCOVhHNWNiaUFnSUNCbWRXNWpkR2x2YmlCdmJsSmxjMmw2WlNBb0tTQjdYRzRnSUNBZ0lDQXZLbXB6YUdsdWRDQjJZV3hwWkhSb2FYTTZJSFJ5ZFdVZ0tpOWNibHh1SUNBZ0lDQWdkbWxsZDNCdmNuUklaV2xuYUhRZ1BTQWtkbWxsZDNCdmNuUXVhR1ZwWjJoMEtDazdYRzRnSUNBZ0lDQjBhSEpsYzJodmJHUWdQU0IyYVdWM2NHOXlkRWhsYVdkb2RDQXFJQ2h3WVhKaGJXVjBaWEp6TG05bVpuTmxkQ0F2SURFd01DazdYRzVjYmlBZ0lDQWdJR05oWTJobFFYUjBjbWxpZFhSbGN5Z3BPMXh1WEc0Z0lDQWdJQ0FrS0hSb2FYTXBMblJ5YVdkblpYSW9KM05qY205c2JDY3BPMXh1SUNBZ0lIMWNibHh1SUNBZ0lIWmhjaUJ2YmxOamNtOXNiQ0E5SUdSbFltOTFibU5sS0daMWJtTjBhVzl1SUc5dVUyTnliMnhzSUNncElIdGNiaUFnSUNBZ0lITmpjbTlzYkZSdmNDQTlJQ1FvZEdocGN5a3VjMk55YjJ4c1ZHOXdLQ2s3WEc1Y2JpQWdJQ0FnSUdsbUlDaHdZWEpoYldWMFpYSnpMbk4wWVhKMFFYUWdKaVlnYzJOeWIyeHNWRzl3SUR3Z2NHRnlZVzFsZEdWeWN5NXpkR0Z5ZEVGMEtTQjdYRzRnSUNBZ0lDQWdJSEpsZEhWeWJpQm1ZV3h6WlR0Y2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ2RtRnlJSFJ2Y0V4cGJXbDBJRDBnYzJOeWIyeHNWRzl3SUNzZ2RHaHlaWE5vYjJ4a08xeHVJQ0FnSUNBZ2RtRnlJR0p2ZEhSdmJVeHBiV2wwSUQwZ2MyTnliMnhzVkc5d0lDc2dLSFpwWlhkd2IzSjBTR1ZwWjJoMElDMGdkR2h5WlhOb2IyeGtLVHRjYmx4dUlDQWdJQ0FnSkdWc2N5NWxZV05vS0daMWJtTjBhVzl1SUNncElIdGNiaUFnSUNBZ0lDQWdkbUZ5SUNSbGJDQTlJQ1FvZEdocGN5azdYRzVjYmlBZ0lDQWdJQ0FnZG1GeUlITjBZWFJsSUQwZ0pHVnNMbUYwZEhJb0oyUmhkR0V0YzNSaGRHVW5LVHRjYmx4dUlDQWdJQ0FnSUNCMllYSWdhR1ZwWjJoMElEMGdjR0Z5YzJWSmJuUW9KR1ZzTG1GMGRISW9KMlJoZEdFdGFHVnBaMmgwSnlrcElIeDhJQ1JsYkM1dmRYUmxja2hsYVdkb2RDZ3BPMXh1SUNBZ0lDQWdJQ0IyWVhJZ2RHOXdJRDBnYVhOSmJrTnZiblJoYVc1bGNseHVJQ0FnSUNBZ0lDQWdJRDhnY0dGeWMyVkpiblFvSkdWc0xtRjBkSElvSjJSaGRHRXRkRzl3SnlrcElDc2dNU0I4ZkNBa1pXd3VjRzl6YVhScGIyNG9LUzUwYjNBZ0t5QXhYRzRnSUNBZ0lDQWdJQ0FnT2lCd1lYSnpaVWx1ZENna1pXd3VZWFIwY2lnblpHRjBZUzEwYjNBbktTa2dLeUF4SUh4OElDUmxiQzV2Wm1aelpYUW9LUzUwYjNBZ0t5QXhPMXh1SUNBZ0lDQWdJQ0IyWVhJZ1ltOTBkRzl0SUQwZ2RHOXdJQ3NnYUdWcFoyaDBPMXh1WEc0Z0lDQWdJQ0FnSUdsbUlDaDBiM0FnUGlCMGIzQk1hVzFwZENBbUppQjBiM0FnUENCaWIzUjBiMjFNYVcxcGRGeHVJQ0FnSUNBZ0lDQWdJQ0FnZkh3Z1ltOTBkRzl0SUQ0Z2RHOXdUR2x0YVhRZ0ppWWdZbTkwZEc5dElEd2dZbTkwZEc5dFRHbHRhWFJjYmlBZ0lDQWdJQ0FnSUNBZ0lIeDhJSFJ2Y0NBOElIUnZjRXhwYldsMElDWW1JR0p2ZEhSdmJTQStJR0p2ZEhSdmJVeHBiV2wwS1NCN1hHNWNiaUFnSUNBZ0lDQWdJQ0JwWmlBb0lYTjBZWFJsS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FrWld3dVlYUjBjaWduWkdGMFlTMXpkR0YwWlNjc0lDZDJhWE5wWW14bEp5azdYRzRnSUNBZ0lDQWdJQ0FnSUNBa1pXd3VkSEpwWjJkbGNpZ25ZV04wYVhabEp5azdYRzRnSUNBZ0lDQWdJQ0FnSUNBa1pXd3VkSEpwWjJkbGNpZ25jM1JoZEdWRGFHRnVaMlVuTENBbllXTjBhWFpsSnlrN1hHNGdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdJQ0FnSUdsbUlDaHpkR0YwWlNrZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSkdWc0xtRjBkSElvSjJSaGRHRXRjM1JoZEdVbkxDQnVkV3hzS1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ1JsYkM1MGNtbG5aMlZ5S0NkcGJtRmpkR2wyWlNjcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSkdWc0xuUnlhV2RuWlhJb0ozTjBZWFJsUTJoaGJtZGxKeXdnSjJsdVlXTjBhWFpsSnlrN1hHNGdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUgwcE8xeHVJQ0FnSUgwc0lESXdLVHRjYmx4dUlDQWdJSEpsZEhWeWJpQjdYRzRnSUNBZ0lDQXZLaXBjYmlBZ0lDQWdJQ0FxSUZOMFlYSjBJSGRoZVhCdmFXNTBYRzRnSUNBZ0lDQWdLbHh1SUNBZ0lDQWdJQ29nUUcxbGRHaHZaQ0J6ZEdGeWRGeHVJQ0FnSUNBZ0lDb3ZYRzRnSUNBZ0lDQnpkR0Z5ZERvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lDQWdJQ0FrS0hkcGJtUnZkeWt1YjI0b0ozSmxjMmw2WlNjc0lHOXVVbVZ6YVhwbEtUdGNiaUFnSUNBZ0lDQWdKSFpwWlhkd2IzSjBMbTl1S0NkelkzSnZiR3duTENCdmJsTmpjbTlzYkNrN1hHNGdJQ0FnSUNBZ0lHTmhZMmhsUVhSMGNtbGlkWFJsY3lncE8xeHVJQ0FnSUNBZ0lDQnZibE5qY205c2JDZ3BPMXh1SUNBZ0lDQWdmU3hjYmx4dUlDQWdJQ0FnTHlvcVhHNGdJQ0FnSUNBZ0tpQlRkRzl3SUhkaGVYQnZhVzUwWEc0Z0lDQWdJQ0FnS2x4dUlDQWdJQ0FnSUNvZ1FHMWxkR2h2WkNCemRHOXdYRzRnSUNBZ0lDQWdLaTljYmlBZ0lDQWdJSE4wYjNBNklHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQWdJQ0FnSkNoM2FXNWtiM2NwTG05bVppZ25jbVZ6YVhwbEp5d2diMjVTWlhOcGVtVXBPMXh1SUNBZ0lDQWdJQ0FrZG1sbGQzQnZjblF1YjJabUtDZHpZM0p2Ykd3bkxDQnZibE5qY205c2JDazdYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZUdGNiaUFnZlR0Y2JseHVmU2tvYWxGMVpYSjVLVHNpWFgwPSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbid1c2Ugc3RyaWN0JztcblxudmFyIGpRdWVyeSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydqUXVlcnknXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ2pRdWVyeSddIDogbnVsbCk7XG5cbi8qKlxuICogRXh0cmFjdCB0aGUgY3VycmVudCBoYXNoXG4gKiBhbmQgcmV0dXJuIHRoZSBjb3JyZXNwb25kaW5nIG5hbWVcbiAqXG4gKiBAbW9kdWxlIEhBU0hcbiAqIEByZXF1aXJlcyBqUXVlcnlcbiAqL1xudmFyIEhBU0ggPSBIQVNIIHx8IChmdW5jdGlvbiAoKSB7XG4gIHZhciBpbnN0YW5jZSA9IG51bGw7XG5cbiAgZnVuY3Rpb24gaW5pdCAoKSB7XG4gICAgdmFyIGFnZW5jaWVzID0ge1xuICAgICAgYWtxYTogJ0FLUUEnLFxuICAgICAgaGtpOiAnSEtJJyxcbiAgICAgIGdyb3VlazogJ0dyb3VlaycsXG4gICAgICBtZWRpYW1vbmtzOiAnTWVkaWEgTW9ua3MnLFxuICAgICAgc29sZWlsbm9pcjogJ1NvbGVpbCBOb2lyJyxcbiAgICAgIHRocmVhZDogJ1RocmVhZCcsXG4gICAgICB1bHRyYW5vaXI6ICdVbHRyYSBOb2lyJ1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRIYXNoICgpIHtcbiAgICAgIHJldHVybiB3aW5kb3cubG9jYXRpb24uaGFzaC5zcGxpdCgnIycpWzFdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEFnZW5jeSAoaGFzaCkge1xuICAgICAgdmFyIGFnZW5jeTtcblxuICAgICAgaWYgKGhhc2ggJiYgYWdlbmNpZXNbaGFzaF0pIHtcbiAgICAgICAgYWdlbmN5ID0gYWdlbmNpZXNbaGFzaF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhZ2VuY3kgPSAnJztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGFnZW5jeTtcbiAgICB9XG5cbiAgICB2YXIgaGFzaCA9IGdldEhhc2goKTtcbiAgICB2YXIgYWdlbmN5ID0gZ2V0QWdlbmN5KGhhc2gpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGhhc2g6IGhhc2gsXG4gICAgICBhZ2VuY3k6IGFnZW5jeSxcblxuICAgICAgLyoqXG4gICAgICAgKiBSZXBsYWNlIGFsbCB0aGUgcGxhY2Vob2xkZXJzIGJ5IGNvcnJlY3QgYWdlbmN5IG5hbWVcbiAgICAgICAqXG4gICAgICAgKiBAbWV0aG9kIHJlcGxhY2VQbGFjZWhvbGRlcnNcbiAgICAgICAqL1xuICAgICAgcmVwbGFjZVBsYWNlaG9sZGVyczogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgJHBsYWNlaG9sZGVycyA9IGpRdWVyeSgnLnBsYWNlaG9sZGVyLS1hZ2VuY3knKTtcbiAgICAgICAgXG4gICAgICAgICRwbGFjZWhvbGRlcnMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyICRwbGFjZWhvbGRlciA9IGpRdWVyeSh0aGlzKTtcblxuICAgICAgICAgIGlmICgkcGxhY2Vob2xkZXIuaGFzQ2xhc3MoJ3BsYWNlaG9sZGVyLS1hZ2VuY3ktLXlvdScpKSB7XG4gICAgICAgICAgICBpZiAoYWdlbmN5ICE9PSAnJykge1xuICAgICAgICAgICAgICAkcGxhY2Vob2xkZXIuaHRtbChhZ2VuY3kpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgJHBsYWNlaG9sZGVyLmh0bWwoJ3lvdScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoJHBsYWNlaG9sZGVyLmhhc0NsYXNzKCdwbGFjZWhvbGRlci0tYWdlbmN5LS1jYXBpdGFsJykpIHtcbiAgICAgICAgICAgICAgJHBsYWNlaG9sZGVyLmh0bWwoYWdlbmN5LnRvVXBwZXJDYXNlKCkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgJHBsYWNlaG9sZGVyLmh0bWwoYWdlbmN5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciAkZW1haWwgPSBqUXVlcnkoJy5wbGFjZWhvbGRlci0tZW1haWwnKTtcblxuICAgICAgICB2YXIgc3ViamVjdCA9IGhhc2ggPyAnP3N1YmplY3Q9SGkgZnJvbSAnICsgYWdlbmN5IDogJz9zdWJqZWN0PUhpJztcbiAgICAgICAgdmFyIGJvZHkgPSBoYXNoID8gJyZib2R5PUhpIFYsIHdlIGxpa2UgeW91ciB3b3JrIGFuZCB3b3VsZCBsb3ZlIHRvIG1lZXQgeW91LicgOiAnJmJvZHk9SGkgVic7XG5cbiAgICAgICAgJGVtYWlsLmF0dHIoJ2hyZWYnLCBbXG4gICAgICAgICAgJ21haWx0bzp2YWxlbnRpbi5tYXJtb25pZXJAZ21haWwuY29tJyxcbiAgICAgICAgICBzdWJqZWN0LFxuICAgICAgICAgIGJvZHlcbiAgICAgICAgXS5qb2luKCcnKSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgLyoqXG4gICAgICogR2V0IEhBU0ggY3VycmVudCBpbnN0YW5jZVxuICAgICAqXG4gICAgICogQG1ldGhvZCBnZXRJbnN0YW5jZVxuICAgICAqIEByZXR1cm4ge0hBU0h9XG4gICAgICovXG4gICAgZ2V0SW5zdGFuY2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghaW5zdGFuY2UpIHtcbiAgICAgICAgaW5zdGFuY2UgPSBpbml0KCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpbnN0YW5jZTtcbiAgICB9XG4gIH07XG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhBU0guZ2V0SW5zdGFuY2UoKTtcbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ6dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW1Gd2NDOXpjbU12YW5NdmJXOWtkV3hsY3k5b1lYTm9UVzlrZFd4bExtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdRVUZCUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFTSXNJbVpwYkdVaU9pSm5aVzVsY21GMFpXUXVhbk1pTENKemIzVnlZMlZTYjI5MElqb2lJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpSjNWelpTQnpkSEpwWTNRbk8xeHVYRzUyWVhJZ2FsRjFaWEo1SUQwZ0tIUjVjR1Z2WmlCM2FXNWtiM2NnSVQwOUlGd2lkVzVrWldacGJtVmtYQ0lnUHlCM2FXNWtiM2RiSjJwUmRXVnllU2RkSURvZ2RIbHdaVzltSUdkc2IySmhiQ0FoUFQwZ1hDSjFibVJsWm1sdVpXUmNJaUEvSUdkc2IySmhiRnNuYWxGMVpYSjVKMTBnT2lCdWRXeHNLVHRjYmx4dUx5b3FYRzRnS2lCRmVIUnlZV04wSUhSb1pTQmpkWEp5Wlc1MElHaGhjMmhjYmlBcUlHRnVaQ0J5WlhSMWNtNGdkR2hsSUdOdmNuSmxjM0J2Ym1ScGJtY2dibUZ0WlZ4dUlDcGNiaUFxSUVCdGIyUjFiR1VnU0VGVFNGeHVJQ29nUUhKbGNYVnBjbVZ6SUdwUmRXVnllVnh1SUNvdlhHNTJZWElnU0VGVFNDQTlJRWhCVTBnZ2ZId2dLR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdkbUZ5SUdsdWMzUmhibU5sSUQwZ2JuVnNiRHRjYmx4dUlDQm1kVzVqZEdsdmJpQnBibWwwSUNncElIdGNiaUFnSUNCMllYSWdZV2RsYm1OcFpYTWdQU0I3WEc0Z0lDQWdJQ0JoYTNGaE9pQW5RVXRSUVNjc1hHNGdJQ0FnSUNCb2EyazZJQ2RJUzBrbkxGeHVJQ0FnSUNBZ1ozSnZkV1ZyT2lBblIzSnZkV1ZySnl4Y2JpQWdJQ0FnSUcxbFpHbGhiVzl1YTNNNklDZE5aV1JwWVNCTmIyNXJjeWNzWEc0Z0lDQWdJQ0J6YjJ4bGFXeHViMmx5T2lBblUyOXNaV2xzSUU1dmFYSW5MRnh1SUNBZ0lDQWdkR2h5WldGa09pQW5WR2h5WldGa0p5eGNiaUFnSUNBZ0lIVnNkSEpoYm05cGNqb2dKMVZzZEhKaElFNXZhWEluWEc0Z0lDQWdmVHRjYmx4dUlDQWdJR1oxYm1OMGFXOXVJR2RsZEVoaGMyZ2dLQ2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVJSGRwYm1SdmR5NXNiMk5oZEdsdmJpNW9ZWE5vTG5Od2JHbDBLQ2NqSnlsYk1WMDdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1puVnVZM1JwYjI0Z1oyVjBRV2RsYm1ONUlDaG9ZWE5vS1NCN1hHNGdJQ0FnSUNCMllYSWdZV2RsYm1ONU8xeHVYRzRnSUNBZ0lDQnBaaUFvYUdGemFDQW1KaUJoWjJWdVkybGxjMXRvWVhOb1hTa2dlMXh1SUNBZ0lDQWdJQ0JoWjJWdVkza2dQU0JoWjJWdVkybGxjMXRvWVhOb1hUdGNiaUFnSUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNBZ0lHRm5aVzVqZVNBOUlDY25PMXh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0J5WlhSMWNtNGdZV2RsYm1ONU8xeHVJQ0FnSUgxY2JseHVJQ0FnSUhaaGNpQm9ZWE5vSUQwZ1oyVjBTR0Z6YUNncE8xeHVJQ0FnSUhaaGNpQmhaMlZ1WTNrZ1BTQm5aWFJCWjJWdVkza29hR0Z6YUNrN1hHNWNiaUFnSUNCeVpYUjFjbTRnZTF4dUlDQWdJQ0FnYUdGemFEb2dhR0Z6YUN4Y2JpQWdJQ0FnSUdGblpXNWplVG9nWVdkbGJtTjVMRnh1WEc0Z0lDQWdJQ0F2S2lwY2JpQWdJQ0FnSUNBcUlGSmxjR3hoWTJVZ1lXeHNJSFJvWlNCd2JHRmpaV2h2YkdSbGNuTWdZbmtnWTI5eWNtVmpkQ0JoWjJWdVkza2dibUZ0WlZ4dUlDQWdJQ0FnSUNwY2JpQWdJQ0FnSUNBcUlFQnRaWFJvYjJRZ2NtVndiR0ZqWlZCc1lXTmxhRzlzWkdWeWMxeHVJQ0FnSUNBZ0lDb3ZYRzRnSUNBZ0lDQnlaWEJzWVdObFVHeGhZMlZvYjJ4a1pYSnpPaUJtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnSUNBZ0lIWmhjaUFrY0d4aFkyVm9iMnhrWlhKeklEMGdhbEYxWlhKNUtDY3VjR3hoWTJWb2IyeGtaWEl0TFdGblpXNWplU2NwTzF4dUlDQWdJQ0FnSUNCY2JpQWdJQ0FnSUNBZ0pIQnNZV05sYUc5c1pHVnljeTVsWVdOb0tHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQWdJQ0FnSUNCMllYSWdKSEJzWVdObGFHOXNaR1Z5SUQwZ2FsRjFaWEo1S0hSb2FYTXBPMXh1WEc0Z0lDQWdJQ0FnSUNBZ2FXWWdLQ1J3YkdGalpXaHZiR1JsY2k1b1lYTkRiR0Z6Y3lnbmNHeGhZMlZvYjJ4a1pYSXRMV0ZuWlc1amVTMHRlVzkxSnlrcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUdsbUlDaGhaMlZ1WTNrZ0lUMDlJQ2NuS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNSd2JHRmpaV2h2YkdSbGNpNW9kRzFzS0dGblpXNWplU2s3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBa2NHeGhZMlZvYjJ4a1pYSXVhSFJ0YkNnbmVXOTFKeWs3WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQWdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lHbG1JQ2drY0d4aFkyVm9iMnhrWlhJdWFHRnpRMnhoYzNNb0ozQnNZV05sYUc5c1pHVnlMUzFoWjJWdVkza3RMV05oY0dsMFlXd25LU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FrY0d4aFkyVm9iMnhrWlhJdWFIUnRiQ2hoWjJWdVkza3VkRzlWY0hCbGNrTmhjMlVvS1NrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWtjR3hoWTJWb2IyeGtaWEl1YUhSdGJDaGhaMlZ1WTNrcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lDQWdmU2s3WEc1Y2JpQWdJQ0FnSUNBZ2RtRnlJQ1JsYldGcGJDQTlJR3BSZFdWeWVTZ25MbkJzWVdObGFHOXNaR1Z5TFMxbGJXRnBiQ2NwTzF4dVhHNGdJQ0FnSUNBZ0lIWmhjaUJ6ZFdKcVpXTjBJRDBnYUdGemFDQS9JQ2MvYzNWaWFtVmpkRDFJYVNCbWNtOXRJQ2NnS3lCaFoyVnVZM2tnT2lBblAzTjFZbXBsWTNROVNHa25PMXh1SUNBZ0lDQWdJQ0IyWVhJZ1ltOWtlU0E5SUdoaGMyZ2dQeUFuSm1KdlpIazlTR2tnVml3Z2QyVWdiR2xyWlNCNWIzVnlJSGR2Y21zZ1lXNWtJSGR2ZFd4a0lHeHZkbVVnZEc4Z2JXVmxkQ0I1YjNVdUp5QTZJQ2NtWW05a2VUMUlhU0JXSnp0Y2JseHVJQ0FnSUNBZ0lDQWtaVzFoYVd3dVlYUjBjaWduYUhKbFppY3NJRnRjYmlBZ0lDQWdJQ0FnSUNBbmJXRnBiSFJ2T25aaGJHVnVkR2x1TG0xaGNtMXZibWxsY2tCbmJXRnBiQzVqYjIwbkxGeHVJQ0FnSUNBZ0lDQWdJSE4xWW1wbFkzUXNYRzRnSUNBZ0lDQWdJQ0FnWW05a2VWeHVJQ0FnSUNBZ0lDQmRMbXB2YVc0b0p5Y3BLVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlPMXh1SUNCOVhHNWNiaUFnY21WMGRYSnVJSHRjYmlBZ0lDQXZLaXBjYmlBZ0lDQWdLaUJIWlhRZ1NFRlRTQ0JqZFhKeVpXNTBJR2x1YzNSaGJtTmxYRzRnSUNBZ0lDcGNiaUFnSUNBZ0tpQkFiV1YwYUc5a0lHZGxkRWx1YzNSaGJtTmxYRzRnSUNBZ0lDb2dRSEpsZEhWeWJpQjdTRUZUU0gxY2JpQWdJQ0FnS2k5Y2JpQWdJQ0JuWlhSSmJuTjBZVzVqWlRvZ1puVnVZM1JwYjI0Z0tDa2dlMXh1SUNBZ0lDQWdhV1lnS0NGcGJuTjBZVzVqWlNrZ2UxeHVJQ0FnSUNBZ0lDQnBibk4wWVc1alpTQTlJR2x1YVhRb0tUdGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdjbVYwZFhKdUlHbHVjM1JoYm1ObE8xeHVJQ0FnSUgxY2JpQWdmVHRjYm4wcEtDazdYRzVjYm0xdlpIVnNaUzVsZUhCdmNuUnpJRDBnU0VGVFNDNW5aWFJKYm5OMFlXNWpaU2dwT3lKZGZRPT0iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4ndXNlIHN0cmljdCc7XG5cbnZhciBqUXVlcnkgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snalF1ZXJ5J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydqUXVlcnknXSA6IG51bGwpO1xuXG4vKipcbiAqIFByZWxvYWRlclxuICpcbiAqIEBjbGFzcyBMb2FkZXJcbiAqIEBjb25zdHJ1Y3RvclxuICogQHJlcXVpcmVzIGpRdWVyeVxuICovXG5mdW5jdGlvbiBMb2FkZXIgKCkge1xuICB0aGlzLiRlbCA9IGpRdWVyeSgnLmxvYWRlcicpO1xuICB0aGlzLiR0aXRsZSA9IHRoaXMuJGVsLmZpbmQoJy5sb2FkZXJfX3RpdGxlJyk7XG4gIHRoaXMuJHByb2dyZXNzID0gdGhpcy4kZWwuZmluZCgnLmxvYWRlcl9fcHJvZ3Jlc3MnKTtcbn1cblxuLyoqXG4gKiBPdXQgYW5pbWF0aW9uXG4gKlxuICogQG1ldGhvZCBvdXRcbiAqL1xuTG9hZGVyLnByb3RvdHlwZS5vdXQgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuJHByb2dyZXNzLnN0b3AoKS5hbmltYXRlKHsgd2lkdGg6ICcxMDAlJyB9LCAxMDAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy4kZWwuYW5pbWF0ZSh7IG9wYWNpdHk6IDAgfSwgMTAwMCwgZnVuY3Rpb24gKCkge1xuICAgICAgdGhpcy4kZWwuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgdGhpcy4kdGl0bGUuYW5pbWF0ZSh7IHRvcDogJy0xMCUnLCBvcGFjaXR5OiAwIH0sIDUwMCk7XG4gICAgdGhpcy4kcHJvZ3Jlc3MuYW5pbWF0ZSh7IGhlaWdodDogMCB9LCA0MDApO1xuICB9LmJpbmQodGhpcykpO1xufTtcblxuLyoqXG4gKiBVcGRhdGUgdGhlIHBlcmNlbnQgbG9hZGVkXG4gKlxuICogQG1ldGhvZCB1cGRhdGVcbiAqIEBwYXJhbSB7TnVtYmVyfSBbcGVyY2VudF1cbiAqL1xuTG9hZGVyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoKSB7fTtcblxubW9kdWxlLmV4cG9ydHMgPSBMb2FkZXI7XG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltRndjQzl6Y21NdmFuTXZiMkpxWldOMGN6SkVMMHh2WVdSbGNrOWlhbVZqZERKRUxtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdRVUZCUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEVpTENKbWFXeGxJam9pWjJWdVpYSmhkR1ZrTG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpZDFjMlVnYzNSeWFXTjBKenRjYmx4dWRtRnlJR3BSZFdWeWVTQTlJQ2gwZVhCbGIyWWdkMmx1Wkc5M0lDRTlQU0JjSW5WdVpHVm1hVzVsWkZ3aUlEOGdkMmx1Wkc5M1d5ZHFVWFZsY25rblhTQTZJSFI1Y0dWdlppQm5iRzlpWVd3Z0lUMDlJRndpZFc1a1pXWnBibVZrWENJZ1B5Qm5iRzlpWVd4YkoycFJkV1Z5ZVNkZElEb2diblZzYkNrN1hHNWNiaThxS2x4dUlDb2dVSEpsYkc5aFpHVnlYRzRnS2x4dUlDb2dRR05zWVhOeklFeHZZV1JsY2x4dUlDb2dRR052Ym5OMGNuVmpkRzl5WEc0Z0tpQkFjbVZ4ZFdseVpYTWdhbEYxWlhKNVhHNGdLaTljYm1aMWJtTjBhVzl1SUV4dllXUmxjaUFvS1NCN1hHNGdJSFJvYVhNdUpHVnNJRDBnYWxGMVpYSjVLQ2N1Ykc5aFpHVnlKeWs3WEc0Z0lIUm9hWE11SkhScGRHeGxJRDBnZEdocGN5NGtaV3d1Wm1sdVpDZ25MbXh2WVdSbGNsOWZkR2wwYkdVbktUdGNiaUFnZEdocGN5NGtjSEp2WjNKbGMzTWdQU0IwYUdsekxpUmxiQzVtYVc1a0tDY3ViRzloWkdWeVgxOXdjbTluY21WemN5Y3BPMXh1ZlZ4dVhHNHZLaXBjYmlBcUlFOTFkQ0JoYm1sdFlYUnBiMjVjYmlBcVhHNGdLaUJBYldWMGFHOWtJRzkxZEZ4dUlDb3ZYRzVNYjJGa1pYSXVjSEp2ZEc5MGVYQmxMbTkxZENBOUlHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ2RHaHBjeTRrY0hKdlozSmxjM011YzNSdmNDZ3BMbUZ1YVcxaGRHVW9leUIzYVdSMGFEb2dKekV3TUNVbklIMHNJREV3TURBc0lHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ0lDQjBhR2x6TGlSbGJDNWhibWx0WVhSbEtIc2diM0JoWTJsMGVUb2dNQ0I5TENBeE1EQXdMQ0JtZFc1amRHbHZiaUFvS1NCN1hHNGdJQ0FnSUNCMGFHbHpMaVJsYkM1amMzTW9KMlJwYzNCc1lYa25MQ0FuYm05dVpTY3BPMXh1SUNBZ0lIMHVZbWx1WkNoMGFHbHpLU2s3WEc1Y2JpQWdJQ0IwYUdsekxpUjBhWFJzWlM1aGJtbHRZWFJsS0hzZ2RHOXdPaUFuTFRFd0pTY3NJRzl3WVdOcGRIazZJREFnZlN3Z05UQXdLVHRjYmlBZ0lDQjBhR2x6TGlSd2NtOW5jbVZ6Y3k1aGJtbHRZWFJsS0hzZ2FHVnBaMmgwT2lBd0lIMHNJRFF3TUNrN1hHNGdJSDB1WW1sdVpDaDBhR2x6S1NrN1hHNTlPMXh1WEc0dktpcGNiaUFxSUZWd1pHRjBaU0IwYUdVZ2NHVnlZMlZ1ZENCc2IyRmtaV1JjYmlBcVhHNGdLaUJBYldWMGFHOWtJSFZ3WkdGMFpWeHVJQ29nUUhCaGNtRnRJSHRPZFcxaVpYSjlJRnR3WlhKalpXNTBYVnh1SUNvdlhHNU1iMkZrWlhJdWNISnZkRzkwZVhCbExuVndaR0YwWlNBOUlHWjFibU4wYVc5dUlDZ3BJSHQ5TzF4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlFeHZZV1JsY2pzaVhYMD0iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG4vKiBqc2hpbnQgbGF4YnJlYWs6IHRydWUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgalF1ZXJ5ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ2pRdWVyeSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnalF1ZXJ5J10gOiBudWxsKTtcblxuLyoqXG4gKiBBbmltYXRlZCB3aXJlZnJhbWVcbiAqXG4gKiBAY2xhc3MgV2lyZWZyYW1lXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7alF1ZXJ5fSBbJGVsXSBET00gZWxlbWVudFxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmRlbGF5XSBEZWxheSBiZXR3ZWVuIGZyYW1lc1xuICogQHBhcmFtIHtBcnJheX0gW29wdGlvbnMucG9zaXRpb25zXSBBbmltYXRlZCBzY3JvbGwgcG9zaXRpb25zXG4gKiBAcmVxdWlyZXMgalF1ZXJ5XG4gKi9cbmZ1bmN0aW9uIFdpcmVmcmFtZSAoJGVsLCBvcHRpb25zKSB7XG4gIHRoaXMucGFyYW1ldGVycyA9IGpRdWVyeS5leHRlbmQoe1xuICAgIGRlbGF5OiAyMDAsXG4gICAgcG9zaXRpb25zOiBbLTIwLCAtOTAsIC0xMzUsIC0yMDAsIC0yMCwgNDBdXG4gIH0sIG9wdGlvbnMpO1xuXG4gIHRoaXMuJHRvcExpbmVzID0gJGVsLmZpbmQoJy53aXJlZnJhbWVfX2ZyYW1lLS10b3AnKTtcbiAgdGhpcy4kYm90dG9tTGluZXMgPSAkZWwuZmluZCgnLndpcmVmcmFtZV9fZnJhbWUtLWJvdHRvbScpO1xuICB0aGlzLiRsZWZ0TGluZXMgPSAkZWwuZmluZCgnLndpcmVmcmFtZV9fZnJhbWUtLWxlZnQnKTtcbiAgdGhpcy4kcmlnaHRMaW5lcyA9ICRlbC5maW5kKCcud2lyZWZyYW1lX19mcmFtZS0tcmlnaHQnKTtcbiAgdGhpcy4kbGVmdENvbHVtbiA9ICRlbC5maW5kKCcud2lyZWZyYW1lX19jb2x1bW4tLWxlZnQnKTtcbiAgdGhpcy4kdGV4dExpbmVzID0gJGVsLmZpbmQoJy53aXJlZnJhbWVfX3RleHRfX2xpbmUnKTtcbiAgdGhpcy4kY29udHJvbE5vZGVzID0gJGVsLmZpbmQoJy53aXJlZnJhbWVfX2NvbnRyb2xzX19ub2RlJyk7XG5cbiAgdGhpcy5pbnRlcnZhbCA9IG51bGw7XG4gIHRoaXMudG90YWxQb3NpdGlvbnMgPSB0aGlzLnBhcmFtZXRlcnMucG9zaXRpb25zLmxlbmd0aDtcbiAgdGhpcy5jdXJyZW50UG9zaXRpb24gPSAwO1xufVxuXG4vKipcbiAqIEluIGFuaW1hdGlvblxuICpcbiAqIEBtZXRob2QgaW5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW291dF0gT3V0IGluc3RlYWQgb2YgaW4/XG4gKi9cbldpcmVmcmFtZS5wcm90b3R5cGUuaW4gPSBmdW5jdGlvbiAob3V0KSB7XG4gIC8vIHRhcmdldHNcbiAgdmFyIHRhcmdldExpbmVzO1xuICB2YXIgdGFyZ2V0VGV4dExpbmVzO1xuICB2YXIgdGFyZ2V0SW5jb21wbGV0ZVRleHRMaW5lcztcbiAgdmFyIHRhcmdldE5vZGVzO1xuXG4gIGlmIChvdXQgPT09IDApIHtcbiAgICB0YXJnZXRMaW5lcyA9IHRhcmdldFRleHRMaW5lcyA9IHRhcmdldEluY29tcGxldGVUZXh0TGluZXMgPSAwO1xuICAgIHRhcmdldE5vZGVzID0gMzA7XG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0TGluZXMgPSB0YXJnZXRUZXh0TGluZXMgPSAnMTAwJSc7XG4gICAgdGFyZ2V0SW5jb21wbGV0ZVRleHRMaW5lcyA9ICc2MCUnO1xuICAgIHRhcmdldE5vZGVzID0gMDtcbiAgfVxuXG4gIC8vIGZyYW1lc1xuICB2YXIgdG90YWxGcmFtZXMgPSB0aGlzLiR0b3BMaW5lcy5sZW5ndGg7XG5cbiAgdmFyIHNldEFuaW1hdGlvbiA9IGZ1bmN0aW9uIChpbmRleCkge1xuICAgIHZhciAkdG9wID0galF1ZXJ5KHRoaXMuJHRvcExpbmVzW2luZGV4XSk7XG4gICAgdmFyICRib3R0b20gPSBqUXVlcnkodGhpcy4kYm90dG9tTGluZXNbaW5kZXhdKTtcbiAgICB2YXIgJGxlZnQgPSBqUXVlcnkodGhpcy4kbGVmdExpbmVzW2luZGV4XSk7XG4gICAgdmFyICRyaWdodCA9IGpRdWVyeSh0aGlzLiRyaWdodExpbmVzW2luZGV4XSk7XG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICR0b3AuY3NzKCd3aWR0aCcsIHRhcmdldExpbmVzKTtcbiAgICAgICRyaWdodC5jc3MoJ2hlaWdodCcsIHRhcmdldExpbmVzKTtcbiAgICB9LCAoaW5kZXggKiB0aGlzLnBhcmFtZXRlcnMuZGVsYXkpICsgNDAwKTtcblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgJGxlZnQuY3NzKCdoZWlnaHQnLCB0YXJnZXRMaW5lcyk7XG4gICAgICAkYm90dG9tLmNzcygnd2lkdGgnLCB0YXJnZXRMaW5lcyk7XG4gICAgfSwgKGluZGV4ICogdGhpcy5wYXJhbWV0ZXJzLmRlbGF5KSArIDYwMCk7XG4gIH0uYmluZCh0aGlzKTtcblxuICAvLyBzZXQgYW5pbWF0aW9ucyBmb3IgZWFjaCBmcmFtZVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRvdGFsRnJhbWVzOyBpKyspIHtcbiAgICBzZXRBbmltYXRpb24oaSk7XG4gIH1cblxuICAvLyB0ZXh0XG4gIHZhciBkZWxheSA9IHRoaXMucGFyYW1ldGVycy5kZWxheTtcblxuICB0aGlzLiR0ZXh0TGluZXMuZWFjaChmdW5jdGlvbiAoaSkge1xuICAgIHZhciAkbGluZSA9IGpRdWVyeSh0aGlzKTtcblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgJGxpbmUuY3NzKCd3aWR0aCcsICRsaW5lLmhhc0NsYXNzKCd3aXJlZnJhbWVfX3RleHRfX2xpbmUtLWluY29tcGxldGUnKVxuICAgICAgICA/IHRhcmdldEluY29tcGxldGVUZXh0TGluZXNcbiAgICAgICAgOiB0YXJnZXRUZXh0TGluZXMpO1xuICAgICAgXG4gICAgfSwgaSAqIGRlbGF5KTtcbiAgfSk7XG5cbiAgLy8gY29udHJvbCBub2Rlc1xuICB0aGlzLiRjb250cm9sTm9kZXMuZWFjaChmdW5jdGlvbiAoaSkge1xuICAgIHZhciAkbm9kZSA9IGpRdWVyeSh0aGlzKTtcblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgJG5vZGUuY3NzKCd0b3AnLCB0YXJnZXROb2Rlcyk7XG4gICAgfSwgaSAqIGRlbGF5KTtcbiAgfSk7XG59O1xuXG4vKipcbiAqIE91dCBhbmltYXRpb25cbiAqXG4gKiBAbWV0aG9kIG91dFxuICovXG5XaXJlZnJhbWUucHJvdG90eXBlLm91dCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy4kdG9wTGluZXMuY3NzKCd3aWR0aCcsIDApO1xuICB0aGlzLiRib3R0b21MaW5lcy5jc3MoJ3dpZHRoJywgMCk7XG4gIHRoaXMuJGxlZnRMaW5lcy5jc3MoJ2hlaWdodCcsIDApO1xuICB0aGlzLiRyaWdodExpbmVzLmNzcygnaGVpZ2h0JywgMCk7XG4gIHRoaXMuJHRleHRMaW5lcy5jc3MoJ3dpZHRoJywgMCk7XG4gIHRoaXMuJGNvbnRyb2xOb2Rlcy5jc3MoJ3RvcCcsIDMwKTtcbn07XG5cbi8qKlxuICogU3RhcnQgYW5pbWF0aW9uXG4gKlxuICogQG1ldGhvZCBzdGFydFxuICovXG5XaXJlZnJhbWUucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy5pbnRlcnZhbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHRoaXMuaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuY3VycmVudFBvc2l0aW9uID4gdGhpcy50b3RhbFBvc2l0aW9ucykge1xuICAgICAgdGhpcy5jdXJyZW50UG9zaXRpb24gPSAwO1xuICAgIH1cblxuICAgIHRoaXMuJGxlZnRDb2x1bW4uY3NzKCd0b3AnLCB0aGlzLnBhcmFtZXRlcnMucG9zaXRpb25zW3RoaXMuY3VycmVudFBvc2l0aW9uXSArICdweCcpO1xuXG4gICAgdGhpcy5jdXJyZW50UG9zaXRpb24rKztcbiAgfS5iaW5kKHRoaXMpLCAyMDAwKTtcbn07XG5cbi8qKlxuICogU3RvcCBhbmltYXRpb25cbiAqXG4gKiBAbWV0aG9kIHN0b3BcbiAqL1xuV2lyZWZyYW1lLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKCkge1xuICBpZiAoIXRoaXMuaW50ZXJ2YWwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgdGhpcy5pbnRlcnZhbCA9IG51bGw7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdpcmVmcmFtZTtcbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ6dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW1Gd2NDOXpjbU12YW5NdmIySnFaV04wY3pKRUwxZHBjbVZtY21GdFpVOWlhbVZqZERKRUxtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdRVUZCUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRU0lzSW1acGJHVWlPaUpuWlc1bGNtRjBaV1F1YW5NaUxDSnpiM1Z5WTJWU2IyOTBJam9pSWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaUx5b2dhbk5vYVc1MElHeGhlR0p5WldGck9pQjBjblZsSUNvdlhHNWNiaWQxYzJVZ2MzUnlhV04wSnp0Y2JseHVkbUZ5SUdwUmRXVnllU0E5SUNoMGVYQmxiMllnZDJsdVpHOTNJQ0U5UFNCY0luVnVaR1ZtYVc1bFpGd2lJRDhnZDJsdVpHOTNXeWRxVVhWbGNua25YU0E2SUhSNWNHVnZaaUJuYkc5aVlXd2dJVDA5SUZ3aWRXNWtaV1pwYm1Wa1hDSWdQeUJuYkc5aVlXeGJKMnBSZFdWeWVTZGRJRG9nYm5Wc2JDazdYRzVjYmk4cUtseHVJQ29nUVc1cGJXRjBaV1FnZDJseVpXWnlZVzFsWEc0Z0tseHVJQ29nUUdOc1lYTnpJRmRwY21WbWNtRnRaVnh1SUNvZ1FHTnZibk4wY25WamRHOXlYRzRnS2lCQWNHRnlZVzBnZTJwUmRXVnllWDBnV3lSbGJGMGdSRTlOSUdWc1pXMWxiblJjYmlBcUlFQndZWEpoYlNCN1QySnFaV04wZlNCYmIzQjBhVzl1YzExY2JpQXFJRUJ3WVhKaGJTQjdUblZ0WW1WeWZTQmJiM0IwYVc5dWN5NWtaV3hoZVYwZ1JHVnNZWGtnWW1WMGQyVmxiaUJtY21GdFpYTmNiaUFxSUVCd1lYSmhiU0I3UVhKeVlYbDlJRnR2Y0hScGIyNXpMbkJ2YzJsMGFXOXVjMTBnUVc1cGJXRjBaV1FnYzJOeWIyeHNJSEJ2YzJsMGFXOXVjMXh1SUNvZ1FISmxjWFZwY21WeklHcFJkV1Z5ZVZ4dUlDb3ZYRzVtZFc1amRHbHZiaUJYYVhKbFpuSmhiV1VnS0NSbGJDd2diM0IwYVc5dWN5a2dlMXh1SUNCMGFHbHpMbkJoY21GdFpYUmxjbk1nUFNCcVVYVmxjbmt1WlhoMFpXNWtLSHRjYmlBZ0lDQmtaV3hoZVRvZ01qQXdMRnh1SUNBZ0lIQnZjMmwwYVc5dWN6b2dXeTB5TUN3Z0xUa3dMQ0F0TVRNMUxDQXRNakF3TENBdE1qQXNJRFF3WFZ4dUlDQjlMQ0J2Y0hScGIyNXpLVHRjYmx4dUlDQjBhR2x6TGlSMGIzQk1hVzVsY3lBOUlDUmxiQzVtYVc1a0tDY3VkMmx5WldaeVlXMWxYMTltY21GdFpTMHRkRzl3SnlrN1hHNGdJSFJvYVhNdUpHSnZkSFJ2YlV4cGJtVnpJRDBnSkdWc0xtWnBibVFvSnk1M2FYSmxabkpoYldWZlgyWnlZVzFsTFMxaWIzUjBiMjBuS1R0Y2JpQWdkR2hwY3k0a2JHVm1kRXhwYm1WeklEMGdKR1ZzTG1acGJtUW9KeTUzYVhKbFpuSmhiV1ZmWDJaeVlXMWxMUzFzWldaMEp5azdYRzRnSUhSb2FYTXVKSEpwWjJoMFRHbHVaWE1nUFNBa1pXd3VabWx1WkNnbkxuZHBjbVZtY21GdFpWOWZabkpoYldVdExYSnBaMmgwSnlrN1hHNGdJSFJvYVhNdUpHeGxablJEYjJ4MWJXNGdQU0FrWld3dVptbHVaQ2duTG5kcGNtVm1jbUZ0WlY5ZlkyOXNkVzF1TFMxc1pXWjBKeWs3WEc0Z0lIUm9hWE11SkhSbGVIUk1hVzVsY3lBOUlDUmxiQzVtYVc1a0tDY3VkMmx5WldaeVlXMWxYMTkwWlhoMFgxOXNhVzVsSnlrN1hHNGdJSFJvYVhNdUpHTnZiblJ5YjJ4T2IyUmxjeUE5SUNSbGJDNW1hVzVrS0NjdWQybHlaV1p5WVcxbFgxOWpiMjUwY205c2MxOWZibTlrWlNjcE8xeHVYRzRnSUhSb2FYTXVhVzUwWlhKMllXd2dQU0J1ZFd4c08xeHVJQ0IwYUdsekxuUnZkR0ZzVUc5emFYUnBiMjV6SUQwZ2RHaHBjeTV3WVhKaGJXVjBaWEp6TG5CdmMybDBhVzl1Y3k1c1pXNW5kR2c3WEc0Z0lIUm9hWE11WTNWeWNtVnVkRkJ2YzJsMGFXOXVJRDBnTUR0Y2JuMWNibHh1THlvcVhHNGdLaUJKYmlCaGJtbHRZWFJwYjI1Y2JpQXFYRzRnS2lCQWJXVjBhRzlrSUdsdVhHNGdLaUJBY0dGeVlXMGdlMEp2YjJ4bFlXNTlJRnR2ZFhSZElFOTFkQ0JwYm5OMFpXRmtJRzltSUdsdVAxeHVJQ292WEc1WGFYSmxabkpoYldVdWNISnZkRzkwZVhCbExtbHVJRDBnWm5WdVkzUnBiMjRnS0c5MWRDa2dlMXh1SUNBdkx5QjBZWEpuWlhSelhHNGdJSFpoY2lCMFlYSm5aWFJNYVc1bGN6dGNiaUFnZG1GeUlIUmhjbWRsZEZSbGVIUk1hVzVsY3p0Y2JpQWdkbUZ5SUhSaGNtZGxkRWx1WTI5dGNHeGxkR1ZVWlhoMFRHbHVaWE03WEc0Z0lIWmhjaUIwWVhKblpYUk9iMlJsY3p0Y2JseHVJQ0JwWmlBb2IzVjBJRDA5UFNBd0tTQjdYRzRnSUNBZ2RHRnlaMlYwVEdsdVpYTWdQU0IwWVhKblpYUlVaWGgwVEdsdVpYTWdQU0IwWVhKblpYUkpibU52YlhCc1pYUmxWR1Y0ZEV4cGJtVnpJRDBnTUR0Y2JpQWdJQ0IwWVhKblpYUk9iMlJsY3lBOUlETXdPMXh1SUNCOUlHVnNjMlVnZTF4dUlDQWdJSFJoY21kbGRFeHBibVZ6SUQwZ2RHRnlaMlYwVkdWNGRFeHBibVZ6SUQwZ0p6RXdNQ1VuTzF4dUlDQWdJSFJoY21kbGRFbHVZMjl0Y0d4bGRHVlVaWGgwVEdsdVpYTWdQU0FuTmpBbEp6dGNiaUFnSUNCMFlYSm5aWFJPYjJSbGN5QTlJREE3WEc0Z0lIMWNibHh1SUNBdkx5Qm1jbUZ0WlhOY2JpQWdkbUZ5SUhSdmRHRnNSbkpoYldWeklEMGdkR2hwY3k0a2RHOXdUR2x1WlhNdWJHVnVaM1JvTzF4dVhHNGdJSFpoY2lCelpYUkJibWx0WVhScGIyNGdQU0JtZFc1amRHbHZiaUFvYVc1a1pYZ3BJSHRjYmlBZ0lDQjJZWElnSkhSdmNDQTlJR3BSZFdWeWVTaDBhR2x6TGlSMGIzQk1hVzVsYzF0cGJtUmxlRjBwTzF4dUlDQWdJSFpoY2lBa1ltOTBkRzl0SUQwZ2FsRjFaWEo1S0hSb2FYTXVKR0p2ZEhSdmJVeHBibVZ6VzJsdVpHVjRYU2s3WEc0Z0lDQWdkbUZ5SUNSc1pXWjBJRDBnYWxGMVpYSjVLSFJvYVhNdUpHeGxablJNYVc1bGMxdHBibVJsZUYwcE8xeHVJQ0FnSUhaaGNpQWtjbWxuYUhRZ1BTQnFVWFZsY25rb2RHaHBjeTRrY21sbmFIUk1hVzVsYzF0cGJtUmxlRjBwTzF4dVhHNGdJQ0FnYzJWMFZHbHRaVzkxZENobWRXNWpkR2x2YmlBb0tTQjdYRzRnSUNBZ0lDQWtkRzl3TG1OemN5Z25kMmxrZEdnbkxDQjBZWEpuWlhSTWFXNWxjeWs3WEc0Z0lDQWdJQ0FrY21sbmFIUXVZM056S0Nkb1pXbG5hSFFuTENCMFlYSm5aWFJNYVc1bGN5azdYRzRnSUNBZ2ZTd2dLR2x1WkdWNElDb2dkR2hwY3k1d1lYSmhiV1YwWlhKekxtUmxiR0Y1S1NBcklEUXdNQ2s3WEc1Y2JpQWdJQ0J6WlhSVWFXMWxiM1YwS0daMWJtTjBhVzl1SUNncElIdGNiaUFnSUNBZ0lDUnNaV1owTG1OemN5Z25hR1ZwWjJoMEp5d2dkR0Z5WjJWMFRHbHVaWE1wTzF4dUlDQWdJQ0FnSkdKdmRIUnZiUzVqYzNNb0ozZHBaSFJvSnl3Z2RHRnlaMlYwVEdsdVpYTXBPMXh1SUNBZ0lIMHNJQ2hwYm1SbGVDQXFJSFJvYVhNdWNHRnlZVzFsZEdWeWN5NWtaV3hoZVNrZ0t5QTJNREFwTzF4dUlDQjlMbUpwYm1Rb2RHaHBjeWs3WEc1Y2JpQWdMeThnYzJWMElHRnVhVzFoZEdsdmJuTWdabTl5SUdWaFkyZ2dabkpoYldWY2JpQWdabTl5SUNoMllYSWdhU0E5SURBN0lHa2dQQ0IwYjNSaGJFWnlZVzFsY3pzZ2FTc3JLU0I3WEc0Z0lDQWdjMlYwUVc1cGJXRjBhVzl1S0drcE8xeHVJQ0I5WEc1Y2JpQWdMeThnZEdWNGRGeHVJQ0IyWVhJZ1pHVnNZWGtnUFNCMGFHbHpMbkJoY21GdFpYUmxjbk11WkdWc1lYazdYRzVjYmlBZ2RHaHBjeTRrZEdWNGRFeHBibVZ6TG1WaFkyZ29ablZ1WTNScGIyNGdLR2twSUh0Y2JpQWdJQ0IyWVhJZ0pHeHBibVVnUFNCcVVYVmxjbmtvZEdocGN5azdYRzVjYmlBZ0lDQnpaWFJVYVcxbGIzVjBLR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0FnSUNSc2FXNWxMbU56Y3lnbmQybGtkR2duTENBa2JHbHVaUzVvWVhORGJHRnpjeWduZDJseVpXWnlZVzFsWDE5MFpYaDBYMTlzYVc1bExTMXBibU52YlhCc1pYUmxKeWxjYmlBZ0lDQWdJQ0FnUHlCMFlYSm5aWFJKYm1OdmJYQnNaWFJsVkdWNGRFeHBibVZ6WEc0Z0lDQWdJQ0FnSURvZ2RHRnlaMlYwVkdWNGRFeHBibVZ6S1R0Y2JpQWdJQ0FnSUZ4dUlDQWdJSDBzSUdrZ0tpQmtaV3hoZVNrN1hHNGdJSDBwTzF4dVhHNGdJQzh2SUdOdmJuUnliMndnYm05a1pYTmNiaUFnZEdocGN5NGtZMjl1ZEhKdmJFNXZaR1Z6TG1WaFkyZ29ablZ1WTNScGIyNGdLR2twSUh0Y2JpQWdJQ0IyWVhJZ0pHNXZaR1VnUFNCcVVYVmxjbmtvZEdocGN5azdYRzVjYmlBZ0lDQnpaWFJVYVcxbGIzVjBLR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0FnSUNSdWIyUmxMbU56Y3lnbmRHOXdKeXdnZEdGeVoyVjBUbTlrWlhNcE8xeHVJQ0FnSUgwc0lHa2dLaUJrWld4aGVTazdYRzRnSUgwcE8xeHVmVHRjYmx4dUx5b3FYRzRnS2lCUGRYUWdZVzVwYldGMGFXOXVYRzRnS2x4dUlDb2dRRzFsZEdodlpDQnZkWFJjYmlBcUwxeHVWMmx5WldaeVlXMWxMbkJ5YjNSdmRIbHdaUzV2ZFhRZ1BTQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lIUm9hWE11SkhSdmNFeHBibVZ6TG1OemN5Z25kMmxrZEdnbkxDQXdLVHRjYmlBZ2RHaHBjeTRrWW05MGRHOXRUR2x1WlhNdVkzTnpLQ2QzYVdSMGFDY3NJREFwTzF4dUlDQjBhR2x6TGlSc1pXWjBUR2x1WlhNdVkzTnpLQ2RvWldsbmFIUW5MQ0F3S1R0Y2JpQWdkR2hwY3k0a2NtbG5hSFJNYVc1bGN5NWpjM01vSjJobGFXZG9kQ2NzSURBcE8xeHVJQ0IwYUdsekxpUjBaWGgwVEdsdVpYTXVZM056S0NkM2FXUjBhQ2NzSURBcE8xeHVJQ0IwYUdsekxpUmpiMjUwY205c1RtOWtaWE11WTNOektDZDBiM0FuTENBek1DazdYRzU5TzF4dVhHNHZLaXBjYmlBcUlGTjBZWEowSUdGdWFXMWhkR2x2Ymx4dUlDcGNiaUFxSUVCdFpYUm9iMlFnYzNSaGNuUmNiaUFxTDF4dVYybHlaV1p5WVcxbExuQnliM1J2ZEhsd1pTNXpkR0Z5ZENBOUlHWjFibU4wYVc5dUlDZ3BJSHRjYmlBZ2FXWWdLSFJvYVhNdWFXNTBaWEoyWVd3cElIdGNiaUFnSUNCeVpYUjFjbTRnWm1Gc2MyVTdYRzRnSUgxY2JseHVJQ0IwYUdsekxtbHVkR1Z5ZG1Gc0lEMGdjMlYwU1c1MFpYSjJZV3dvWm5WdVkzUnBiMjRnS0NrZ2UxeHVJQ0FnSUdsbUlDaDBhR2x6TG1OMWNuSmxiblJRYjNOcGRHbHZiaUErSUhSb2FYTXVkRzkwWVd4UWIzTnBkR2x2Ym5NcElIdGNiaUFnSUNBZ0lIUm9hWE11WTNWeWNtVnVkRkJ2YzJsMGFXOXVJRDBnTUR0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0IwYUdsekxpUnNaV1owUTI5c2RXMXVMbU56Y3lnbmRHOXdKeXdnZEdocGN5NXdZWEpoYldWMFpYSnpMbkJ2YzJsMGFXOXVjMXQwYUdsekxtTjFjbkpsYm5SUWIzTnBkR2x2YmwwZ0t5QW5jSGduS1R0Y2JseHVJQ0FnSUhSb2FYTXVZM1Z5Y21WdWRGQnZjMmwwYVc5dUt5czdYRzRnSUgwdVltbHVaQ2gwYUdsektTd2dNakF3TUNrN1hHNTlPMXh1WEc0dktpcGNiaUFxSUZOMGIzQWdZVzVwYldGMGFXOXVYRzRnS2x4dUlDb2dRRzFsZEdodlpDQnpkRzl3WEc0Z0tpOWNibGRwY21WbWNtRnRaUzV3Y205MGIzUjVjR1V1YzNSdmNDQTlJR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdhV1lnS0NGMGFHbHpMbWx1ZEdWeWRtRnNLU0I3WEc0Z0lDQWdjbVYwZFhKdUlHWmhiSE5sTzF4dUlDQjlYRzVjYmlBZ2QybHVaRzkzTG1Oc1pXRnlTVzUwWlhKMllXd29kR2hwY3k1cGJuUmxjblpoYkNrN1hHNGdJSFJvYVhNdWFXNTBaWEoyWVd3Z1BTQnVkV3hzTzF4dWZUdGNibHh1Ylc5a2RXeGxMbVY0Y0c5eWRITWdQU0JYYVhKbFpuSmhiV1U3SWwxOSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbid1c2Ugc3RyaWN0JztcblxudmFyIGpRdWVyeSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydqUXVlcnknXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ2pRdWVyeSddIDogbnVsbCk7XG5cbi8qKlxuICogTWVudVxuICpcbiAqIEBjbGFzcyBNZW51XG4gKiBAY29uc3RydWN0b3JcbiAqIEByZXF1aXJlcyBqUXVlcnlcbiAqL1xuZnVuY3Rpb24gTWVudSAoKSB7XG4gIHZhciAkZWwgPSBqUXVlcnkoJy5tZW51Jyk7XG4gIHZhciAkYnV0dG9uID0gJGVsLmZpbmQoJy5tZW51X19idXR0b24nKTtcbiAgdmFyICRpdGVtc0NvbnRhaW5lciA9ICRlbC5maW5kKCcubWVudV9faXRlbXMnKTtcbiAgdmFyICRpdGVtcyA9ICRlbC5maW5kKCcubWVudV9faXRlbScpO1xuXG4gIHZhciBfY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7fTtcbiAgdmFyIHRpbWVvdXRzID0gW107XG5cbiAgZnVuY3Rpb24gb25Nb3VzZW92ZXIgKCkge1xuICAgICRpdGVtcy5vbignY2xpY2snLCBfY2FsbGJhY2spO1xuXG4gICAgJGl0ZW1zQ29udGFpbmVyLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuXG4gICAgJGVsLnN0b3AoKS5hbmltYXRlKHsgbGVmdDogMCB9LCB7IGR1cmF0aW9uOiA0MDAsIGVhc2luZzogJ2Vhc2VPdXRRdWFydCcgfSk7XG4gICAgJGJ1dHRvbi5zdG9wKCkuYW5pbWF0ZSh7IG9wYWNpdHk6IDAgfSwgNDAwKTtcblxuICAgICRpdGVtcy5lYWNoKGZ1bmN0aW9uIChpKSB7XG4gICAgICB2YXIgJGVsID0galF1ZXJ5KHRoaXMpO1xuXG4gICAgICB2YXIgdGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJGVsLnN0b3AoKS5hbmltYXRlKHsgb3BhY2l0eTogMSB9LCA0MDApO1xuICAgICAgfSwgaSAqIDIwMCk7XG5cbiAgICAgIHRpbWVvdXRzLnB1c2godGltZW91dCk7XG4gICAgfSk7XG5cbiAgICAkZWwub25lKCdtb3VzZWxlYXZlJywgb25Nb3VzZW91dCk7XG4gIH1cblxuICBmdW5jdGlvbiBvbk1vdXNlb3V0ICgpIHtcbiAgICBpZiAodGltZW91dHMpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gdGltZW91dHMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQodGltZW91dHNbaV0pO1xuICAgICAgfVxuICAgICAgdGltZW91dHMgPSBbXTtcbiAgICB9XG5cbiAgICAkZWwuc3RvcCgpLmFuaW1hdGUoeyBsZWZ0OiAzMCB9LCB7IGR1cmF0aW9uOiA0MDAsIGVhc2luZzogJ2Vhc2VPdXRRdWFydCcgfSk7XG4gICAgJGJ1dHRvbi5zdG9wKCkuYW5pbWF0ZSh7IG9wYWNpdHk6IDAuNSB9LCA0MDApO1xuICAgICRpdGVtcy5zdG9wKCkuYW5pbWF0ZSh7IG9wYWNpdHk6IDAgfSwgNDAwLCBmdW5jdGlvbiAoKSB7XG4gICAgICAkaXRlbXNDb250YWluZXIuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICAgICRpdGVtcy5vZmYoJ2NsaWNrJywgX2NhbGxiYWNrKTtcbiAgICB9KTtcblxuICAgICRidXR0b24ub25lKCdtb3VzZW92ZXIgY2xpY2snLCBvbk1vdXNlb3Zlcik7XG4gIH1cblxuICAkYnV0dG9uLm9uZSgnbW91c2VvdmVyIGNsaWNrJywgb25Nb3VzZW92ZXIpO1xuXG4gIHJldHVybiB7XG4gICAgaW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICRlbC5hbmltYXRlKHsgdG9wOiAwLCBvcGFjaXR5OiAxIH0sIDUwMCk7XG4gICAgfSxcblxuICAgIG9uQ2xpY2s6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgX2NhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgfVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1lbnU7XG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltRndjQzl6Y21NdmFuTXZiMkpxWldOMGN6SkVMMjFsYm5WUFltcGxZM1F5UkM1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU8wRkJRVUU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEVpTENKbWFXeGxJam9pWjJWdVpYSmhkR1ZrTG1weklpd2ljMjkxY21ObFVtOXZkQ0k2SWlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYklpZDFjMlVnYzNSeWFXTjBKenRjYmx4dWRtRnlJR3BSZFdWeWVTQTlJQ2gwZVhCbGIyWWdkMmx1Wkc5M0lDRTlQU0JjSW5WdVpHVm1hVzVsWkZ3aUlEOGdkMmx1Wkc5M1d5ZHFVWFZsY25rblhTQTZJSFI1Y0dWdlppQm5iRzlpWVd3Z0lUMDlJRndpZFc1a1pXWnBibVZrWENJZ1B5Qm5iRzlpWVd4YkoycFJkV1Z5ZVNkZElEb2diblZzYkNrN1hHNWNiaThxS2x4dUlDb2dUV1Z1ZFZ4dUlDcGNiaUFxSUVCamJHRnpjeUJOWlc1MVhHNGdLaUJBWTI5dWMzUnlkV04wYjNKY2JpQXFJRUJ5WlhGMWFYSmxjeUJxVVhWbGNubGNiaUFxTDF4dVpuVnVZM1JwYjI0Z1RXVnVkU0FvS1NCN1hHNGdJSFpoY2lBa1pXd2dQU0JxVVhWbGNua29KeTV0Wlc1MUp5azdYRzRnSUhaaGNpQWtZblYwZEc5dUlEMGdKR1ZzTG1acGJtUW9KeTV0Wlc1MVgxOWlkWFIwYjI0bktUdGNiaUFnZG1GeUlDUnBkR1Z0YzBOdmJuUmhhVzVsY2lBOUlDUmxiQzVtYVc1a0tDY3ViV1Z1ZFY5ZmFYUmxiWE1uS1R0Y2JpQWdkbUZ5SUNScGRHVnRjeUE5SUNSbGJDNW1hVzVrS0NjdWJXVnVkVjlmYVhSbGJTY3BPMXh1WEc0Z0lIWmhjaUJmWTJGc2JHSmhZMnNnUFNCbWRXNWpkR2x2YmlBb0tTQjdmVHRjYmlBZ2RtRnlJSFJwYldWdmRYUnpJRDBnVzEwN1hHNWNiaUFnWm5WdVkzUnBiMjRnYjI1TmIzVnpaVzkyWlhJZ0tDa2dlMXh1SUNBZ0lDUnBkR1Z0Y3k1dmJpZ25ZMnhwWTJzbkxDQmZZMkZzYkdKaFkyc3BPMXh1WEc0Z0lDQWdKR2wwWlcxelEyOXVkR0ZwYm1WeUxtTnpjeWduWkdsemNHeGhlU2NzSUNkaWJHOWpheWNwTzF4dVhHNGdJQ0FnSkdWc0xuTjBiM0FvS1M1aGJtbHRZWFJsS0hzZ2JHVm1kRG9nTUNCOUxDQjdJR1IxY21GMGFXOXVPaUEwTURBc0lHVmhjMmx1WnpvZ0oyVmhjMlZQZFhSUmRXRnlkQ2NnZlNrN1hHNGdJQ0FnSkdKMWRIUnZiaTV6ZEc5d0tDa3VZVzVwYldGMFpTaDdJRzl3WVdOcGRIazZJREFnZlN3Z05EQXdLVHRjYmx4dUlDQWdJQ1JwZEdWdGN5NWxZV05vS0daMWJtTjBhVzl1SUNocEtTQjdYRzRnSUNBZ0lDQjJZWElnSkdWc0lEMGdhbEYxWlhKNUtIUm9hWE1wTzF4dVhHNGdJQ0FnSUNCMllYSWdkR2x0Wlc5MWRDQTlJSGRwYm1SdmR5NXpaWFJVYVcxbGIzVjBLR1oxYm1OMGFXOXVJQ2dwSUh0Y2JpQWdJQ0FnSUNBZ0pHVnNMbk4wYjNBb0tTNWhibWx0WVhSbEtIc2diM0JoWTJsMGVUb2dNU0I5TENBME1EQXBPMXh1SUNBZ0lDQWdmU3dnYVNBcUlESXdNQ2s3WEc1Y2JpQWdJQ0FnSUhScGJXVnZkWFJ6TG5CMWMyZ29kR2x0Wlc5MWRDazdYRzRnSUNBZ2ZTazdYRzVjYmlBZ0lDQWtaV3d1YjI1bEtDZHRiM1Z6Wld4bFlYWmxKeXdnYjI1TmIzVnpaVzkxZENrN1hHNGdJSDFjYmx4dUlDQm1kVzVqZEdsdmJpQnZiazF2ZFhObGIzVjBJQ2dwSUh0Y2JpQWdJQ0JwWmlBb2RHbHRaVzkxZEhNcElIdGNiaUFnSUNBZ0lHWnZjaUFvZG1GeUlHa2dQU0F3TENCcUlEMGdkR2x0Wlc5MWRITXViR1Z1WjNSb095QnBJRHdnYWpzZ2FTc3JLU0I3WEc0Z0lDQWdJQ0FnSUhkcGJtUnZkeTVqYkdWaGNsUnBiV1Z2ZFhRb2RHbHRaVzkxZEhOYmFWMHBPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lDQWdkR2x0Wlc5MWRITWdQU0JiWFR0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0FrWld3dWMzUnZjQ2dwTG1GdWFXMWhkR1VvZXlCc1pXWjBPaUF6TUNCOUxDQjdJR1IxY21GMGFXOXVPaUEwTURBc0lHVmhjMmx1WnpvZ0oyVmhjMlZQZFhSUmRXRnlkQ2NnZlNrN1hHNGdJQ0FnSkdKMWRIUnZiaTV6ZEc5d0tDa3VZVzVwYldGMFpTaDdJRzl3WVdOcGRIazZJREF1TlNCOUxDQTBNREFwTzF4dUlDQWdJQ1JwZEdWdGN5NXpkRzl3S0NrdVlXNXBiV0YwWlNoN0lHOXdZV05wZEhrNklEQWdmU3dnTkRBd0xDQm1kVzVqZEdsdmJpQW9LU0I3WEc0Z0lDQWdJQ0FrYVhSbGJYTkRiMjUwWVdsdVpYSXVZM056S0Nka2FYTndiR0Y1Snl3Z0oyNXZibVVuS1R0Y2JpQWdJQ0FnSUNScGRHVnRjeTV2Wm1Zb0oyTnNhV05ySnl3Z1gyTmhiR3hpWVdOcktUdGNiaUFnSUNCOUtUdGNibHh1SUNBZ0lDUmlkWFIwYjI0dWIyNWxLQ2R0YjNWelpXOTJaWElnWTJ4cFkyc25MQ0J2YmsxdmRYTmxiM1psY2lrN1hHNGdJSDFjYmx4dUlDQWtZblYwZEc5dUxtOXVaU2duYlc5MWMyVnZkbVZ5SUdOc2FXTnJKeXdnYjI1TmIzVnpaVzkyWlhJcE8xeHVYRzRnSUhKbGRIVnliaUI3WEc0Z0lDQWdhVzQ2SUdaMWJtTjBhVzl1SUNncElIdGNiaUFnSUNBZ0lDUmxiQzVoYm1sdFlYUmxLSHNnZEc5d09pQXdMQ0J2Y0dGamFYUjVPaUF4SUgwc0lEVXdNQ2s3WEc0Z0lDQWdmU3hjYmx4dUlDQWdJRzl1UTJ4cFkyczZJR1oxYm1OMGFXOXVJQ2hqWVd4c1ltRmpheWtnZTF4dUlDQWdJQ0FnWDJOaGJHeGlZV05ySUQwZ1kyRnNiR0poWTJzN1hHNGdJQ0FnZlZ4dUlDQjlPMXh1ZlZ4dVhHNXRiMlIxYkdVdVpYaHdiM0owY3lBOUlFMWxiblU3SWwxOSIsIi8vIHJlcXVlc3RBbmltYXRpb25GcmFtZSBwb2x5ZmlsbCBieSBFcmlrIE3DtmxsZXIuIGZpeGVzIGZyb20gUGF1bCBJcmlzaCBhbmQgVGlubyBaaWpkZWxcbi8vIE1JVCBsaWNlbnNlXG5cbid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uKCkge1xuICB2YXIgbGFzdFRpbWUgPSAwO1xuICB2YXIgdmVuZG9ycyA9IFsnbXMnLCAnbW96JywgJ3dlYmtpdCcsICdvJ107XG4gIGZvcih2YXIgeCA9IDA7IHggPCB2ZW5kb3JzLmxlbmd0aCAmJiAhd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTsgKyt4KSB7XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdKydSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcbiAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1t4XSsnQ2FuY2VsQW5pbWF0aW9uRnJhbWUnXSB8fCB3aW5kb3dbdmVuZG9yc1t4XSsnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ107XG4gIH1cbiBcbiAgaWYgKCF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKSB7XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgICB2YXIgY3VyclRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgIHZhciB0aW1lVG9DYWxsID0gTWF0aC5tYXgoMCwgMTYgLSAoY3VyclRpbWUgLSBsYXN0VGltZSkpO1xuICAgICAgdmFyIGlkID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIGNhbGxiYWNrKGN1cnJUaW1lICsgdGltZVRvQ2FsbCk7XG4gICAgICB9LCB0aW1lVG9DYWxsKTtcbiAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsO1xuICAgICAgcmV0dXJuIGlkO1xuICAgIH07XG4gIH1cbiBcbiAgaWYgKCF3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUpIHtcbiAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbihpZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KGlkKTtcbiAgICB9O1xuICB9XG59KSgpOyIsIi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0Z1bmN0aW9uL2JpbmRcblxuJ3VzZSBzdHJpY3QnO1xuXG4oZnVuY3Rpb24gKCkge1xuICBpZiAoIUZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kKSB7XG4gICAgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbihvVGhpcykge1xuICAgICAgaWYgKHR5cGVvZiB0aGlzICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIGNsb3Nlc3QgdGhpbmcgcG9zc2libGUgdG8gdGhlIEVDTUFTY3JpcHQgNVxuICAgICAgICAvLyBpbnRlcm5hbCBJc0NhbGxhYmxlIGZ1bmN0aW9uXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Z1bmN0aW9uLnByb3RvdHlwZS5iaW5kIC0gd2hhdCBpcyB0cnlpbmcgdG8gYmUgYm91bmQgaXMgbm90IGNhbGxhYmxlJyk7XG4gICAgICB9XG5cbiAgICAgIHZhciBhQXJncyAgID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSxcbiAgICAgICAgICBmVG9CaW5kID0gdGhpcyxcbiAgICAgICAgICBmTk9QICAgID0gZnVuY3Rpb24oKSB7fSxcbiAgICAgICAgICBmQm91bmQgID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gZlRvQmluZC5hcHBseSh0aGlzIGluc3RhbmNlb2YgZk5PUCAmJiBvVGhpc1xuICAgICAgICAgICAgICAgICAgID8gdGhpc1xuICAgICAgICAgICAgICAgICAgIDogb1RoaXMsXG4gICAgICAgICAgICAgICAgICAgYUFyZ3MuY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgICAgICAgICB9O1xuXG4gICAgICBmTk9QLnByb3RvdHlwZSA9IHRoaXMucHJvdG90eXBlO1xuICAgICAgZkJvdW5kLnByb3RvdHlwZSA9IG5ldyBmTk9QKCk7XG5cbiAgICAgIHJldHVybiBmQm91bmQ7XG4gICAgfTtcbiAgfVxufSkoKTsiLCIvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9pbmRleE9mXG5cbid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uICgpIHtcbiAgaWYgKCFBcnJheS5wcm90b3R5cGUuaW5kZXhPZikge1xuICAgIEFycmF5LnByb3RvdHlwZS5pbmRleE9mID0gZnVuY3Rpb24oc2VhcmNoRWxlbWVudCAvKiwgZnJvbUluZGV4ICovICkge1widXNlIHN0cmljdFwiO1xuICAgICAgaWYgKHRoaXMgPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG4gICAgICB9XG4gICAgICB2YXIgdCA9IE9iamVjdCh0aGlzKTtcbiAgICAgIHZhciBsZW4gPSB0Lmxlbmd0aCA+Pj4gMDtcbiAgICAgIGlmIChsZW4gPT09IDApIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgICAgdmFyIG4gPSAwO1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIG4gPSBOdW1iZXIoYXJndW1lbnRzWzFdKTtcbiAgICAgICAgaWYgKG4gIT0gbikgey8vIHNob3J0Y3V0IGZvciB2ZXJpZnlpbmcgaWYgaXQncyBOYU5cbiAgICAgICAgICBuID0gMDtcbiAgICAgICAgfSBlbHNlIGlmIChuICE9IDAgJiYgbiAhPSBJbmZpbml0eSAmJiBuICE9IC1JbmZpbml0eSkge1xuICAgICAgICAgIG4gPSAobiA+IDAgfHwgLTEpICogTWF0aC5mbG9vcihNYXRoLmFicyhuKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChuID49IGxlbikge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgICB9XG4gICAgICB2YXIgayA9IG4gPj0gMCA/IG4gOiBNYXRoLm1heChsZW4gLSBNYXRoLmFicyhuKSwgMCk7XG4gICAgICBmb3IgKDsgayA8IGxlbjsgaysrKSB7XG4gICAgICAgIGlmICggayBpbiB0ICYmIHRba10gPT09IHNlYXJjaEVsZW1lbnQpIHtcbiAgICAgICAgICByZXR1cm4gaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cbiAgfVxufSkoKTsiLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogRGVib3VuY2UgYSBmdW5jdGlvblxuICogaHR0cHM6Ly9naXRodWIuY29tL2phc2hrZW5hcy91bmRlcnNjb3JlXG4gKlxuICogQG1ldGhvZCBkZWJvdW5jZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrXVxuICogQHBhcmFtIHtOdW1iZXJ9IFtkZWxheV1cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW2ltbWVkaWF0ZV1cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICovXG5mdW5jdGlvbiBkZWJvdW5jZSAoY2FsbGJhY2ssIGRlbGF5LCBpbW1lZGlhdGUpIHtcbiAgdmFyIHRpbWVvdXQ7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY29udGV4dCA9IHRoaXM7XG4gICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG5cbiAgICB2YXIgY2FsbExhdGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICBpZiAoIWltbWVkaWF0ZSkge1xuICAgICAgICBjYWxsYmFjay5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIGNhbGxOb3cgPSBpbW1lZGlhdGUgJiYgIXRpbWVvdXQ7XG4gICAgd2luZG93LmNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICB0aW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoY2FsbExhdGVyLCBkZWxheSk7XG4gICAgaWYgKGNhbGxOb3cpIHtcbiAgICAgIGNhbGxiYWNrLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgIH1cbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWJvdW5jZTsgIl19
