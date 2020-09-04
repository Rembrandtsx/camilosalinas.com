(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

require('./polyfills/animFramePolyfill');
require('./polyfills/bindPolyfill');
require('./polyfills/indexOfPolyfill');

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var TweenLite = (typeof window !== "undefined" ? window['TweenLite'] : typeof global !== "undefined" ? global['TweenLite'] : null);
TweenLite.defaultEase = window.Quad.easeInOut;

require('./libs/waypointLib');
  
var APP = require('./modules/appModule');
var SCENE = require('./modules/sceneModule');
var SOUNDS = require('./modules/soundsModule');
var HASH = require('./modules/hashModule');

var ImagesLoader = require('./classes/LoaderClass');

var Loader = require('./objects2D/LoaderObject2D');
var Menu = require('./objects2D/menuObject2D');
var Help = require('./objects2D/HelpObject2D');
var Wireframe = require('./objects2D/WireframeObject2D');

var helloSection = require('./sections/helloSection');
var beamsSection = require('./sections/beamsSection');
var dropSection = require('./sections/dropSection');
var ballSection = require('./sections/ballSection');
var flowSection = require('./sections/flowSection');
var neonsSection = require('./sections/neonsSection');
var heightSection = require('./sections/heightSection');
var waveSection = require('./sections/waveSection');
var faceSection = require('./sections/faceSection');
var rocksSection = require('./sections/rocksSection');
var galaxySection = require('./sections/galaxySection');
var gravitySection = require('./sections/gravitySection');
var citySection = require('./sections/citySection');
var endSection = require('./sections/endSection');

jQuery(function () {
  HASH.replacePlaceholders();

  var loader = new Loader();
  var help = new Help();
  var menu = new Menu();
  var imagesLoader = new ImagesLoader([
    './app/public/img/texture-ball.png',
    './app/public/img/texture-ballAlpha.png',
    './app/public/img/sprite-smoke.png',
    './app/public/img/sprite-AKQA.png'
  ]);

  // preload
  imagesLoader.start();

  imagesLoader.onProgress(function (percent) {
    loader.update(percent);
  });

  imagesLoader.onComplete(function () {
    loader.out();

    TweenLite.delayedCall(0.8, SCENE.in);
    TweenLite.delayedCall(1.5, function () {
      map.in();
      menu.in();
    });
  });

  menu.onClick(function () {
    var $el = jQuery(this);
    var name = $el.attr('data-button') || '';

    if (name === 'sounds') {
      SOUNDS.toggle();
      $el.html(SOUNDS.isMuted() ? 'UNMUTE' : 'MUTE');
    }
    else if (name === 'help') {
      help.in();
    }
    else if (name === 'quality') {
      var text;
      var quality;

      if (SCENE.getQuality() === 0.5) {
        text = 'QUALITY 1';
        quality = 1;
      } else {
        text = 'QUALITY 0.5';
        quality = 0.5;
      }

      $el.html(text);
      SCENE.quality(quality);
    }
  });  
    
  // scene
  var $heads = jQuery('.heads');
  var $viewport = $heads.find('.heads__viewport');

  SCENE.config({ quality: 1 });
  SCENE.setViewport($viewport);
  SCENE.addSections([
    helloSection,
    beamsSection,
    dropSection,
    ballSection,
    flowSection,
    neonsSection,
    heightSection,
    waveSection,
    faceSection,
    rocksSection,
    galaxySection,
    gravitySection,
    citySection,
    endSection
  ]);

  SCENE.on('section:changeBegin', function () {
    var way = this.way;
    var to = this.to.name;
    var from = this.from.name;

    // in begin
    if (to === 'hello') {
      helloSection.in();
      helloSection.start();
      helloSection.smokeStart();

      beamsSection.out('up');
      beamsSection.start();
    }
    else if (to === 'beams') {
      helloSection.smokeStart();

      beamsSection.in();
      beamsSection.start();
    }
    else if (to === 'drop') {
      beamsSection.out('down');
      beamsSection.start();

      dropSection.in();
      dropSection.start();
    }
    else if (to === 'ball') {
      dropSection.out('down');
      dropSection.start();

      ballSection.in();
      ballSection.start();

      flowSection.fieldIn();
      flowSection.start();
    }
    else if (to === 'flow') {
      flowSection.in();
      flowSection.fieldIn();
      flowSection.start();

      neonsSection.smokeStart();
    }
    else if (to === 'neons') {
      flowSection.fieldIn();
      flowSection.start();

      neonsSection.start();
      neonsSection.smokeStart();

      heightSection.show();
    }
    else if (to === 'height') {
      flowSection.fieldIn();
      flowSection.start();

      neonsSection.smokeStart();

      heightSection.show();
      heightSection.in();
      heightSection.start();
    }
    else if (to === 'wave') {
      heightSection.show();

      waveSection.in(way);
      waveSection.start();
    }
    else if (to === 'face') {
      faceSection.in();
      faceSection.start();

      rocksSection.show();
    }
    else if (to === 'rocks') {
      rocksSection.show();
      rocksSection.in();
      rocksSection.start();
    }
    else if (to === 'galaxy') {
      rocksSection.show();

      galaxySection.in(way);
      galaxySection.start();

      gravitySection.show();
    }
    else if (to === 'gravity') {
      gravitySection.show();
      gravitySection.in();
      gravitySection.start();
    }
    else if (to === 'end') {
      endSection.in();
    }

    // out begin
    if (from === 'hello') {
      helloSection.out(way);
    }
    else if (from === 'beams') {
      beamsSection.out(way);
    }
    else if (from === 'drop') {
      dropSection.out(way);
    }
    else if (from === 'ball') {
      ballSection.out(way);
    }
    else if (from === 'flow') {
      flowSection.out(way);
    }
    else if (from === 'neons') {
      neonsSection.out(way);
    }
    else if (from === 'height') {
      heightSection.out(way);
    }
    else if (from === 'wave') {
      waveSection.out(way);
    }
    else if (from === 'face') {
      faceSection.out(way);
    }
    else if (from === 'rocks') {
      rocksSection.out(way);
    }
    else if (from === 'galaxy') {
      galaxySection.out(way);
    }
    else if (from === 'gravity') {
      gravitySection.out(way);
    }
    else if (from === 'end') {
      endSection.out(way);
    }
  });

  SCENE.on('section:changeComplete', function () {
    var to = this.to.name;
    var from = this.from.name;

    // out complete
    if (from === 'hello') {
      helloSection.stop();

      if (to !== 'beams') {
        helloSection.smokeStop();
      }

      if (to !== 'beams' && to !== 'drop') {
        beamsSection.stop();
      }
    }
    else if (from === 'beams') {
      if (to !== 'hello') {
        helloSection.smokeStop();
      }

      if (to !== 'hello' && to !== 'drop') {
        beamsSection.stop();
      }
    }
    else if (from === 'drop') {
      if (to !== 'hello' && to !== 'beams') {
        beamsSection.stop();
      }

      if (to !== 'ball') {
        dropSection.stop();
      }
    }
    else if (from === 'ball') {
      ballSection.stop();

      if (to !== 'drop') {
        dropSection.stop();
      }

      if (to !== 'flow' && to !== 'neons' && to !== 'height') {
        flowSection.stop();
      }
    }
    else if (from === 'flow') {
      if (to !== 'neons' && to !== 'height') {
        neonsSection.smokeStop();
      }

      if (to !== 'ball' && to !== 'neons' && to !== 'height') {
        flowSection.stop();
      }
    }
    else if (from === 'neons') {
      neonsSection.stop();

      if (to !== 'flow' && to !== 'height') {
        neonsSection.smokeStop();
      }

      if (to !== 'ball' && to !== 'flow' && to !== 'height') {
        flowSection.stop();
      }

      if (to !== 'height' && to !== 'wave') {
        heightSection.hide();
      }
    }
    else if (from === 'height') {
      heightSection.stop();

      if (to !== 'neons' && to !== 'wave') {
        heightSection.hide();
      }

      if (to !== 'flow' && to !== 'neons') {
        neonsSection.smokeStop();
      }

      if (to !== 'ball' && to !== 'flow' && to !== 'neons') {
        flowSection.stop();
      }
    }
    else if (from === 'wave') {
      waveSection.stop();

      if (to !== 'neons' && to !== 'height') {
        heightSection.hide();
      }
    }
    else if (from === 'face') {
      faceSection.stop();

      if (to !== 'rocks' && to !== 'galaxy') {
        rocksSection.hide();
      }
    }
    else if (from === 'rocks') {
      rocksSection.stop();

      if (to !== 'face' && to !== 'galaxy') {
        rocksSection.hide();
      }
    }
    else if (from === 'galaxy') {
      galaxySection.stop();

      if (to !== 'face' && to !== 'rocks') {
        rocksSection.hide();
      }

      if (to !== 'gravity') {
        gravitySection.hide();
      }
    }
    else if (from === 'gravity') {
      gravitySection.stop();

      if (to !== 'galaxy') {
        gravitySection.hide();
      }
    }
  });

  SCENE.on('end', function () {
    SCENE.lock();
    APP.slide(SCENE.unlock);
  });

  // map
  var map = SCENE.getMap();

  $heads.prepend(map.$el);

  map.init();

  map.onClick(function (index) {
    SCENE.goTo(index);
  });

  SCENE.on('section:changeBegin', function () {
    map.setActive(this.to.index);
  });

  // tails
  var wireframe = new Wireframe(jQuery('.wireframe'));

  var $tailsSections = jQuery('.tails__section');
  $tailsSections.find('.tails__section__el').animate({ opacity: 0, y: 100 }, 0);

  var waypoint = $tailsSections.waypoint({
    $viewport: jQuery('.tails'),
    offset: 30
  });

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

  APP.on('slideBegin', function () {
    if (this.to === 'heads') {
      waypoint.stop();

      try {
        SOUNDS.background.fadeIn(1, 2000);  
      } catch (e) {
        console.warn(e);
      }
      
    } else {
      SOUNDS.background.fadeOut(0, 2000);
    }
  });

  APP.on('slideComplete', function () {
    if (this.to === 'tails') {
      waypoint.start();
    }
  });
 
  // SCENE on/off
  APP.on('heads:visible', function () {
    SCENE.start();
  });

  APP.on('heads:invisible', function () {
    SCENE.stop();
  });

  APP.start();
  SCENE.start();

  SOUNDS.background.fadeIn(1, 2000);
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvbWFpbjNELmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4vcG9seWZpbGxzL2FuaW1GcmFtZVBvbHlmaWxsJyk7XG5yZXF1aXJlKCcuL3BvbHlmaWxscy9iaW5kUG9seWZpbGwnKTtcbnJlcXVpcmUoJy4vcG9seWZpbGxzL2luZGV4T2ZQb2x5ZmlsbCcpO1xuXG52YXIgalF1ZXJ5ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ2pRdWVyeSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnalF1ZXJ5J10gOiBudWxsKTtcbnZhciBUd2VlbkxpdGUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snVHdlZW5MaXRlJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydUd2VlbkxpdGUnXSA6IG51bGwpO1xuVHdlZW5MaXRlLmRlZmF1bHRFYXNlID0gd2luZG93LlF1YWQuZWFzZUluT3V0O1xuXG5yZXF1aXJlKCcuL2xpYnMvd2F5cG9pbnRMaWInKTtcbiAgXG52YXIgQVBQID0gcmVxdWlyZSgnLi9tb2R1bGVzL2FwcE1vZHVsZScpO1xudmFyIFNDRU5FID0gcmVxdWlyZSgnLi9tb2R1bGVzL3NjZW5lTW9kdWxlJyk7XG52YXIgU09VTkRTID0gcmVxdWlyZSgnLi9tb2R1bGVzL3NvdW5kc01vZHVsZScpO1xudmFyIEhBU0ggPSByZXF1aXJlKCcuL21vZHVsZXMvaGFzaE1vZHVsZScpO1xuXG52YXIgSW1hZ2VzTG9hZGVyID0gcmVxdWlyZSgnLi9jbGFzc2VzL0xvYWRlckNsYXNzJyk7XG5cbnZhciBMb2FkZXIgPSByZXF1aXJlKCcuL29iamVjdHMyRC9Mb2FkZXJPYmplY3QyRCcpO1xudmFyIE1lbnUgPSByZXF1aXJlKCcuL29iamVjdHMyRC9tZW51T2JqZWN0MkQnKTtcbnZhciBIZWxwID0gcmVxdWlyZSgnLi9vYmplY3RzMkQvSGVscE9iamVjdDJEJyk7XG52YXIgV2lyZWZyYW1lID0gcmVxdWlyZSgnLi9vYmplY3RzMkQvV2lyZWZyYW1lT2JqZWN0MkQnKTtcblxudmFyIGhlbGxvU2VjdGlvbiA9IHJlcXVpcmUoJy4vc2VjdGlvbnMvaGVsbG9TZWN0aW9uJyk7XG52YXIgYmVhbXNTZWN0aW9uID0gcmVxdWlyZSgnLi9zZWN0aW9ucy9iZWFtc1NlY3Rpb24nKTtcbnZhciBkcm9wU2VjdGlvbiA9IHJlcXVpcmUoJy4vc2VjdGlvbnMvZHJvcFNlY3Rpb24nKTtcbnZhciBiYWxsU2VjdGlvbiA9IHJlcXVpcmUoJy4vc2VjdGlvbnMvYmFsbFNlY3Rpb24nKTtcbnZhciBmbG93U2VjdGlvbiA9IHJlcXVpcmUoJy4vc2VjdGlvbnMvZmxvd1NlY3Rpb24nKTtcbnZhciBuZW9uc1NlY3Rpb24gPSByZXF1aXJlKCcuL3NlY3Rpb25zL25lb25zU2VjdGlvbicpO1xudmFyIGhlaWdodFNlY3Rpb24gPSByZXF1aXJlKCcuL3NlY3Rpb25zL2hlaWdodFNlY3Rpb24nKTtcbnZhciB3YXZlU2VjdGlvbiA9IHJlcXVpcmUoJy4vc2VjdGlvbnMvd2F2ZVNlY3Rpb24nKTtcbnZhciBmYWNlU2VjdGlvbiA9IHJlcXVpcmUoJy4vc2VjdGlvbnMvZmFjZVNlY3Rpb24nKTtcbnZhciByb2Nrc1NlY3Rpb24gPSByZXF1aXJlKCcuL3NlY3Rpb25zL3JvY2tzU2VjdGlvbicpO1xudmFyIGdhbGF4eVNlY3Rpb24gPSByZXF1aXJlKCcuL3NlY3Rpb25zL2dhbGF4eVNlY3Rpb24nKTtcbnZhciBncmF2aXR5U2VjdGlvbiA9IHJlcXVpcmUoJy4vc2VjdGlvbnMvZ3Jhdml0eVNlY3Rpb24nKTtcbnZhciBjaXR5U2VjdGlvbiA9IHJlcXVpcmUoJy4vc2VjdGlvbnMvY2l0eVNlY3Rpb24nKTtcbnZhciBlbmRTZWN0aW9uID0gcmVxdWlyZSgnLi9zZWN0aW9ucy9lbmRTZWN0aW9uJyk7XG5cbmpRdWVyeShmdW5jdGlvbiAoKSB7XG4gIEhBU0gucmVwbGFjZVBsYWNlaG9sZGVycygpO1xuXG4gIHZhciBsb2FkZXIgPSBuZXcgTG9hZGVyKCk7XG4gIHZhciBoZWxwID0gbmV3IEhlbHAoKTtcbiAgdmFyIG1lbnUgPSBuZXcgTWVudSgpO1xuICB2YXIgaW1hZ2VzTG9hZGVyID0gbmV3IEltYWdlc0xvYWRlcihbXG4gICAgJy4vYXBwL3B1YmxpYy9pbWcvdGV4dHVyZS1iYWxsLnBuZycsXG4gICAgJy4vYXBwL3B1YmxpYy9pbWcvdGV4dHVyZS1iYWxsQWxwaGEucG5nJyxcbiAgICAnLi9hcHAvcHVibGljL2ltZy9zcHJpdGUtc21va2UucG5nJyxcbiAgICAnLi9hcHAvcHVibGljL2ltZy9zcHJpdGUtQUtRQS5wbmcnXG4gIF0pO1xuXG4gIC8vIHByZWxvYWRcbiAgaW1hZ2VzTG9hZGVyLnN0YXJ0KCk7XG5cbiAgaW1hZ2VzTG9hZGVyLm9uUHJvZ3Jlc3MoZnVuY3Rpb24gKHBlcmNlbnQpIHtcbiAgICBsb2FkZXIudXBkYXRlKHBlcmNlbnQpO1xuICB9KTtcblxuICBpbWFnZXNMb2FkZXIub25Db21wbGV0ZShmdW5jdGlvbiAoKSB7XG4gICAgbG9hZGVyLm91dCgpO1xuXG4gICAgVHdlZW5MaXRlLmRlbGF5ZWRDYWxsKDAuOCwgU0NFTkUuaW4pO1xuICAgIFR3ZWVuTGl0ZS5kZWxheWVkQ2FsbCgxLjUsIGZ1bmN0aW9uICgpIHtcbiAgICAgIG1hcC5pbigpO1xuICAgICAgbWVudS5pbigpO1xuICAgIH0pO1xuICB9KTtcblxuICBtZW51Lm9uQ2xpY2soZnVuY3Rpb24gKCkge1xuICAgIHZhciAkZWwgPSBqUXVlcnkodGhpcyk7XG4gICAgdmFyIG5hbWUgPSAkZWwuYXR0cignZGF0YS1idXR0b24nKSB8fCAnJztcblxuICAgIGlmIChuYW1lID09PSAnc291bmRzJykge1xuICAgICAgU09VTkRTLnRvZ2dsZSgpO1xuICAgICAgJGVsLmh0bWwoU09VTkRTLmlzTXV0ZWQoKSA/ICdVTk1VVEUnIDogJ01VVEUnKTtcbiAgICB9XG4gICAgZWxzZSBpZiAobmFtZSA9PT0gJ2hlbHAnKSB7XG4gICAgICBoZWxwLmluKCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKG5hbWUgPT09ICdxdWFsaXR5Jykge1xuICAgICAgdmFyIHRleHQ7XG4gICAgICB2YXIgcXVhbGl0eTtcblxuICAgICAgaWYgKFNDRU5FLmdldFF1YWxpdHkoKSA9PT0gMC41KSB7XG4gICAgICAgIHRleHQgPSAnUVVBTElUWSAxJztcbiAgICAgICAgcXVhbGl0eSA9IDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0ZXh0ID0gJ1FVQUxJVFkgMC41JztcbiAgICAgICAgcXVhbGl0eSA9IDAuNTtcbiAgICAgIH1cblxuICAgICAgJGVsLmh0bWwodGV4dCk7XG4gICAgICBTQ0VORS5xdWFsaXR5KHF1YWxpdHkpO1xuICAgIH1cbiAgfSk7ICBcbiAgICBcbiAgLy8gc2NlbmVcbiAgdmFyICRoZWFkcyA9IGpRdWVyeSgnLmhlYWRzJyk7XG4gIHZhciAkdmlld3BvcnQgPSAkaGVhZHMuZmluZCgnLmhlYWRzX192aWV3cG9ydCcpO1xuXG4gIFNDRU5FLmNvbmZpZyh7IHF1YWxpdHk6IDEgfSk7XG4gIFNDRU5FLnNldFZpZXdwb3J0KCR2aWV3cG9ydCk7XG4gIFNDRU5FLmFkZFNlY3Rpb25zKFtcbiAgICBoZWxsb1NlY3Rpb24sXG4gICAgYmVhbXNTZWN0aW9uLFxuICAgIGRyb3BTZWN0aW9uLFxuICAgIGJhbGxTZWN0aW9uLFxuICAgIGZsb3dTZWN0aW9uLFxuICAgIG5lb25zU2VjdGlvbixcbiAgICBoZWlnaHRTZWN0aW9uLFxuICAgIHdhdmVTZWN0aW9uLFxuICAgIGZhY2VTZWN0aW9uLFxuICAgIHJvY2tzU2VjdGlvbixcbiAgICBnYWxheHlTZWN0aW9uLFxuICAgIGdyYXZpdHlTZWN0aW9uLFxuICAgIGNpdHlTZWN0aW9uLFxuICAgIGVuZFNlY3Rpb25cbiAgXSk7XG5cbiAgU0NFTkUub24oJ3NlY3Rpb246Y2hhbmdlQmVnaW4nLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHdheSA9IHRoaXMud2F5O1xuICAgIHZhciB0byA9IHRoaXMudG8ubmFtZTtcbiAgICB2YXIgZnJvbSA9IHRoaXMuZnJvbS5uYW1lO1xuXG4gICAgLy8gaW4gYmVnaW5cbiAgICBpZiAodG8gPT09ICdoZWxsbycpIHtcbiAgICAgIGhlbGxvU2VjdGlvbi5pbigpO1xuICAgICAgaGVsbG9TZWN0aW9uLnN0YXJ0KCk7XG4gICAgICBoZWxsb1NlY3Rpb24uc21va2VTdGFydCgpO1xuXG4gICAgICBiZWFtc1NlY3Rpb24ub3V0KCd1cCcpO1xuICAgICAgYmVhbXNTZWN0aW9uLnN0YXJ0KCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHRvID09PSAnYmVhbXMnKSB7XG4gICAgICBoZWxsb1NlY3Rpb24uc21va2VTdGFydCgpO1xuXG4gICAgICBiZWFtc1NlY3Rpb24uaW4oKTtcbiAgICAgIGJlYW1zU2VjdGlvbi5zdGFydCgpO1xuICAgIH1cbiAgICBlbHNlIGlmICh0byA9PT0gJ2Ryb3AnKSB7XG4gICAgICBiZWFtc1NlY3Rpb24ub3V0KCdkb3duJyk7XG4gICAgICBiZWFtc1NlY3Rpb24uc3RhcnQoKTtcblxuICAgICAgZHJvcFNlY3Rpb24uaW4oKTtcbiAgICAgIGRyb3BTZWN0aW9uLnN0YXJ0KCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHRvID09PSAnYmFsbCcpIHtcbiAgICAgIGRyb3BTZWN0aW9uLm91dCgnZG93bicpO1xuICAgICAgZHJvcFNlY3Rpb24uc3RhcnQoKTtcblxuICAgICAgYmFsbFNlY3Rpb24uaW4oKTtcbiAgICAgIGJhbGxTZWN0aW9uLnN0YXJ0KCk7XG5cbiAgICAgIGZsb3dTZWN0aW9uLmZpZWxkSW4oKTtcbiAgICAgIGZsb3dTZWN0aW9uLnN0YXJ0KCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHRvID09PSAnZmxvdycpIHtcbiAgICAgIGZsb3dTZWN0aW9uLmluKCk7XG4gICAgICBmbG93U2VjdGlvbi5maWVsZEluKCk7XG4gICAgICBmbG93U2VjdGlvbi5zdGFydCgpO1xuXG4gICAgICBuZW9uc1NlY3Rpb24uc21va2VTdGFydCgpO1xuICAgIH1cbiAgICBlbHNlIGlmICh0byA9PT0gJ25lb25zJykge1xuICAgICAgZmxvd1NlY3Rpb24uZmllbGRJbigpO1xuICAgICAgZmxvd1NlY3Rpb24uc3RhcnQoKTtcblxuICAgICAgbmVvbnNTZWN0aW9uLnN0YXJ0KCk7XG4gICAgICBuZW9uc1NlY3Rpb24uc21va2VTdGFydCgpO1xuXG4gICAgICBoZWlnaHRTZWN0aW9uLnNob3coKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodG8gPT09ICdoZWlnaHQnKSB7XG4gICAgICBmbG93U2VjdGlvbi5maWVsZEluKCk7XG4gICAgICBmbG93U2VjdGlvbi5zdGFydCgpO1xuXG4gICAgICBuZW9uc1NlY3Rpb24uc21va2VTdGFydCgpO1xuXG4gICAgICBoZWlnaHRTZWN0aW9uLnNob3coKTtcbiAgICAgIGhlaWdodFNlY3Rpb24uaW4oKTtcbiAgICAgIGhlaWdodFNlY3Rpb24uc3RhcnQoKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodG8gPT09ICd3YXZlJykge1xuICAgICAgaGVpZ2h0U2VjdGlvbi5zaG93KCk7XG5cbiAgICAgIHdhdmVTZWN0aW9uLmluKHdheSk7XG4gICAgICB3YXZlU2VjdGlvbi5zdGFydCgpO1xuICAgIH1cbiAgICBlbHNlIGlmICh0byA9PT0gJ2ZhY2UnKSB7XG4gICAgICBmYWNlU2VjdGlvbi5pbigpO1xuICAgICAgZmFjZVNlY3Rpb24uc3RhcnQoKTtcblxuICAgICAgcm9ja3NTZWN0aW9uLnNob3coKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodG8gPT09ICdyb2NrcycpIHtcbiAgICAgIHJvY2tzU2VjdGlvbi5zaG93KCk7XG4gICAgICByb2Nrc1NlY3Rpb24uaW4oKTtcbiAgICAgIHJvY2tzU2VjdGlvbi5zdGFydCgpO1xuICAgIH1cbiAgICBlbHNlIGlmICh0byA9PT0gJ2dhbGF4eScpIHtcbiAgICAgIHJvY2tzU2VjdGlvbi5zaG93KCk7XG5cbiAgICAgIGdhbGF4eVNlY3Rpb24uaW4od2F5KTtcbiAgICAgIGdhbGF4eVNlY3Rpb24uc3RhcnQoKTtcblxuICAgICAgZ3Jhdml0eVNlY3Rpb24uc2hvdygpO1xuICAgIH1cbiAgICBlbHNlIGlmICh0byA9PT0gJ2dyYXZpdHknKSB7XG4gICAgICBncmF2aXR5U2VjdGlvbi5zaG93KCk7XG4gICAgICBncmF2aXR5U2VjdGlvbi5pbigpO1xuICAgICAgZ3Jhdml0eVNlY3Rpb24uc3RhcnQoKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodG8gPT09ICdlbmQnKSB7XG4gICAgICBlbmRTZWN0aW9uLmluKCk7XG4gICAgfVxuXG4gICAgLy8gb3V0IGJlZ2luXG4gICAgaWYgKGZyb20gPT09ICdoZWxsbycpIHtcbiAgICAgIGhlbGxvU2VjdGlvbi5vdXQod2F5KTtcbiAgICB9XG4gICAgZWxzZSBpZiAoZnJvbSA9PT0gJ2JlYW1zJykge1xuICAgICAgYmVhbXNTZWN0aW9uLm91dCh3YXkpO1xuICAgIH1cbiAgICBlbHNlIGlmIChmcm9tID09PSAnZHJvcCcpIHtcbiAgICAgIGRyb3BTZWN0aW9uLm91dCh3YXkpO1xuICAgIH1cbiAgICBlbHNlIGlmIChmcm9tID09PSAnYmFsbCcpIHtcbiAgICAgIGJhbGxTZWN0aW9uLm91dCh3YXkpO1xuICAgIH1cbiAgICBlbHNlIGlmIChmcm9tID09PSAnZmxvdycpIHtcbiAgICAgIGZsb3dTZWN0aW9uLm91dCh3YXkpO1xuICAgIH1cbiAgICBlbHNlIGlmIChmcm9tID09PSAnbmVvbnMnKSB7XG4gICAgICBuZW9uc1NlY3Rpb24ub3V0KHdheSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGZyb20gPT09ICdoZWlnaHQnKSB7XG4gICAgICBoZWlnaHRTZWN0aW9uLm91dCh3YXkpO1xuICAgIH1cbiAgICBlbHNlIGlmIChmcm9tID09PSAnd2F2ZScpIHtcbiAgICAgIHdhdmVTZWN0aW9uLm91dCh3YXkpO1xuICAgIH1cbiAgICBlbHNlIGlmIChmcm9tID09PSAnZmFjZScpIHtcbiAgICAgIGZhY2VTZWN0aW9uLm91dCh3YXkpO1xuICAgIH1cbiAgICBlbHNlIGlmIChmcm9tID09PSAncm9ja3MnKSB7XG4gICAgICByb2Nrc1NlY3Rpb24ub3V0KHdheSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGZyb20gPT09ICdnYWxheHknKSB7XG4gICAgICBnYWxheHlTZWN0aW9uLm91dCh3YXkpO1xuICAgIH1cbiAgICBlbHNlIGlmIChmcm9tID09PSAnZ3Jhdml0eScpIHtcbiAgICAgIGdyYXZpdHlTZWN0aW9uLm91dCh3YXkpO1xuICAgIH1cbiAgICBlbHNlIGlmIChmcm9tID09PSAnZW5kJykge1xuICAgICAgZW5kU2VjdGlvbi5vdXQod2F5KTtcbiAgICB9XG4gIH0pO1xuXG4gIFNDRU5FLm9uKCdzZWN0aW9uOmNoYW5nZUNvbXBsZXRlJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciB0byA9IHRoaXMudG8ubmFtZTtcbiAgICB2YXIgZnJvbSA9IHRoaXMuZnJvbS5uYW1lO1xuXG4gICAgLy8gb3V0IGNvbXBsZXRlXG4gICAgaWYgKGZyb20gPT09ICdoZWxsbycpIHtcbiAgICAgIGhlbGxvU2VjdGlvbi5zdG9wKCk7XG5cbiAgICAgIGlmICh0byAhPT0gJ2JlYW1zJykge1xuICAgICAgICBoZWxsb1NlY3Rpb24uc21va2VTdG9wKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0byAhPT0gJ2JlYW1zJyAmJiB0byAhPT0gJ2Ryb3AnKSB7XG4gICAgICAgIGJlYW1zU2VjdGlvbi5zdG9wKCk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKGZyb20gPT09ICdiZWFtcycpIHtcbiAgICAgIGlmICh0byAhPT0gJ2hlbGxvJykge1xuICAgICAgICBoZWxsb1NlY3Rpb24uc21va2VTdG9wKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0byAhPT0gJ2hlbGxvJyAmJiB0byAhPT0gJ2Ryb3AnKSB7XG4gICAgICAgIGJlYW1zU2VjdGlvbi5zdG9wKCk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKGZyb20gPT09ICdkcm9wJykge1xuICAgICAgaWYgKHRvICE9PSAnaGVsbG8nICYmIHRvICE9PSAnYmVhbXMnKSB7XG4gICAgICAgIGJlYW1zU2VjdGlvbi5zdG9wKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0byAhPT0gJ2JhbGwnKSB7XG4gICAgICAgIGRyb3BTZWN0aW9uLnN0b3AoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoZnJvbSA9PT0gJ2JhbGwnKSB7XG4gICAgICBiYWxsU2VjdGlvbi5zdG9wKCk7XG5cbiAgICAgIGlmICh0byAhPT0gJ2Ryb3AnKSB7XG4gICAgICAgIGRyb3BTZWN0aW9uLnN0b3AoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRvICE9PSAnZmxvdycgJiYgdG8gIT09ICduZW9ucycgJiYgdG8gIT09ICdoZWlnaHQnKSB7XG4gICAgICAgIGZsb3dTZWN0aW9uLnN0b3AoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoZnJvbSA9PT0gJ2Zsb3cnKSB7XG4gICAgICBpZiAodG8gIT09ICduZW9ucycgJiYgdG8gIT09ICdoZWlnaHQnKSB7XG4gICAgICAgIG5lb25zU2VjdGlvbi5zbW9rZVN0b3AoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRvICE9PSAnYmFsbCcgJiYgdG8gIT09ICduZW9ucycgJiYgdG8gIT09ICdoZWlnaHQnKSB7XG4gICAgICAgIGZsb3dTZWN0aW9uLnN0b3AoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoZnJvbSA9PT0gJ25lb25zJykge1xuICAgICAgbmVvbnNTZWN0aW9uLnN0b3AoKTtcblxuICAgICAgaWYgKHRvICE9PSAnZmxvdycgJiYgdG8gIT09ICdoZWlnaHQnKSB7XG4gICAgICAgIG5lb25zU2VjdGlvbi5zbW9rZVN0b3AoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRvICE9PSAnYmFsbCcgJiYgdG8gIT09ICdmbG93JyAmJiB0byAhPT0gJ2hlaWdodCcpIHtcbiAgICAgICAgZmxvd1NlY3Rpb24uc3RvcCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAodG8gIT09ICdoZWlnaHQnICYmIHRvICE9PSAnd2F2ZScpIHtcbiAgICAgICAgaGVpZ2h0U2VjdGlvbi5oaWRlKCk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKGZyb20gPT09ICdoZWlnaHQnKSB7XG4gICAgICBoZWlnaHRTZWN0aW9uLnN0b3AoKTtcblxuICAgICAgaWYgKHRvICE9PSAnbmVvbnMnICYmIHRvICE9PSAnd2F2ZScpIHtcbiAgICAgICAgaGVpZ2h0U2VjdGlvbi5oaWRlKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0byAhPT0gJ2Zsb3cnICYmIHRvICE9PSAnbmVvbnMnKSB7XG4gICAgICAgIG5lb25zU2VjdGlvbi5zbW9rZVN0b3AoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRvICE9PSAnYmFsbCcgJiYgdG8gIT09ICdmbG93JyAmJiB0byAhPT0gJ25lb25zJykge1xuICAgICAgICBmbG93U2VjdGlvbi5zdG9wKCk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKGZyb20gPT09ICd3YXZlJykge1xuICAgICAgd2F2ZVNlY3Rpb24uc3RvcCgpO1xuXG4gICAgICBpZiAodG8gIT09ICduZW9ucycgJiYgdG8gIT09ICdoZWlnaHQnKSB7XG4gICAgICAgIGhlaWdodFNlY3Rpb24uaGlkZSgpO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChmcm9tID09PSAnZmFjZScpIHtcbiAgICAgIGZhY2VTZWN0aW9uLnN0b3AoKTtcblxuICAgICAgaWYgKHRvICE9PSAncm9ja3MnICYmIHRvICE9PSAnZ2FsYXh5Jykge1xuICAgICAgICByb2Nrc1NlY3Rpb24uaGlkZSgpO1xuICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChmcm9tID09PSAncm9ja3MnKSB7XG4gICAgICByb2Nrc1NlY3Rpb24uc3RvcCgpO1xuXG4gICAgICBpZiAodG8gIT09ICdmYWNlJyAmJiB0byAhPT0gJ2dhbGF4eScpIHtcbiAgICAgICAgcm9ja3NTZWN0aW9uLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAoZnJvbSA9PT0gJ2dhbGF4eScpIHtcbiAgICAgIGdhbGF4eVNlY3Rpb24uc3RvcCgpO1xuXG4gICAgICBpZiAodG8gIT09ICdmYWNlJyAmJiB0byAhPT0gJ3JvY2tzJykge1xuICAgICAgICByb2Nrc1NlY3Rpb24uaGlkZSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAodG8gIT09ICdncmF2aXR5Jykge1xuICAgICAgICBncmF2aXR5U2VjdGlvbi5oaWRlKCk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKGZyb20gPT09ICdncmF2aXR5Jykge1xuICAgICAgZ3Jhdml0eVNlY3Rpb24uc3RvcCgpO1xuXG4gICAgICBpZiAodG8gIT09ICdnYWxheHknKSB7XG4gICAgICAgIGdyYXZpdHlTZWN0aW9uLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIFNDRU5FLm9uKCdlbmQnLCBmdW5jdGlvbiAoKSB7XG4gICAgU0NFTkUubG9jaygpO1xuICAgIEFQUC5zbGlkZShTQ0VORS51bmxvY2spO1xuICB9KTtcblxuICAvLyBtYXBcbiAgdmFyIG1hcCA9IFNDRU5FLmdldE1hcCgpO1xuXG4gICRoZWFkcy5wcmVwZW5kKG1hcC4kZWwpO1xuXG4gIG1hcC5pbml0KCk7XG5cbiAgbWFwLm9uQ2xpY2soZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgU0NFTkUuZ29UbyhpbmRleCk7XG4gIH0pO1xuXG4gIFNDRU5FLm9uKCdzZWN0aW9uOmNoYW5nZUJlZ2luJywgZnVuY3Rpb24gKCkge1xuICAgIG1hcC5zZXRBY3RpdmUodGhpcy50by5pbmRleCk7XG4gIH0pO1xuXG4gIC8vIHRhaWxzXG4gIHZhciB3aXJlZnJhbWUgPSBuZXcgV2lyZWZyYW1lKGpRdWVyeSgnLndpcmVmcmFtZScpKTtcblxuICB2YXIgJHRhaWxzU2VjdGlvbnMgPSBqUXVlcnkoJy50YWlsc19fc2VjdGlvbicpO1xuICAkdGFpbHNTZWN0aW9ucy5maW5kKCcudGFpbHNfX3NlY3Rpb25fX2VsJykuYW5pbWF0ZSh7IG9wYWNpdHk6IDAsIHk6IDEwMCB9LCAwKTtcblxuICB2YXIgd2F5cG9pbnQgPSAkdGFpbHNTZWN0aW9ucy53YXlwb2ludCh7XG4gICAgJHZpZXdwb3J0OiBqUXVlcnkoJy50YWlscycpLFxuICAgIG9mZnNldDogMzBcbiAgfSk7XG5cbiAgJHRhaWxzU2VjdGlvbnMub24oJ2FjdGl2ZScsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgJGVsID0galF1ZXJ5KHRoaXMpO1xuICAgIFxuICAgIGlmICgkZWwuYXR0cignZGF0YS1hcHBlYXJlZCcpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgalF1ZXJ5KHRoaXMpLmZpbmQoJy50YWlsc19fc2VjdGlvbl9fZWwnKS5lYWNoKGZ1bmN0aW9uIChpKSB7XG4gICAgICBqUXVlcnkodGhpcykuc3RvcCgpLmRlbGF5KGkgKiAxMDApLmFuaW1hdGUoeyBvcGFjaXR5OiAxLCB5OiAwIH0sIDUwMCk7XG4gICAgfSk7XG5cbiAgICAkZWwuYXR0cignZGF0YS1hcHBlYXJlZCcsIHRydWUpO1xuICB9KTtcblxuICBqUXVlcnkoJy50YWlsc19fc2VjdGlvbi0tc2l0ZScpLm9uKCdzdGF0ZUNoYW5nZScsIGZ1bmN0aW9uIChlLCBzdGF0ZSkge1xuICAgIGlmIChzdGF0ZSA9PT0gJ2FjdGl2ZScpIHtcbiAgICAgIHdpcmVmcmFtZS5zdGFydCgpO1xuICAgICAgd2lyZWZyYW1lLmluKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdpcmVmcmFtZS5zdG9wKCk7XG4gICAgfVxuICB9KTtcblxuICBBUFAub24oJ3NsaWRlQmVnaW4nLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMudG8gPT09ICdoZWFkcycpIHtcbiAgICAgIHdheXBvaW50LnN0b3AoKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgU09VTkRTLmJhY2tncm91bmQuZmFkZUluKDEsIDIwMDApOyAgXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihlKTtcbiAgICAgIH1cbiAgICAgIFxuICAgIH0gZWxzZSB7XG4gICAgICBTT1VORFMuYmFja2dyb3VuZC5mYWRlT3V0KDAsIDIwMDApO1xuICAgIH1cbiAgfSk7XG5cbiAgQVBQLm9uKCdzbGlkZUNvbXBsZXRlJywgZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnRvID09PSAndGFpbHMnKSB7XG4gICAgICB3YXlwb2ludC5zdGFydCgpO1xuICAgIH1cbiAgfSk7XG4gXG4gIC8vIFNDRU5FIG9uL29mZlxuICBBUFAub24oJ2hlYWRzOnZpc2libGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgU0NFTkUuc3RhcnQoKTtcbiAgfSk7XG5cbiAgQVBQLm9uKCdoZWFkczppbnZpc2libGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgU0NFTkUuc3RvcCgpO1xuICB9KTtcblxuICBBUFAuc3RhcnQoKTtcbiAgU0NFTkUuc3RhcnQoKTtcblxuICBTT1VORFMuYmFja2dyb3VuZC5mYWRlSW4oMSwgMjAwMCk7XG59KTsiXX0=
},{"./classes/LoaderClass":3,"./libs/waypointLib":7,"./modules/appModule":11,"./modules/hashModule":12,"./modules/sceneModule":13,"./modules/soundsModule":14,"./objects2D/HelpObject2D":15,"./objects2D/LoaderObject2D":18,"./objects2D/WireframeObject2D":21,"./objects2D/menuObject2D":22,"./polyfills/animFramePolyfill":43,"./polyfills/bindPolyfill":44,"./polyfills/indexOfPolyfill":45,"./sections/ballSection":46,"./sections/beamsSection":47,"./sections/citySection":48,"./sections/dropSection":49,"./sections/endSection":50,"./sections/faceSection":51,"./sections/flowSection":52,"./sections/galaxySection":53,"./sections/gravitySection":54,"./sections/heightSection":55,"./sections/helloSection":56,"./sections/neonsSection":57,"./sections/rocksSection":58,"./sections/waveSection":59}],2:[function(require,module,exports){
'use strict';

/**
 * Event bus
 *
 * @class Events
 * @constructor
 */
function Events () {
  this.events = {};
  this.id = -1;
}

/**
 * Register event
 *
 * @method on
 * @param {String} [name]
 * @param {Function} [callback]
 * @return {Number} [id]
 */
Events.prototype.on = function (name, callback) {
  if (!this.events[name]) {
    this.events[name] = [];
  }

  var id = (++this.id).toString();

  this.events[name].push({
    id: id,
    callback: callback
  });

  return id;
};

/**
 * Trigger event
 *
 * @method trigger
 * @param {String} [name]
 * @param {Object} [data]
 */
Events.prototype.trigger = function (name, data) {
  if (!this.events[name]) {
    return false;
  }

  var suscribers = this.events[name];
  for (var i = 0, j = suscribers.length; i < j; i++) {
    suscribers[i].callback.apply(data);
  }
};

module.exports = Events;
},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
(function (global){
'use strict';

var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);

/**
 * Section class
 * 
 * @class Section
 * @constructor
 * @param {String} [name]
 * @requires THREE
 */
function Section (name) {
  this.name = name;
  this.playing = false;

  var fn = function () {};
  this._in = fn;
  this._out = fn;
  this._start = fn;
  this._stop = fn;

  this.el = new THREE.Object3D();
}

/**
 * Add a new object
 *
 * @method add
 * @param {THREE.Object3D} [object]
 */
Section.prototype.add = function (object) {
  this.el.add(object);
};

/**
 * Section's in animation
 *
 * @method in
 * @param {String} [way]
 */
Section.prototype.in = function (way) {
  this._in(way);
};

/**
 * Section's out animation
 *
 * @method out
 * @param {String} [way]
 */
Section.prototype.out = function (way) {
  this._out(way);
};

/**
 * Start the section
 *
 * @method start
 */
Section.prototype.start = function () {
  if (this.playing) {
    return false;
  }

  this._start();

  this.playing = true;
};

/**
 * Stop the section
 *
 * @method stop
 */
Section.prototype.stop = function () {
  if (!this.playing) {
    return false;
  }

  this._stop();

  this.playing = false;
};

/**
 * Pass the in handler
 *
 * @method onIn
 * @param {Function} [callback]
 */
Section.prototype.onIn = function (callback) {
  this._in = callback;
};

/**
 * Pass the out handler
 *
 * @method onOut
 * @param {Function} [callback]
 */
Section.prototype.onOut = function (callback) {
  this._out = callback;
};

/**
 * Pass the start handler
 *
 * @method onStart
 * @param {Function} [callback]
 */
Section.prototype.onStart = function (callback) {
  this._start = callback;
};

/**
 * Pass the stop handler
 *
 * @method onStop
 * @param {Function} [callback]
 */
Section.prototype.onStop = function (callback) {
  this._stop = callback;
};

module.exports = Section;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvY2xhc3Nlcy9TZWN0aW9uQ2xhc3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgVEhSRUUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snVEhSRUUnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1RIUkVFJ10gOiBudWxsKTtcblxuLyoqXG4gKiBTZWN0aW9uIGNsYXNzXG4gKiBcbiAqIEBjbGFzcyBTZWN0aW9uXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7U3RyaW5nfSBbbmFtZV1cbiAqIEByZXF1aXJlcyBUSFJFRVxuICovXG5mdW5jdGlvbiBTZWN0aW9uIChuYW1lKSB7XG4gIHRoaXMubmFtZSA9IG5hbWU7XG4gIHRoaXMucGxheWluZyA9IGZhbHNlO1xuXG4gIHZhciBmbiA9IGZ1bmN0aW9uICgpIHt9O1xuICB0aGlzLl9pbiA9IGZuO1xuICB0aGlzLl9vdXQgPSBmbjtcbiAgdGhpcy5fc3RhcnQgPSBmbjtcbiAgdGhpcy5fc3RvcCA9IGZuO1xuXG4gIHRoaXMuZWwgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKTtcbn1cblxuLyoqXG4gKiBBZGQgYSBuZXcgb2JqZWN0XG4gKlxuICogQG1ldGhvZCBhZGRcbiAqIEBwYXJhbSB7VEhSRUUuT2JqZWN0M0R9IFtvYmplY3RdXG4gKi9cblNlY3Rpb24ucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIChvYmplY3QpIHtcbiAgdGhpcy5lbC5hZGQob2JqZWN0KTtcbn07XG5cbi8qKlxuICogU2VjdGlvbidzIGluIGFuaW1hdGlvblxuICpcbiAqIEBtZXRob2QgaW5cbiAqIEBwYXJhbSB7U3RyaW5nfSBbd2F5XVxuICovXG5TZWN0aW9uLnByb3RvdHlwZS5pbiA9IGZ1bmN0aW9uICh3YXkpIHtcbiAgdGhpcy5faW4od2F5KTtcbn07XG5cbi8qKlxuICogU2VjdGlvbidzIG91dCBhbmltYXRpb25cbiAqXG4gKiBAbWV0aG9kIG91dFxuICogQHBhcmFtIHtTdHJpbmd9IFt3YXldXG4gKi9cblNlY3Rpb24ucHJvdG90eXBlLm91dCA9IGZ1bmN0aW9uICh3YXkpIHtcbiAgdGhpcy5fb3V0KHdheSk7XG59O1xuXG4vKipcbiAqIFN0YXJ0IHRoZSBzZWN0aW9uXG4gKlxuICogQG1ldGhvZCBzdGFydFxuICovXG5TZWN0aW9uLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMucGxheWluZykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHRoaXMuX3N0YXJ0KCk7XG5cbiAgdGhpcy5wbGF5aW5nID0gdHJ1ZTtcbn07XG5cbi8qKlxuICogU3RvcCB0aGUgc2VjdGlvblxuICpcbiAqIEBtZXRob2Qgc3RvcFxuICovXG5TZWN0aW9uLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKCkge1xuICBpZiAoIXRoaXMucGxheWluZykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHRoaXMuX3N0b3AoKTtcblxuICB0aGlzLnBsYXlpbmcgPSBmYWxzZTtcbn07XG5cbi8qKlxuICogUGFzcyB0aGUgaW4gaGFuZGxlclxuICpcbiAqIEBtZXRob2Qgb25JblxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrXVxuICovXG5TZWN0aW9uLnByb3RvdHlwZS5vbkluID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIHRoaXMuX2luID0gY2FsbGJhY2s7XG59O1xuXG4vKipcbiAqIFBhc3MgdGhlIG91dCBoYW5kbGVyXG4gKlxuICogQG1ldGhvZCBvbk91dFxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrXVxuICovXG5TZWN0aW9uLnByb3RvdHlwZS5vbk91dCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICB0aGlzLl9vdXQgPSBjYWxsYmFjaztcbn07XG5cbi8qKlxuICogUGFzcyB0aGUgc3RhcnQgaGFuZGxlclxuICpcbiAqIEBtZXRob2Qgb25TdGFydFxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrXVxuICovXG5TZWN0aW9uLnByb3RvdHlwZS5vblN0YXJ0ID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIHRoaXMuX3N0YXJ0ID0gY2FsbGJhY2s7XG59O1xuXG4vKipcbiAqIFBhc3MgdGhlIHN0b3AgaGFuZGxlclxuICpcbiAqIEBtZXRob2Qgb25TdG9wXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2tdXG4gKi9cblNlY3Rpb24ucHJvdG90eXBlLm9uU3RvcCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICB0aGlzLl9zdG9wID0gY2FsbGJhY2s7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNlY3Rpb247Il19
},{}],5:[function(require,module,exports){
(function (global){
'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

/**
 * Slider
 *
 * @class Slider
 * @constructor
 * @requires jQuery
 */
function Slider ($el) {
  this.$el = $el;

  // els
  this.$container = this.$el.find('.slider__slides');
  this.$slides = this.$container.find('.slider__slide');
  this.$map = this.$el.find('.slider__map');

  // vars
  this.totalSlides = this.$slides.length;
  this.slideWidth = 100 / this.totalSlides;
  this.current = 0;
  this.interval = null;

  // init container
  this.$container.css('width', (this.totalSlides * 100) + '%');

  // methods
  this.onResize = null;

  // init slides and map
  var $node = jQuery('<div class="slider__map__node">');
  this.$nodes = jQuery();

  this.$slides.each(function (index, el) {
    var $slide = jQuery(el);
    
    $slide.css({
      width: this.slideWidth + '%',
      left: (index * this.slideWidth) + '%'
    });

    var $nodeCopy = $node.clone();
      
    // first slide/node setup
    if (index === 0) {
      $slide.addClass('is-active');
      $nodeCopy.addClass('is-active');
    }

    this.$nodes = this.$nodes.add($nodeCopy);
  }.bind(this));

  this.$map.html(this.$nodes);

  // init resize method
  this.onResize = function () {
    var maxHeight = 0;

    this.$slides.each(function () {
      var height = jQuery(this).height();

      if (height > maxHeight) {
        maxHeight = height;
      }
    });

    maxHeight += 10;

    this.$el.css({ height: maxHeight, marginTop: -(maxHeight / 2) });
  }.bind(this);

  this.onResize();
}

/**
 * Go to next slide
 *
 * @method next
 */
Slider.prototype.next = function () {
  this.current++;

  if (this.current >= this.totalSlides) {
    this.current = 0;
  }

  this.goTo(this.current);
};

/**
 * Go to previous slide
 *
 * @method prev
 */
Slider.prototype.prev = function () {
  this.current--;

  if (this.current <= 0) {
    this.current = this.totalSlides;
  }

  this.goTo(this.current);
};

/**
 * Go to a specific slide
 *
 * @method goTo
 * @param {Number} [index] Slide's index
 */
Slider.prototype.goTo = function (index) {
  var target = -(index * 100) + '%';

  this.updateMap(index);

  this.$container.stop().animate({ left: target }, 500);

  this.$slides.removeClass('is-active');
  jQuery(this.$slides[index]).addClass('is-active');
};

/**
 * Update control nodes
 *
 * @method updateMap
 * @param {Number} [index] Current index
 */
Slider.prototype.updateMap = function (index) {
  this.$nodes.removeClass('is-active');
  jQuery(this.$nodes[index]).addClass('is-active');
};

/**
 * Start the slider
 *
 * @method start
 */
Slider.prototype.start = function () {
  this.$nodes.on('click', function (e) {
    var index = jQuery(e.currentTarget).index();
    this.goTo(index);
  }.bind(this));

  // autoplay with pause on hover
  this.interval = window.setInterval(function () {
    this.next();
  }.bind(this), 10000);

  var _this = this;
  
  this.$el.on({
    mouseenter: function () {
      window.clearInterval(_this.interval);
    },
    mouseleave: function () {
      _this.interval = window.setInterval(function () {
        _this.next();
      }, 10000);
    }
  });

  jQuery(window).on('resize', this.onResize);
  this.onResize();
};

/**
 * Stop the slider
 *
 * @method next
 */
Slider.prototype.stop = function () {
  this.$nodes.off('click');
  this.$el.off('mouseenter mouseleave');
  jQuery(window).off('resize', this.onResize);

  window.clearInterval(this.interval);
};

module.exports = Slider;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvbGlicy9zbGlkZXJMaWIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBqUXVlcnkgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snalF1ZXJ5J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydqUXVlcnknXSA6IG51bGwpO1xuXG4vKipcbiAqIFNsaWRlclxuICpcbiAqIEBjbGFzcyBTbGlkZXJcbiAqIEBjb25zdHJ1Y3RvclxuICogQHJlcXVpcmVzIGpRdWVyeVxuICovXG5mdW5jdGlvbiBTbGlkZXIgKCRlbCkge1xuICB0aGlzLiRlbCA9ICRlbDtcblxuICAvLyBlbHNcbiAgdGhpcy4kY29udGFpbmVyID0gdGhpcy4kZWwuZmluZCgnLnNsaWRlcl9fc2xpZGVzJyk7XG4gIHRoaXMuJHNsaWRlcyA9IHRoaXMuJGNvbnRhaW5lci5maW5kKCcuc2xpZGVyX19zbGlkZScpO1xuICB0aGlzLiRtYXAgPSB0aGlzLiRlbC5maW5kKCcuc2xpZGVyX19tYXAnKTtcblxuICAvLyB2YXJzXG4gIHRoaXMudG90YWxTbGlkZXMgPSB0aGlzLiRzbGlkZXMubGVuZ3RoO1xuICB0aGlzLnNsaWRlV2lkdGggPSAxMDAgLyB0aGlzLnRvdGFsU2xpZGVzO1xuICB0aGlzLmN1cnJlbnQgPSAwO1xuICB0aGlzLmludGVydmFsID0gbnVsbDtcblxuICAvLyBpbml0IGNvbnRhaW5lclxuICB0aGlzLiRjb250YWluZXIuY3NzKCd3aWR0aCcsICh0aGlzLnRvdGFsU2xpZGVzICogMTAwKSArICclJyk7XG5cbiAgLy8gbWV0aG9kc1xuICB0aGlzLm9uUmVzaXplID0gbnVsbDtcblxuICAvLyBpbml0IHNsaWRlcyBhbmQgbWFwXG4gIHZhciAkbm9kZSA9IGpRdWVyeSgnPGRpdiBjbGFzcz1cInNsaWRlcl9fbWFwX19ub2RlXCI+Jyk7XG4gIHRoaXMuJG5vZGVzID0galF1ZXJ5KCk7XG5cbiAgdGhpcy4kc2xpZGVzLmVhY2goZnVuY3Rpb24gKGluZGV4LCBlbCkge1xuICAgIHZhciAkc2xpZGUgPSBqUXVlcnkoZWwpO1xuICAgIFxuICAgICRzbGlkZS5jc3Moe1xuICAgICAgd2lkdGg6IHRoaXMuc2xpZGVXaWR0aCArICclJyxcbiAgICAgIGxlZnQ6IChpbmRleCAqIHRoaXMuc2xpZGVXaWR0aCkgKyAnJSdcbiAgICB9KTtcblxuICAgIHZhciAkbm9kZUNvcHkgPSAkbm9kZS5jbG9uZSgpO1xuICAgICAgXG4gICAgLy8gZmlyc3Qgc2xpZGUvbm9kZSBzZXR1cFxuICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgJHNsaWRlLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICRub2RlQ29weS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgfVxuXG4gICAgdGhpcy4kbm9kZXMgPSB0aGlzLiRub2Rlcy5hZGQoJG5vZGVDb3B5KTtcbiAgfS5iaW5kKHRoaXMpKTtcblxuICB0aGlzLiRtYXAuaHRtbCh0aGlzLiRub2Rlcyk7XG5cbiAgLy8gaW5pdCByZXNpemUgbWV0aG9kXG4gIHRoaXMub25SZXNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1heEhlaWdodCA9IDA7XG5cbiAgICB0aGlzLiRzbGlkZXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgaGVpZ2h0ID0galF1ZXJ5KHRoaXMpLmhlaWdodCgpO1xuXG4gICAgICBpZiAoaGVpZ2h0ID4gbWF4SGVpZ2h0KSB7XG4gICAgICAgIG1heEhlaWdodCA9IGhlaWdodDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIG1heEhlaWdodCArPSAxMDtcblxuICAgIHRoaXMuJGVsLmNzcyh7IGhlaWdodDogbWF4SGVpZ2h0LCBtYXJnaW5Ub3A6IC0obWF4SGVpZ2h0IC8gMikgfSk7XG4gIH0uYmluZCh0aGlzKTtcblxuICB0aGlzLm9uUmVzaXplKCk7XG59XG5cbi8qKlxuICogR28gdG8gbmV4dCBzbGlkZVxuICpcbiAqIEBtZXRob2QgbmV4dFxuICovXG5TbGlkZXIucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuY3VycmVudCsrO1xuXG4gIGlmICh0aGlzLmN1cnJlbnQgPj0gdGhpcy50b3RhbFNsaWRlcykge1xuICAgIHRoaXMuY3VycmVudCA9IDA7XG4gIH1cblxuICB0aGlzLmdvVG8odGhpcy5jdXJyZW50KTtcbn07XG5cbi8qKlxuICogR28gdG8gcHJldmlvdXMgc2xpZGVcbiAqXG4gKiBAbWV0aG9kIHByZXZcbiAqL1xuU2xpZGVyLnByb3RvdHlwZS5wcmV2ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmN1cnJlbnQtLTtcblxuICBpZiAodGhpcy5jdXJyZW50IDw9IDApIHtcbiAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLnRvdGFsU2xpZGVzO1xuICB9XG5cbiAgdGhpcy5nb1RvKHRoaXMuY3VycmVudCk7XG59O1xuXG4vKipcbiAqIEdvIHRvIGEgc3BlY2lmaWMgc2xpZGVcbiAqXG4gKiBAbWV0aG9kIGdvVG9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbaW5kZXhdIFNsaWRlJ3MgaW5kZXhcbiAqL1xuU2xpZGVyLnByb3RvdHlwZS5nb1RvID0gZnVuY3Rpb24gKGluZGV4KSB7XG4gIHZhciB0YXJnZXQgPSAtKGluZGV4ICogMTAwKSArICclJztcblxuICB0aGlzLnVwZGF0ZU1hcChpbmRleCk7XG5cbiAgdGhpcy4kY29udGFpbmVyLnN0b3AoKS5hbmltYXRlKHsgbGVmdDogdGFyZ2V0IH0sIDUwMCk7XG5cbiAgdGhpcy4kc2xpZGVzLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgalF1ZXJ5KHRoaXMuJHNsaWRlc1tpbmRleF0pLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbn07XG5cbi8qKlxuICogVXBkYXRlIGNvbnRyb2wgbm9kZXNcbiAqXG4gKiBAbWV0aG9kIHVwZGF0ZU1hcFxuICogQHBhcmFtIHtOdW1iZXJ9IFtpbmRleF0gQ3VycmVudCBpbmRleFxuICovXG5TbGlkZXIucHJvdG90eXBlLnVwZGF0ZU1hcCA9IGZ1bmN0aW9uIChpbmRleCkge1xuICB0aGlzLiRub2Rlcy5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gIGpRdWVyeSh0aGlzLiRub2Rlc1tpbmRleF0pLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbn07XG5cbi8qKlxuICogU3RhcnQgdGhlIHNsaWRlclxuICpcbiAqIEBtZXRob2Qgc3RhcnRcbiAqL1xuU2xpZGVyLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy4kbm9kZXMub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgaW5kZXggPSBqUXVlcnkoZS5jdXJyZW50VGFyZ2V0KS5pbmRleCgpO1xuICAgIHRoaXMuZ29UbyhpbmRleCk7XG4gIH0uYmluZCh0aGlzKSk7XG5cbiAgLy8gYXV0b3BsYXkgd2l0aCBwYXVzZSBvbiBob3ZlclxuICB0aGlzLmludGVydmFsID0gd2luZG93LnNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm5leHQoKTtcbiAgfS5iaW5kKHRoaXMpLCAxMDAwMCk7XG5cbiAgdmFyIF90aGlzID0gdGhpcztcbiAgXG4gIHRoaXMuJGVsLm9uKHtcbiAgICBtb3VzZWVudGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbChfdGhpcy5pbnRlcnZhbCk7XG4gICAgfSxcbiAgICBtb3VzZWxlYXZlOiBmdW5jdGlvbiAoKSB7XG4gICAgICBfdGhpcy5pbnRlcnZhbCA9IHdpbmRvdy5zZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICAgIF90aGlzLm5leHQoKTtcbiAgICAgIH0sIDEwMDAwKTtcbiAgICB9XG4gIH0pO1xuXG4gIGpRdWVyeSh3aW5kb3cpLm9uKCdyZXNpemUnLCB0aGlzLm9uUmVzaXplKTtcbiAgdGhpcy5vblJlc2l6ZSgpO1xufTtcblxuLyoqXG4gKiBTdG9wIHRoZSBzbGlkZXJcbiAqXG4gKiBAbWV0aG9kIG5leHRcbiAqL1xuU2xpZGVyLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLiRub2Rlcy5vZmYoJ2NsaWNrJyk7XG4gIHRoaXMuJGVsLm9mZignbW91c2VlbnRlciBtb3VzZWxlYXZlJyk7XG4gIGpRdWVyeSh3aW5kb3cpLm9mZigncmVzaXplJywgdGhpcy5vblJlc2l6ZSk7XG5cbiAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNsaWRlcjsiXX0=
},{}],6:[function(require,module,exports){
(function (global){
'use strict';
  
var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);

/**
 * Sprite animation on a mesh using texture's offset
 *
 * @module SPRITE3D
 * @requires jQuery, THREE
 */
var SPRITE3D = SPRITE3D || (function () {
  var sprites = [];
  var previousTime = Date.now();

  return {
    /**
     * Add a new Sprite to the render queue
     *
     * @method add
     * @param {SPRITE3D.Sprite} [Sprite]
     */
    add: function (Sprite) {
      // update previousTime to avoid frame jumping
      // if inactive for too long
      if (sprites.length === 0) {
        previousTime = Date.now();
      }

      sprites.push(Sprite);
    },

    /**
     * Remove a Sprite from the render queue
     *
     * @method remove
     * @param {SPRITE3D.Sprite} [Sprite]
     */
    remove: function (Sprite) {
      var i = sprites.indexOf(Sprite);

      if (i !== -1) {
        sprites.splice(i, 1);
      }
    },

    /**
     * Update Sprites in the render queue
     *
     * @method update
     */
    update: function () {
      if (!sprites.length) {
        return false;
      }

      var time = Date.now();
      var delta = time - previousTime;
      previousTime = time;

      var i = 0;

      while (i < sprites.length) {
        if (sprites[i].update(delta)) {
          i++;
        } else {
          sprites.splice(i, 1);
        }
      }
    }
  };
})();

/**
 * Sprite
 *
 * @class SPRITE3D.Sprite
 * @constructor
 * @param {THREE.Texture} [texture]
 * @param {Object} [options]
 * @params {Number} [options.duration=100] Time per image
 * @params {Number} [options.horizontal=1] Horizontal steps
 * @params {Number} [options.vertical=1] Vertical steps
 * @params {Number} [options.total=1] Total steps
 * @params {Boolean} [options.loop=true] Loop?
 * @requires SPRITE3D, jQuery, THREE
 */
SPRITE3D.Sprite = function (texture, options) {
  this.texture = texture;

  this.parameters = jQuery.extend({
    duration: 100,
    horizontal: 1,
    vertical: 1,
    total: 1,
    loop: true
  }, options);

  this.texture.wrapS = texture.wrapT = THREE.RepeatWrapping; 
  this.texture.repeat.set(1 / this.parameters.horizontal, 1 / this.parameters.vertical);
  this.texture.offset.x = this.texture.offset.y = 1;

  this.isPlaying = false;
  this.current = 0;
  this.currentTime = 0;
};

/**
 * Start the animation (add it to render queue)
 *
 * @method start
 */
SPRITE3D.Sprite.prototype.start = function () {
  if (this.isPlaying) {
    return false;
  }

  SPRITE3D.add(this);

  this.isPlaying = true;
};

/**
 * Stop the animation (remove it from render queue)
 *
 * @method stop
 */
SPRITE3D.Sprite.prototype.stop = function () {
  if (!this.isPlaying) {
    return false;
  }

  SPRITE3D.remove(this);

  this.isPlaying = false;
};

/**
 * Update thre Sprite
 *
 * @method update
 * @param {Number} [delta] Time delta (time elapsed since last update)
 */
SPRITE3D.Sprite.prototype.update = function (delta) {
  this.currentTime += delta;

  while (this.currentTime > this.parameters.duration) {
    this.currentTime -= this.parameters.duration;

    this.current++;

    if (this.current === this.parameters.total - 1) {
      if (this.parameters.loop) {
        this.current = 0;  
      } else {
        this.current = 0;
        this.stop();
        return false;
      }
    }

    var factor = this.parameters.total - this.current;

    var row = Math.floor(factor / this.parameters.horizontal);
    var col = Math.floor(factor % this.parameters.horizontal);

    this.texture.offset.x = col / this.parameters.horizontal;
    this.texture.offset.y = row / this.parameters.vertical;
  }

  return true;
};

module.exports = SPRITE3D;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvbGlicy9zcHJpdGUzRExpYi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG4gIFxudmFyIGpRdWVyeSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydqUXVlcnknXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ2pRdWVyeSddIDogbnVsbCk7XG52YXIgVEhSRUUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snVEhSRUUnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1RIUkVFJ10gOiBudWxsKTtcblxuLyoqXG4gKiBTcHJpdGUgYW5pbWF0aW9uIG9uIGEgbWVzaCB1c2luZyB0ZXh0dXJlJ3Mgb2Zmc2V0XG4gKlxuICogQG1vZHVsZSBTUFJJVEUzRFxuICogQHJlcXVpcmVzIGpRdWVyeSwgVEhSRUVcbiAqL1xudmFyIFNQUklURTNEID0gU1BSSVRFM0QgfHwgKGZ1bmN0aW9uICgpIHtcbiAgdmFyIHNwcml0ZXMgPSBbXTtcbiAgdmFyIHByZXZpb3VzVGltZSA9IERhdGUubm93KCk7XG5cbiAgcmV0dXJuIHtcbiAgICAvKipcbiAgICAgKiBBZGQgYSBuZXcgU3ByaXRlIHRvIHRoZSByZW5kZXIgcXVldWVcbiAgICAgKlxuICAgICAqIEBtZXRob2QgYWRkXG4gICAgICogQHBhcmFtIHtTUFJJVEUzRC5TcHJpdGV9IFtTcHJpdGVdXG4gICAgICovXG4gICAgYWRkOiBmdW5jdGlvbiAoU3ByaXRlKSB7XG4gICAgICAvLyB1cGRhdGUgcHJldmlvdXNUaW1lIHRvIGF2b2lkIGZyYW1lIGp1bXBpbmdcbiAgICAgIC8vIGlmIGluYWN0aXZlIGZvciB0b28gbG9uZ1xuICAgICAgaWYgKHNwcml0ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHByZXZpb3VzVGltZSA9IERhdGUubm93KCk7XG4gICAgICB9XG5cbiAgICAgIHNwcml0ZXMucHVzaChTcHJpdGUpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYSBTcHJpdGUgZnJvbSB0aGUgcmVuZGVyIHF1ZXVlXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHJlbW92ZVxuICAgICAqIEBwYXJhbSB7U1BSSVRFM0QuU3ByaXRlfSBbU3ByaXRlXVxuICAgICAqL1xuICAgIHJlbW92ZTogZnVuY3Rpb24gKFNwcml0ZSkge1xuICAgICAgdmFyIGkgPSBzcHJpdGVzLmluZGV4T2YoU3ByaXRlKTtcblxuICAgICAgaWYgKGkgIT09IC0xKSB7XG4gICAgICAgIHNwcml0ZXMuc3BsaWNlKGksIDEpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGUgU3ByaXRlcyBpbiB0aGUgcmVuZGVyIHF1ZXVlXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIHVwZGF0ZVxuICAgICAqL1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCFzcHJpdGVzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHZhciB0aW1lID0gRGF0ZS5ub3coKTtcbiAgICAgIHZhciBkZWx0YSA9IHRpbWUgLSBwcmV2aW91c1RpbWU7XG4gICAgICBwcmV2aW91c1RpbWUgPSB0aW1lO1xuXG4gICAgICB2YXIgaSA9IDA7XG5cbiAgICAgIHdoaWxlIChpIDwgc3ByaXRlcy5sZW5ndGgpIHtcbiAgICAgICAgaWYgKHNwcml0ZXNbaV0udXBkYXRlKGRlbHRhKSkge1xuICAgICAgICAgIGkrKztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzcHJpdGVzLnNwbGljZShpLCAxKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcbn0pKCk7XG5cbi8qKlxuICogU3ByaXRlXG4gKlxuICogQGNsYXNzIFNQUklURTNELlNwcml0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge1RIUkVFLlRleHR1cmV9IFt0ZXh0dXJlXVxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogQHBhcmFtcyB7TnVtYmVyfSBbb3B0aW9ucy5kdXJhdGlvbj0xMDBdIFRpbWUgcGVyIGltYWdlXG4gKiBAcGFyYW1zIHtOdW1iZXJ9IFtvcHRpb25zLmhvcml6b250YWw9MV0gSG9yaXpvbnRhbCBzdGVwc1xuICogQHBhcmFtcyB7TnVtYmVyfSBbb3B0aW9ucy52ZXJ0aWNhbD0xXSBWZXJ0aWNhbCBzdGVwc1xuICogQHBhcmFtcyB7TnVtYmVyfSBbb3B0aW9ucy50b3RhbD0xXSBUb3RhbCBzdGVwc1xuICogQHBhcmFtcyB7Qm9vbGVhbn0gW29wdGlvbnMubG9vcD10cnVlXSBMb29wP1xuICogQHJlcXVpcmVzIFNQUklURTNELCBqUXVlcnksIFRIUkVFXG4gKi9cblNQUklURTNELlNwcml0ZSA9IGZ1bmN0aW9uICh0ZXh0dXJlLCBvcHRpb25zKSB7XG4gIHRoaXMudGV4dHVyZSA9IHRleHR1cmU7XG5cbiAgdGhpcy5wYXJhbWV0ZXJzID0galF1ZXJ5LmV4dGVuZCh7XG4gICAgZHVyYXRpb246IDEwMCxcbiAgICBob3Jpem9udGFsOiAxLFxuICAgIHZlcnRpY2FsOiAxLFxuICAgIHRvdGFsOiAxLFxuICAgIGxvb3A6IHRydWVcbiAgfSwgb3B0aW9ucyk7XG5cbiAgdGhpcy50ZXh0dXJlLndyYXBTID0gdGV4dHVyZS53cmFwVCA9IFRIUkVFLlJlcGVhdFdyYXBwaW5nOyBcbiAgdGhpcy50ZXh0dXJlLnJlcGVhdC5zZXQoMSAvIHRoaXMucGFyYW1ldGVycy5ob3Jpem9udGFsLCAxIC8gdGhpcy5wYXJhbWV0ZXJzLnZlcnRpY2FsKTtcbiAgdGhpcy50ZXh0dXJlLm9mZnNldC54ID0gdGhpcy50ZXh0dXJlLm9mZnNldC55ID0gMTtcblxuICB0aGlzLmlzUGxheWluZyA9IGZhbHNlO1xuICB0aGlzLmN1cnJlbnQgPSAwO1xuICB0aGlzLmN1cnJlbnRUaW1lID0gMDtcbn07XG5cbi8qKlxuICogU3RhcnQgdGhlIGFuaW1hdGlvbiAoYWRkIGl0IHRvIHJlbmRlciBxdWV1ZSlcbiAqXG4gKiBAbWV0aG9kIHN0YXJ0XG4gKi9cblNQUklURTNELlNwcml0ZS5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLmlzUGxheWluZykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIFNQUklURTNELmFkZCh0aGlzKTtcblxuICB0aGlzLmlzUGxheWluZyA9IHRydWU7XG59O1xuXG4vKipcbiAqIFN0b3AgdGhlIGFuaW1hdGlvbiAocmVtb3ZlIGl0IGZyb20gcmVuZGVyIHF1ZXVlKVxuICpcbiAqIEBtZXRob2Qgc3RvcFxuICovXG5TUFJJVEUzRC5TcHJpdGUucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICghdGhpcy5pc1BsYXlpbmcpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBTUFJJVEUzRC5yZW1vdmUodGhpcyk7XG5cbiAgdGhpcy5pc1BsYXlpbmcgPSBmYWxzZTtcbn07XG5cbi8qKlxuICogVXBkYXRlIHRocmUgU3ByaXRlXG4gKlxuICogQG1ldGhvZCB1cGRhdGVcbiAqIEBwYXJhbSB7TnVtYmVyfSBbZGVsdGFdIFRpbWUgZGVsdGEgKHRpbWUgZWxhcHNlZCBzaW5jZSBsYXN0IHVwZGF0ZSlcbiAqL1xuU1BSSVRFM0QuU3ByaXRlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoZGVsdGEpIHtcbiAgdGhpcy5jdXJyZW50VGltZSArPSBkZWx0YTtcblxuICB3aGlsZSAodGhpcy5jdXJyZW50VGltZSA+IHRoaXMucGFyYW1ldGVycy5kdXJhdGlvbikge1xuICAgIHRoaXMuY3VycmVudFRpbWUgLT0gdGhpcy5wYXJhbWV0ZXJzLmR1cmF0aW9uO1xuXG4gICAgdGhpcy5jdXJyZW50Kys7XG5cbiAgICBpZiAodGhpcy5jdXJyZW50ID09PSB0aGlzLnBhcmFtZXRlcnMudG90YWwgLSAxKSB7XG4gICAgICBpZiAodGhpcy5wYXJhbWV0ZXJzLmxvb3ApIHtcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gMDsgIFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gMDtcbiAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgZmFjdG9yID0gdGhpcy5wYXJhbWV0ZXJzLnRvdGFsIC0gdGhpcy5jdXJyZW50O1xuXG4gICAgdmFyIHJvdyA9IE1hdGguZmxvb3IoZmFjdG9yIC8gdGhpcy5wYXJhbWV0ZXJzLmhvcml6b250YWwpO1xuICAgIHZhciBjb2wgPSBNYXRoLmZsb29yKGZhY3RvciAlIHRoaXMucGFyYW1ldGVycy5ob3Jpem9udGFsKTtcblxuICAgIHRoaXMudGV4dHVyZS5vZmZzZXQueCA9IGNvbCAvIHRoaXMucGFyYW1ldGVycy5ob3Jpem9udGFsO1xuICAgIHRoaXMudGV4dHVyZS5vZmZzZXQueSA9IHJvdyAvIHRoaXMucGFyYW1ldGVycy52ZXJ0aWNhbDtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTUFJJVEUzRDsiXX0=
},{}],7:[function(require,module,exports){
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
},{"../utils/debounceUtil":60}],8:[function(require,module,exports){
(function (global){
'use strict';

var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);

var glitch = new THREE.ShaderMaterial({
  uniforms: {
    time: { type: 'f', value: 10.0 },
    resolution: { type: 'v2', value: new THREE.Vector2(10, 10) },
    fInverseViewportDimensions: { type: 'v2', value: new THREE.Vector2(10, 10) }
  },
  vertexShader: [

    'void main () {',
      'gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
    '}'

  ].join('\n'),
  fragmentShader: [

    'float time;',
    'uniform vec2 resolution;',
    'vec2 fInverseViewportDimensions;',

    'vec2 rota (vec2 p, float theta) {',
      'vec2 q;',
      'q.x = cos(theta) * p.x - sin(theta) * p.y;',
      'q.y = sin(theta) * p.y + cos(theta) * p.x;',
      'return q;',
    '}',

    'vec4 ConvertToVPos (vec4 p) {',
      'return vec4(0.5*(vec2(p.x + p.w, p.w - p.y) + p.w * fInverseViewportDimensions.xy), p.zw);',
    '}',

    'void main (void) {',
      'time = 1.0;',
      'vec2 p = (vec2(1, 1).xy / resolution.xy) - 0.5;',

      'for (float i = 0.0; i < 1.0; i++) {',
        'p = rota(p, time + length(p * 0.1) * (20.0 * cos(time * 0.5)));',
        'float s = 2.0;',
        'float dy = 1.0 / (5.0 * abs(p.y * s));',
        'gl_FragColor += vec4(dy * 0.1 * dy, 0.5 * dy, dy, 1.0);',
      '}',
    '}'

  ].join('\n')
});

module.exports = glitch;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvbWF0ZXJpYWxzL2dsaXRjaE1hdGVyaWFsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBUSFJFRSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydUSFJFRSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnVEhSRUUnXSA6IG51bGwpO1xuXG52YXIgZ2xpdGNoID0gbmV3IFRIUkVFLlNoYWRlck1hdGVyaWFsKHtcbiAgdW5pZm9ybXM6IHtcbiAgICB0aW1lOiB7IHR5cGU6ICdmJywgdmFsdWU6IDEwLjAgfSxcbiAgICByZXNvbHV0aW9uOiB7IHR5cGU6ICd2MicsIHZhbHVlOiBuZXcgVEhSRUUuVmVjdG9yMigxMCwgMTApIH0sXG4gICAgZkludmVyc2VWaWV3cG9ydERpbWVuc2lvbnM6IHsgdHlwZTogJ3YyJywgdmFsdWU6IG5ldyBUSFJFRS5WZWN0b3IyKDEwLCAxMCkgfVxuICB9LFxuICB2ZXJ0ZXhTaGFkZXI6IFtcblxuICAgICd2b2lkIG1haW4gKCkgeycsXG4gICAgICAnZ2xfUG9zaXRpb24gPSBwcm9qZWN0aW9uTWF0cml4ICogbW9kZWxWaWV3TWF0cml4ICogdmVjNChwb3NpdGlvbiwgMS4wKTsnLFxuICAgICd9J1xuXG4gIF0uam9pbignXFxuJyksXG4gIGZyYWdtZW50U2hhZGVyOiBbXG5cbiAgICAnZmxvYXQgdGltZTsnLFxuICAgICd1bmlmb3JtIHZlYzIgcmVzb2x1dGlvbjsnLFxuICAgICd2ZWMyIGZJbnZlcnNlVmlld3BvcnREaW1lbnNpb25zOycsXG5cbiAgICAndmVjMiByb3RhICh2ZWMyIHAsIGZsb2F0IHRoZXRhKSB7JyxcbiAgICAgICd2ZWMyIHE7JyxcbiAgICAgICdxLnggPSBjb3ModGhldGEpICogcC54IC0gc2luKHRoZXRhKSAqIHAueTsnLFxuICAgICAgJ3EueSA9IHNpbih0aGV0YSkgKiBwLnkgKyBjb3ModGhldGEpICogcC54OycsXG4gICAgICAncmV0dXJuIHE7JyxcbiAgICAnfScsXG5cbiAgICAndmVjNCBDb252ZXJ0VG9WUG9zICh2ZWM0IHApIHsnLFxuICAgICAgJ3JldHVybiB2ZWM0KDAuNSoodmVjMihwLnggKyBwLncsIHAudyAtIHAueSkgKyBwLncgKiBmSW52ZXJzZVZpZXdwb3J0RGltZW5zaW9ucy54eSksIHAuencpOycsXG4gICAgJ30nLFxuXG4gICAgJ3ZvaWQgbWFpbiAodm9pZCkgeycsXG4gICAgICAndGltZSA9IDEuMDsnLFxuICAgICAgJ3ZlYzIgcCA9ICh2ZWMyKDEsIDEpLnh5IC8gcmVzb2x1dGlvbi54eSkgLSAwLjU7JyxcblxuICAgICAgJ2ZvciAoZmxvYXQgaSA9IDAuMDsgaSA8IDEuMDsgaSsrKSB7JyxcbiAgICAgICAgJ3AgPSByb3RhKHAsIHRpbWUgKyBsZW5ndGgocCAqIDAuMSkgKiAoMjAuMCAqIGNvcyh0aW1lICogMC41KSkpOycsXG4gICAgICAgICdmbG9hdCBzID0gMi4wOycsXG4gICAgICAgICdmbG9hdCBkeSA9IDEuMCAvICg1LjAgKiBhYnMocC55ICogcykpOycsXG4gICAgICAgICdnbF9GcmFnQ29sb3IgKz0gdmVjNChkeSAqIDAuMSAqIGR5LCAwLjUgKiBkeSwgZHksIDEuMCk7JyxcbiAgICAgICd9JyxcbiAgICAnfSdcblxuICBdLmpvaW4oJ1xcbicpXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBnbGl0Y2g7Il19
},{}],9:[function(require,module,exports){
(function (global){
'use strict';

var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);

var sphereEnvMapShader = new THREE.ShaderMaterial({
  uniforms: {
    map: { type: 't', value: null }
  },
  vertexShader: [

    'varying vec2 vN;',

    'void main() {',
        'vec4 p = vec4( position, 1. );',

        'vec3 e = normalize( vec3( modelViewMatrix * p ) );',
        'vec3 n = normalize( normalMatrix * normal );',

        'vec3 r = reflect( e, n );',
        'float m = 2. * sqrt( ',
            'pow( r.x, 2. ) + ',
            'pow( r.y, 2. ) + ',
            'pow( r.z + 1., 2. ) ',
        ');',
        'vN = r.xy / m + .5;',

        'gl_Position = projectionMatrix * modelViewMatrix * p;',
    '}'

  ].join('\n'),
  fragmentShader: [

    'uniform sampler2D map;',

    'varying vec2 vN;',

    'void main() {    ',
        'vec3 base = texture2D( map, vN ).rgb;',
        'gl_FragColor = vec4( base, 1. );',
    '}'

  ].join('\n')
});

module.exports = sphereEnvMapShader;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvbWF0ZXJpYWxzL21hdENhcE1hdGVyaWFsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIFRIUkVFID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1RIUkVFJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydUSFJFRSddIDogbnVsbCk7XG5cbnZhciBzcGhlcmVFbnZNYXBTaGFkZXIgPSBuZXcgVEhSRUUuU2hhZGVyTWF0ZXJpYWwoe1xuICB1bmlmb3Jtczoge1xuICAgIG1hcDogeyB0eXBlOiAndCcsIHZhbHVlOiBudWxsIH1cbiAgfSxcbiAgdmVydGV4U2hhZGVyOiBbXG5cbiAgICAndmFyeWluZyB2ZWMyIHZOOycsXG5cbiAgICAndm9pZCBtYWluKCkgeycsXG4gICAgICAgICd2ZWM0IHAgPSB2ZWM0KCBwb3NpdGlvbiwgMS4gKTsnLFxuXG4gICAgICAgICd2ZWMzIGUgPSBub3JtYWxpemUoIHZlYzMoIG1vZGVsVmlld01hdHJpeCAqIHAgKSApOycsXG4gICAgICAgICd2ZWMzIG4gPSBub3JtYWxpemUoIG5vcm1hbE1hdHJpeCAqIG5vcm1hbCApOycsXG5cbiAgICAgICAgJ3ZlYzMgciA9IHJlZmxlY3QoIGUsIG4gKTsnLFxuICAgICAgICAnZmxvYXQgbSA9IDIuICogc3FydCggJyxcbiAgICAgICAgICAgICdwb3coIHIueCwgMi4gKSArICcsXG4gICAgICAgICAgICAncG93KCByLnksIDIuICkgKyAnLFxuICAgICAgICAgICAgJ3Bvdyggci56ICsgMS4sIDIuICkgJyxcbiAgICAgICAgJyk7JyxcbiAgICAgICAgJ3ZOID0gci54eSAvIG0gKyAuNTsnLFxuXG4gICAgICAgICdnbF9Qb3NpdGlvbiA9IHByb2plY3Rpb25NYXRyaXggKiBtb2RlbFZpZXdNYXRyaXggKiBwOycsXG4gICAgJ30nXG5cbiAgXS5qb2luKCdcXG4nKSxcbiAgZnJhZ21lbnRTaGFkZXI6IFtcblxuICAgICd1bmlmb3JtIHNhbXBsZXIyRCBtYXA7JyxcblxuICAgICd2YXJ5aW5nIHZlYzIgdk47JyxcblxuICAgICd2b2lkIG1haW4oKSB7ICAgICcsXG4gICAgICAgICd2ZWMzIGJhc2UgPSB0ZXh0dXJlMkQoIG1hcCwgdk4gKS5yZ2I7JyxcbiAgICAgICAgJ2dsX0ZyYWdDb2xvciA9IHZlYzQoIGJhc2UsIDEuICk7JyxcbiAgICAnfSdcblxuICBdLmpvaW4oJ1xcbicpXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBzcGhlcmVFbnZNYXBTaGFkZXI7Il19
},{}],10:[function(require,module,exports){
(function (global){
'use strict';

var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);

/**
 * Basic material that accepts vec4 as vertices colors (rgba).
 *
 * @attribute {Object} [customColor]
 * @attribute {Array} [customColor.value]
 */
var outlineShader = new THREE.ShaderMaterial({
  uniforms: {
    time: { type: 'f', value: 1 }
  },
  attributes: {
    customColor: { type: 'v4', value: [] }
  },
  vertexShader: [

    'attribute vec4 customColor;',
    'varying vec4 vColor;',

    'void main () {',
      'vColor = customColor;',
      'gl_Position = projectionMatrix * (modelViewMatrix * vec4(position, 1.0));',
    '}'

  ].join('\n'),
  fragmentShader: [

    'uniform float time;',
    'varying vec4 vColor;',

    'void main () {',
      'gl_FragColor = vColor;',
      'gl_FragColor.a += sin(time) - time;',
    '}'

  ].join('\n'),
  transparent: true,
  side: THREE.BackSide
});

module.exports = outlineShader;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvbWF0ZXJpYWxzL291dGxpbmVNYXRlcmlhbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgVEhSRUUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snVEhSRUUnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1RIUkVFJ10gOiBudWxsKTtcblxuLyoqXG4gKiBCYXNpYyBtYXRlcmlhbCB0aGF0IGFjY2VwdHMgdmVjNCBhcyB2ZXJ0aWNlcyBjb2xvcnMgKHJnYmEpLlxuICpcbiAqIEBhdHRyaWJ1dGUge09iamVjdH0gW2N1c3RvbUNvbG9yXVxuICogQGF0dHJpYnV0ZSB7QXJyYXl9IFtjdXN0b21Db2xvci52YWx1ZV1cbiAqL1xudmFyIG91dGxpbmVTaGFkZXIgPSBuZXcgVEhSRUUuU2hhZGVyTWF0ZXJpYWwoe1xuICB1bmlmb3Jtczoge1xuICAgIHRpbWU6IHsgdHlwZTogJ2YnLCB2YWx1ZTogMSB9XG4gIH0sXG4gIGF0dHJpYnV0ZXM6IHtcbiAgICBjdXN0b21Db2xvcjogeyB0eXBlOiAndjQnLCB2YWx1ZTogW10gfVxuICB9LFxuICB2ZXJ0ZXhTaGFkZXI6IFtcblxuICAgICdhdHRyaWJ1dGUgdmVjNCBjdXN0b21Db2xvcjsnLFxuICAgICd2YXJ5aW5nIHZlYzQgdkNvbG9yOycsXG5cbiAgICAndm9pZCBtYWluICgpIHsnLFxuICAgICAgJ3ZDb2xvciA9IGN1c3RvbUNvbG9yOycsXG4gICAgICAnZ2xfUG9zaXRpb24gPSBwcm9qZWN0aW9uTWF0cml4ICogKG1vZGVsVmlld01hdHJpeCAqIHZlYzQocG9zaXRpb24sIDEuMCkpOycsXG4gICAgJ30nXG5cbiAgXS5qb2luKCdcXG4nKSxcbiAgZnJhZ21lbnRTaGFkZXI6IFtcblxuICAgICd1bmlmb3JtIGZsb2F0IHRpbWU7JyxcbiAgICAndmFyeWluZyB2ZWM0IHZDb2xvcjsnLFxuXG4gICAgJ3ZvaWQgbWFpbiAoKSB7JyxcbiAgICAgICdnbF9GcmFnQ29sb3IgPSB2Q29sb3I7JyxcbiAgICAgICdnbF9GcmFnQ29sb3IuYSArPSBzaW4odGltZSkgLSB0aW1lOycsXG4gICAgJ30nXG5cbiAgXS5qb2luKCdcXG4nKSxcbiAgdHJhbnNwYXJlbnQ6IHRydWUsXG4gIHNpZGU6IFRIUkVFLkJhY2tTaWRlXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBvdXRsaW5lU2hhZGVyOyJdfQ==
},{}],11:[function(require,module,exports){
(function (global){
'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

var Events = require('../classes/EventsClass');

/**
 * Handle navigation between heads/tails
 *
 * @module APP
 * @event [heads:visible] Heads is at least partially in the viewport
 * @event [heads:invisible] Heads is completely out of the viewport
 * @requires jQuery, Events
 */
var APP = (function () {
  var instance;

  function init () {
    var events = new Events();

    var $trigger = jQuery('.trigger');
    var $heads = jQuery('.heads');
    var $tails = jQuery('.tails');
    var $infoArrow = $heads.find('.trigger__info--arrow');
    var $infoHeads = $heads.find('.trigger__info--heads');
    var $infoTails = $heads.find('.trigger__info--tails');

    // reset scroll
    jQuery('body').stop().animate({ scrollTop: 0 }, 2000);

    function navigation () {

      var isOpen = false;
      var isSliding = false;

      // Update the location of the trigger area
      function updateTrigger () {
        var properties;

        if (isOpen) {
          properties = { top: 0, bottom: 'auto' };
        } else {
          properties = { top: 'auto', bottom: 0 };
        }

        $trigger.css(properties);
      }

      function open () {
        if (isSliding) {
          return false;
        }

        var to;
        var y;

        if (isOpen) {
          to = 'heads';
          y = -90;
          events.trigger('heads:visible');
        } else {
          to = 'tails';
          y = -10;
          $infoArrow.stop().animate({ opacity: 0, bottom: 20 }, 500);
        }

        var props = { y: y + '%' };

        $heads.stop().animate(props, { duration: 400, easing: 'swing' });
        $tails.stop().animate(props, { duration: 400, easing: 'swing' });
      }

      function close () {
        if (isSliding) {
          return false;
        }

        var to;
        var y;

        if (isOpen) {
          to = 'heads';
          y = -100;
        } else {
          to = 'tails';
          y = 0;
          $infoArrow.stop().animate({ opacity: 0.5, bottom: 0 }, 500);
        }

        var props = { y: y + '%' };

        function onComplete () {
          if (to === 'heads') {
            events.trigger('heads:invisible');
          }
        }
        
        $heads.stop().animate(props, { duration: 400, easing: 'swing' });
        $tails.stop().animate(props, { duration: 400, easing: 'swing', complete: onComplete });
      }

      // Slide between heads and tails 
      function slide (callback) {
        isSliding = true;

        var to;
        var y;
        var durations;

        if (isOpen) {
          to = 'heads';
          y = 0;
          durations = [1050, 1000];
          events.trigger('heads:visible');
          $infoHeads.animate({ opacity: 0 }, 800);
          $infoArrow.stop().animate({ opacity: 0.5, bottom: 0 }, 500);
        } else {
          to = 'tails';
          y = -100;
          durations = [1000, 1050];
          $infoTails.animate({ opacity: 0 }, 800);
        }

        events.trigger('slideBegin', { to: to });

        var props = { y: y + '%' };

        function onComplete () {
          isSliding = false;

          events.trigger('slideComplete', { to: to });

          if (to === 'tails') {
            events.trigger('heads:invisible');

            $infoHeads.css('opacity', 1);
          } else {
            $infoTails.css('opacity', 1);
          }

          if (callback) {
            callback();
          }
        }

        $heads.stop().animate(props, { duration: durations[0], easing: 'easeInOutCubic' });
        $tails.stop().animate(props, { duration: durations[1], easing: 'easeInOutCubic', complete: onComplete });

        isOpen = !isOpen;

        updateTrigger();
      }

      $trigger.on({
        mouseenter: function () {
          open();
        },
        mouseleave: function () {
          close();
        },
        click: function () {
          slide();
        }
      });

      events.on('endSlide', function () {
        slide(this);
      });

      $infoHeads.css('opacity', 0);
    }

    function setup () {
      navigation();
      return APP.getInstance();
    }

    return {
      /**
       * Start APP
       *
       * @method start
       */
      start: setup,

      /**
       * Listen to APP event bus
       *
       * @method on
       * @param {String} [event]
       * @param {Function} [callback]
       **/
      on: function () {
        events.on.apply(events, arguments);
      },

      /**
       * Trigger slide on APP event bus
       * 
       * @method slide
       **/
      slide: function (callback) {
        events.trigger('endSlide', callback);
      }
    };
  }

  return {
    /**
     * Return APP instance
     *
     * @method getInstance
     * @return {APP}
     */
    getInstance: function () {
      if (!instance) {
        instance = init();
      }

      return instance;
    }
  };
})();

module.exports = APP.getInstance();
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvbW9kdWxlcy9hcHBNb2R1bGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgalF1ZXJ5ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ2pRdWVyeSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnalF1ZXJ5J10gOiBudWxsKTtcblxudmFyIEV2ZW50cyA9IHJlcXVpcmUoJy4uL2NsYXNzZXMvRXZlbnRzQ2xhc3MnKTtcblxuLyoqXG4gKiBIYW5kbGUgbmF2aWdhdGlvbiBiZXR3ZWVuIGhlYWRzL3RhaWxzXG4gKlxuICogQG1vZHVsZSBBUFBcbiAqIEBldmVudCBbaGVhZHM6dmlzaWJsZV0gSGVhZHMgaXMgYXQgbGVhc3QgcGFydGlhbGx5IGluIHRoZSB2aWV3cG9ydFxuICogQGV2ZW50IFtoZWFkczppbnZpc2libGVdIEhlYWRzIGlzIGNvbXBsZXRlbHkgb3V0IG9mIHRoZSB2aWV3cG9ydFxuICogQHJlcXVpcmVzIGpRdWVyeSwgRXZlbnRzXG4gKi9cbnZhciBBUFAgPSAoZnVuY3Rpb24gKCkge1xuICB2YXIgaW5zdGFuY2U7XG5cbiAgZnVuY3Rpb24gaW5pdCAoKSB7XG4gICAgdmFyIGV2ZW50cyA9IG5ldyBFdmVudHMoKTtcblxuICAgIHZhciAkdHJpZ2dlciA9IGpRdWVyeSgnLnRyaWdnZXInKTtcbiAgICB2YXIgJGhlYWRzID0galF1ZXJ5KCcuaGVhZHMnKTtcbiAgICB2YXIgJHRhaWxzID0galF1ZXJ5KCcudGFpbHMnKTtcbiAgICB2YXIgJGluZm9BcnJvdyA9ICRoZWFkcy5maW5kKCcudHJpZ2dlcl9faW5mby0tYXJyb3cnKTtcbiAgICB2YXIgJGluZm9IZWFkcyA9ICRoZWFkcy5maW5kKCcudHJpZ2dlcl9faW5mby0taGVhZHMnKTtcbiAgICB2YXIgJGluZm9UYWlscyA9ICRoZWFkcy5maW5kKCcudHJpZ2dlcl9faW5mby0tdGFpbHMnKTtcblxuICAgIC8vIHJlc2V0IHNjcm9sbFxuICAgIGpRdWVyeSgnYm9keScpLnN0b3AoKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiAwIH0sIDIwMDApO1xuXG4gICAgZnVuY3Rpb24gbmF2aWdhdGlvbiAoKSB7XG5cbiAgICAgIHZhciBpc09wZW4gPSBmYWxzZTtcbiAgICAgIHZhciBpc1NsaWRpbmcgPSBmYWxzZTtcblxuICAgICAgLy8gVXBkYXRlIHRoZSBsb2NhdGlvbiBvZiB0aGUgdHJpZ2dlciBhcmVhXG4gICAgICBmdW5jdGlvbiB1cGRhdGVUcmlnZ2VyICgpIHtcbiAgICAgICAgdmFyIHByb3BlcnRpZXM7XG5cbiAgICAgICAgaWYgKGlzT3Blbikge1xuICAgICAgICAgIHByb3BlcnRpZXMgPSB7IHRvcDogMCwgYm90dG9tOiAnYXV0bycgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcm9wZXJ0aWVzID0geyB0b3A6ICdhdXRvJywgYm90dG9tOiAwIH07XG4gICAgICAgIH1cblxuICAgICAgICAkdHJpZ2dlci5jc3MocHJvcGVydGllcyk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIG9wZW4gKCkge1xuICAgICAgICBpZiAoaXNTbGlkaW5nKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHRvO1xuICAgICAgICB2YXIgeTtcblxuICAgICAgICBpZiAoaXNPcGVuKSB7XG4gICAgICAgICAgdG8gPSAnaGVhZHMnO1xuICAgICAgICAgIHkgPSAtOTA7XG4gICAgICAgICAgZXZlbnRzLnRyaWdnZXIoJ2hlYWRzOnZpc2libGUnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0byA9ICd0YWlscyc7XG4gICAgICAgICAgeSA9IC0xMDtcbiAgICAgICAgICAkaW5mb0Fycm93LnN0b3AoKS5hbmltYXRlKHsgb3BhY2l0eTogMCwgYm90dG9tOiAyMCB9LCA1MDApO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHByb3BzID0geyB5OiB5ICsgJyUnIH07XG5cbiAgICAgICAgJGhlYWRzLnN0b3AoKS5hbmltYXRlKHByb3BzLCB7IGR1cmF0aW9uOiA0MDAsIGVhc2luZzogJ3N3aW5nJyB9KTtcbiAgICAgICAgJHRhaWxzLnN0b3AoKS5hbmltYXRlKHByb3BzLCB7IGR1cmF0aW9uOiA0MDAsIGVhc2luZzogJ3N3aW5nJyB9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gY2xvc2UgKCkge1xuICAgICAgICBpZiAoaXNTbGlkaW5nKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHRvO1xuICAgICAgICB2YXIgeTtcblxuICAgICAgICBpZiAoaXNPcGVuKSB7XG4gICAgICAgICAgdG8gPSAnaGVhZHMnO1xuICAgICAgICAgIHkgPSAtMTAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRvID0gJ3RhaWxzJztcbiAgICAgICAgICB5ID0gMDtcbiAgICAgICAgICAkaW5mb0Fycm93LnN0b3AoKS5hbmltYXRlKHsgb3BhY2l0eTogMC41LCBib3R0b206IDAgfSwgNTAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBwcm9wcyA9IHsgeTogeSArICclJyB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIG9uQ29tcGxldGUgKCkge1xuICAgICAgICAgIGlmICh0byA9PT0gJ2hlYWRzJykge1xuICAgICAgICAgICAgZXZlbnRzLnRyaWdnZXIoJ2hlYWRzOmludmlzaWJsZScpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgJGhlYWRzLnN0b3AoKS5hbmltYXRlKHByb3BzLCB7IGR1cmF0aW9uOiA0MDAsIGVhc2luZzogJ3N3aW5nJyB9KTtcbiAgICAgICAgJHRhaWxzLnN0b3AoKS5hbmltYXRlKHByb3BzLCB7IGR1cmF0aW9uOiA0MDAsIGVhc2luZzogJ3N3aW5nJywgY29tcGxldGU6IG9uQ29tcGxldGUgfSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFNsaWRlIGJldHdlZW4gaGVhZHMgYW5kIHRhaWxzIFxuICAgICAgZnVuY3Rpb24gc2xpZGUgKGNhbGxiYWNrKSB7XG4gICAgICAgIGlzU2xpZGluZyA9IHRydWU7XG5cbiAgICAgICAgdmFyIHRvO1xuICAgICAgICB2YXIgeTtcbiAgICAgICAgdmFyIGR1cmF0aW9ucztcblxuICAgICAgICBpZiAoaXNPcGVuKSB7XG4gICAgICAgICAgdG8gPSAnaGVhZHMnO1xuICAgICAgICAgIHkgPSAwO1xuICAgICAgICAgIGR1cmF0aW9ucyA9IFsxMDUwLCAxMDAwXTtcbiAgICAgICAgICBldmVudHMudHJpZ2dlcignaGVhZHM6dmlzaWJsZScpO1xuICAgICAgICAgICRpbmZvSGVhZHMuYW5pbWF0ZSh7IG9wYWNpdHk6IDAgfSwgODAwKTtcbiAgICAgICAgICAkaW5mb0Fycm93LnN0b3AoKS5hbmltYXRlKHsgb3BhY2l0eTogMC41LCBib3R0b206IDAgfSwgNTAwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0byA9ICd0YWlscyc7XG4gICAgICAgICAgeSA9IC0xMDA7XG4gICAgICAgICAgZHVyYXRpb25zID0gWzEwMDAsIDEwNTBdO1xuICAgICAgICAgICRpbmZvVGFpbHMuYW5pbWF0ZSh7IG9wYWNpdHk6IDAgfSwgODAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV2ZW50cy50cmlnZ2VyKCdzbGlkZUJlZ2luJywgeyB0bzogdG8gfSk7XG5cbiAgICAgICAgdmFyIHByb3BzID0geyB5OiB5ICsgJyUnIH07XG5cbiAgICAgICAgZnVuY3Rpb24gb25Db21wbGV0ZSAoKSB7XG4gICAgICAgICAgaXNTbGlkaW5nID0gZmFsc2U7XG5cbiAgICAgICAgICBldmVudHMudHJpZ2dlcignc2xpZGVDb21wbGV0ZScsIHsgdG86IHRvIH0pO1xuXG4gICAgICAgICAgaWYgKHRvID09PSAndGFpbHMnKSB7XG4gICAgICAgICAgICBldmVudHMudHJpZ2dlcignaGVhZHM6aW52aXNpYmxlJyk7XG5cbiAgICAgICAgICAgICRpbmZvSGVhZHMuY3NzKCdvcGFjaXR5JywgMSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRpbmZvVGFpbHMuY3NzKCdvcGFjaXR5JywgMSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICRoZWFkcy5zdG9wKCkuYW5pbWF0ZShwcm9wcywgeyBkdXJhdGlvbjogZHVyYXRpb25zWzBdLCBlYXNpbmc6ICdlYXNlSW5PdXRDdWJpYycgfSk7XG4gICAgICAgICR0YWlscy5zdG9wKCkuYW5pbWF0ZShwcm9wcywgeyBkdXJhdGlvbjogZHVyYXRpb25zWzFdLCBlYXNpbmc6ICdlYXNlSW5PdXRDdWJpYycsIGNvbXBsZXRlOiBvbkNvbXBsZXRlIH0pO1xuXG4gICAgICAgIGlzT3BlbiA9ICFpc09wZW47XG5cbiAgICAgICAgdXBkYXRlVHJpZ2dlcigpO1xuICAgICAgfVxuXG4gICAgICAkdHJpZ2dlci5vbih7XG4gICAgICAgIG1vdXNlZW50ZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBvcGVuKCk7XG4gICAgICAgIH0sXG4gICAgICAgIG1vdXNlbGVhdmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjbG9zZSgpO1xuICAgICAgICB9LFxuICAgICAgICBjbGljazogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNsaWRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBldmVudHMub24oJ2VuZFNsaWRlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICBzbGlkZSh0aGlzKTtcbiAgICAgIH0pO1xuXG4gICAgICAkaW5mb0hlYWRzLmNzcygnb3BhY2l0eScsIDApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldHVwICgpIHtcbiAgICAgIG5hdmlnYXRpb24oKTtcbiAgICAgIHJldHVybiBBUFAuZ2V0SW5zdGFuY2UoKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgLyoqXG4gICAgICAgKiBTdGFydCBBUFBcbiAgICAgICAqXG4gICAgICAgKiBAbWV0aG9kIHN0YXJ0XG4gICAgICAgKi9cbiAgICAgIHN0YXJ0OiBzZXR1cCxcblxuICAgICAgLyoqXG4gICAgICAgKiBMaXN0ZW4gdG8gQVBQIGV2ZW50IGJ1c1xuICAgICAgICpcbiAgICAgICAqIEBtZXRob2Qgb25cbiAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbZXZlbnRdXG4gICAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY2FsbGJhY2tdXG4gICAgICAgKiovXG4gICAgICBvbjogZnVuY3Rpb24gKCkge1xuICAgICAgICBldmVudHMub24uYXBwbHkoZXZlbnRzLCBhcmd1bWVudHMpO1xuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBUcmlnZ2VyIHNsaWRlIG9uIEFQUCBldmVudCBidXNcbiAgICAgICAqIFxuICAgICAgICogQG1ldGhvZCBzbGlkZVxuICAgICAgICoqL1xuICAgICAgc2xpZGU6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICBldmVudHMudHJpZ2dlcignZW5kU2xpZGUnLCBjYWxsYmFjayk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgLyoqXG4gICAgICogUmV0dXJuIEFQUCBpbnN0YW5jZVxuICAgICAqXG4gICAgICogQG1ldGhvZCBnZXRJbnN0YW5jZVxuICAgICAqIEByZXR1cm4ge0FQUH1cbiAgICAgKi9cbiAgICBnZXRJbnN0YW5jZTogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCFpbnN0YW5jZSkge1xuICAgICAgICBpbnN0YW5jZSA9IGluaXQoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgIH1cbiAgfTtcbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gQVBQLmdldEluc3RhbmNlKCk7Il19
},{"../classes/EventsClass":2}],12:[function(require,module,exports){
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
},{}],13:[function(require,module,exports){
(function (global){
'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var TweenLite = (typeof window !== "undefined" ? window['TweenLite'] : typeof global !== "undefined" ? global['TweenLite'] : null);

var SPRITE3D = require('../libs/sprite3DLib');

var SOUNDS = require('../modules/soundsModule');

var Events = require('../classes/EventsClass');

var MapObj = require('../objects2D/MapObject2D');

var BackgroundParticles = require('../objects3D/BackgroundParticlesObject3D');
var BackgroundLines = require('../objects3D/BackgroundLinesObject3D');

/**
 * 3D Scene
 *
 * @module SCENE
 * @event [section:changeBegin]
 * @event [section:changeComplete]
 * @requires jQuery, THREE, TweenLite, SPRITE3D, SOUNDS, Events, MapObj, BackgroundParticles, BackgroundLines
 */
var SCENE = (function () {
  var instance;

  function init () {
    // params
    var parameters = {
      fogColor: '#0a0a0a',
      quality: 1,
      sectionHeight: 50
    };

    // DOM element
    var $viewport;
    var width;
    var height;

    // THREE Scene
    var resolution;
    var renderer;
    var scene;
    var light;
    var camera;
    var frameId;
    var cameraShakeY = 0;

    // mouse
    var mouseX = 0;

    // general
    var isLocked = false; // used to prevent additional event when slide() called from outside
    var isActive;
    var isStarted = false;

    // camera
    var cameraCache = { speed: 0 };
    var isScrolling = false;

    // background lines
    var backgroundLines;

    // sections
    var sections = [];
    var sectionsMap = {}; // map name with index
    var totalSections;
    var currentIndex = 0;
    var previousIndex = 0;
    
    // events
    var events = new Events();

    function navigation () {
      function next () {
        if (currentIndex === totalSections) {
          if (!isLocked) {
            events.trigger('end');  
          }
          
          return false;
        }

        currentIndex++;

        animateCamera(currentIndex);
      }

      function prev () {
        if (currentIndex === 0) {
          return false;
        }

        currentIndex--;

        animateCamera(currentIndex);
      }

      // scroll
      var newDate;
      var oldDate = new Date();
      
      function onScroll (event) {
        newDate = new Date();

        var elapsed = newDate.getTime() - oldDate.getTime();

        // handle scroll smoothing (mac trackpad for instance)
        if (elapsed > 50 && !isScrolling) {
          if (event.originalEvent.detail > 0 || event.originalEvent.wheelDelta < 0) {
            next();
          } else {
            prev();
          }
        }

        oldDate = new Date();

        return false;
      }

      function onKeyDown (event) {
        if (!isScrolling && isActive) {
          var keyCode = event.keyCode;
          
          if (keyCode === 40) {
            next();
          } else if (keyCode === 38) {
            prev();
          }
        }
      }

      $viewport.on('DOMMouseScroll mousewheel', onScroll);
      jQuery(document).on('keydown', onKeyDown);
    }

    function setup () {
      if (!$viewport) {
        console.warn('set viewport first');
        return false;
      }

      resolution = parameters.quality;

      renderer = new THREE.WebGLRenderer({
        alpha: false,
        antialias: false
      });
      // for transparent bg, also set alpha: true
      // renderer.setClearColor(0x000000, 0);
      renderer.setClearColor('#0a0a0a', 1);
      renderer.setSize(width * resolution, height * resolution);
      $viewport.append(renderer.domElement);

      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(parameters.fogColor, 0.01);

      light = new THREE.DirectionalLight('#ffffff', 0.5);
      light.position.set(0.2, 1, 0.5);
      scene.add(light);

      camera = new THREE.PerspectiveCamera(20, width / height, 1, 4000);
      camera.position.set(0, 0, 40);

      function onMouseMove (event) {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      }

      jQuery(window).on('resize', onResize);
      $viewport.on('mousemove', onMouseMove);

      navigation();
      draw();

      return SCENE.getInstance();
    }

    function setupBackground () {
      // add background particles and lines
      // rangeY based on the size and the number of sections
      var rangeY = [
        parameters.sectionHeight,
        (-sections.length * parameters.sectionHeight) - parameters.sectionHeight
      ];

      var backgroundParticles = new BackgroundParticles({ rangeY: rangeY, count: 1000 });
      scene.add(backgroundParticles.el);

      backgroundLines = new BackgroundLines({ rangeY: rangeY, count: 200 });
      scene.add(backgroundLines.el);
    }

    function draw () {
      SPRITE3D.update();
      render();
      frameId = window.requestAnimationFrame(draw);
    }

    function render () {
      // camera noise
      camera.position.y += Math.cos(cameraShakeY) / 50;
      cameraShakeY += 0.02;

      // mouse camera move
      camera.position.x += ((mouseX * 5) - camera.position.x) * 0.03;

      renderer.render(scene, camera);
    }

    function onResize () {
      width = $viewport.width();
      height = $viewport.height();

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width * resolution, height * resolution);
    }

    function animateCamera (index) {
      // in case goTo is called
      // otherwise navigation set currentIndex
      currentIndex = index;

      var nextPosition = index * -parameters.sectionHeight;
      
      // which way are we animating?
      var way = index < previousIndex ? -1 : 1;

      // event's data
      var data = {
        from: {
          name: sectionsMap[previousIndex],
          index: previousIndex
        },
        to: {
          name: sectionsMap[index],
          index: index
        },
        way: way === -1 ? 'up' : 'down'
      };

      TweenLite.to(camera.position, 1.5, { y: nextPosition, ease: window.Quart.easeInOut,
        onStart: function () {
          isScrolling = true;
          SOUNDS.wind.play();
          events.trigger('section:changeBegin', data);
        },
        onComplete: function () {
          if (previousIndex === index) {
            return false;
          }

          isScrolling = false;
          events.trigger('section:changeComplete', data);
          previousIndex = index;
        }
      });

      TweenLite.to(cameraCache, 1.5, {
        bezier: { type: 'soft', values: [{ speed: 10 }, { speed: 0 }] },
        onUpdate: function () {
          backgroundLines.updateY(this.target.speed);
        }
      });
    }

    return {
      /**
       * Set the SCENE viewport
       *
       * @method setViewport
       * @param {jQuery} [$el] $viewport DOM element
       */
      setViewport: function ($el) {
        $viewport = $el;

        width = $viewport.width();
        height = $viewport.height();

        setup();
      },

      /**
       * Set config
       *
       * @method config
       * @param {Object} [options]
       * @param {String} [options.fogColor='#0a0a0a'] Fog color
       * @param {Number} [options.quality=1] Quality
       * @param {Number} [options.sectionHeight=50] Height of each section
       * @param {Boolean} [screenshot=false] If set on true, press P to output imgData to the console
       */
      config: function (options) {
        parameters = jQuery.extend(parameters, options);
      },

      /**
       * Add sections
       *
       * @method addSections
       * @param {Array} [sections] Array of Sections
       */
      addSections: function (_sections) {
        sections = _sections;
        totalSections = sections.length - 1;

        for (var i = 0, j = sections.length; i < j; i++) {
          var section = sections[i];

          sectionsMap[i] = section.name;

          section.el.position.y = i * -parameters.sectionHeight;
          scene.add(section.el);
        }

        setupBackground();
      },

      /**
       * Listen to SCENE event bus
       *
       * @method on
       * @param {String} [event]
       * @param {Function} [callback]
       **/
      on: function () {
        events.on.apply(events, arguments);
      },

      /**
       * Animate camera to section
       *
       * @method goTo
       * @param {Number} [index] Section's index
       */
      goTo: function (index) {
        if (index === currentIndex) {
          return false;
        }

        animateCamera(index);
      },

      /**
       * Get SCENE map
       *
       * @method getMap
       * @return {Map}
       */
      getMap: function () {

        var map = new MapObj();

        for (var i = 0, j = sections.length; i < j; i++) {
          map.addNode(i);
        }

        return map;
      },

      /**
       * Start drawing loop
       *
       * @method stop
       */
      start: function () {
        isActive = true;

        if (!isStarted) {
          // first event
          var data = {
            from: {
              name: sectionsMap[previousIndex],
              index: previousIndex
            },
            to: {
              name: sectionsMap[currentIndex],
              index: currentIndex
            },
            way: 'down'
          };

          events.trigger('section:changeBegin', data);

          isStarted = true;
        }

        if (!frameId) {
          draw();
        }
      },

      /**
       * Stop drawing loop
       *
       * @method stop
       */
      stop: function () {
        if (frameId) {
          window.cancelAnimationFrame(frameId);
          frameId = undefined;
          isActive = false;
        }
      },

      /**
       * Set scene quality
       *
       * @method quality
       * @param {Number} [ratio]
       */
      quality: function (value) {
        resolution = value;
        renderer.setSize(width * resolution, height * resolution);
      },

      /**
       * Return current scene quality
       *
       * @method getQuality
       * @return {Number}
       */
      getQuality: function () {
        return resolution;
      },

      /**
       * Lock scene (forbid triggering end event)
       *
       * @method lock
       */
      lock: function () {
        isLocked = true;
      },

      /**
       * Unlock scene (allow triggering end event)
       *
       * @method unlock
       */
      unlock: function () {
        isLocked = false;
      },

      /**
       * in animation
       *
       * @method in
       */
      in: function () {
        TweenLite.to({ fov: 200, speed: 0 }, 2, {
          bezier: { type: 'soft', values: [{ speed: 20 }, { speed: 0 }]},
          fov: 60,
          ease: 'easeOutCubic',
          onUpdate: function () {
            backgroundLines.updateZ(this.target.speed);
            camera.fov = this.target.fov;
            camera.updateProjectionMatrix();
          }
        });
      }
    };
  }

  return {
    /**
     * Return SCENE instance
     *
     * @method getInstance
     * @return {SCENE}
     */
    getInstance: function () {
      if (!instance) {
        instance = init();
      }

      return instance;
    }
  };
})();

module.exports = SCENE.getInstance();
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvbW9kdWxlcy9zY2VuZU1vZHVsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBqUXVlcnkgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snalF1ZXJ5J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydqUXVlcnknXSA6IG51bGwpO1xudmFyIFRIUkVFID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1RIUkVFJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydUSFJFRSddIDogbnVsbCk7XG52YXIgVHdlZW5MaXRlID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1R3ZWVuTGl0ZSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnVHdlZW5MaXRlJ10gOiBudWxsKTtcblxudmFyIFNQUklURTNEID0gcmVxdWlyZSgnLi4vbGlicy9zcHJpdGUzRExpYicpO1xuXG52YXIgU09VTkRTID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9zb3VuZHNNb2R1bGUnKTtcblxudmFyIEV2ZW50cyA9IHJlcXVpcmUoJy4uL2NsYXNzZXMvRXZlbnRzQ2xhc3MnKTtcblxudmFyIE1hcE9iaiA9IHJlcXVpcmUoJy4uL29iamVjdHMyRC9NYXBPYmplY3QyRCcpO1xuXG52YXIgQmFja2dyb3VuZFBhcnRpY2xlcyA9IHJlcXVpcmUoJy4uL29iamVjdHMzRC9CYWNrZ3JvdW5kUGFydGljbGVzT2JqZWN0M0QnKTtcbnZhciBCYWNrZ3JvdW5kTGluZXMgPSByZXF1aXJlKCcuLi9vYmplY3RzM0QvQmFja2dyb3VuZExpbmVzT2JqZWN0M0QnKTtcblxuLyoqXG4gKiAzRCBTY2VuZVxuICpcbiAqIEBtb2R1bGUgU0NFTkVcbiAqIEBldmVudCBbc2VjdGlvbjpjaGFuZ2VCZWdpbl1cbiAqIEBldmVudCBbc2VjdGlvbjpjaGFuZ2VDb21wbGV0ZV1cbiAqIEByZXF1aXJlcyBqUXVlcnksIFRIUkVFLCBUd2VlbkxpdGUsIFNQUklURTNELCBTT1VORFMsIEV2ZW50cywgTWFwT2JqLCBCYWNrZ3JvdW5kUGFydGljbGVzLCBCYWNrZ3JvdW5kTGluZXNcbiAqL1xudmFyIFNDRU5FID0gKGZ1bmN0aW9uICgpIHtcbiAgdmFyIGluc3RhbmNlO1xuXG4gIGZ1bmN0aW9uIGluaXQgKCkge1xuICAgIC8vIHBhcmFtc1xuICAgIHZhciBwYXJhbWV0ZXJzID0ge1xuICAgICAgZm9nQ29sb3I6ICcjMGEwYTBhJyxcbiAgICAgIHF1YWxpdHk6IDEsXG4gICAgICBzZWN0aW9uSGVpZ2h0OiA1MFxuICAgIH07XG5cbiAgICAvLyBET00gZWxlbWVudFxuICAgIHZhciAkdmlld3BvcnQ7XG4gICAgdmFyIHdpZHRoO1xuICAgIHZhciBoZWlnaHQ7XG5cbiAgICAvLyBUSFJFRSBTY2VuZVxuICAgIHZhciByZXNvbHV0aW9uO1xuICAgIHZhciByZW5kZXJlcjtcbiAgICB2YXIgc2NlbmU7XG4gICAgdmFyIGxpZ2h0O1xuICAgIHZhciBjYW1lcmE7XG4gICAgdmFyIGZyYW1lSWQ7XG4gICAgdmFyIGNhbWVyYVNoYWtlWSA9IDA7XG5cbiAgICAvLyBtb3VzZVxuICAgIHZhciBtb3VzZVggPSAwO1xuXG4gICAgLy8gZ2VuZXJhbFxuICAgIHZhciBpc0xvY2tlZCA9IGZhbHNlOyAvLyB1c2VkIHRvIHByZXZlbnQgYWRkaXRpb25hbCBldmVudCB3aGVuIHNsaWRlKCkgY2FsbGVkIGZyb20gb3V0c2lkZVxuICAgIHZhciBpc0FjdGl2ZTtcbiAgICB2YXIgaXNTdGFydGVkID0gZmFsc2U7XG5cbiAgICAvLyBjYW1lcmFcbiAgICB2YXIgY2FtZXJhQ2FjaGUgPSB7IHNwZWVkOiAwIH07XG4gICAgdmFyIGlzU2Nyb2xsaW5nID0gZmFsc2U7XG5cbiAgICAvLyBiYWNrZ3JvdW5kIGxpbmVzXG4gICAgdmFyIGJhY2tncm91bmRMaW5lcztcblxuICAgIC8vIHNlY3Rpb25zXG4gICAgdmFyIHNlY3Rpb25zID0gW107XG4gICAgdmFyIHNlY3Rpb25zTWFwID0ge307IC8vIG1hcCBuYW1lIHdpdGggaW5kZXhcbiAgICB2YXIgdG90YWxTZWN0aW9ucztcbiAgICB2YXIgY3VycmVudEluZGV4ID0gMDtcbiAgICB2YXIgcHJldmlvdXNJbmRleCA9IDA7XG4gICAgXG4gICAgLy8gZXZlbnRzXG4gICAgdmFyIGV2ZW50cyA9IG5ldyBFdmVudHMoKTtcblxuICAgIGZ1bmN0aW9uIG5hdmlnYXRpb24gKCkge1xuICAgICAgZnVuY3Rpb24gbmV4dCAoKSB7XG4gICAgICAgIGlmIChjdXJyZW50SW5kZXggPT09IHRvdGFsU2VjdGlvbnMpIHtcbiAgICAgICAgICBpZiAoIWlzTG9ja2VkKSB7XG4gICAgICAgICAgICBldmVudHMudHJpZ2dlcignZW5kJyk7ICBcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgY3VycmVudEluZGV4Kys7XG5cbiAgICAgICAgYW5pbWF0ZUNhbWVyYShjdXJyZW50SW5kZXgpO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBwcmV2ICgpIHtcbiAgICAgICAgaWYgKGN1cnJlbnRJbmRleCA9PT0gMCkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGN1cnJlbnRJbmRleC0tO1xuXG4gICAgICAgIGFuaW1hdGVDYW1lcmEoY3VycmVudEluZGV4KTtcbiAgICAgIH1cblxuICAgICAgLy8gc2Nyb2xsXG4gICAgICB2YXIgbmV3RGF0ZTtcbiAgICAgIHZhciBvbGREYXRlID0gbmV3IERhdGUoKTtcbiAgICAgIFxuICAgICAgZnVuY3Rpb24gb25TY3JvbGwgKGV2ZW50KSB7XG4gICAgICAgIG5ld0RhdGUgPSBuZXcgRGF0ZSgpO1xuXG4gICAgICAgIHZhciBlbGFwc2VkID0gbmV3RGF0ZS5nZXRUaW1lKCkgLSBvbGREYXRlLmdldFRpbWUoKTtcblxuICAgICAgICAvLyBoYW5kbGUgc2Nyb2xsIHNtb290aGluZyAobWFjIHRyYWNrcGFkIGZvciBpbnN0YW5jZSlcbiAgICAgICAgaWYgKGVsYXBzZWQgPiA1MCAmJiAhaXNTY3JvbGxpbmcpIHtcbiAgICAgICAgICBpZiAoZXZlbnQub3JpZ2luYWxFdmVudC5kZXRhaWwgPiAwIHx8IGV2ZW50Lm9yaWdpbmFsRXZlbnQud2hlZWxEZWx0YSA8IDApIHtcbiAgICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJldigpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG9sZERhdGUgPSBuZXcgRGF0ZSgpO1xuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gb25LZXlEb3duIChldmVudCkge1xuICAgICAgICBpZiAoIWlzU2Nyb2xsaW5nICYmIGlzQWN0aXZlKSB7XG4gICAgICAgICAgdmFyIGtleUNvZGUgPSBldmVudC5rZXlDb2RlO1xuICAgICAgICAgIFxuICAgICAgICAgIGlmIChrZXlDb2RlID09PSA0MCkge1xuICAgICAgICAgICAgbmV4dCgpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoa2V5Q29kZSA9PT0gMzgpIHtcbiAgICAgICAgICAgIHByZXYoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgJHZpZXdwb3J0Lm9uKCdET01Nb3VzZVNjcm9sbCBtb3VzZXdoZWVsJywgb25TY3JvbGwpO1xuICAgICAgalF1ZXJ5KGRvY3VtZW50KS5vbigna2V5ZG93bicsIG9uS2V5RG93bik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0dXAgKCkge1xuICAgICAgaWYgKCEkdmlld3BvcnQpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdzZXQgdmlld3BvcnQgZmlyc3QnKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXNvbHV0aW9uID0gcGFyYW1ldGVycy5xdWFsaXR5O1xuXG4gICAgICByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHtcbiAgICAgICAgYWxwaGE6IGZhbHNlLFxuICAgICAgICBhbnRpYWxpYXM6IGZhbHNlXG4gICAgICB9KTtcbiAgICAgIC8vIGZvciB0cmFuc3BhcmVudCBiZywgYWxzbyBzZXQgYWxwaGE6IHRydWVcbiAgICAgIC8vIHJlbmRlcmVyLnNldENsZWFyQ29sb3IoMHgwMDAwMDAsIDApO1xuICAgICAgcmVuZGVyZXIuc2V0Q2xlYXJDb2xvcignIzBhMGEwYScsIDEpO1xuICAgICAgcmVuZGVyZXIuc2V0U2l6ZSh3aWR0aCAqIHJlc29sdXRpb24sIGhlaWdodCAqIHJlc29sdXRpb24pO1xuICAgICAgJHZpZXdwb3J0LmFwcGVuZChyZW5kZXJlci5kb21FbGVtZW50KTtcblxuICAgICAgc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcbiAgICAgIHNjZW5lLmZvZyA9IG5ldyBUSFJFRS5Gb2dFeHAyKHBhcmFtZXRlcnMuZm9nQ29sb3IsIDAuMDEpO1xuXG4gICAgICBsaWdodCA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KCcjZmZmZmZmJywgMC41KTtcbiAgICAgIGxpZ2h0LnBvc2l0aW9uLnNldCgwLjIsIDEsIDAuNSk7XG4gICAgICBzY2VuZS5hZGQobGlnaHQpO1xuXG4gICAgICBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoMjAsIHdpZHRoIC8gaGVpZ2h0LCAxLCA0MDAwKTtcbiAgICAgIGNhbWVyYS5wb3NpdGlvbi5zZXQoMCwgMCwgNDApO1xuXG4gICAgICBmdW5jdGlvbiBvbk1vdXNlTW92ZSAoZXZlbnQpIHtcbiAgICAgICAgbW91c2VYID0gKGV2ZW50LmNsaWVudFggLyB3aW5kb3cuaW5uZXJXaWR0aCkgKiAyIC0gMTtcbiAgICAgIH1cblxuICAgICAgalF1ZXJ5KHdpbmRvdykub24oJ3Jlc2l6ZScsIG9uUmVzaXplKTtcbiAgICAgICR2aWV3cG9ydC5vbignbW91c2Vtb3ZlJywgb25Nb3VzZU1vdmUpO1xuXG4gICAgICBuYXZpZ2F0aW9uKCk7XG4gICAgICBkcmF3KCk7XG5cbiAgICAgIHJldHVybiBTQ0VORS5nZXRJbnN0YW5jZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldHVwQmFja2dyb3VuZCAoKSB7XG4gICAgICAvLyBhZGQgYmFja2dyb3VuZCBwYXJ0aWNsZXMgYW5kIGxpbmVzXG4gICAgICAvLyByYW5nZVkgYmFzZWQgb24gdGhlIHNpemUgYW5kIHRoZSBudW1iZXIgb2Ygc2VjdGlvbnNcbiAgICAgIHZhciByYW5nZVkgPSBbXG4gICAgICAgIHBhcmFtZXRlcnMuc2VjdGlvbkhlaWdodCxcbiAgICAgICAgKC1zZWN0aW9ucy5sZW5ndGggKiBwYXJhbWV0ZXJzLnNlY3Rpb25IZWlnaHQpIC0gcGFyYW1ldGVycy5zZWN0aW9uSGVpZ2h0XG4gICAgICBdO1xuXG4gICAgICB2YXIgYmFja2dyb3VuZFBhcnRpY2xlcyA9IG5ldyBCYWNrZ3JvdW5kUGFydGljbGVzKHsgcmFuZ2VZOiByYW5nZVksIGNvdW50OiAxMDAwIH0pO1xuICAgICAgc2NlbmUuYWRkKGJhY2tncm91bmRQYXJ0aWNsZXMuZWwpO1xuXG4gICAgICBiYWNrZ3JvdW5kTGluZXMgPSBuZXcgQmFja2dyb3VuZExpbmVzKHsgcmFuZ2VZOiByYW5nZVksIGNvdW50OiAyMDAgfSk7XG4gICAgICBzY2VuZS5hZGQoYmFja2dyb3VuZExpbmVzLmVsKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBkcmF3ICgpIHtcbiAgICAgIFNQUklURTNELnVwZGF0ZSgpO1xuICAgICAgcmVuZGVyKCk7XG4gICAgICBmcmFtZUlkID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShkcmF3KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZW5kZXIgKCkge1xuICAgICAgLy8gY2FtZXJhIG5vaXNlXG4gICAgICBjYW1lcmEucG9zaXRpb24ueSArPSBNYXRoLmNvcyhjYW1lcmFTaGFrZVkpIC8gNTA7XG4gICAgICBjYW1lcmFTaGFrZVkgKz0gMC4wMjtcblxuICAgICAgLy8gbW91c2UgY2FtZXJhIG1vdmVcbiAgICAgIGNhbWVyYS5wb3NpdGlvbi54ICs9ICgobW91c2VYICogNSkgLSBjYW1lcmEucG9zaXRpb24ueCkgKiAwLjAzO1xuXG4gICAgICByZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25SZXNpemUgKCkge1xuICAgICAgd2lkdGggPSAkdmlld3BvcnQud2lkdGgoKTtcbiAgICAgIGhlaWdodCA9ICR2aWV3cG9ydC5oZWlnaHQoKTtcblxuICAgICAgY2FtZXJhLmFzcGVjdCA9IHdpZHRoIC8gaGVpZ2h0O1xuICAgICAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcblxuICAgICAgcmVuZGVyZXIuc2V0U2l6ZSh3aWR0aCAqIHJlc29sdXRpb24sIGhlaWdodCAqIHJlc29sdXRpb24pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFuaW1hdGVDYW1lcmEgKGluZGV4KSB7XG4gICAgICAvLyBpbiBjYXNlIGdvVG8gaXMgY2FsbGVkXG4gICAgICAvLyBvdGhlcndpc2UgbmF2aWdhdGlvbiBzZXQgY3VycmVudEluZGV4XG4gICAgICBjdXJyZW50SW5kZXggPSBpbmRleDtcblxuICAgICAgdmFyIG5leHRQb3NpdGlvbiA9IGluZGV4ICogLXBhcmFtZXRlcnMuc2VjdGlvbkhlaWdodDtcbiAgICAgIFxuICAgICAgLy8gd2hpY2ggd2F5IGFyZSB3ZSBhbmltYXRpbmc/XG4gICAgICB2YXIgd2F5ID0gaW5kZXggPCBwcmV2aW91c0luZGV4ID8gLTEgOiAxO1xuXG4gICAgICAvLyBldmVudCdzIGRhdGFcbiAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICBmcm9tOiB7XG4gICAgICAgICAgbmFtZTogc2VjdGlvbnNNYXBbcHJldmlvdXNJbmRleF0sXG4gICAgICAgICAgaW5kZXg6IHByZXZpb3VzSW5kZXhcbiAgICAgICAgfSxcbiAgICAgICAgdG86IHtcbiAgICAgICAgICBuYW1lOiBzZWN0aW9uc01hcFtpbmRleF0sXG4gICAgICAgICAgaW5kZXg6IGluZGV4XG4gICAgICAgIH0sXG4gICAgICAgIHdheTogd2F5ID09PSAtMSA/ICd1cCcgOiAnZG93bidcbiAgICAgIH07XG5cbiAgICAgIFR3ZWVuTGl0ZS50byhjYW1lcmEucG9zaXRpb24sIDEuNSwgeyB5OiBuZXh0UG9zaXRpb24sIGVhc2U6IHdpbmRvdy5RdWFydC5lYXNlSW5PdXQsXG4gICAgICAgIG9uU3RhcnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpc1Njcm9sbGluZyA9IHRydWU7XG4gICAgICAgICAgU09VTkRTLndpbmQucGxheSgpO1xuICAgICAgICAgIGV2ZW50cy50cmlnZ2VyKCdzZWN0aW9uOmNoYW5nZUJlZ2luJywgZGF0YSk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAocHJldmlvdXNJbmRleCA9PT0gaW5kZXgpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpc1Njcm9sbGluZyA9IGZhbHNlO1xuICAgICAgICAgIGV2ZW50cy50cmlnZ2VyKCdzZWN0aW9uOmNoYW5nZUNvbXBsZXRlJywgZGF0YSk7XG4gICAgICAgICAgcHJldmlvdXNJbmRleCA9IGluZGV4O1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgVHdlZW5MaXRlLnRvKGNhbWVyYUNhY2hlLCAxLjUsIHtcbiAgICAgICAgYmV6aWVyOiB7IHR5cGU6ICdzb2Z0JywgdmFsdWVzOiBbeyBzcGVlZDogMTAgfSwgeyBzcGVlZDogMCB9XSB9LFxuICAgICAgICBvblVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGJhY2tncm91bmRMaW5lcy51cGRhdGVZKHRoaXMudGFyZ2V0LnNwZWVkKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIC8qKlxuICAgICAgICogU2V0IHRoZSBTQ0VORSB2aWV3cG9ydFxuICAgICAgICpcbiAgICAgICAqIEBtZXRob2Qgc2V0Vmlld3BvcnRcbiAgICAgICAqIEBwYXJhbSB7alF1ZXJ5fSBbJGVsXSAkdmlld3BvcnQgRE9NIGVsZW1lbnRcbiAgICAgICAqL1xuICAgICAgc2V0Vmlld3BvcnQ6IGZ1bmN0aW9uICgkZWwpIHtcbiAgICAgICAgJHZpZXdwb3J0ID0gJGVsO1xuXG4gICAgICAgIHdpZHRoID0gJHZpZXdwb3J0LndpZHRoKCk7XG4gICAgICAgIGhlaWdodCA9ICR2aWV3cG9ydC5oZWlnaHQoKTtcblxuICAgICAgICBzZXR1cCgpO1xuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBTZXQgY29uZmlnXG4gICAgICAgKlxuICAgICAgICogQG1ldGhvZCBjb25maWdcbiAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5mb2dDb2xvcj0nIzBhMGEwYSddIEZvZyBjb2xvclxuICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnF1YWxpdHk9MV0gUXVhbGl0eVxuICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnNlY3Rpb25IZWlnaHQ9NTBdIEhlaWdodCBvZiBlYWNoIHNlY3Rpb25cbiAgICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW3NjcmVlbnNob3Q9ZmFsc2VdIElmIHNldCBvbiB0cnVlLCBwcmVzcyBQIHRvIG91dHB1dCBpbWdEYXRhIHRvIHRoZSBjb25zb2xlXG4gICAgICAgKi9cbiAgICAgIGNvbmZpZzogZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgcGFyYW1ldGVycyA9IGpRdWVyeS5leHRlbmQocGFyYW1ldGVycywgb3B0aW9ucyk7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEFkZCBzZWN0aW9uc1xuICAgICAgICpcbiAgICAgICAqIEBtZXRob2QgYWRkU2VjdGlvbnNcbiAgICAgICAqIEBwYXJhbSB7QXJyYXl9IFtzZWN0aW9uc10gQXJyYXkgb2YgU2VjdGlvbnNcbiAgICAgICAqL1xuICAgICAgYWRkU2VjdGlvbnM6IGZ1bmN0aW9uIChfc2VjdGlvbnMpIHtcbiAgICAgICAgc2VjdGlvbnMgPSBfc2VjdGlvbnM7XG4gICAgICAgIHRvdGFsU2VjdGlvbnMgPSBzZWN0aW9ucy5sZW5ndGggLSAxO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gc2VjdGlvbnMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICAgdmFyIHNlY3Rpb24gPSBzZWN0aW9uc1tpXTtcblxuICAgICAgICAgIHNlY3Rpb25zTWFwW2ldID0gc2VjdGlvbi5uYW1lO1xuXG4gICAgICAgICAgc2VjdGlvbi5lbC5wb3NpdGlvbi55ID0gaSAqIC1wYXJhbWV0ZXJzLnNlY3Rpb25IZWlnaHQ7XG4gICAgICAgICAgc2NlbmUuYWRkKHNlY3Rpb24uZWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0dXBCYWNrZ3JvdW5kKCk7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIExpc3RlbiB0byBTQ0VORSBldmVudCBidXNcbiAgICAgICAqXG4gICAgICAgKiBAbWV0aG9kIG9uXG4gICAgICAgKiBAcGFyYW0ge1N0cmluZ30gW2V2ZW50XVxuICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2NhbGxiYWNrXVxuICAgICAgICoqL1xuICAgICAgb246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZXZlbnRzLm9uLmFwcGx5KGV2ZW50cywgYXJndW1lbnRzKTtcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogQW5pbWF0ZSBjYW1lcmEgdG8gc2VjdGlvblxuICAgICAgICpcbiAgICAgICAqIEBtZXRob2QgZ29Ub1xuICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IFtpbmRleF0gU2VjdGlvbidzIGluZGV4XG4gICAgICAgKi9cbiAgICAgIGdvVG86IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICBpZiAoaW5kZXggPT09IGN1cnJlbnRJbmRleCkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFuaW1hdGVDYW1lcmEoaW5kZXgpO1xuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBHZXQgU0NFTkUgbWFwXG4gICAgICAgKlxuICAgICAgICogQG1ldGhvZCBnZXRNYXBcbiAgICAgICAqIEByZXR1cm4ge01hcH1cbiAgICAgICAqL1xuICAgICAgZ2V0TWFwOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdmFyIG1hcCA9IG5ldyBNYXBPYmooKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgaiA9IHNlY3Rpb25zLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgICAgIG1hcC5hZGROb2RlKGkpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1hcDtcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogU3RhcnQgZHJhd2luZyBsb29wXG4gICAgICAgKlxuICAgICAgICogQG1ldGhvZCBzdG9wXG4gICAgICAgKi9cbiAgICAgIHN0YXJ0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlzQWN0aXZlID0gdHJ1ZTtcblxuICAgICAgICBpZiAoIWlzU3RhcnRlZCkge1xuICAgICAgICAgIC8vIGZpcnN0IGV2ZW50XG4gICAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICBmcm9tOiB7XG4gICAgICAgICAgICAgIG5hbWU6IHNlY3Rpb25zTWFwW3ByZXZpb3VzSW5kZXhdLFxuICAgICAgICAgICAgICBpbmRleDogcHJldmlvdXNJbmRleFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRvOiB7XG4gICAgICAgICAgICAgIG5hbWU6IHNlY3Rpb25zTWFwW2N1cnJlbnRJbmRleF0sXG4gICAgICAgICAgICAgIGluZGV4OiBjdXJyZW50SW5kZXhcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB3YXk6ICdkb3duJ1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICBldmVudHMudHJpZ2dlcignc2VjdGlvbjpjaGFuZ2VCZWdpbicsIGRhdGEpO1xuXG4gICAgICAgICAgaXNTdGFydGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghZnJhbWVJZCkge1xuICAgICAgICAgIGRyYXcoKTtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBTdG9wIGRyYXdpbmcgbG9vcFxuICAgICAgICpcbiAgICAgICAqIEBtZXRob2Qgc3RvcFxuICAgICAgICovXG4gICAgICBzdG9wOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChmcmFtZUlkKSB7XG4gICAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKGZyYW1lSWQpO1xuICAgICAgICAgIGZyYW1lSWQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgaXNBY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBTZXQgc2NlbmUgcXVhbGl0eVxuICAgICAgICpcbiAgICAgICAqIEBtZXRob2QgcXVhbGl0eVxuICAgICAgICogQHBhcmFtIHtOdW1iZXJ9IFtyYXRpb11cbiAgICAgICAqL1xuICAgICAgcXVhbGl0eTogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHJlc29sdXRpb24gPSB2YWx1ZTtcbiAgICAgICAgcmVuZGVyZXIuc2V0U2l6ZSh3aWR0aCAqIHJlc29sdXRpb24sIGhlaWdodCAqIHJlc29sdXRpb24pO1xuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBSZXR1cm4gY3VycmVudCBzY2VuZSBxdWFsaXR5XG4gICAgICAgKlxuICAgICAgICogQG1ldGhvZCBnZXRRdWFsaXR5XG4gICAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAgICAgKi9cbiAgICAgIGdldFF1YWxpdHk6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHJlc29sdXRpb247XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIExvY2sgc2NlbmUgKGZvcmJpZCB0cmlnZ2VyaW5nIGVuZCBldmVudClcbiAgICAgICAqXG4gICAgICAgKiBAbWV0aG9kIGxvY2tcbiAgICAgICAqL1xuICAgICAgbG9jazogZnVuY3Rpb24gKCkge1xuICAgICAgICBpc0xvY2tlZCA9IHRydWU7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFVubG9jayBzY2VuZSAoYWxsb3cgdHJpZ2dlcmluZyBlbmQgZXZlbnQpXG4gICAgICAgKlxuICAgICAgICogQG1ldGhvZCB1bmxvY2tcbiAgICAgICAqL1xuICAgICAgdW5sb2NrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlzTG9ja2VkID0gZmFsc2U7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIGluIGFuaW1hdGlvblxuICAgICAgICpcbiAgICAgICAqIEBtZXRob2QgaW5cbiAgICAgICAqL1xuICAgICAgaW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgVHdlZW5MaXRlLnRvKHsgZm92OiAyMDAsIHNwZWVkOiAwIH0sIDIsIHtcbiAgICAgICAgICBiZXppZXI6IHsgdHlwZTogJ3NvZnQnLCB2YWx1ZXM6IFt7IHNwZWVkOiAyMCB9LCB7IHNwZWVkOiAwIH1dfSxcbiAgICAgICAgICBmb3Y6IDYwLFxuICAgICAgICAgIGVhc2U6ICdlYXNlT3V0Q3ViaWMnLFxuICAgICAgICAgIG9uVXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kTGluZXMudXBkYXRlWih0aGlzLnRhcmdldC5zcGVlZCk7XG4gICAgICAgICAgICBjYW1lcmEuZm92ID0gdGhpcy50YXJnZXQuZm92O1xuICAgICAgICAgICAgY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICByZXR1cm4ge1xuICAgIC8qKlxuICAgICAqIFJldHVybiBTQ0VORSBpbnN0YW5jZVxuICAgICAqXG4gICAgICogQG1ldGhvZCBnZXRJbnN0YW5jZVxuICAgICAqIEByZXR1cm4ge1NDRU5FfVxuICAgICAqL1xuICAgIGdldEluc3RhbmNlOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIWluc3RhbmNlKSB7XG4gICAgICAgIGluc3RhbmNlID0gaW5pdCgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgfVxuICB9O1xufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBTQ0VORS5nZXRJbnN0YW5jZSgpOyJdfQ==
},{"../classes/EventsClass":2,"../libs/sprite3DLib":6,"../modules/soundsModule":14,"../objects2D/MapObject2D":19,"../objects3D/BackgroundLinesObject3D":23,"../objects3D/BackgroundParticlesObject3D":24}],14:[function(require,module,exports){
(function (global){
'use strict';

var Howler = (typeof window !== "undefined" ? window['Howler'] : typeof global !== "undefined" ? global['Howler'] : null);
var Howl = (typeof window !== "undefined" ? window['Howl'] : typeof global !== "undefined" ? global['Howl'] : null);
var visibly = (typeof window !== "undefined" ? window['visibly'] : typeof global !== "undefined" ? global['visibly'] : null);

/**
 * Sounds module
 *
 * @module SOUNDS
 * @requires Howler, visibly
 */
var SOUNDS = (function () {
  var instance;

  function init () {

    var isMuted = false;

    return {
      /**
       * Toggle on/off sounds
       *
       * @method toogle
       */
      toggle: function () {
        if (isMuted) {
          Howler.unmute();
        } else {
          Howler.mute();
        }

        isMuted = !isMuted;
      },

      /**
       * Is muted
       * @method isMuted
       * @return {Boolean}
       */
      isMuted: function () {
        return Howler._muted;
      },

      background: new Howl({
        urls: [
          './app/public/sounds/background.mp3',
          './app/public/sounds/background.ogg',
          './app/public/sounds/background.wav'
        ],
        loop: true,
        volume: 0.5
      }),
      wind: new Howl({
        urls: [
          './app/public/sounds/wind.mp3',
          './app/public/sounds/wind.ogg',
          './app/public/sounds/wind.wav'
        ]
      }),
      whitenoise: new Howl({
        urls: [
          './app/public/sounds/whitenoise.mp3',
          './app/public/sounds/whitenoise.ogg',
          './app/public/sounds/whitenoise.wav'
        ],
        volume: 0.05
      }),
      neon: new Howl({
        urls: [
          './app/public/sounds/neon.mp3',
          './app/public/sounds/neon.ogg',
          './app/public/sounds/neon.wav'
        ],
        volume: 0.05
      })
    };
  }

  return  {
    /**
     * Return SOUNDS instance
     *
     * @method getInstance
     * @return {SOUNDS}
     */
    getInstance: function () {
      if (!instance) {
        instance = init();
      }

      return instance;
    }
  };
})();

// tab active/inactive
visibly.onHidden(function () {
  Howler.mute();
});

visibly.onVisible(function () {
  Howler.unmute();
});

module.exports = SOUNDS.getInstance();
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvbW9kdWxlcy9zb3VuZHNNb2R1bGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBIb3dsZXIgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snSG93bGVyJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydIb3dsZXInXSA6IG51bGwpO1xudmFyIEhvd2wgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snSG93bCddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnSG93bCddIDogbnVsbCk7XG52YXIgdmlzaWJseSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93Wyd2aXNpYmx5J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWyd2aXNpYmx5J10gOiBudWxsKTtcblxuLyoqXG4gKiBTb3VuZHMgbW9kdWxlXG4gKlxuICogQG1vZHVsZSBTT1VORFNcbiAqIEByZXF1aXJlcyBIb3dsZXIsIHZpc2libHlcbiAqL1xudmFyIFNPVU5EUyA9IChmdW5jdGlvbiAoKSB7XG4gIHZhciBpbnN0YW5jZTtcblxuICBmdW5jdGlvbiBpbml0ICgpIHtcblxuICAgIHZhciBpc011dGVkID0gZmFsc2U7XG5cbiAgICByZXR1cm4ge1xuICAgICAgLyoqXG4gICAgICAgKiBUb2dnbGUgb24vb2ZmIHNvdW5kc1xuICAgICAgICpcbiAgICAgICAqIEBtZXRob2QgdG9vZ2xlXG4gICAgICAgKi9cbiAgICAgIHRvZ2dsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoaXNNdXRlZCkge1xuICAgICAgICAgIEhvd2xlci51bm11dGUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBIb3dsZXIubXV0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaXNNdXRlZCA9ICFpc011dGVkO1xuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBJcyBtdXRlZFxuICAgICAgICogQG1ldGhvZCBpc011dGVkXG4gICAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgICAgICovXG4gICAgICBpc011dGVkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBIb3dsZXIuX211dGVkO1xuICAgICAgfSxcblxuICAgICAgYmFja2dyb3VuZDogbmV3IEhvd2woe1xuICAgICAgICB1cmxzOiBbXG4gICAgICAgICAgJy4vYXBwL3B1YmxpYy9zb3VuZHMvYmFja2dyb3VuZC5tcDMnLFxuICAgICAgICAgICcuL2FwcC9wdWJsaWMvc291bmRzL2JhY2tncm91bmQub2dnJyxcbiAgICAgICAgICAnLi9hcHAvcHVibGljL3NvdW5kcy9iYWNrZ3JvdW5kLndhdidcbiAgICAgICAgXSxcbiAgICAgICAgbG9vcDogdHJ1ZSxcbiAgICAgICAgdm9sdW1lOiAwLjVcbiAgICAgIH0pLFxuICAgICAgd2luZDogbmV3IEhvd2woe1xuICAgICAgICB1cmxzOiBbXG4gICAgICAgICAgJy4vYXBwL3B1YmxpYy9zb3VuZHMvd2luZC5tcDMnLFxuICAgICAgICAgICcuL2FwcC9wdWJsaWMvc291bmRzL3dpbmQub2dnJyxcbiAgICAgICAgICAnLi9hcHAvcHVibGljL3NvdW5kcy93aW5kLndhdidcbiAgICAgICAgXVxuICAgICAgfSksXG4gICAgICB3aGl0ZW5vaXNlOiBuZXcgSG93bCh7XG4gICAgICAgIHVybHM6IFtcbiAgICAgICAgICAnLi9hcHAvcHVibGljL3NvdW5kcy93aGl0ZW5vaXNlLm1wMycsXG4gICAgICAgICAgJy4vYXBwL3B1YmxpYy9zb3VuZHMvd2hpdGVub2lzZS5vZ2cnLFxuICAgICAgICAgICcuL2FwcC9wdWJsaWMvc291bmRzL3doaXRlbm9pc2Uud2F2J1xuICAgICAgICBdLFxuICAgICAgICB2b2x1bWU6IDAuMDVcbiAgICAgIH0pLFxuICAgICAgbmVvbjogbmV3IEhvd2woe1xuICAgICAgICB1cmxzOiBbXG4gICAgICAgICAgJy4vYXBwL3B1YmxpYy9zb3VuZHMvbmVvbi5tcDMnLFxuICAgICAgICAgICcuL2FwcC9wdWJsaWMvc291bmRzL25lb24ub2dnJyxcbiAgICAgICAgICAnLi9hcHAvcHVibGljL3NvdW5kcy9uZW9uLndhdidcbiAgICAgICAgXSxcbiAgICAgICAgdm9sdW1lOiAwLjA1XG4gICAgICB9KVxuICAgIH07XG4gIH1cblxuICByZXR1cm4gIHtcbiAgICAvKipcbiAgICAgKiBSZXR1cm4gU09VTkRTIGluc3RhbmNlXG4gICAgICpcbiAgICAgKiBAbWV0aG9kIGdldEluc3RhbmNlXG4gICAgICogQHJldHVybiB7U09VTkRTfVxuICAgICAqL1xuICAgIGdldEluc3RhbmNlOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIWluc3RhbmNlKSB7XG4gICAgICAgIGluc3RhbmNlID0gaW5pdCgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgfVxuICB9O1xufSkoKTtcblxuLy8gdGFiIGFjdGl2ZS9pbmFjdGl2ZVxudmlzaWJseS5vbkhpZGRlbihmdW5jdGlvbiAoKSB7XG4gIEhvd2xlci5tdXRlKCk7XG59KTtcblxudmlzaWJseS5vblZpc2libGUoZnVuY3Rpb24gKCkge1xuICBIb3dsZXIudW5tdXRlKCk7XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBTT1VORFMuZ2V0SW5zdGFuY2UoKTsiXX0=
},{}],15:[function(require,module,exports){
(function (global){
'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

var Slider = require('../libs/sliderLib');

var Layout = require('../objects2D/LayoutObject2D');
var Mouse = require('../objects2D/MouseObject2D');
var Keys = require('../objects2D/KeysObject2D');

/**
 * Help overlay
 *
 * @class Help
 * @constructor
 * @requires jQuery, Sider, Layout, Mouse, Keys
 */
function Help () {
  this.$el = jQuery('.help');
  this.slider = new Slider(this.$el.find('.slider'));

  this.keys = new Keys(this.$el.find('.keys'));
  this.mouse = new Mouse(this.$el.find('.mouse'));
  this.layout = new Layout(this.$el.find('.layout'));
}

/**
 * In animation
 *
 * @method in
 */
Help.prototype.in = function () {
  this.$el.css({ display: 'block', opacity: 0 });

  this.slider.start();

  this.slider.$el.delay(100).css({ top: '60%', opacity: 0 })
    .animate({ top: '50%', opacity: 1 }, 500);

  this.$el.stop().animate({ opacity: 0.9 }, 500, function () {
    this.keys.start();
    this.mouse.start();
    this.layout.start();
  }.bind(this));

  this.$el.on('click', function (event) {
    if (event.target === this) {
      this.out();
    }
  }.bind(this));

  this.$el.find('.help__quit').on('click', function () {
    this.out();
  }.bind(this));
};

/**
 * Out animation
 *
 * @method out
 */
Help.prototype.out = function () {
  this.$el.stop().animate({ opacity: 0 }, 500, function () {
    this.$el.css('display', 'none');

    this.slider.stop();

    this.keys.stop();
    this.mouse.stop();
    this.layout.stop();
  }.bind(this));

  this.$el.off('click');
  this.$el.find('.help__quit').off('click');
};

module.exports = Help;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvb2JqZWN0czJEL0hlbHBPYmplY3QyRC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgalF1ZXJ5ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ2pRdWVyeSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnalF1ZXJ5J10gOiBudWxsKTtcblxudmFyIFNsaWRlciA9IHJlcXVpcmUoJy4uL2xpYnMvc2xpZGVyTGliJyk7XG5cbnZhciBMYXlvdXQgPSByZXF1aXJlKCcuLi9vYmplY3RzMkQvTGF5b3V0T2JqZWN0MkQnKTtcbnZhciBNb3VzZSA9IHJlcXVpcmUoJy4uL29iamVjdHMyRC9Nb3VzZU9iamVjdDJEJyk7XG52YXIgS2V5cyA9IHJlcXVpcmUoJy4uL29iamVjdHMyRC9LZXlzT2JqZWN0MkQnKTtcblxuLyoqXG4gKiBIZWxwIG92ZXJsYXlcbiAqXG4gKiBAY2xhc3MgSGVscFxuICogQGNvbnN0cnVjdG9yXG4gKiBAcmVxdWlyZXMgalF1ZXJ5LCBTaWRlciwgTGF5b3V0LCBNb3VzZSwgS2V5c1xuICovXG5mdW5jdGlvbiBIZWxwICgpIHtcbiAgdGhpcy4kZWwgPSBqUXVlcnkoJy5oZWxwJyk7XG4gIHRoaXMuc2xpZGVyID0gbmV3IFNsaWRlcih0aGlzLiRlbC5maW5kKCcuc2xpZGVyJykpO1xuXG4gIHRoaXMua2V5cyA9IG5ldyBLZXlzKHRoaXMuJGVsLmZpbmQoJy5rZXlzJykpO1xuICB0aGlzLm1vdXNlID0gbmV3IE1vdXNlKHRoaXMuJGVsLmZpbmQoJy5tb3VzZScpKTtcbiAgdGhpcy5sYXlvdXQgPSBuZXcgTGF5b3V0KHRoaXMuJGVsLmZpbmQoJy5sYXlvdXQnKSk7XG59XG5cbi8qKlxuICogSW4gYW5pbWF0aW9uXG4gKlxuICogQG1ldGhvZCBpblxuICovXG5IZWxwLnByb3RvdHlwZS5pbiA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy4kZWwuY3NzKHsgZGlzcGxheTogJ2Jsb2NrJywgb3BhY2l0eTogMCB9KTtcblxuICB0aGlzLnNsaWRlci5zdGFydCgpO1xuXG4gIHRoaXMuc2xpZGVyLiRlbC5kZWxheSgxMDApLmNzcyh7IHRvcDogJzYwJScsIG9wYWNpdHk6IDAgfSlcbiAgICAuYW5pbWF0ZSh7IHRvcDogJzUwJScsIG9wYWNpdHk6IDEgfSwgNTAwKTtcblxuICB0aGlzLiRlbC5zdG9wKCkuYW5pbWF0ZSh7IG9wYWNpdHk6IDAuOSB9LCA1MDAsIGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmtleXMuc3RhcnQoKTtcbiAgICB0aGlzLm1vdXNlLnN0YXJ0KCk7XG4gICAgdGhpcy5sYXlvdXQuc3RhcnQoKTtcbiAgfS5iaW5kKHRoaXMpKTtcblxuICB0aGlzLiRlbC5vbignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQudGFyZ2V0ID09PSB0aGlzKSB7XG4gICAgICB0aGlzLm91dCgpO1xuICAgIH1cbiAgfS5iaW5kKHRoaXMpKTtcblxuICB0aGlzLiRlbC5maW5kKCcuaGVscF9fcXVpdCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm91dCgpO1xuICB9LmJpbmQodGhpcykpO1xufTtcblxuLyoqXG4gKiBPdXQgYW5pbWF0aW9uXG4gKlxuICogQG1ldGhvZCBvdXRcbiAqL1xuSGVscC5wcm90b3R5cGUub3V0ID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLiRlbC5zdG9wKCkuYW5pbWF0ZSh7IG9wYWNpdHk6IDAgfSwgNTAwLCBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy4kZWwuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcblxuICAgIHRoaXMuc2xpZGVyLnN0b3AoKTtcblxuICAgIHRoaXMua2V5cy5zdG9wKCk7XG4gICAgdGhpcy5tb3VzZS5zdG9wKCk7XG4gICAgdGhpcy5sYXlvdXQuc3RvcCgpO1xuICB9LmJpbmQodGhpcykpO1xuXG4gIHRoaXMuJGVsLm9mZignY2xpY2snKTtcbiAgdGhpcy4kZWwuZmluZCgnLmhlbHBfX3F1aXQnKS5vZmYoJ2NsaWNrJyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhlbHA7Il19
},{"../libs/sliderLib":5,"../objects2D/KeysObject2D":16,"../objects2D/LayoutObject2D":17,"../objects2D/MouseObject2D":20}],16:[function(require,module,exports){
'use strict';

/**
 * Animated keyboard keys
 *
 * @class Keys
 * @constructor
 * @requires jQuery
 */
function Keys ($el) {
  this.$el = $el;

  this.$top = this.$el.find('.key--top');
  this.$bottom = this.$el.find('.key--bottom');

  this.interval = null;
  this.current = 'top';
}

/**
 * Hightlight a key
 *
 * @method highlight
 */
Keys.prototype.highlight = function () {
  this.current = this.current === 'top' ? 'bottom' : 'top';
  var $el = this.current === 'top' ? this.$top : this.$bottom;

  $el.stop().animate({
      opacity: 1
    }, 400, function () {
      $el.stop().animate({
        opacity: 0.2
      }, 300);
  });
};

/**
 * Start animation
 *
 * @method start
 */
Keys.prototype.start = function () {
  this.interval = window.setInterval(function () {
    this.highlight();
  }.bind(this), 1000);
};

/**
 * Stop animation
 *
 * @method stop
 */
Keys.prototype.stop = function () {
  window.clearInterval(this.interval);
};

module.exports = Keys;
},{}],17:[function(require,module,exports){
'use strict';

/**
 * Animated layout
 *
 * @class Layout
 * @constructor
 * @requires jQuery
 */
function Layout ($el) {
  this.$el = $el;

  this.$container = this.$el.find('.layout__parts');
  this.$mouse = this.$el.find('.layout__mouse');
  this.$click = this.$mouse.find('.layout__mouse__click');

  // targets
  this.y = 0;
  this.openY = -15;
  this.mouseY = 90;

  this.interval = null;
}

/**
 * Animation next step
 *
 * @method slide
 */
Layout.prototype.slide = function () {
  // update targets
  if (this.y === 0) {
    this.y = -100;
    this.openY = -15;
    this.mouseY = 83;
  } else {
    this.y = 0;
    this.openY = -85;
    this.mouseY = 3;
  }

  var open = function () {
    this.$container.animate({
      'top': this.openY + '%'
    }, 800, function () {
      click();
    });
  }.bind(this);

  var moveMouse = function () {
    var flag = false;

    this.$mouse.animate({
      'top': this.mouseY + '%'
    }, {
      duration: 500,
      progress: function (animation, progress) {
        if (!flag && progress > 0.5) {
          flag = !flag;
          open();
        }
      }
    });
  }.bind(this);

  var click = function () {
    var flag = false;

    this.$click.delay(500).animate({
      'width': 70,
      'height': 70,
      'margin-left': -35,
      'margin-top': -35,
      'opacity': 0
    }, {
      duration: 400,
      progress: function (animation, progress) {
        if (!flag && progress > 0.7) {
          flag = !flag;
          slide();
        }
      },
      complete: function () {
        this.$click.css({
          'width': 0,
          'height': 0,
          'margin-left': 0,
          'margin-top': 0,
          'opacity': 1
        }.bind(this));
      }
    });
  }.bind(this);

  var slide = function () {
    this.$container.animate({
      'top': this.y + '%'
    }, 500);

    centerMouse();
  }.bind(this);

  var centerMouse = function () {
    this.$mouse.delay(300).animate({
      'top': '45%'
    }, 500);
  }.bind(this);

  moveMouse();
};

/**
 * Start animation
 *
 * @method start
 */
Layout.prototype.start = function () {
  this.slide();

  this.interval = window.setInterval(function () {
    this.slide();
  }.bind(this), 4000);
};

/**
 * Stop animation
 *
 * @method stop
 */
Layout.prototype.stop = function () {
  window.clearInterval(this.interval);
};

module.exports = Layout;
},{}],18:[function(require,module,exports){
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
},{}],19:[function(require,module,exports){
(function (global){
'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

/**
 * Navigation Map
 *
 * @class Map
 * @constructor
 * @requires jQuery
 */
function Map () {
  this.$el = jQuery('<div class="map"></div>');
  this.$nodes = null;
  this.callback = function () {};
}

/**
 * Default node
 * 
 * @property $node
 */
Map.prototype.$node = jQuery('<div class="map__node"></div>');

/**
 * Add a new node
 *
 * @method addNode
 * @param {Number} [index]
 */
Map.prototype.addNode = function (index) {
  var $node = this.$node.clone();
  $node.attr('data-index', index);
  
  this.$el.append($node);
};

/**
 * Initialize
 *
 * @method init
 */
Map.prototype.init = function () {
  var _this = this;

  // event
  this.$el.on('click', '.map__node', function () {
    var index = jQuery(this).data('index');
    _this.callback(index);
  });

  // center
  this.$el.css('margin-top', - this.$el.height() / 2);

  // nodes
  this.$nodes = this.$el.find('.map__node');
};

/**
 * Set onClick callback
 *
 * @method onClick
 * @param {Function} [callback]
 */
Map.prototype.onClick = function (callback) {
  this.callback = callback;
};
  
/**
 * Set active node (.is-active)
 *
 * @method setActive
 * @param {Number} [index]
 */
Map.prototype.setActive = function (index) {
  this.$nodes.removeClass('is-active');
  jQuery(this.$nodes[index]).addClass('is-active');
};

/**
 * In animation
 *
 * @method in
 */
Map.prototype.in = function () {
  this.$nodes.each(function (i) {
    jQuery(this).delay(i * 50).animate({ right: 0, opacity: 1 }, 500);
  });
};

module.exports = Map;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvb2JqZWN0czJEL01hcE9iamVjdDJELmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgalF1ZXJ5ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ2pRdWVyeSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnalF1ZXJ5J10gOiBudWxsKTtcblxuLyoqXG4gKiBOYXZpZ2F0aW9uIE1hcFxuICpcbiAqIEBjbGFzcyBNYXBcbiAqIEBjb25zdHJ1Y3RvclxuICogQHJlcXVpcmVzIGpRdWVyeVxuICovXG5mdW5jdGlvbiBNYXAgKCkge1xuICB0aGlzLiRlbCA9IGpRdWVyeSgnPGRpdiBjbGFzcz1cIm1hcFwiPjwvZGl2PicpO1xuICB0aGlzLiRub2RlcyA9IG51bGw7XG4gIHRoaXMuY2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7fTtcbn1cblxuLyoqXG4gKiBEZWZhdWx0IG5vZGVcbiAqIFxuICogQHByb3BlcnR5ICRub2RlXG4gKi9cbk1hcC5wcm90b3R5cGUuJG5vZGUgPSBqUXVlcnkoJzxkaXYgY2xhc3M9XCJtYXBfX25vZGVcIj48L2Rpdj4nKTtcblxuLyoqXG4gKiBBZGQgYSBuZXcgbm9kZVxuICpcbiAqIEBtZXRob2QgYWRkTm9kZVxuICogQHBhcmFtIHtOdW1iZXJ9IFtpbmRleF1cbiAqL1xuTWFwLnByb3RvdHlwZS5hZGROb2RlID0gZnVuY3Rpb24gKGluZGV4KSB7XG4gIHZhciAkbm9kZSA9IHRoaXMuJG5vZGUuY2xvbmUoKTtcbiAgJG5vZGUuYXR0cignZGF0YS1pbmRleCcsIGluZGV4KTtcbiAgXG4gIHRoaXMuJGVsLmFwcGVuZCgkbm9kZSk7XG59O1xuXG4vKipcbiAqIEluaXRpYWxpemVcbiAqXG4gKiBAbWV0aG9kIGluaXRcbiAqL1xuTWFwLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gIC8vIGV2ZW50XG4gIHRoaXMuJGVsLm9uKCdjbGljaycsICcubWFwX19ub2RlJywgZnVuY3Rpb24gKCkge1xuICAgIHZhciBpbmRleCA9IGpRdWVyeSh0aGlzKS5kYXRhKCdpbmRleCcpO1xuICAgIF90aGlzLmNhbGxiYWNrKGluZGV4KTtcbiAgfSk7XG5cbiAgLy8gY2VudGVyXG4gIHRoaXMuJGVsLmNzcygnbWFyZ2luLXRvcCcsIC0gdGhpcy4kZWwuaGVpZ2h0KCkgLyAyKTtcblxuICAvLyBub2Rlc1xuICB0aGlzLiRub2RlcyA9IHRoaXMuJGVsLmZpbmQoJy5tYXBfX25vZGUnKTtcbn07XG5cbi8qKlxuICogU2V0IG9uQ2xpY2sgY2FsbGJhY2tcbiAqXG4gKiBAbWV0aG9kIG9uQ2xpY2tcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFja11cbiAqL1xuTWFwLnByb3RvdHlwZS5vbkNsaWNrID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcbn07XG4gIFxuLyoqXG4gKiBTZXQgYWN0aXZlIG5vZGUgKC5pcy1hY3RpdmUpXG4gKlxuICogQG1ldGhvZCBzZXRBY3RpdmVcbiAqIEBwYXJhbSB7TnVtYmVyfSBbaW5kZXhdXG4gKi9cbk1hcC5wcm90b3R5cGUuc2V0QWN0aXZlID0gZnVuY3Rpb24gKGluZGV4KSB7XG4gIHRoaXMuJG5vZGVzLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgalF1ZXJ5KHRoaXMuJG5vZGVzW2luZGV4XSkuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xufTtcblxuLyoqXG4gKiBJbiBhbmltYXRpb25cbiAqXG4gKiBAbWV0aG9kIGluXG4gKi9cbk1hcC5wcm90b3R5cGUuaW4gPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuJG5vZGVzLmVhY2goZnVuY3Rpb24gKGkpIHtcbiAgICBqUXVlcnkodGhpcykuZGVsYXkoaSAqIDUwKS5hbmltYXRlKHsgcmlnaHQ6IDAsIG9wYWNpdHk6IDEgfSwgNTAwKTtcbiAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1hcDsiXX0=
},{}],20:[function(require,module,exports){
'use strict';

/**
 * Animated mouse
 *
 * @class Mouse
 * @constructor
 * @requires jQuery
 */
function Mouse ($el) {
  this.$el = $el;

  this.$wheel = this.$el.find('.mouse__wheel');
  this.$lines = this.$wheel.find('.mouse__wheel__lines');

  this.interval = null;
  this.y = 0;
}

/**
 * Animate wheel
 *
 * @method scroll
 */
Mouse.prototype.scroll = function () {
  this.y = this.y === 0 ? -80 : 0;

  this.$wheel.stop().animate({ opacity: 1 }, 400);

  var y = this.y;

  this.$lines.stop().animate({
      top: y + '%'
    }, 500, function () {
      this.$wheel.stop().animate({
        opacity: 0.2
      }, 300);
  }.bind(this));
};

/**
 * Start animation
 *
 * @method start
 */
Mouse.prototype.start = function () {
  this.interval = window.setInterval(function () {
    this.scroll();
  }.bind(this), 2000);
};

/**
 * Stop animation
 *
 * @method stop
 */
Mouse.prototype.stop = function () {
  window.clearInterval(this.interval);
};

module.exports = Mouse;
},{}],21:[function(require,module,exports){
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
},{}],22:[function(require,module,exports){
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
},{}],23:[function(require,module,exports){
(function (global){
'use strict';
  
var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);

var random = require('../utils/randomUtil');

/**
 * Background floating lines
 *
 * @class BackgroundLines
 * @constructor
 * @param {Object} [options]
 * @param {Number} [options.count=200] Number of lines
 * @param {Array} [options.rangeY=[-100, 100]] Y range for the random
 * @requires jQuery, THREE, random
 */
function BackgroundLines (options) {
  var parameters = jQuery.extend(BackgroundLines.defaultOptions, options);

  var group = new THREE.Object3D();

  var line = this.getLine();

  for (var i = 0; i < parameters.count; i++) {
    var lineCopy = line.clone();

    lineCopy.position.x = random(-20, 20);
    lineCopy.position.y = random(parameters.rangeY[0], parameters.rangeY[1]);
    lineCopy.position.z = random(-50, 50);

    group.add(lineCopy);
  }

  this.el = group;
  this.line = line;
}

BackgroundLines.defaultOptions = {
  count: 200,
  rangeY: [-100, 100]
};

/**
 * Get base line
 *
 * @method getLine
 * @return {THREE.Line} 
 */
BackgroundLines.prototype.getLine = function () {
  var material = new THREE.LineBasicMaterial();

  var geometry = new THREE.Geometry();
  geometry.vertices.push(new THREE.Vector3(0, 0.2, 0));
  geometry.vertices.push(new THREE.Vector3(0, 0, 0));

  var line = new THREE.Line(geometry, material);

  return line;  
};

/**
 * Update lines Y size
 *
 * @method updateY
 * @param {Number} [speed]
 */
BackgroundLines.prototype.updateY = function (speed) {
  this.line.geometry.vertices[0].y = speed + 0.2;
  this.line.geometry.verticesNeedUpdate = true;
  this.line.geometry.computeBoundingSphere();
};

/**
 * Update lines Z size
 *
 * @method updateZ
 * @param {Number} [speed]
 */
BackgroundLines.prototype.updateZ = function (speed) {
  this.line.geometry.vertices[0].z = speed;
  this.line.geometry.verticesNeedUpdate = true;
  this.line.geometry.computeBoundingSphere();
};

module.exports = BackgroundLines;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvb2JqZWN0czNEL0JhY2tncm91bmRMaW5lc09iamVjdDNELmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG4gIFxudmFyIGpRdWVyeSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydqUXVlcnknXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ2pRdWVyeSddIDogbnVsbCk7XG52YXIgVEhSRUUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snVEhSRUUnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1RIUkVFJ10gOiBudWxsKTtcblxudmFyIHJhbmRvbSA9IHJlcXVpcmUoJy4uL3V0aWxzL3JhbmRvbVV0aWwnKTtcblxuLyoqXG4gKiBCYWNrZ3JvdW5kIGZsb2F0aW5nIGxpbmVzXG4gKlxuICogQGNsYXNzIEJhY2tncm91bmRMaW5lc1xuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuY291bnQ9MjAwXSBOdW1iZXIgb2YgbGluZXNcbiAqIEBwYXJhbSB7QXJyYXl9IFtvcHRpb25zLnJhbmdlWT1bLTEwMCwgMTAwXV0gWSByYW5nZSBmb3IgdGhlIHJhbmRvbVxuICogQHJlcXVpcmVzIGpRdWVyeSwgVEhSRUUsIHJhbmRvbVxuICovXG5mdW5jdGlvbiBCYWNrZ3JvdW5kTGluZXMgKG9wdGlvbnMpIHtcbiAgdmFyIHBhcmFtZXRlcnMgPSBqUXVlcnkuZXh0ZW5kKEJhY2tncm91bmRMaW5lcy5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgdmFyIGdyb3VwID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XG5cbiAgdmFyIGxpbmUgPSB0aGlzLmdldExpbmUoKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHBhcmFtZXRlcnMuY291bnQ7IGkrKykge1xuICAgIHZhciBsaW5lQ29weSA9IGxpbmUuY2xvbmUoKTtcblxuICAgIGxpbmVDb3B5LnBvc2l0aW9uLnggPSByYW5kb20oLTIwLCAyMCk7XG4gICAgbGluZUNvcHkucG9zaXRpb24ueSA9IHJhbmRvbShwYXJhbWV0ZXJzLnJhbmdlWVswXSwgcGFyYW1ldGVycy5yYW5nZVlbMV0pO1xuICAgIGxpbmVDb3B5LnBvc2l0aW9uLnogPSByYW5kb20oLTUwLCA1MCk7XG5cbiAgICBncm91cC5hZGQobGluZUNvcHkpO1xuICB9XG5cbiAgdGhpcy5lbCA9IGdyb3VwO1xuICB0aGlzLmxpbmUgPSBsaW5lO1xufVxuXG5CYWNrZ3JvdW5kTGluZXMuZGVmYXVsdE9wdGlvbnMgPSB7XG4gIGNvdW50OiAyMDAsXG4gIHJhbmdlWTogWy0xMDAsIDEwMF1cbn07XG5cbi8qKlxuICogR2V0IGJhc2UgbGluZVxuICpcbiAqIEBtZXRob2QgZ2V0TGluZVxuICogQHJldHVybiB7VEhSRUUuTGluZX0gXG4gKi9cbkJhY2tncm91bmRMaW5lcy5wcm90b3R5cGUuZ2V0TGluZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG1hdGVyaWFsID0gbmV3IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsKCk7XG5cbiAgdmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkdlb21ldHJ5KCk7XG4gIGdlb21ldHJ5LnZlcnRpY2VzLnB1c2gobmV3IFRIUkVFLlZlY3RvcjMoMCwgMC4yLCAwKSk7XG4gIGdlb21ldHJ5LnZlcnRpY2VzLnB1c2gobmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMCkpO1xuXG4gIHZhciBsaW5lID0gbmV3IFRIUkVFLkxpbmUoZ2VvbWV0cnksIG1hdGVyaWFsKTtcblxuICByZXR1cm4gbGluZTsgIFxufTtcblxuLyoqXG4gKiBVcGRhdGUgbGluZXMgWSBzaXplXG4gKlxuICogQG1ldGhvZCB1cGRhdGVZXG4gKiBAcGFyYW0ge051bWJlcn0gW3NwZWVkXVxuICovXG5CYWNrZ3JvdW5kTGluZXMucHJvdG90eXBlLnVwZGF0ZVkgPSBmdW5jdGlvbiAoc3BlZWQpIHtcbiAgdGhpcy5saW5lLmdlb21ldHJ5LnZlcnRpY2VzWzBdLnkgPSBzcGVlZCArIDAuMjtcbiAgdGhpcy5saW5lLmdlb21ldHJ5LnZlcnRpY2VzTmVlZFVwZGF0ZSA9IHRydWU7XG4gIHRoaXMubGluZS5nZW9tZXRyeS5jb21wdXRlQm91bmRpbmdTcGhlcmUoKTtcbn07XG5cbi8qKlxuICogVXBkYXRlIGxpbmVzIFogc2l6ZVxuICpcbiAqIEBtZXRob2QgdXBkYXRlWlxuICogQHBhcmFtIHtOdW1iZXJ9IFtzcGVlZF1cbiAqL1xuQmFja2dyb3VuZExpbmVzLnByb3RvdHlwZS51cGRhdGVaID0gZnVuY3Rpb24gKHNwZWVkKSB7XG4gIHRoaXMubGluZS5nZW9tZXRyeS52ZXJ0aWNlc1swXS56ID0gc3BlZWQ7XG4gIHRoaXMubGluZS5nZW9tZXRyeS52ZXJ0aWNlc05lZWRVcGRhdGUgPSB0cnVlO1xuICB0aGlzLmxpbmUuZ2VvbWV0cnkuY29tcHV0ZUJvdW5kaW5nU3BoZXJlKCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhY2tncm91bmRMaW5lczsiXX0=
},{"../utils/randomUtil":65}],24:[function(require,module,exports){
(function (global){
/* jshint shadow: true */

'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);

var random = require('../utils/randomUtil');

/**
 * Background floating particles/strips
 *
 * @class BackgroundParticles
 * @constructor
 * @param {Object} [options]
 * @param {Object} [strips=true] Strips?
 * @param {Number} [options.count=1000] Number of particles
 * @param {Number} [options.particleSize=0.5] Size of a particle
 * @param {Array} [options.rangeY=[-100, 100]] Y range for positions
 * @requires jQuery, THREE, random
 */
function BackgroundParticles (options) {
  var parameters = jQuery.extend(BackgroundParticles.defaultOptions, options);

  var material = new THREE.PointCloudMaterial({
    size: parameters.particleSize
  });

  var geometry = new THREE.Geometry();

  for (var i = 0; i < parameters.count; i++) {
    var particle = new THREE.Vector3(
      random(-50, 50),
      random(parameters.rangeY[0], parameters.rangeY[1]),
      random(-50, 100)
    );

    geometry.vertices.push(particle);
  }

  var group = new THREE.Object3D();

  group.add(new THREE.PointCloud(geometry, material));
  
  if (parameters.strips) {
    var stripsGeometry = new THREE.Geometry();

    var stripGeometry = new THREE.PlaneGeometry(5, 2);
    var stripMaterial = new THREE.MeshLambertMaterial({ color: '#666666' });

    for (var i = 0; i < parameters.stripsCount; i++) {
      var stripMesh = new THREE.Mesh(stripGeometry, stripMaterial);
      stripMesh.position.set(
        random(-50, 50),
        random(parameters.rangeY[0], parameters.rangeY[1]),
        random(-50, 0)
      );

      stripMesh.scale.set(
        random(0.5, 1),
        random(0.1, 1),
        1
      );

      stripMesh.updateMatrix();
      stripsGeometry.merge(stripMesh.geometry, stripMesh.matrix);
    } 

    var totalMesh = new THREE.Mesh(stripsGeometry, stripMaterial);

    group.add(totalMesh);
  }

  this.el = group;
}

BackgroundParticles.defaultOptions = {
  count: 1000,
  particleSize: 0.5,
  rangeY: [-100, 100],
  strips: true,
  stripsCount: 20
};

module.exports = BackgroundParticles;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvb2JqZWN0czNEL0JhY2tncm91bmRQYXJ0aWNsZXNPYmplY3QzRC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIi8qIGpzaGludCBzaGFkb3c6IHRydWUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgalF1ZXJ5ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ2pRdWVyeSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnalF1ZXJ5J10gOiBudWxsKTtcbnZhciBUSFJFRSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydUSFJFRSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnVEhSRUUnXSA6IG51bGwpO1xuXG52YXIgcmFuZG9tID0gcmVxdWlyZSgnLi4vdXRpbHMvcmFuZG9tVXRpbCcpO1xuXG4vKipcbiAqIEJhY2tncm91bmQgZmxvYXRpbmcgcGFydGljbGVzL3N0cmlwc1xuICpcbiAqIEBjbGFzcyBCYWNrZ3JvdW5kUGFydGljbGVzXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAqIEBwYXJhbSB7T2JqZWN0fSBbc3RyaXBzPXRydWVdIFN0cmlwcz9cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5jb3VudD0xMDAwXSBOdW1iZXIgb2YgcGFydGljbGVzXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMucGFydGljbGVTaXplPTAuNV0gU2l6ZSBvZiBhIHBhcnRpY2xlXG4gKiBAcGFyYW0ge0FycmF5fSBbb3B0aW9ucy5yYW5nZVk9Wy0xMDAsIDEwMF1dIFkgcmFuZ2UgZm9yIHBvc2l0aW9uc1xuICogQHJlcXVpcmVzIGpRdWVyeSwgVEhSRUUsIHJhbmRvbVxuICovXG5mdW5jdGlvbiBCYWNrZ3JvdW5kUGFydGljbGVzIChvcHRpb25zKSB7XG4gIHZhciBwYXJhbWV0ZXJzID0galF1ZXJ5LmV4dGVuZChCYWNrZ3JvdW5kUGFydGljbGVzLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcblxuICB2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuUG9pbnRDbG91ZE1hdGVyaWFsKHtcbiAgICBzaXplOiBwYXJhbWV0ZXJzLnBhcnRpY2xlU2l6ZVxuICB9KTtcblxuICB2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuR2VvbWV0cnkoKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHBhcmFtZXRlcnMuY291bnQ7IGkrKykge1xuICAgIHZhciBwYXJ0aWNsZSA9IG5ldyBUSFJFRS5WZWN0b3IzKFxuICAgICAgcmFuZG9tKC01MCwgNTApLFxuICAgICAgcmFuZG9tKHBhcmFtZXRlcnMucmFuZ2VZWzBdLCBwYXJhbWV0ZXJzLnJhbmdlWVsxXSksXG4gICAgICByYW5kb20oLTUwLCAxMDApXG4gICAgKTtcblxuICAgIGdlb21ldHJ5LnZlcnRpY2VzLnB1c2gocGFydGljbGUpO1xuICB9XG5cbiAgdmFyIGdyb3VwID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XG5cbiAgZ3JvdXAuYWRkKG5ldyBUSFJFRS5Qb2ludENsb3VkKGdlb21ldHJ5LCBtYXRlcmlhbCkpO1xuICBcbiAgaWYgKHBhcmFtZXRlcnMuc3RyaXBzKSB7XG4gICAgdmFyIHN0cmlwc0dlb21ldHJ5ID0gbmV3IFRIUkVFLkdlb21ldHJ5KCk7XG5cbiAgICB2YXIgc3RyaXBHZW9tZXRyeSA9IG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KDUsIDIpO1xuICAgIHZhciBzdHJpcE1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoeyBjb2xvcjogJyM2NjY2NjYnIH0pO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXJhbWV0ZXJzLnN0cmlwc0NvdW50OyBpKyspIHtcbiAgICAgIHZhciBzdHJpcE1lc2ggPSBuZXcgVEhSRUUuTWVzaChzdHJpcEdlb21ldHJ5LCBzdHJpcE1hdGVyaWFsKTtcbiAgICAgIHN0cmlwTWVzaC5wb3NpdGlvbi5zZXQoXG4gICAgICAgIHJhbmRvbSgtNTAsIDUwKSxcbiAgICAgICAgcmFuZG9tKHBhcmFtZXRlcnMucmFuZ2VZWzBdLCBwYXJhbWV0ZXJzLnJhbmdlWVsxXSksXG4gICAgICAgIHJhbmRvbSgtNTAsIDApXG4gICAgICApO1xuXG4gICAgICBzdHJpcE1lc2guc2NhbGUuc2V0KFxuICAgICAgICByYW5kb20oMC41LCAxKSxcbiAgICAgICAgcmFuZG9tKDAuMSwgMSksXG4gICAgICAgIDFcbiAgICAgICk7XG5cbiAgICAgIHN0cmlwTWVzaC51cGRhdGVNYXRyaXgoKTtcbiAgICAgIHN0cmlwc0dlb21ldHJ5Lm1lcmdlKHN0cmlwTWVzaC5nZW9tZXRyeSwgc3RyaXBNZXNoLm1hdHJpeCk7XG4gICAgfSBcblxuICAgIHZhciB0b3RhbE1lc2ggPSBuZXcgVEhSRUUuTWVzaChzdHJpcHNHZW9tZXRyeSwgc3RyaXBNYXRlcmlhbCk7XG5cbiAgICBncm91cC5hZGQodG90YWxNZXNoKTtcbiAgfVxuXG4gIHRoaXMuZWwgPSBncm91cDtcbn1cblxuQmFja2dyb3VuZFBhcnRpY2xlcy5kZWZhdWx0T3B0aW9ucyA9IHtcbiAgY291bnQ6IDEwMDAsXG4gIHBhcnRpY2xlU2l6ZTogMC41LFxuICByYW5nZVk6IFstMTAwLCAxMDBdLFxuICBzdHJpcHM6IHRydWUsXG4gIHN0cmlwc0NvdW50OiAyMFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYWNrZ3JvdW5kUGFydGljbGVzOyJdfQ==
},{"../utils/randomUtil":65}],25:[function(require,module,exports){
(function (global){
'use strict';

var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var TweenLite = (typeof window !== "undefined" ? window['TweenLite'] : typeof global !== "undefined" ? global['TweenLite'] : null);

var SOUNDS = require('../modules/soundsModule');
var random = require('../utils/randomUtil');
var yoyo = require('../utils/yoyoUtil');
var glitchMaterial = require('../materials/glitchMaterial');

/**
 * Animated ball
 *
 * @class Ball
 * @constructor
 * @requires THREE, TweenLite, SOUNDS, random, yoyo, glitchMaterial
 */
function Ball () {
  var texture = THREE.ImageUtils.loadTexture('./app/public/img/texture-ball.png');
  var textureAlpha = THREE.ImageUtils.loadTexture('./app/public/img/texture-ballAlpha.png');
  texture.wrapS = textureAlpha.wrapS = THREE.RepeatWrapping;
  texture.wrapT = textureAlpha.wrapT = THREE.RepeatWrapping;
  texture.repeat.x = textureAlpha.repeat.x = 0;
  texture.repeat.y = textureAlpha.repeat.y = 0;

  var materialStripe = new THREE.MeshLambertMaterial({
    map: texture,
    color: '#ffffff',
    emissive: '#0a0a0a',
    depthWrite: false,
    depthTest: true,
    transparent: true
  });

  var geometry = new THREE.SphereGeometry(10, 30, 30);

  var mesh = new THREE.Mesh(geometry, materialStripe);

  var colorA = new THREE.Color('#000000');
  var colorB = new THREE.Color('#ffffff');

  // Make the ball blink once
  function blink () {
    materialStripe.emissive = colorB;
    materialStripe.color = colorA;

    TweenLite.delayedCall(random(0.1, 1), function () {
      materialStripe.emissive = colorA;
      materialStripe.color = colorB;
    });
  }

  // Make the ball glitch once
  function glitch () {
    mesh.material = glitchMaterial;

    SOUNDS.whitenoise.play();

    TweenLite.delayedCall(random(0.2, 1), function () {
      mesh.material = materialStripe;
      SOUNDS.whitenoise.stop();
    });
  }
  
  var inTween = TweenLite.to({ y: 40, opacity: 0 }, 1.5, { y: 0, opacity: 1, paused: true,
    onUpdate: function () {
      mesh.position.y = this.target.y;
      materialStripe.opacity = this.target.opacity;  
    }
  });

  var appearTweenSteps = 6;
  var appearTweenCurrent = 0;
  var repeatValues = [1, 10, 30, 0, 1, 5];

  var appearTween = TweenLite.to({}, 0.1, { paused: true,
      onComplete: function () {
        appearTweenCurrent++;

        if (appearTweenCurrent < appearTweenSteps) {
          mesh.material.map = textureAlpha;
          textureAlpha.repeat.set(1, repeatValues[appearTweenCurrent]);

          this.duration(0.2);
          this.restart();
        } else {
          mesh.material.map = texture;
          appearTweenCurrent = 0;
        }
      }
    });

  var rotateY = 0;
  var rotateX = 0;

  var idleTweens = {
    rotate: TweenLite.to({ textureRepeat: 3 }, 5, { textureRepeat: 8, paused: true,
        onUpdate: function () {
          texture.repeat.set(1, this.target.textureRepeat);

          mesh.rotation.y = rotateY;
          mesh.rotation.x = rotateX;

          rotateY += 0.01;
          rotateX += 0.02;
        },
        onComplete: yoyo,
        onReverseComplete: yoyo
      }),

    glitch: TweenLite.to({}, random(0.1, 5), { paused: true,
        onComplete: function () {
          glitch();
          this.duration(random(0.1, 5));
          this.restart();
        }
      }),

    blink: TweenLite.to({}, random(0.1, 5), { paused: true,
        onComplete: function () {
          blink();
          this.duration(random(0.1, 5));
          this.restart();
        }
      })
  };

  this.el = mesh;

  this.in = function () {
    inTween.play();
    appearTween.restart();
  };

  this.out = function () {
    inTween.reverse();
  };

  this.start = function () {
    idleTweens.rotate.resume();
    // idleTweens.glitch.resume();
    idleTweens.blink.resume();
  };

  this.stop = function () {
    idleTweens.rotate.pause();
    // idleTweens.glitch.pause();
    idleTweens.blink.pause();
  };
}

module.exports = Ball;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvb2JqZWN0czNEL0JhbGxPYmplY3QzRC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgVEhSRUUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snVEhSRUUnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1RIUkVFJ10gOiBudWxsKTtcbnZhciBUd2VlbkxpdGUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snVHdlZW5MaXRlJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydUd2VlbkxpdGUnXSA6IG51bGwpO1xuXG52YXIgU09VTkRTID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9zb3VuZHNNb2R1bGUnKTtcbnZhciByYW5kb20gPSByZXF1aXJlKCcuLi91dGlscy9yYW5kb21VdGlsJyk7XG52YXIgeW95byA9IHJlcXVpcmUoJy4uL3V0aWxzL3lveW9VdGlsJyk7XG52YXIgZ2xpdGNoTWF0ZXJpYWwgPSByZXF1aXJlKCcuLi9tYXRlcmlhbHMvZ2xpdGNoTWF0ZXJpYWwnKTtcblxuLyoqXG4gKiBBbmltYXRlZCBiYWxsXG4gKlxuICogQGNsYXNzIEJhbGxcbiAqIEBjb25zdHJ1Y3RvclxuICogQHJlcXVpcmVzIFRIUkVFLCBUd2VlbkxpdGUsIFNPVU5EUywgcmFuZG9tLCB5b3lvLCBnbGl0Y2hNYXRlcmlhbFxuICovXG5mdW5jdGlvbiBCYWxsICgpIHtcbiAgdmFyIHRleHR1cmUgPSBUSFJFRS5JbWFnZVV0aWxzLmxvYWRUZXh0dXJlKCcuL2FwcC9wdWJsaWMvaW1nL3RleHR1cmUtYmFsbC5wbmcnKTtcbiAgdmFyIHRleHR1cmVBbHBoYSA9IFRIUkVFLkltYWdlVXRpbHMubG9hZFRleHR1cmUoJy4vYXBwL3B1YmxpYy9pbWcvdGV4dHVyZS1iYWxsQWxwaGEucG5nJyk7XG4gIHRleHR1cmUud3JhcFMgPSB0ZXh0dXJlQWxwaGEud3JhcFMgPSBUSFJFRS5SZXBlYXRXcmFwcGluZztcbiAgdGV4dHVyZS53cmFwVCA9IHRleHR1cmVBbHBoYS53cmFwVCA9IFRIUkVFLlJlcGVhdFdyYXBwaW5nO1xuICB0ZXh0dXJlLnJlcGVhdC54ID0gdGV4dHVyZUFscGhhLnJlcGVhdC54ID0gMDtcbiAgdGV4dHVyZS5yZXBlYXQueSA9IHRleHR1cmVBbHBoYS5yZXBlYXQueSA9IDA7XG5cbiAgdmFyIG1hdGVyaWFsU3RyaXBlID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoe1xuICAgIG1hcDogdGV4dHVyZSxcbiAgICBjb2xvcjogJyNmZmZmZmYnLFxuICAgIGVtaXNzaXZlOiAnIzBhMGEwYScsXG4gICAgZGVwdGhXcml0ZTogZmFsc2UsXG4gICAgZGVwdGhUZXN0OiB0cnVlLFxuICAgIHRyYW5zcGFyZW50OiB0cnVlXG4gIH0pO1xuXG4gIHZhciBnZW9tZXRyeSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeSgxMCwgMzAsIDMwKTtcblxuICB2YXIgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbFN0cmlwZSk7XG5cbiAgdmFyIGNvbG9yQSA9IG5ldyBUSFJFRS5Db2xvcignIzAwMDAwMCcpO1xuICB2YXIgY29sb3JCID0gbmV3IFRIUkVFLkNvbG9yKCcjZmZmZmZmJyk7XG5cbiAgLy8gTWFrZSB0aGUgYmFsbCBibGluayBvbmNlXG4gIGZ1bmN0aW9uIGJsaW5rICgpIHtcbiAgICBtYXRlcmlhbFN0cmlwZS5lbWlzc2l2ZSA9IGNvbG9yQjtcbiAgICBtYXRlcmlhbFN0cmlwZS5jb2xvciA9IGNvbG9yQTtcblxuICAgIFR3ZWVuTGl0ZS5kZWxheWVkQ2FsbChyYW5kb20oMC4xLCAxKSwgZnVuY3Rpb24gKCkge1xuICAgICAgbWF0ZXJpYWxTdHJpcGUuZW1pc3NpdmUgPSBjb2xvckE7XG4gICAgICBtYXRlcmlhbFN0cmlwZS5jb2xvciA9IGNvbG9yQjtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIE1ha2UgdGhlIGJhbGwgZ2xpdGNoIG9uY2VcbiAgZnVuY3Rpb24gZ2xpdGNoICgpIHtcbiAgICBtZXNoLm1hdGVyaWFsID0gZ2xpdGNoTWF0ZXJpYWw7XG5cbiAgICBTT1VORFMud2hpdGVub2lzZS5wbGF5KCk7XG5cbiAgICBUd2VlbkxpdGUuZGVsYXllZENhbGwocmFuZG9tKDAuMiwgMSksIGZ1bmN0aW9uICgpIHtcbiAgICAgIG1lc2gubWF0ZXJpYWwgPSBtYXRlcmlhbFN0cmlwZTtcbiAgICAgIFNPVU5EUy53aGl0ZW5vaXNlLnN0b3AoKTtcbiAgICB9KTtcbiAgfVxuICBcbiAgdmFyIGluVHdlZW4gPSBUd2VlbkxpdGUudG8oeyB5OiA0MCwgb3BhY2l0eTogMCB9LCAxLjUsIHsgeTogMCwgb3BhY2l0eTogMSwgcGF1c2VkOiB0cnVlLFxuICAgIG9uVXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICBtZXNoLnBvc2l0aW9uLnkgPSB0aGlzLnRhcmdldC55O1xuICAgICAgbWF0ZXJpYWxTdHJpcGUub3BhY2l0eSA9IHRoaXMudGFyZ2V0Lm9wYWNpdHk7ICBcbiAgICB9XG4gIH0pO1xuXG4gIHZhciBhcHBlYXJUd2VlblN0ZXBzID0gNjtcbiAgdmFyIGFwcGVhclR3ZWVuQ3VycmVudCA9IDA7XG4gIHZhciByZXBlYXRWYWx1ZXMgPSBbMSwgMTAsIDMwLCAwLCAxLCA1XTtcblxuICB2YXIgYXBwZWFyVHdlZW4gPSBUd2VlbkxpdGUudG8oe30sIDAuMSwgeyBwYXVzZWQ6IHRydWUsXG4gICAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGFwcGVhclR3ZWVuQ3VycmVudCsrO1xuXG4gICAgICAgIGlmIChhcHBlYXJUd2VlbkN1cnJlbnQgPCBhcHBlYXJUd2VlblN0ZXBzKSB7XG4gICAgICAgICAgbWVzaC5tYXRlcmlhbC5tYXAgPSB0ZXh0dXJlQWxwaGE7XG4gICAgICAgICAgdGV4dHVyZUFscGhhLnJlcGVhdC5zZXQoMSwgcmVwZWF0VmFsdWVzW2FwcGVhclR3ZWVuQ3VycmVudF0pO1xuXG4gICAgICAgICAgdGhpcy5kdXJhdGlvbigwLjIpO1xuICAgICAgICAgIHRoaXMucmVzdGFydCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1lc2gubWF0ZXJpYWwubWFwID0gdGV4dHVyZTtcbiAgICAgICAgICBhcHBlYXJUd2VlbkN1cnJlbnQgPSAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgdmFyIHJvdGF0ZVkgPSAwO1xuICB2YXIgcm90YXRlWCA9IDA7XG5cbiAgdmFyIGlkbGVUd2VlbnMgPSB7XG4gICAgcm90YXRlOiBUd2VlbkxpdGUudG8oeyB0ZXh0dXJlUmVwZWF0OiAzIH0sIDUsIHsgdGV4dHVyZVJlcGVhdDogOCwgcGF1c2VkOiB0cnVlLFxuICAgICAgICBvblVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRleHR1cmUucmVwZWF0LnNldCgxLCB0aGlzLnRhcmdldC50ZXh0dXJlUmVwZWF0KTtcblxuICAgICAgICAgIG1lc2gucm90YXRpb24ueSA9IHJvdGF0ZVk7XG4gICAgICAgICAgbWVzaC5yb3RhdGlvbi54ID0gcm90YXRlWDtcblxuICAgICAgICAgIHJvdGF0ZVkgKz0gMC4wMTtcbiAgICAgICAgICByb3RhdGVYICs9IDAuMDI7XG4gICAgICAgIH0sXG4gICAgICAgIG9uQ29tcGxldGU6IHlveW8sXG4gICAgICAgIG9uUmV2ZXJzZUNvbXBsZXRlOiB5b3lvXG4gICAgICB9KSxcblxuICAgIGdsaXRjaDogVHdlZW5MaXRlLnRvKHt9LCByYW5kb20oMC4xLCA1KSwgeyBwYXVzZWQ6IHRydWUsXG4gICAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBnbGl0Y2goKTtcbiAgICAgICAgICB0aGlzLmR1cmF0aW9uKHJhbmRvbSgwLjEsIDUpKTtcbiAgICAgICAgICB0aGlzLnJlc3RhcnQoKTtcbiAgICAgICAgfVxuICAgICAgfSksXG5cbiAgICBibGluazogVHdlZW5MaXRlLnRvKHt9LCByYW5kb20oMC4xLCA1KSwgeyBwYXVzZWQ6IHRydWUsXG4gICAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBibGluaygpO1xuICAgICAgICAgIHRoaXMuZHVyYXRpb24ocmFuZG9tKDAuMSwgNSkpO1xuICAgICAgICAgIHRoaXMucmVzdGFydCgpO1xuICAgICAgICB9XG4gICAgICB9KVxuICB9O1xuXG4gIHRoaXMuZWwgPSBtZXNoO1xuXG4gIHRoaXMuaW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgaW5Ud2Vlbi5wbGF5KCk7XG4gICAgYXBwZWFyVHdlZW4ucmVzdGFydCgpO1xuICB9O1xuXG4gIHRoaXMub3V0ID0gZnVuY3Rpb24gKCkge1xuICAgIGluVHdlZW4ucmV2ZXJzZSgpO1xuICB9O1xuXG4gIHRoaXMuc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWRsZVR3ZWVucy5yb3RhdGUucmVzdW1lKCk7XG4gICAgLy8gaWRsZVR3ZWVucy5nbGl0Y2gucmVzdW1lKCk7XG4gICAgaWRsZVR3ZWVucy5ibGluay5yZXN1bWUoKTtcbiAgfTtcblxuICB0aGlzLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWRsZVR3ZWVucy5yb3RhdGUucGF1c2UoKTtcbiAgICAvLyBpZGxlVHdlZW5zLmdsaXRjaC5wYXVzZSgpO1xuICAgIGlkbGVUd2VlbnMuYmxpbmsucGF1c2UoKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCYWxsOyJdfQ==
},{"../materials/glitchMaterial":8,"../modules/soundsModule":14,"../utils/randomUtil":65,"../utils/yoyoUtil":66}],26:[function(require,module,exports){
(function (global){
'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var TweenLite = (typeof window !== "undefined" ? window['TweenLite'] : typeof global !== "undefined" ? global['TweenLite'] : null);

var random = require('../utils/randomUtil');
var yoyo = require('../utils/yoyoUtil');

/**
 * Light beam
 *
 * @class Beam
 * @constructor
 * @param {Object} [options]
 * @param {String} [options.color='#ffffff'] Beam color
 * @param {Number} [options.height=15] Beam expanded height
 * @param {Number} [options.width=2] Beam width
 * @param {Number} [options.cubeSize=0.5] Extremity cube size
 * @param {Number} [options.delay=0] Animations delay
 * @requires jQuery, THREE, TweenLite, random, yoyo
 */
function Beam (options) {
  var parameters = jQuery.extend(Beam.defaultOptions, options);

  var width = parameters.width;
  var height = parameters.height;

  var group = new THREE.Object3D();

  var baseMaterial = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    depthWrite: false,
    depthTest: true,
    transparent: true,
    opacity: 1,
    blending: THREE.AdditiveBlending,
    color: parameters.color
  });

  var bodyTexture = THREE.ImageUtils.loadTexture('./app/public/img/texture-laserBody.png');
  var capTexture = THREE.ImageUtils.loadTexture('./app/public/img/texture-laserCap.png');
  var flareTexture = THREE.ImageUtils.loadTexture('./app/public/img/texture-laserFlare.png');

  var lineMaterial = new THREE.LineBasicMaterial({ color: parameters.color });
  var bodyMaterial = baseMaterial.clone();
  var capMaterial = baseMaterial.clone();
  var flareMaterial = baseMaterial.clone();
  var cubeMaterial = baseMaterial.clone();

  bodyMaterial.map = bodyTexture;
  capMaterial.map = capTexture;
  flareMaterial.map = flareTexture;

  var bodyGeometry = new THREE.PlaneGeometry(width, height, 1, 1);
  var capGeometry = new THREE.PlaneGeometry(width, width, 1, 1);
  var flareGeometry = new THREE.PlaneGeometry(10, 10, 1, 1);
  var movingFlareGeometry = new THREE.PlaneGeometry(10, 40);
  var cubeGeometry = new THREE.BoxGeometry(
    parameters.cubeSize,
    parameters.cubeSize,
    parameters.cubeSize
  );

  // set height 0
  bodyGeometry.vertices[2].y = bodyGeometry.vertices[3].y = (height / 2) + (width / 2);
  bodyGeometry.verticesNeedUpdate = true;
  bodyGeometry.computeBoundingSphere();

  var bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
  var capMeshTop = new THREE.Mesh(capGeometry, capMaterial);
  var capMeshBottom = capMeshTop.clone();
  var flareMesh = new THREE.Mesh(flareGeometry, flareMaterial);
  var cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);

  bodyMesh.position.y = 0;
  capMeshTop.position.y = (height / 2) + (width / 2);
  capMeshBottom.position.y = -(height / 2) - (width / 2);
  capMeshBottom.rotation.z = Math.PI;
  flareMesh.position.y = -(height / 2) - (width / 2);

  // line
  var lineGeometry = new THREE.Geometry();
  lineGeometry.vertices.push(new THREE.Vector3(0, (height / 2) + (width / 2), 0));
  lineGeometry.vertices.push(new THREE.Vector3(0, (height / 2) + (width / 2), 0));

  var lineMesh = new THREE.Line(lineGeometry, lineMaterial);

  group.add(lineMesh);

  // body 
  var body = new THREE.Object3D();

  var bodyPlane = new THREE.Object3D();

  bodyPlane.add(bodyMesh);
  bodyPlane.add(capMeshTop);
  bodyPlane.add(capMeshBottom);

  body.add(bodyPlane);

  group.add(body);

  // flare
  group.add(flareMesh);

  // moving flare
  var movingFlareMaterial = flareMaterial.clone();
  var movingFlareMesh = new THREE.Mesh(movingFlareGeometry, movingFlareMaterial);
  movingFlareMesh.scale.x = 3;
  group.add(movingFlareMesh);

  // cube group
  var cubeGroup = new THREE.Object3D();
  cubeGroup.add(cubeMesh);
  cubeGroup.add(movingFlareMesh);
  group.add(cubeGroup);

  // animations
  var cache = { y: (height / 2) + (width / 2) };

  function positionUpdate () {
    /*jshint validthis: true */
    
    var extremity = this.target.y - (width /2);

    lineGeometry.vertices[1].y = extremity;
    lineGeometry.verticesNeedUpdate = true;
    lineGeometry.computeBoundingSphere();

    bodyGeometry.vertices[2].y = bodyGeometry.vertices[3].y = this.target.y;
    bodyGeometry.verticesNeedUpdate = true;
    bodyGeometry.computeBoundingSphere();

    capMeshBottom.position.y = extremity;

    flareMesh.position.y = extremity;
    cubeGroup.position.y = extremity;
  }

  var idleTweens = {
    flare: TweenLite.to({ scale: 1, opacity: 1 }, random(1, 2), { scale: 2, opacity: 0.6, paused: true,
        onUpdate: function () {
          flareMesh.scale.set(this.target.scale, this.target.scale, 1);
          flareMaterial.opacity = this.target.opacity;
        },
        onComplete: yoyo,
        onReverseComplete: yoyo
      }),

    movingflare: TweenLite.to({ y: 0, scale: 3, opacity: 1 }, random(2, 6), { y: 30, scale: 1, opacity: 0, paused: true,
        onUpdate: function () {
          movingFlareMesh.position.y = this.target.y;
          movingFlareMesh.scale.x = this.target.scale;
          movingFlareMaterial.opacity = this.target.opacity;
        },
        onComplete: yoyo,
        onReverseComplete: yoyo
      }),

    body: TweenLite.to({ opacity: 1 }, random(1, 2), { opacity: 0.5,
        onUpdate: function () {
          bodyMaterial.opacity = capMaterial.opacity = this.target.opacity;
        },
        onComplete: yoyo,
        onReverseComplete: yoyo
      })
  };

  this.el = group;

  var delay = parameters.delay;

  this.in = function () {
    TweenLite.to(cache, 1, { y: -5, delay: delay, onUpdate: positionUpdate });
  };

  this.out = function (way) {
    var y = way === 'up' ? ((height / 2) + (width / 2)) - 1 : -70;
    TweenLite.to(cache, 1, { y: y, delay: delay, onUpdate: positionUpdate });
  };

  this.start = function () {
    idleTweens.flare.resume();
    idleTweens.movingflare.resume();
    idleTweens.body.resume();
  };

  this.stop = function () {
    idleTweens.flare.pause();
    idleTweens.movingflare.pause();
    idleTweens.body.pause();
  };
}

Beam.defaultOptions = {
  color: '#ffffff',
    height: 15,
    width: 2,
    cubeSize: 0.5,
    delay: 0
  };

module.exports = Beam;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvb2JqZWN0czNEL0JlYW1PYmplY3QzRC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBqUXVlcnkgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snalF1ZXJ5J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydqUXVlcnknXSA6IG51bGwpO1xudmFyIFRIUkVFID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1RIUkVFJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydUSFJFRSddIDogbnVsbCk7XG52YXIgVHdlZW5MaXRlID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1R3ZWVuTGl0ZSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnVHdlZW5MaXRlJ10gOiBudWxsKTtcblxudmFyIHJhbmRvbSA9IHJlcXVpcmUoJy4uL3V0aWxzL3JhbmRvbVV0aWwnKTtcbnZhciB5b3lvID0gcmVxdWlyZSgnLi4vdXRpbHMveW95b1V0aWwnKTtcblxuLyoqXG4gKiBMaWdodCBiZWFtXG4gKlxuICogQGNsYXNzIEJlYW1cbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yPScjZmZmZmZmJ10gQmVhbSBjb2xvclxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmhlaWdodD0xNV0gQmVhbSBleHBhbmRlZCBoZWlnaHRcbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy53aWR0aD0yXSBCZWFtIHdpZHRoXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuY3ViZVNpemU9MC41XSBFeHRyZW1pdHkgY3ViZSBzaXplXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuZGVsYXk9MF0gQW5pbWF0aW9ucyBkZWxheVxuICogQHJlcXVpcmVzIGpRdWVyeSwgVEhSRUUsIFR3ZWVuTGl0ZSwgcmFuZG9tLCB5b3lvXG4gKi9cbmZ1bmN0aW9uIEJlYW0gKG9wdGlvbnMpIHtcbiAgdmFyIHBhcmFtZXRlcnMgPSBqUXVlcnkuZXh0ZW5kKEJlYW0uZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gIHZhciB3aWR0aCA9IHBhcmFtZXRlcnMud2lkdGg7XG4gIHZhciBoZWlnaHQgPSBwYXJhbWV0ZXJzLmhlaWdodDtcblxuICB2YXIgZ3JvdXAgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKTtcblxuICB2YXIgYmFzZU1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtcbiAgICBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlLFxuICAgIGRlcHRoV3JpdGU6IGZhbHNlLFxuICAgIGRlcHRoVGVzdDogdHJ1ZSxcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcbiAgICBvcGFjaXR5OiAxLFxuICAgIGJsZW5kaW5nOiBUSFJFRS5BZGRpdGl2ZUJsZW5kaW5nLFxuICAgIGNvbG9yOiBwYXJhbWV0ZXJzLmNvbG9yXG4gIH0pO1xuXG4gIHZhciBib2R5VGV4dHVyZSA9IFRIUkVFLkltYWdlVXRpbHMubG9hZFRleHR1cmUoJy4vYXBwL3B1YmxpYy9pbWcvdGV4dHVyZS1sYXNlckJvZHkucG5nJyk7XG4gIHZhciBjYXBUZXh0dXJlID0gVEhSRUUuSW1hZ2VVdGlscy5sb2FkVGV4dHVyZSgnLi9hcHAvcHVibGljL2ltZy90ZXh0dXJlLWxhc2VyQ2FwLnBuZycpO1xuICB2YXIgZmxhcmVUZXh0dXJlID0gVEhSRUUuSW1hZ2VVdGlscy5sb2FkVGV4dHVyZSgnLi9hcHAvcHVibGljL2ltZy90ZXh0dXJlLWxhc2VyRmxhcmUucG5nJyk7XG5cbiAgdmFyIGxpbmVNYXRlcmlhbCA9IG5ldyBUSFJFRS5MaW5lQmFzaWNNYXRlcmlhbCh7IGNvbG9yOiBwYXJhbWV0ZXJzLmNvbG9yIH0pO1xuICB2YXIgYm9keU1hdGVyaWFsID0gYmFzZU1hdGVyaWFsLmNsb25lKCk7XG4gIHZhciBjYXBNYXRlcmlhbCA9IGJhc2VNYXRlcmlhbC5jbG9uZSgpO1xuICB2YXIgZmxhcmVNYXRlcmlhbCA9IGJhc2VNYXRlcmlhbC5jbG9uZSgpO1xuICB2YXIgY3ViZU1hdGVyaWFsID0gYmFzZU1hdGVyaWFsLmNsb25lKCk7XG5cbiAgYm9keU1hdGVyaWFsLm1hcCA9IGJvZHlUZXh0dXJlO1xuICBjYXBNYXRlcmlhbC5tYXAgPSBjYXBUZXh0dXJlO1xuICBmbGFyZU1hdGVyaWFsLm1hcCA9IGZsYXJlVGV4dHVyZTtcblxuICB2YXIgYm9keUdlb21ldHJ5ID0gbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkod2lkdGgsIGhlaWdodCwgMSwgMSk7XG4gIHZhciBjYXBHZW9tZXRyeSA9IG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KHdpZHRoLCB3aWR0aCwgMSwgMSk7XG4gIHZhciBmbGFyZUdlb21ldHJ5ID0gbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkoMTAsIDEwLCAxLCAxKTtcbiAgdmFyIG1vdmluZ0ZsYXJlR2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSgxMCwgNDApO1xuICB2YXIgY3ViZUdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KFxuICAgIHBhcmFtZXRlcnMuY3ViZVNpemUsXG4gICAgcGFyYW1ldGVycy5jdWJlU2l6ZSxcbiAgICBwYXJhbWV0ZXJzLmN1YmVTaXplXG4gICk7XG5cbiAgLy8gc2V0IGhlaWdodCAwXG4gIGJvZHlHZW9tZXRyeS52ZXJ0aWNlc1syXS55ID0gYm9keUdlb21ldHJ5LnZlcnRpY2VzWzNdLnkgPSAoaGVpZ2h0IC8gMikgKyAod2lkdGggLyAyKTtcbiAgYm9keUdlb21ldHJ5LnZlcnRpY2VzTmVlZFVwZGF0ZSA9IHRydWU7XG4gIGJvZHlHZW9tZXRyeS5jb21wdXRlQm91bmRpbmdTcGhlcmUoKTtcblxuICB2YXIgYm9keU1lc2ggPSBuZXcgVEhSRUUuTWVzaChib2R5R2VvbWV0cnksIGJvZHlNYXRlcmlhbCk7XG4gIHZhciBjYXBNZXNoVG9wID0gbmV3IFRIUkVFLk1lc2goY2FwR2VvbWV0cnksIGNhcE1hdGVyaWFsKTtcbiAgdmFyIGNhcE1lc2hCb3R0b20gPSBjYXBNZXNoVG9wLmNsb25lKCk7XG4gIHZhciBmbGFyZU1lc2ggPSBuZXcgVEhSRUUuTWVzaChmbGFyZUdlb21ldHJ5LCBmbGFyZU1hdGVyaWFsKTtcbiAgdmFyIGN1YmVNZXNoID0gbmV3IFRIUkVFLk1lc2goY3ViZUdlb21ldHJ5LCBjdWJlTWF0ZXJpYWwpO1xuXG4gIGJvZHlNZXNoLnBvc2l0aW9uLnkgPSAwO1xuICBjYXBNZXNoVG9wLnBvc2l0aW9uLnkgPSAoaGVpZ2h0IC8gMikgKyAod2lkdGggLyAyKTtcbiAgY2FwTWVzaEJvdHRvbS5wb3NpdGlvbi55ID0gLShoZWlnaHQgLyAyKSAtICh3aWR0aCAvIDIpO1xuICBjYXBNZXNoQm90dG9tLnJvdGF0aW9uLnogPSBNYXRoLlBJO1xuICBmbGFyZU1lc2gucG9zaXRpb24ueSA9IC0oaGVpZ2h0IC8gMikgLSAod2lkdGggLyAyKTtcblxuICAvLyBsaW5lXG4gIHZhciBsaW5lR2VvbWV0cnkgPSBuZXcgVEhSRUUuR2VvbWV0cnkoKTtcbiAgbGluZUdlb21ldHJ5LnZlcnRpY2VzLnB1c2gobmV3IFRIUkVFLlZlY3RvcjMoMCwgKGhlaWdodCAvIDIpICsgKHdpZHRoIC8gMiksIDApKTtcbiAgbGluZUdlb21ldHJ5LnZlcnRpY2VzLnB1c2gobmV3IFRIUkVFLlZlY3RvcjMoMCwgKGhlaWdodCAvIDIpICsgKHdpZHRoIC8gMiksIDApKTtcblxuICB2YXIgbGluZU1lc2ggPSBuZXcgVEhSRUUuTGluZShsaW5lR2VvbWV0cnksIGxpbmVNYXRlcmlhbCk7XG5cbiAgZ3JvdXAuYWRkKGxpbmVNZXNoKTtcblxuICAvLyBib2R5IFxuICB2YXIgYm9keSA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuXG4gIHZhciBib2R5UGxhbmUgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKTtcblxuICBib2R5UGxhbmUuYWRkKGJvZHlNZXNoKTtcbiAgYm9keVBsYW5lLmFkZChjYXBNZXNoVG9wKTtcbiAgYm9keVBsYW5lLmFkZChjYXBNZXNoQm90dG9tKTtcblxuICBib2R5LmFkZChib2R5UGxhbmUpO1xuXG4gIGdyb3VwLmFkZChib2R5KTtcblxuICAvLyBmbGFyZVxuICBncm91cC5hZGQoZmxhcmVNZXNoKTtcblxuICAvLyBtb3ZpbmcgZmxhcmVcbiAgdmFyIG1vdmluZ0ZsYXJlTWF0ZXJpYWwgPSBmbGFyZU1hdGVyaWFsLmNsb25lKCk7XG4gIHZhciBtb3ZpbmdGbGFyZU1lc2ggPSBuZXcgVEhSRUUuTWVzaChtb3ZpbmdGbGFyZUdlb21ldHJ5LCBtb3ZpbmdGbGFyZU1hdGVyaWFsKTtcbiAgbW92aW5nRmxhcmVNZXNoLnNjYWxlLnggPSAzO1xuICBncm91cC5hZGQobW92aW5nRmxhcmVNZXNoKTtcblxuICAvLyBjdWJlIGdyb3VwXG4gIHZhciBjdWJlR3JvdXAgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKTtcbiAgY3ViZUdyb3VwLmFkZChjdWJlTWVzaCk7XG4gIGN1YmVHcm91cC5hZGQobW92aW5nRmxhcmVNZXNoKTtcbiAgZ3JvdXAuYWRkKGN1YmVHcm91cCk7XG5cbiAgLy8gYW5pbWF0aW9uc1xuICB2YXIgY2FjaGUgPSB7IHk6IChoZWlnaHQgLyAyKSArICh3aWR0aCAvIDIpIH07XG5cbiAgZnVuY3Rpb24gcG9zaXRpb25VcGRhdGUgKCkge1xuICAgIC8qanNoaW50IHZhbGlkdGhpczogdHJ1ZSAqL1xuICAgIFxuICAgIHZhciBleHRyZW1pdHkgPSB0aGlzLnRhcmdldC55IC0gKHdpZHRoIC8yKTtcblxuICAgIGxpbmVHZW9tZXRyeS52ZXJ0aWNlc1sxXS55ID0gZXh0cmVtaXR5O1xuICAgIGxpbmVHZW9tZXRyeS52ZXJ0aWNlc05lZWRVcGRhdGUgPSB0cnVlO1xuICAgIGxpbmVHZW9tZXRyeS5jb21wdXRlQm91bmRpbmdTcGhlcmUoKTtcblxuICAgIGJvZHlHZW9tZXRyeS52ZXJ0aWNlc1syXS55ID0gYm9keUdlb21ldHJ5LnZlcnRpY2VzWzNdLnkgPSB0aGlzLnRhcmdldC55O1xuICAgIGJvZHlHZW9tZXRyeS52ZXJ0aWNlc05lZWRVcGRhdGUgPSB0cnVlO1xuICAgIGJvZHlHZW9tZXRyeS5jb21wdXRlQm91bmRpbmdTcGhlcmUoKTtcblxuICAgIGNhcE1lc2hCb3R0b20ucG9zaXRpb24ueSA9IGV4dHJlbWl0eTtcblxuICAgIGZsYXJlTWVzaC5wb3NpdGlvbi55ID0gZXh0cmVtaXR5O1xuICAgIGN1YmVHcm91cC5wb3NpdGlvbi55ID0gZXh0cmVtaXR5O1xuICB9XG5cbiAgdmFyIGlkbGVUd2VlbnMgPSB7XG4gICAgZmxhcmU6IFR3ZWVuTGl0ZS50byh7IHNjYWxlOiAxLCBvcGFjaXR5OiAxIH0sIHJhbmRvbSgxLCAyKSwgeyBzY2FsZTogMiwgb3BhY2l0eTogMC42LCBwYXVzZWQ6IHRydWUsXG4gICAgICAgIG9uVXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgZmxhcmVNZXNoLnNjYWxlLnNldCh0aGlzLnRhcmdldC5zY2FsZSwgdGhpcy50YXJnZXQuc2NhbGUsIDEpO1xuICAgICAgICAgIGZsYXJlTWF0ZXJpYWwub3BhY2l0eSA9IHRoaXMudGFyZ2V0Lm9wYWNpdHk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uQ29tcGxldGU6IHlveW8sXG4gICAgICAgIG9uUmV2ZXJzZUNvbXBsZXRlOiB5b3lvXG4gICAgICB9KSxcblxuICAgIG1vdmluZ2ZsYXJlOiBUd2VlbkxpdGUudG8oeyB5OiAwLCBzY2FsZTogMywgb3BhY2l0eTogMSB9LCByYW5kb20oMiwgNiksIHsgeTogMzAsIHNjYWxlOiAxLCBvcGFjaXR5OiAwLCBwYXVzZWQ6IHRydWUsXG4gICAgICAgIG9uVXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgbW92aW5nRmxhcmVNZXNoLnBvc2l0aW9uLnkgPSB0aGlzLnRhcmdldC55O1xuICAgICAgICAgIG1vdmluZ0ZsYXJlTWVzaC5zY2FsZS54ID0gdGhpcy50YXJnZXQuc2NhbGU7XG4gICAgICAgICAgbW92aW5nRmxhcmVNYXRlcmlhbC5vcGFjaXR5ID0gdGhpcy50YXJnZXQub3BhY2l0eTtcbiAgICAgICAgfSxcbiAgICAgICAgb25Db21wbGV0ZTogeW95byxcbiAgICAgICAgb25SZXZlcnNlQ29tcGxldGU6IHlveW9cbiAgICAgIH0pLFxuXG4gICAgYm9keTogVHdlZW5MaXRlLnRvKHsgb3BhY2l0eTogMSB9LCByYW5kb20oMSwgMiksIHsgb3BhY2l0eTogMC41LFxuICAgICAgICBvblVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGJvZHlNYXRlcmlhbC5vcGFjaXR5ID0gY2FwTWF0ZXJpYWwub3BhY2l0eSA9IHRoaXMudGFyZ2V0Lm9wYWNpdHk7XG4gICAgICAgIH0sXG4gICAgICAgIG9uQ29tcGxldGU6IHlveW8sXG4gICAgICAgIG9uUmV2ZXJzZUNvbXBsZXRlOiB5b3lvXG4gICAgICB9KVxuICB9O1xuXG4gIHRoaXMuZWwgPSBncm91cDtcblxuICB2YXIgZGVsYXkgPSBwYXJhbWV0ZXJzLmRlbGF5O1xuXG4gIHRoaXMuaW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgVHdlZW5MaXRlLnRvKGNhY2hlLCAxLCB7IHk6IC01LCBkZWxheTogZGVsYXksIG9uVXBkYXRlOiBwb3NpdGlvblVwZGF0ZSB9KTtcbiAgfTtcblxuICB0aGlzLm91dCA9IGZ1bmN0aW9uICh3YXkpIHtcbiAgICB2YXIgeSA9IHdheSA9PT0gJ3VwJyA/ICgoaGVpZ2h0IC8gMikgKyAod2lkdGggLyAyKSkgLSAxIDogLTcwO1xuICAgIFR3ZWVuTGl0ZS50byhjYWNoZSwgMSwgeyB5OiB5LCBkZWxheTogZGVsYXksIG9uVXBkYXRlOiBwb3NpdGlvblVwZGF0ZSB9KTtcbiAgfTtcblxuICB0aGlzLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgIGlkbGVUd2VlbnMuZmxhcmUucmVzdW1lKCk7XG4gICAgaWRsZVR3ZWVucy5tb3ZpbmdmbGFyZS5yZXN1bWUoKTtcbiAgICBpZGxlVHdlZW5zLmJvZHkucmVzdW1lKCk7XG4gIH07XG5cbiAgdGhpcy5zdG9wID0gZnVuY3Rpb24gKCkge1xuICAgIGlkbGVUd2VlbnMuZmxhcmUucGF1c2UoKTtcbiAgICBpZGxlVHdlZW5zLm1vdmluZ2ZsYXJlLnBhdXNlKCk7XG4gICAgaWRsZVR3ZWVucy5ib2R5LnBhdXNlKCk7XG4gIH07XG59XG5cbkJlYW0uZGVmYXVsdE9wdGlvbnMgPSB7XG4gIGNvbG9yOiAnI2ZmZmZmZicsXG4gICAgaGVpZ2h0OiAxNSxcbiAgICB3aWR0aDogMixcbiAgICBjdWJlU2l6ZTogMC41LFxuICAgIGRlbGF5OiAwXG4gIH07XG5cbm1vZHVsZS5leHBvcnRzID0gQmVhbTsiXX0=
},{"../utils/randomUtil":65,"../utils/yoyoUtil":66}],27:[function(require,module,exports){
(function (global){
'use strict';

var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);

var dilate = require('../utils/dilateUtil');

var outlineMaterial = require('../materials/outlineMaterial');

function City () {
  this.el = new THREE.Object3D();

  this.groups = {};
  this.baseMaterial = new THREE.MeshLambertMaterial({ color: '#333333' });

  this.loader = new THREE.JSONLoader();
}

City.prototype.addGroup = function (data) {
  if (!this.groups[data.name]) {
    this.groups[data.name] = new THREE.Object3D();
  }

  if (!data.outline) {
    data.outline = {};
  }

  var groupName = data.name;

  for (var objName in data.objs) {
    if (data.objs.hasOwnProperty(objName)) {
      var url = data.objs[objName];

      if (!data.outline[objName]) {
        data.outline[objName] = {};
      }

      var isSolid = data.outline[objName].solid ? true : false;
      var offset = data.outline[objName].offset
        ? data.outline[objName].offset
        : 0.15;

      this.loadObj(groupName, url, offset, isSolid);
    }
  }
};

City.prototype.loadObj = function (groupName, url, offset, isSolid) {
  var _this = this;

  this.loader.load(url, function (geometry) {
    _this.processObj({
      geometry: geometry,
      group: groupName,
      offset: offset,
      solid: isSolid
    });
  });
};

City.prototype.processObj = function (data) {
  var groupName = data.group;
  var geometry = data.geometry;

  var mesh = new THREE.Mesh(geometry, this.baseMaterial);

  this.groups[groupName].add(mesh);

  var outlineGeometry = geometry.clone();
  dilate(outlineGeometry, data.offset);

  var localOutlineMaterial = outlineMaterial.clone();
  localOutlineMaterial.uniforms = THREE.UniformsUtils.clone(outlineMaterial.uniforms);
  localOutlineMaterial.attributes = THREE.UniformsUtils.clone(outlineMaterial.attributes);

  var outlineMesh = new THREE.Mesh(outlineGeometry, localOutlineMaterial);

  outlineGeometry.computeBoundingBox();
  var height = outlineGeometry.boundingBox.max.y - outlineGeometry.boundingBox.min.y;

  for (var i = 0, j = outlineGeometry.vertices.length; i < j; i++) {
    var color;

    if (data.solid) {
      color = new THREE.Vector4(0.7, 0.7, 0.7, 1.0);
    } else {
      var vertex = outlineGeometry.vertices[i];
      var percent = Math.floor(vertex.y * 100 / height) - 10;
      color = new THREE.Vector4(0.7, 0.7, 0.7, percent / 100);
    }

    localOutlineMaterial.attributes.customColor.value[i] = color;
  }

  this.groups[groupName].add(outlineMesh);
};

City.prototype.showGroup = function (name) {
  this.el.add(this.groups[name]);
};

module.exports = City;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvb2JqZWN0czNEL0NpdHlPYmplY3QzRC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgVEhSRUUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snVEhSRUUnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1RIUkVFJ10gOiBudWxsKTtcblxudmFyIGRpbGF0ZSA9IHJlcXVpcmUoJy4uL3V0aWxzL2RpbGF0ZVV0aWwnKTtcblxudmFyIG91dGxpbmVNYXRlcmlhbCA9IHJlcXVpcmUoJy4uL21hdGVyaWFscy9vdXRsaW5lTWF0ZXJpYWwnKTtcblxuZnVuY3Rpb24gQ2l0eSAoKSB7XG4gIHRoaXMuZWwgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKTtcblxuICB0aGlzLmdyb3VwcyA9IHt9O1xuICB0aGlzLmJhc2VNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHsgY29sb3I6ICcjMzMzMzMzJyB9KTtcblxuICB0aGlzLmxvYWRlciA9IG5ldyBUSFJFRS5KU09OTG9hZGVyKCk7XG59XG5cbkNpdHkucHJvdG90eXBlLmFkZEdyb3VwID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgaWYgKCF0aGlzLmdyb3Vwc1tkYXRhLm5hbWVdKSB7XG4gICAgdGhpcy5ncm91cHNbZGF0YS5uYW1lXSA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuICB9XG5cbiAgaWYgKCFkYXRhLm91dGxpbmUpIHtcbiAgICBkYXRhLm91dGxpbmUgPSB7fTtcbiAgfVxuXG4gIHZhciBncm91cE5hbWUgPSBkYXRhLm5hbWU7XG5cbiAgZm9yICh2YXIgb2JqTmFtZSBpbiBkYXRhLm9ianMpIHtcbiAgICBpZiAoZGF0YS5vYmpzLmhhc093blByb3BlcnR5KG9iak5hbWUpKSB7XG4gICAgICB2YXIgdXJsID0gZGF0YS5vYmpzW29iak5hbWVdO1xuXG4gICAgICBpZiAoIWRhdGEub3V0bGluZVtvYmpOYW1lXSkge1xuICAgICAgICBkYXRhLm91dGxpbmVbb2JqTmFtZV0gPSB7fTtcbiAgICAgIH1cblxuICAgICAgdmFyIGlzU29saWQgPSBkYXRhLm91dGxpbmVbb2JqTmFtZV0uc29saWQgPyB0cnVlIDogZmFsc2U7XG4gICAgICB2YXIgb2Zmc2V0ID0gZGF0YS5vdXRsaW5lW29iak5hbWVdLm9mZnNldFxuICAgICAgICA/IGRhdGEub3V0bGluZVtvYmpOYW1lXS5vZmZzZXRcbiAgICAgICAgOiAwLjE1O1xuXG4gICAgICB0aGlzLmxvYWRPYmooZ3JvdXBOYW1lLCB1cmwsIG9mZnNldCwgaXNTb2xpZCk7XG4gICAgfVxuICB9XG59O1xuXG5DaXR5LnByb3RvdHlwZS5sb2FkT2JqID0gZnVuY3Rpb24gKGdyb3VwTmFtZSwgdXJsLCBvZmZzZXQsIGlzU29saWQpIHtcbiAgdmFyIF90aGlzID0gdGhpcztcblxuICB0aGlzLmxvYWRlci5sb2FkKHVybCwgZnVuY3Rpb24gKGdlb21ldHJ5KSB7XG4gICAgX3RoaXMucHJvY2Vzc09iaih7XG4gICAgICBnZW9tZXRyeTogZ2VvbWV0cnksXG4gICAgICBncm91cDogZ3JvdXBOYW1lLFxuICAgICAgb2Zmc2V0OiBvZmZzZXQsXG4gICAgICBzb2xpZDogaXNTb2xpZFxuICAgIH0pO1xuICB9KTtcbn07XG5cbkNpdHkucHJvdG90eXBlLnByb2Nlc3NPYmogPSBmdW5jdGlvbiAoZGF0YSkge1xuICB2YXIgZ3JvdXBOYW1lID0gZGF0YS5ncm91cDtcbiAgdmFyIGdlb21ldHJ5ID0gZGF0YS5nZW9tZXRyeTtcblxuICB2YXIgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCB0aGlzLmJhc2VNYXRlcmlhbCk7XG5cbiAgdGhpcy5ncm91cHNbZ3JvdXBOYW1lXS5hZGQobWVzaCk7XG5cbiAgdmFyIG91dGxpbmVHZW9tZXRyeSA9IGdlb21ldHJ5LmNsb25lKCk7XG4gIGRpbGF0ZShvdXRsaW5lR2VvbWV0cnksIGRhdGEub2Zmc2V0KTtcblxuICB2YXIgbG9jYWxPdXRsaW5lTWF0ZXJpYWwgPSBvdXRsaW5lTWF0ZXJpYWwuY2xvbmUoKTtcbiAgbG9jYWxPdXRsaW5lTWF0ZXJpYWwudW5pZm9ybXMgPSBUSFJFRS5Vbmlmb3Jtc1V0aWxzLmNsb25lKG91dGxpbmVNYXRlcmlhbC51bmlmb3Jtcyk7XG4gIGxvY2FsT3V0bGluZU1hdGVyaWFsLmF0dHJpYnV0ZXMgPSBUSFJFRS5Vbmlmb3Jtc1V0aWxzLmNsb25lKG91dGxpbmVNYXRlcmlhbC5hdHRyaWJ1dGVzKTtcblxuICB2YXIgb3V0bGluZU1lc2ggPSBuZXcgVEhSRUUuTWVzaChvdXRsaW5lR2VvbWV0cnksIGxvY2FsT3V0bGluZU1hdGVyaWFsKTtcblxuICBvdXRsaW5lR2VvbWV0cnkuY29tcHV0ZUJvdW5kaW5nQm94KCk7XG4gIHZhciBoZWlnaHQgPSBvdXRsaW5lR2VvbWV0cnkuYm91bmRpbmdCb3gubWF4LnkgLSBvdXRsaW5lR2VvbWV0cnkuYm91bmRpbmdCb3gubWluLnk7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGogPSBvdXRsaW5lR2VvbWV0cnkudmVydGljZXMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgdmFyIGNvbG9yO1xuXG4gICAgaWYgKGRhdGEuc29saWQpIHtcbiAgICAgIGNvbG9yID0gbmV3IFRIUkVFLlZlY3RvcjQoMC43LCAwLjcsIDAuNywgMS4wKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHZlcnRleCA9IG91dGxpbmVHZW9tZXRyeS52ZXJ0aWNlc1tpXTtcbiAgICAgIHZhciBwZXJjZW50ID0gTWF0aC5mbG9vcih2ZXJ0ZXgueSAqIDEwMCAvIGhlaWdodCkgLSAxMDtcbiAgICAgIGNvbG9yID0gbmV3IFRIUkVFLlZlY3RvcjQoMC43LCAwLjcsIDAuNywgcGVyY2VudCAvIDEwMCk7XG4gICAgfVxuXG4gICAgbG9jYWxPdXRsaW5lTWF0ZXJpYWwuYXR0cmlidXRlcy5jdXN0b21Db2xvci52YWx1ZVtpXSA9IGNvbG9yO1xuICB9XG5cbiAgdGhpcy5ncm91cHNbZ3JvdXBOYW1lXS5hZGQob3V0bGluZU1lc2gpO1xufTtcblxuQ2l0eS5wcm90b3R5cGUuc2hvd0dyb3VwID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgdGhpcy5lbC5hZGQodGhpcy5ncm91cHNbbmFtZV0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDaXR5OyJdfQ==
},{"../materials/outlineMaterial":10,"../utils/dilateUtil":61}],28:[function(require,module,exports){
(function (global){
'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var TweenLite = (typeof window !== "undefined" ? window['TweenLite'] : typeof global !== "undefined" ? global['TweenLite'] : null);

var loop = require('../utils/loopUtil');

/**
 * Animated water ripple
 *
 * @class Drop
 * @constructor
 * @param {Object} [options]
 * @param {Number} [options.count=6] Rings number
 * @param {String} [options.color='#ffffff'] Rings color
 * @param {Number} [options.amplitude=2] Rings max expanded amplitude 
 * @requires jQuery, THREE, TweenLite, loop
 */
function Drop (options) {
  this.parameters = jQuery.extend(Drop.defaultOptions, options);

  var group = new THREE.Object3D();

  var plane = this.getPlane();

  var caches = [];
  var idleTweens = [];

  for (var i = 0; i < this.parameters.count; i++) {
    var planeCopy = plane.clone();
    planeCopy.material = planeCopy.material.clone();

    var tween = this.getTween(planeCopy, i);
    var cache = { duration: (10 + i) / 10, z: (this.parameters.count - i) * 5 };

    group.add(planeCopy);
    caches.push(cache);
    idleTweens.push(tween);
  }

  this.el = group;

  this.in = function () {
    for (var i = 0, j = group.children.length; i < j; i++) {
      var el = group.children[i];
      var cache = caches[i];
      TweenLite.to(el.position, cache.duration, { z: 0 });
    }
  };

  this.out = function (way) {
    var factor = way === 'up' ? 1 : -1;

    for (var i = 0, j = group.children.length; i < j; i++) {
      var el = group.children[i];
      var cache = caches[i];
      TweenLite.to(el.position, cache.duration, { z: factor * cache.z });
    }
  };

  this.start = function () {
    for (var i = 0, j = idleTweens.length; i < j; i++) {
      idleTweens[i].resume();
    }
  };

  this.stop = function () {
    for (var i = 0, j = idleTweens.length; i < j; i++) {
      idleTweens[i].pause();
    }
  };
}

Drop.defaultOptions = {
  count: 6,
  color: '#ffffff',
  amplitude: 2
};

/**
 * Get water ripple plane
 *
 * @method getPlane
 * @return {THREE.Mesh}
 */
Drop.prototype.getPlane = function () {
  var texture = THREE.ImageUtils.loadTexture('./app/public/img/texture-drop.png');
  
  var material = new THREE.MeshBasicMaterial({
    map: texture,
    depthWrite: false,
    depthTest: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    color: this.parameters.color,
    side: THREE.DoubleSide
  });

  var geometry = new THREE.PlaneGeometry(20, 20, 1, 1);

  return new THREE.Mesh(geometry, material);
};

/**
 * Get ripple animation
 *
 * @method getTween
 * @param {THREE.Mesh} [plane]
 * @param {Number} [index]
 * @return {TweenLite}
 */
Drop.prototype.getTween = function (plane, index) {
  var cache = { scale: 0.1, opacity: 1 };
  var scale = (index + 1) * (this.parameters.amplitude) / this.parameters.count;

  return TweenLite.to(cache, 1.5, { scale: scale, opacity: 0, paused: true, delay: (index * 100) / 1000,
      onUpdate: function () {
        plane.scale.x = plane.scale.y = cache.scale;
        plane.material.opacity = cache.opacity;
      },
      onComplete: loop
    });
};

module.exports = Drop;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvb2JqZWN0czNEL0Ryb3BPYmplY3QzRC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIGpRdWVyeSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydqUXVlcnknXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ2pRdWVyeSddIDogbnVsbCk7XG52YXIgVEhSRUUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snVEhSRUUnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1RIUkVFJ10gOiBudWxsKTtcbnZhciBUd2VlbkxpdGUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snVHdlZW5MaXRlJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydUd2VlbkxpdGUnXSA6IG51bGwpO1xuXG52YXIgbG9vcCA9IHJlcXVpcmUoJy4uL3V0aWxzL2xvb3BVdGlsJyk7XG5cbi8qKlxuICogQW5pbWF0ZWQgd2F0ZXIgcmlwcGxlXG4gKlxuICogQGNsYXNzIERyb3BcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmNvdW50PTZdIFJpbmdzIG51bWJlclxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yPScjZmZmZmZmJ10gUmluZ3MgY29sb3JcbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5hbXBsaXR1ZGU9Ml0gUmluZ3MgbWF4IGV4cGFuZGVkIGFtcGxpdHVkZSBcbiAqIEByZXF1aXJlcyBqUXVlcnksIFRIUkVFLCBUd2VlbkxpdGUsIGxvb3BcbiAqL1xuZnVuY3Rpb24gRHJvcCAob3B0aW9ucykge1xuICB0aGlzLnBhcmFtZXRlcnMgPSBqUXVlcnkuZXh0ZW5kKERyb3AuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gIHZhciBncm91cCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuXG4gIHZhciBwbGFuZSA9IHRoaXMuZ2V0UGxhbmUoKTtcblxuICB2YXIgY2FjaGVzID0gW107XG4gIHZhciBpZGxlVHdlZW5zID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnBhcmFtZXRlcnMuY291bnQ7IGkrKykge1xuICAgIHZhciBwbGFuZUNvcHkgPSBwbGFuZS5jbG9uZSgpO1xuICAgIHBsYW5lQ29weS5tYXRlcmlhbCA9IHBsYW5lQ29weS5tYXRlcmlhbC5jbG9uZSgpO1xuXG4gICAgdmFyIHR3ZWVuID0gdGhpcy5nZXRUd2VlbihwbGFuZUNvcHksIGkpO1xuICAgIHZhciBjYWNoZSA9IHsgZHVyYXRpb246ICgxMCArIGkpIC8gMTAsIHo6ICh0aGlzLnBhcmFtZXRlcnMuY291bnQgLSBpKSAqIDUgfTtcblxuICAgIGdyb3VwLmFkZChwbGFuZUNvcHkpO1xuICAgIGNhY2hlcy5wdXNoKGNhY2hlKTtcbiAgICBpZGxlVHdlZW5zLnB1c2godHdlZW4pO1xuICB9XG5cbiAgdGhpcy5lbCA9IGdyb3VwO1xuXG4gIHRoaXMuaW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGogPSBncm91cC5jaGlsZHJlbi5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgIHZhciBlbCA9IGdyb3VwLmNoaWxkcmVuW2ldO1xuICAgICAgdmFyIGNhY2hlID0gY2FjaGVzW2ldO1xuICAgICAgVHdlZW5MaXRlLnRvKGVsLnBvc2l0aW9uLCBjYWNoZS5kdXJhdGlvbiwgeyB6OiAwIH0pO1xuICAgIH1cbiAgfTtcblxuICB0aGlzLm91dCA9IGZ1bmN0aW9uICh3YXkpIHtcbiAgICB2YXIgZmFjdG9yID0gd2F5ID09PSAndXAnID8gMSA6IC0xO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGogPSBncm91cC5jaGlsZHJlbi5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgIHZhciBlbCA9IGdyb3VwLmNoaWxkcmVuW2ldO1xuICAgICAgdmFyIGNhY2hlID0gY2FjaGVzW2ldO1xuICAgICAgVHdlZW5MaXRlLnRvKGVsLnBvc2l0aW9uLCBjYWNoZS5kdXJhdGlvbiwgeyB6OiBmYWN0b3IgKiBjYWNoZS56IH0pO1xuICAgIH1cbiAgfTtcblxuICB0aGlzLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgIGZvciAodmFyIGkgPSAwLCBqID0gaWRsZVR3ZWVucy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgIGlkbGVUd2VlbnNbaV0ucmVzdW1lKCk7XG4gICAgfVxuICB9O1xuXG4gIHRoaXMuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgaiA9IGlkbGVUd2VlbnMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICBpZGxlVHdlZW5zW2ldLnBhdXNlKCk7XG4gICAgfVxuICB9O1xufVxuXG5Ecm9wLmRlZmF1bHRPcHRpb25zID0ge1xuICBjb3VudDogNixcbiAgY29sb3I6ICcjZmZmZmZmJyxcbiAgYW1wbGl0dWRlOiAyXG59O1xuXG4vKipcbiAqIEdldCB3YXRlciByaXBwbGUgcGxhbmVcbiAqXG4gKiBAbWV0aG9kIGdldFBsYW5lXG4gKiBAcmV0dXJuIHtUSFJFRS5NZXNofVxuICovXG5Ecm9wLnByb3RvdHlwZS5nZXRQbGFuZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHRleHR1cmUgPSBUSFJFRS5JbWFnZVV0aWxzLmxvYWRUZXh0dXJlKCcuL2FwcC9wdWJsaWMvaW1nL3RleHR1cmUtZHJvcC5wbmcnKTtcbiAgXG4gIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XG4gICAgbWFwOiB0ZXh0dXJlLFxuICAgIGRlcHRoV3JpdGU6IGZhbHNlLFxuICAgIGRlcHRoVGVzdDogdHJ1ZSxcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcbiAgICBvcGFjaXR5OiAwLFxuICAgIGJsZW5kaW5nOiBUSFJFRS5BZGRpdGl2ZUJsZW5kaW5nLFxuICAgIGNvbG9yOiB0aGlzLnBhcmFtZXRlcnMuY29sb3IsXG4gICAgc2lkZTogVEhSRUUuRG91YmxlU2lkZVxuICB9KTtcblxuICB2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSgyMCwgMjAsIDEsIDEpO1xuXG4gIHJldHVybiBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xufTtcblxuLyoqXG4gKiBHZXQgcmlwcGxlIGFuaW1hdGlvblxuICpcbiAqIEBtZXRob2QgZ2V0VHdlZW5cbiAqIEBwYXJhbSB7VEhSRUUuTWVzaH0gW3BsYW5lXVxuICogQHBhcmFtIHtOdW1iZXJ9IFtpbmRleF1cbiAqIEByZXR1cm4ge1R3ZWVuTGl0ZX1cbiAqL1xuRHJvcC5wcm90b3R5cGUuZ2V0VHdlZW4gPSBmdW5jdGlvbiAocGxhbmUsIGluZGV4KSB7XG4gIHZhciBjYWNoZSA9IHsgc2NhbGU6IDAuMSwgb3BhY2l0eTogMSB9O1xuICB2YXIgc2NhbGUgPSAoaW5kZXggKyAxKSAqICh0aGlzLnBhcmFtZXRlcnMuYW1wbGl0dWRlKSAvIHRoaXMucGFyYW1ldGVycy5jb3VudDtcblxuICByZXR1cm4gVHdlZW5MaXRlLnRvKGNhY2hlLCAxLjUsIHsgc2NhbGU6IHNjYWxlLCBvcGFjaXR5OiAwLCBwYXVzZWQ6IHRydWUsIGRlbGF5OiAoaW5kZXggKiAxMDApIC8gMTAwMCxcbiAgICAgIG9uVXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHBsYW5lLnNjYWxlLnggPSBwbGFuZS5zY2FsZS55ID0gY2FjaGUuc2NhbGU7XG4gICAgICAgIHBsYW5lLm1hdGVyaWFsLm9wYWNpdHkgPSBjYWNoZS5vcGFjaXR5O1xuICAgICAgfSxcbiAgICAgIG9uQ29tcGxldGU6IGxvb3BcbiAgICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRHJvcDsiXX0=
},{"../utils/loopUtil":62}],29:[function(require,module,exports){
(function (global){
'use strict';

var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var TweenLite = (typeof window !== "undefined" ? window['TweenLite'] : typeof global !== "undefined" ? global['TweenLite'] : null);

var yoyo = require('../utils/yoyoUtil');

var matCap = require('../materials/matCapMaterial');
matCap.uniforms.map.value = THREE.ImageUtils.loadTexture('./app/public/img/matCap-shiny.jpg');

/**
 * 3D face
 *
 * @class Face
 * @constructor
 * @requires THREE, TweenLite, random, yoyo, matCap
 */
function Face () {
  var group = new THREE.Object3D();

  var loader = new THREE.JSONLoader();
  loader.load('./app/public/3D/face-hp.js', function (geometry) {
    var mesh = new THREE.Mesh(geometry, matCap);
    mesh.scale.x = 1.5;
    mesh.scale.y = 1.5;

    group.add(mesh);

    var idleTween = TweenLite.to({ y: -0.2 }, 2, { y: 0.2, paused: true,
      onUpdate: function () {
        mesh.rotation.y = this.target.y;
      },
      onComplete: yoyo,
      onReverseComplete: yoyo
    });

    this.in = function () {
      TweenLite.to(mesh.rotation, 1.5, { x: 0 });
    };

    this.out = function (way) {
      var x = way === 'up' ? -1 : 1;
      TweenLite.to(mesh.rotation, 1.5, { x: x });
    };

    this.start = function () {
      idleTween.resume();
    };

    this.stop = function () {
      idleTween.pause();
    };
  }.bind(this));

  this.el = group;

  this.start = function () {};

  this.stop = this.start;

  this.in = this.start;

  this.out = this.start;
}

module.exports = Face;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvb2JqZWN0czNEL0ZhY2VIcE9iamVjdDNELmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIFRIUkVFID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1RIUkVFJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydUSFJFRSddIDogbnVsbCk7XG52YXIgVHdlZW5MaXRlID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1R3ZWVuTGl0ZSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnVHdlZW5MaXRlJ10gOiBudWxsKTtcblxudmFyIHlveW8gPSByZXF1aXJlKCcuLi91dGlscy95b3lvVXRpbCcpO1xuXG52YXIgbWF0Q2FwID0gcmVxdWlyZSgnLi4vbWF0ZXJpYWxzL21hdENhcE1hdGVyaWFsJyk7XG5tYXRDYXAudW5pZm9ybXMubWFwLnZhbHVlID0gVEhSRUUuSW1hZ2VVdGlscy5sb2FkVGV4dHVyZSgnLi9hcHAvcHVibGljL2ltZy9tYXRDYXAtc2hpbnkuanBnJyk7XG5cbi8qKlxuICogM0QgZmFjZVxuICpcbiAqIEBjbGFzcyBGYWNlXG4gKiBAY29uc3RydWN0b3JcbiAqIEByZXF1aXJlcyBUSFJFRSwgVHdlZW5MaXRlLCByYW5kb20sIHlveW8sIG1hdENhcFxuICovXG5mdW5jdGlvbiBGYWNlICgpIHtcbiAgdmFyIGdyb3VwID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XG5cbiAgdmFyIGxvYWRlciA9IG5ldyBUSFJFRS5KU09OTG9hZGVyKCk7XG4gIGxvYWRlci5sb2FkKCcuL2FwcC9wdWJsaWMvM0QvZmFjZS1ocC5qcycsIGZ1bmN0aW9uIChnZW9tZXRyeSkge1xuICAgIHZhciBtZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdENhcCk7XG4gICAgbWVzaC5zY2FsZS54ID0gMS41O1xuICAgIG1lc2guc2NhbGUueSA9IDEuNTtcblxuICAgIGdyb3VwLmFkZChtZXNoKTtcblxuICAgIHZhciBpZGxlVHdlZW4gPSBUd2VlbkxpdGUudG8oeyB5OiAtMC4yIH0sIDIsIHsgeTogMC4yLCBwYXVzZWQ6IHRydWUsXG4gICAgICBvblVwZGF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBtZXNoLnJvdGF0aW9uLnkgPSB0aGlzLnRhcmdldC55O1xuICAgICAgfSxcbiAgICAgIG9uQ29tcGxldGU6IHlveW8sXG4gICAgICBvblJldmVyc2VDb21wbGV0ZTogeW95b1xuICAgIH0pO1xuXG4gICAgdGhpcy5pbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIFR3ZWVuTGl0ZS50byhtZXNoLnJvdGF0aW9uLCAxLjUsIHsgeDogMCB9KTtcbiAgICB9O1xuXG4gICAgdGhpcy5vdXQgPSBmdW5jdGlvbiAod2F5KSB7XG4gICAgICB2YXIgeCA9IHdheSA9PT0gJ3VwJyA/IC0xIDogMTtcbiAgICAgIFR3ZWVuTGl0ZS50byhtZXNoLnJvdGF0aW9uLCAxLjUsIHsgeDogeCB9KTtcbiAgICB9O1xuXG4gICAgdGhpcy5zdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlkbGVUd2Vlbi5yZXN1bWUoKTtcbiAgICB9O1xuXG4gICAgdGhpcy5zdG9wID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWRsZVR3ZWVuLnBhdXNlKCk7XG4gICAgfTtcbiAgfS5iaW5kKHRoaXMpKTtcblxuICB0aGlzLmVsID0gZ3JvdXA7XG5cbiAgdGhpcy5zdGFydCA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gIHRoaXMuc3RvcCA9IHRoaXMuc3RhcnQ7XG5cbiAgdGhpcy5pbiA9IHRoaXMuc3RhcnQ7XG5cbiAgdGhpcy5vdXQgPSB0aGlzLnN0YXJ0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEZhY2U7Il19
},{"../materials/matCapMaterial":9,"../utils/yoyoUtil":66}],30:[function(require,module,exports){
(function (global){
'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var TweenLite = (typeof window !== "undefined" ? window['TweenLite'] : typeof global !== "undefined" ? global['TweenLite'] : null);

var random = require('../utils/randomUtil');
var noise = require('../utils/noiseUtil');
var map = require('../utils/mapUtil');

/**
 * 3D Flow field
 * Fake flocking
 *
 * @param {Array} [points] MainCurve's points
 * @param {Object} [options]
 * @param {Object} [options.subsNumber=3] SubCurves number
 * @param {Number} [options.subsAmplitude=30] SubCurves amplitude
 * @param {Number} [options.subsPrecision=10] SubCurves precision (=subdivisions)
 * @param {Number} [options.noiseXincrement=0.1] SubCurves x noise
 * @param {Number} [options.moiseYincrement=0.1] SubCurves y noise
 * @param {Number} [options.noiseZincrement=0.1] SubCurves z noise
 * @param {Number} [options.renderResolution=100] SubCurves render precision (=subdivisions)
 * @param {String} [options.mainColor='#ffffff'] MainCurve's color
 * @param {String} [options.subsColor='#4c4c4c'] SubCurves color
 * @requires jQuery, THREE, TweenLite, random, noise, map
 */
function FlowField (points, options) {
  this.parameters = jQuery.extend(FlowField.defaultOptions, options);

  var group = new THREE.Object3D();

  var curves = this.getCurves(points);
  var main = curves.main;
  var subs = curves.subs;
  var lines = this.getLines(main, subs);
  var inTweens = [];

  for (var i = 0, j = lines.length; i < j; i++) {
    group.add(lines[i]);
    inTweens.push(this.getInTween(lines[i]));
  }

  var triangleGeometry = new THREE.TetrahedronGeometry(3);
  var triangleMaterial = new THREE.MeshLambertMaterial({ shading: THREE.FlatShading });
  var triangleMesh = new THREE.Mesh(triangleGeometry, triangleMaterial);

  var follow = this.getFollow(triangleMesh, subs);

  for (var k = 0, l = follow.meshes.length; k < l; k++) {
    group.add(follow.meshes[k]);
  }

  this.el = group;

  this.in = function () {
    for (var i = 0, j = inTweens.length; i < j; i++) {
      inTweens[i].restart();
    }
  };

  this.out = function () {
    for (var i = 0, j = inTweens.length; i < j; i++) {
      inTweens[i].reverse();
    }
  };

  this.start = function () {
    for (var i = 0, j = follow.tweens.length; i < j; i++) {
      follow.tweens[i].resume();
    }
  };

  this.stop = function () {
    for (var i = 0, j = follow.tweens.length; i < j; i++) {
      follow.tweens[i].pause();
    }
  };
}

FlowField.defaultOptions = {
  subsNumber: 3,
  subsAmplitude: 30,
  subsPrecision: 10,
  noiseXincrement: 0.1,
  moiseYincrement: 0.1,
  noiseZincrement: 0.1,
  renderResolution: 100,
  mainColor: '#ffffff',
  subsColor: '#4c4c4c',
  subsHiddenColo: '#0a0a0a'
};

/**
 * Get main and subs curves
 *
 * @method getCurves
 * @return {Object}
 */
FlowField.prototype.getCurves = function (points) {
  var main = new THREE.SplineCurve3(points);

  var subsPoints = main.getPoints(this.parameters.subsPrecision);

  var subs = [];

  for (var i = 0; i < this.parameters.subsNumber; i++) {
    var noiseX = random(0, 10);
    var noiseY = random(0, 10);
    var noiseZ = random(0, 10);

    var newPoints = [];
    for (var j = 0, k = subsPoints.length; j < k; j++) {
      var point = subsPoints[j].clone();

      point.x += map(noise(noiseX), [0, 1], [-this.parameters.subsAmplitude, this.parameters.subsAmplitude]);
      point.y += map(noise(noiseY), [0, 1], [-this.parameters.subsAmplitude, this.parameters.subsAmplitude]);
      point.z += map(noise(noiseZ), [0, 1], [-this.parameters.subsAmplitude, this.parameters.subsAmplitude]);

      noiseX += this.parameters.noiseXincrement;
      noiseY += this.parameters.moiseYincrement;
      noiseZ += this.parameters.noiseZincrement;

      newPoints.push(point);
    }

    subs.push(new THREE.SplineCurve3(newPoints));
  }

  return {
    main: main,
    subs: subs
  };
};

/**
 * Get lines
 *
 * @method getLines
 * @param {THREE.SplineCurve3} [main] Main curve
 * @param {Array} [subs] Sub curves
 * @return {Array}
 */
FlowField.prototype.getLines = function (main, subs) {
  var lines = [];

  var mainMaterial = new THREE.LineBasicMaterial({ color: this.parameters.mainColor });

  var mainGeometry = new THREE.Geometry();
  var mainPoints = main.getPoints(this.parameters.renderResolution);
  mainGeometry.vertices = mainPoints;

  var mainLine = new THREE.Line(mainGeometry, mainMaterial);
  mainLine.visible = false;
  lines.push(mainLine);

  var subMaterial = new THREE.LineBasicMaterial({ color: this.parameters.subsColor });

  for (var i = 0, j = subs.length; i < j; i++) {
    var subGeometry = new THREE.Geometry();
    var subPoints = subs[i].getPoints(this.parameters.renderResolution);
    subGeometry.vertices = subPoints;

    var subLine = new THREE.Line(subGeometry, subMaterial);
    subLine.visible = false;
    lines.push(subLine);
  }

  return lines;
};

/**
 * Get in animation
 *
 * @method getInTween
 * @param {THREE.Line} [line] Line to animate
 * @return {TweenLite}
 */
FlowField.prototype.getInTween = function (line) {
  return TweenLite.to({}, random(1, 3), { paused: true,
      onComplete: function () {
        line.visible = true;

        TweenLite.delayedCall(0.2, function () {
          line.visible = false;
        });

        TweenLite.delayedCall(0.3, function () {
          line.visible = true;
        });
      },
      onReverseComplete: function () {
        line.visible = false;
      }
    });
};

/**
 * Get follow animatiom
 *
 * @method getFollor
 * @param {THREE.Mesh} Mesh following
 * @param {Array} Curves
 * @return {Object}
 */
FlowField.prototype.getFollow = function (mesh, curves) {
  var meshes = [];
  var tweens = [];

  function getTween (mesh, sub) {
    return TweenLite.to({ i: 0 }, random(4, 8), { i: 1, paused: true, ease: window.Linear.easeNone,
        onUpdate: function () {
          var position = sub.getPoint(this.target.i);
          var rotation = sub.getTangent(this.target.i);
          
          mesh.position.set(position.x, position.y, position.z);
          mesh.rotation.set(rotation.x, rotation.y, rotation.z);
        },
        onComplete: function () {
          this.restart();
        }
      });
  }

  for (var i = 0, j = curves.length; i < j; i++) {
    var meshCopy = mesh.clone();
    var curve = curves[i];

    meshes.push(meshCopy);
    tweens.push(getTween(meshCopy, curve));
  }

  return {
    tweens: tweens,
    meshes: meshes
  };
};

module.exports = FlowField;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvb2JqZWN0czNEL0Zsb3dGaWVsZE9iamVjdDNELmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBqUXVlcnkgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snalF1ZXJ5J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydqUXVlcnknXSA6IG51bGwpO1xudmFyIFRIUkVFID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1RIUkVFJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydUSFJFRSddIDogbnVsbCk7XG52YXIgVHdlZW5MaXRlID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1R3ZWVuTGl0ZSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnVHdlZW5MaXRlJ10gOiBudWxsKTtcblxudmFyIHJhbmRvbSA9IHJlcXVpcmUoJy4uL3V0aWxzL3JhbmRvbVV0aWwnKTtcbnZhciBub2lzZSA9IHJlcXVpcmUoJy4uL3V0aWxzL25vaXNlVXRpbCcpO1xudmFyIG1hcCA9IHJlcXVpcmUoJy4uL3V0aWxzL21hcFV0aWwnKTtcblxuLyoqXG4gKiAzRCBGbG93IGZpZWxkXG4gKiBGYWtlIGZsb2NraW5nXG4gKlxuICogQHBhcmFtIHtBcnJheX0gW3BvaW50c10gTWFpbkN1cnZlJ3MgcG9pbnRzXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMuc3Vic051bWJlcj0zXSBTdWJDdXJ2ZXMgbnVtYmVyXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuc3Vic0FtcGxpdHVkZT0zMF0gU3ViQ3VydmVzIGFtcGxpdHVkZVxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnN1YnNQcmVjaXNpb249MTBdIFN1YkN1cnZlcyBwcmVjaXNpb24gKD1zdWJkaXZpc2lvbnMpXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubm9pc2VYaW5jcmVtZW50PTAuMV0gU3ViQ3VydmVzIHggbm9pc2VcbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5tb2lzZVlpbmNyZW1lbnQ9MC4xXSBTdWJDdXJ2ZXMgeSBub2lzZVxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLm5vaXNlWmluY3JlbWVudD0wLjFdIFN1YkN1cnZlcyB6IG5vaXNlXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMucmVuZGVyUmVzb2x1dGlvbj0xMDBdIFN1YkN1cnZlcyByZW5kZXIgcHJlY2lzaW9uICg9c3ViZGl2aXNpb25zKVxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm1haW5Db2xvcj0nI2ZmZmZmZiddIE1haW5DdXJ2ZSdzIGNvbG9yXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuc3Vic0NvbG9yPScjNGM0YzRjJ10gU3ViQ3VydmVzIGNvbG9yXG4gKiBAcmVxdWlyZXMgalF1ZXJ5LCBUSFJFRSwgVHdlZW5MaXRlLCByYW5kb20sIG5vaXNlLCBtYXBcbiAqL1xuZnVuY3Rpb24gRmxvd0ZpZWxkIChwb2ludHMsIG9wdGlvbnMpIHtcbiAgdGhpcy5wYXJhbWV0ZXJzID0galF1ZXJ5LmV4dGVuZChGbG93RmllbGQuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gIHZhciBncm91cCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuXG4gIHZhciBjdXJ2ZXMgPSB0aGlzLmdldEN1cnZlcyhwb2ludHMpO1xuICB2YXIgbWFpbiA9IGN1cnZlcy5tYWluO1xuICB2YXIgc3VicyA9IGN1cnZlcy5zdWJzO1xuICB2YXIgbGluZXMgPSB0aGlzLmdldExpbmVzKG1haW4sIHN1YnMpO1xuICB2YXIgaW5Ud2VlbnMgPSBbXTtcblxuICBmb3IgKHZhciBpID0gMCwgaiA9IGxpbmVzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgIGdyb3VwLmFkZChsaW5lc1tpXSk7XG4gICAgaW5Ud2VlbnMucHVzaCh0aGlzLmdldEluVHdlZW4obGluZXNbaV0pKTtcbiAgfVxuXG4gIHZhciB0cmlhbmdsZUdlb21ldHJ5ID0gbmV3IFRIUkVFLlRldHJhaGVkcm9uR2VvbWV0cnkoMyk7XG4gIHZhciB0cmlhbmdsZU1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoeyBzaGFkaW5nOiBUSFJFRS5GbGF0U2hhZGluZyB9KTtcbiAgdmFyIHRyaWFuZ2xlTWVzaCA9IG5ldyBUSFJFRS5NZXNoKHRyaWFuZ2xlR2VvbWV0cnksIHRyaWFuZ2xlTWF0ZXJpYWwpO1xuXG4gIHZhciBmb2xsb3cgPSB0aGlzLmdldEZvbGxvdyh0cmlhbmdsZU1lc2gsIHN1YnMpO1xuXG4gIGZvciAodmFyIGsgPSAwLCBsID0gZm9sbG93Lm1lc2hlcy5sZW5ndGg7IGsgPCBsOyBrKyspIHtcbiAgICBncm91cC5hZGQoZm9sbG93Lm1lc2hlc1trXSk7XG4gIH1cblxuICB0aGlzLmVsID0gZ3JvdXA7XG5cbiAgdGhpcy5pbiA9IGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgaiA9IGluVHdlZW5zLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgaW5Ud2VlbnNbaV0ucmVzdGFydCgpO1xuICAgIH1cbiAgfTtcblxuICB0aGlzLm91dCA9IGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgaiA9IGluVHdlZW5zLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgaW5Ud2VlbnNbaV0ucmV2ZXJzZSgpO1xuICAgIH1cbiAgfTtcblxuICB0aGlzLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgIGZvciAodmFyIGkgPSAwLCBqID0gZm9sbG93LnR3ZWVucy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgIGZvbGxvdy50d2VlbnNbaV0ucmVzdW1lKCk7XG4gICAgfVxuICB9O1xuXG4gIHRoaXMuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgaiA9IGZvbGxvdy50d2VlbnMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICBmb2xsb3cudHdlZW5zW2ldLnBhdXNlKCk7XG4gICAgfVxuICB9O1xufVxuXG5GbG93RmllbGQuZGVmYXVsdE9wdGlvbnMgPSB7XG4gIHN1YnNOdW1iZXI6IDMsXG4gIHN1YnNBbXBsaXR1ZGU6IDMwLFxuICBzdWJzUHJlY2lzaW9uOiAxMCxcbiAgbm9pc2VYaW5jcmVtZW50OiAwLjEsXG4gIG1vaXNlWWluY3JlbWVudDogMC4xLFxuICBub2lzZVppbmNyZW1lbnQ6IDAuMSxcbiAgcmVuZGVyUmVzb2x1dGlvbjogMTAwLFxuICBtYWluQ29sb3I6ICcjZmZmZmZmJyxcbiAgc3Vic0NvbG9yOiAnIzRjNGM0YycsXG4gIHN1YnNIaWRkZW5Db2xvOiAnIzBhMGEwYSdcbn07XG5cbi8qKlxuICogR2V0IG1haW4gYW5kIHN1YnMgY3VydmVzXG4gKlxuICogQG1ldGhvZCBnZXRDdXJ2ZXNcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuRmxvd0ZpZWxkLnByb3RvdHlwZS5nZXRDdXJ2ZXMgPSBmdW5jdGlvbiAocG9pbnRzKSB7XG4gIHZhciBtYWluID0gbmV3IFRIUkVFLlNwbGluZUN1cnZlMyhwb2ludHMpO1xuXG4gIHZhciBzdWJzUG9pbnRzID0gbWFpbi5nZXRQb2ludHModGhpcy5wYXJhbWV0ZXJzLnN1YnNQcmVjaXNpb24pO1xuXG4gIHZhciBzdWJzID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnBhcmFtZXRlcnMuc3Vic051bWJlcjsgaSsrKSB7XG4gICAgdmFyIG5vaXNlWCA9IHJhbmRvbSgwLCAxMCk7XG4gICAgdmFyIG5vaXNlWSA9IHJhbmRvbSgwLCAxMCk7XG4gICAgdmFyIG5vaXNlWiA9IHJhbmRvbSgwLCAxMCk7XG5cbiAgICB2YXIgbmV3UG9pbnRzID0gW107XG4gICAgZm9yICh2YXIgaiA9IDAsIGsgPSBzdWJzUG9pbnRzLmxlbmd0aDsgaiA8IGs7IGorKykge1xuICAgICAgdmFyIHBvaW50ID0gc3Vic1BvaW50c1tqXS5jbG9uZSgpO1xuXG4gICAgICBwb2ludC54ICs9IG1hcChub2lzZShub2lzZVgpLCBbMCwgMV0sIFstdGhpcy5wYXJhbWV0ZXJzLnN1YnNBbXBsaXR1ZGUsIHRoaXMucGFyYW1ldGVycy5zdWJzQW1wbGl0dWRlXSk7XG4gICAgICBwb2ludC55ICs9IG1hcChub2lzZShub2lzZVkpLCBbMCwgMV0sIFstdGhpcy5wYXJhbWV0ZXJzLnN1YnNBbXBsaXR1ZGUsIHRoaXMucGFyYW1ldGVycy5zdWJzQW1wbGl0dWRlXSk7XG4gICAgICBwb2ludC56ICs9IG1hcChub2lzZShub2lzZVopLCBbMCwgMV0sIFstdGhpcy5wYXJhbWV0ZXJzLnN1YnNBbXBsaXR1ZGUsIHRoaXMucGFyYW1ldGVycy5zdWJzQW1wbGl0dWRlXSk7XG5cbiAgICAgIG5vaXNlWCArPSB0aGlzLnBhcmFtZXRlcnMubm9pc2VYaW5jcmVtZW50O1xuICAgICAgbm9pc2VZICs9IHRoaXMucGFyYW1ldGVycy5tb2lzZVlpbmNyZW1lbnQ7XG4gICAgICBub2lzZVogKz0gdGhpcy5wYXJhbWV0ZXJzLm5vaXNlWmluY3JlbWVudDtcblxuICAgICAgbmV3UG9pbnRzLnB1c2gocG9pbnQpO1xuICAgIH1cblxuICAgIHN1YnMucHVzaChuZXcgVEhSRUUuU3BsaW5lQ3VydmUzKG5ld1BvaW50cykpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBtYWluOiBtYWluLFxuICAgIHN1YnM6IHN1YnNcbiAgfTtcbn07XG5cbi8qKlxuICogR2V0IGxpbmVzXG4gKlxuICogQG1ldGhvZCBnZXRMaW5lc1xuICogQHBhcmFtIHtUSFJFRS5TcGxpbmVDdXJ2ZTN9IFttYWluXSBNYWluIGN1cnZlXG4gKiBAcGFyYW0ge0FycmF5fSBbc3Vic10gU3ViIGN1cnZlc1xuICogQHJldHVybiB7QXJyYXl9XG4gKi9cbkZsb3dGaWVsZC5wcm90b3R5cGUuZ2V0TGluZXMgPSBmdW5jdGlvbiAobWFpbiwgc3Vicykge1xuICB2YXIgbGluZXMgPSBbXTtcblxuICB2YXIgbWFpbk1hdGVyaWFsID0gbmV3IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsKHsgY29sb3I6IHRoaXMucGFyYW1ldGVycy5tYWluQ29sb3IgfSk7XG5cbiAgdmFyIG1haW5HZW9tZXRyeSA9IG5ldyBUSFJFRS5HZW9tZXRyeSgpO1xuICB2YXIgbWFpblBvaW50cyA9IG1haW4uZ2V0UG9pbnRzKHRoaXMucGFyYW1ldGVycy5yZW5kZXJSZXNvbHV0aW9uKTtcbiAgbWFpbkdlb21ldHJ5LnZlcnRpY2VzID0gbWFpblBvaW50cztcblxuICB2YXIgbWFpbkxpbmUgPSBuZXcgVEhSRUUuTGluZShtYWluR2VvbWV0cnksIG1haW5NYXRlcmlhbCk7XG4gIG1haW5MaW5lLnZpc2libGUgPSBmYWxzZTtcbiAgbGluZXMucHVzaChtYWluTGluZSk7XG5cbiAgdmFyIHN1Yk1hdGVyaWFsID0gbmV3IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsKHsgY29sb3I6IHRoaXMucGFyYW1ldGVycy5zdWJzQ29sb3IgfSk7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGogPSBzdWJzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgIHZhciBzdWJHZW9tZXRyeSA9IG5ldyBUSFJFRS5HZW9tZXRyeSgpO1xuICAgIHZhciBzdWJQb2ludHMgPSBzdWJzW2ldLmdldFBvaW50cyh0aGlzLnBhcmFtZXRlcnMucmVuZGVyUmVzb2x1dGlvbik7XG4gICAgc3ViR2VvbWV0cnkudmVydGljZXMgPSBzdWJQb2ludHM7XG5cbiAgICB2YXIgc3ViTGluZSA9IG5ldyBUSFJFRS5MaW5lKHN1Ykdlb21ldHJ5LCBzdWJNYXRlcmlhbCk7XG4gICAgc3ViTGluZS52aXNpYmxlID0gZmFsc2U7XG4gICAgbGluZXMucHVzaChzdWJMaW5lKTtcbiAgfVxuXG4gIHJldHVybiBsaW5lcztcbn07XG5cbi8qKlxuICogR2V0IGluIGFuaW1hdGlvblxuICpcbiAqIEBtZXRob2QgZ2V0SW5Ud2VlblxuICogQHBhcmFtIHtUSFJFRS5MaW5lfSBbbGluZV0gTGluZSB0byBhbmltYXRlXG4gKiBAcmV0dXJuIHtUd2VlbkxpdGV9XG4gKi9cbkZsb3dGaWVsZC5wcm90b3R5cGUuZ2V0SW5Ud2VlbiA9IGZ1bmN0aW9uIChsaW5lKSB7XG4gIHJldHVybiBUd2VlbkxpdGUudG8oe30sIHJhbmRvbSgxLCAzKSwgeyBwYXVzZWQ6IHRydWUsXG4gICAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxpbmUudmlzaWJsZSA9IHRydWU7XG5cbiAgICAgICAgVHdlZW5MaXRlLmRlbGF5ZWRDYWxsKDAuMiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGxpbmUudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICBUd2VlbkxpdGUuZGVsYXllZENhbGwoMC4zLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgbGluZS52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgb25SZXZlcnNlQ29tcGxldGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGluZS52aXNpYmxlID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIEdldCBmb2xsb3cgYW5pbWF0aW9tXG4gKlxuICogQG1ldGhvZCBnZXRGb2xsb3JcbiAqIEBwYXJhbSB7VEhSRUUuTWVzaH0gTWVzaCBmb2xsb3dpbmdcbiAqIEBwYXJhbSB7QXJyYXl9IEN1cnZlc1xuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5GbG93RmllbGQucHJvdG90eXBlLmdldEZvbGxvdyA9IGZ1bmN0aW9uIChtZXNoLCBjdXJ2ZXMpIHtcbiAgdmFyIG1lc2hlcyA9IFtdO1xuICB2YXIgdHdlZW5zID0gW107XG5cbiAgZnVuY3Rpb24gZ2V0VHdlZW4gKG1lc2gsIHN1Yikge1xuICAgIHJldHVybiBUd2VlbkxpdGUudG8oeyBpOiAwIH0sIHJhbmRvbSg0LCA4KSwgeyBpOiAxLCBwYXVzZWQ6IHRydWUsIGVhc2U6IHdpbmRvdy5MaW5lYXIuZWFzZU5vbmUsXG4gICAgICAgIG9uVXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIHBvc2l0aW9uID0gc3ViLmdldFBvaW50KHRoaXMudGFyZ2V0LmkpO1xuICAgICAgICAgIHZhciByb3RhdGlvbiA9IHN1Yi5nZXRUYW5nZW50KHRoaXMudGFyZ2V0LmkpO1xuICAgICAgICAgIFxuICAgICAgICAgIG1lc2gucG9zaXRpb24uc2V0KHBvc2l0aW9uLngsIHBvc2l0aW9uLnksIHBvc2l0aW9uLnopO1xuICAgICAgICAgIG1lc2gucm90YXRpb24uc2V0KHJvdGF0aW9uLngsIHJvdGF0aW9uLnksIHJvdGF0aW9uLnopO1xuICAgICAgICB9LFxuICAgICAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdGhpcy5yZXN0YXJ0KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IDAsIGogPSBjdXJ2ZXMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgdmFyIG1lc2hDb3B5ID0gbWVzaC5jbG9uZSgpO1xuICAgIHZhciBjdXJ2ZSA9IGN1cnZlc1tpXTtcblxuICAgIG1lc2hlcy5wdXNoKG1lc2hDb3B5KTtcbiAgICB0d2VlbnMucHVzaChnZXRUd2VlbihtZXNoQ29weSwgY3VydmUpKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdHdlZW5zOiB0d2VlbnMsXG4gICAgbWVzaGVzOiBtZXNoZXNcbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRmxvd0ZpZWxkOyJdfQ==
},{"../utils/mapUtil":63,"../utils/noiseUtil":64,"../utils/randomUtil":65}],31:[function(require,module,exports){
(function (global){
/* jshint laxbreak: true */

'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var TweenLite = (typeof window !== "undefined" ? window['TweenLite'] : typeof global !== "undefined" ? global['TweenLite'] : null);

var random = require('../utils/randomUtil');
var map = require('../utils/mapUtil');
var loop = require('../utils/loopUtil');

/**
 * @class Galaxy
 * @constructor
 * @param {Object} [options]
 * @param {String} [ringFromColor='#ffffff'] Off color
 * @param {String} [ringToColor='#333333'] On color
 * @param {Number} [ringDivisions=100] Rings divisions
 * @param {Number} [ringColorSteps=30] Gradient steps
 * @requires jQuery, THREE, TweenLite, random, map, loop
 */
function Galaxy (options) {
  this.parameters = jQuery.extend(Galaxy.defaultOptions, options);

  var group = new THREE.Object3D();

  var ring = this.getRing();
  var planet = this.getPlanet();

  var greyPlanet = planet.clone();
  greyPlanet.material = greyPlanet.material.clone();
  greyPlanet.material.color = new THREE.Color('#4c4c4c');

  var blackPlanet = planet.clone();
  blackPlanet.material = blackPlanet.material.clone();
  blackPlanet.material.color = new THREE.Color('#000000');

  var radius = [8, 10, 16, 25, 31];
  var planets = {
    8: { el: planet.clone(), scale: 0.2, increment: 0.03 },
    10: { el: greyPlanet.clone(), scale: 0.1, increment: 0.03 },
    16: { el: greyPlanet.clone(), scale: 0.5, increment: 0.02 },
    25: { el: planet.clone(), scale: 0.7 },
    31: { el: blackPlanet.clone(), scale: 0.5, increment: 0.05 }
  };

  for (var i = 0, j = radius.length; i < j; i++) {
    var ringRadius = radius[i];

    var ringCopy = ring.clone();
    ringCopy.scale.x = ringCopy.scale.y = ringRadius;
    ringCopy.rotation.z = random(0, Math.PI);

    group.add(ringCopy);

    if (planets[ringRadius]) {
      var planetCopy = planets[ringRadius].el;
      var scale = planets[ringRadius].scale;

      planetCopy.scale.x = planetCopy.scale.y = planetCopy.scale.z = scale;

      // random start theta
      var theta = random(0, 2 * Math.PI);
      var x = ringRadius * Math.cos(theta);
      var y = ringRadius * Math.sin(theta);
      planets[ringRadius].theta = theta;
      planetCopy.position.set(x, y, 0);

      group.add(planetCopy);
    }
  }

  var cache = { rotationX: 0, rotationY: 0 };

  function update () {
    group.rotation.y = cache.rotationY;
    group.rotation.x = cache.rotationX;
  }

  this.el = group;

  this.in = function (way) {
    cache = way === 'up'
      ? { rotationY: -0.6, rotationX: -0.5 }
      : { rotationY: 0.6, rotationX: -1.5 };

    update();

    TweenLite.to(cache, 2, { rotationX: -1, rotationY: 0.2, onUpdate: update });
  };

  this.out = function (way) {
    var to = way === 'up'
      ? { rotationY: 0.6, rotationX: -1.5, onUpdate: update }
      : { rotationY: -0.6, rotationX: -0.5, onUpdate: update };
  
    TweenLite.to(cache, 1, to);
  };

  var idleTween = TweenLite.to({}, 10, { paused: true,
      onUpdate: function () {
        for (var radius in planets) {
          if (planets.hasOwnProperty(radius)) {
            var el = planets[radius].el;
            var theta = planets[radius].theta;
            var increment = planets[radius].increment || 0.01;

            var x = radius * Math.cos(theta);
            var y = radius * Math.sin(theta);

            planets[radius].theta -= increment;

            el.position.x = x;
            el.position.y = y;
          }
        }

        ring.geometry.colors = ring.geometry.colors.concat(ring.geometry.colors.splice(0, 1));
        ring.geometry.colorsNeedUpdate = true;
      },
      onComplete: loop
    });

  this.start = function () {
    idleTween.resume();
  };

  this.stop = function () {
    idleTween.pause();
  };
}

Galaxy.defaultOptions = {
  ringFromColor: '#ffffff',
  ringToColor: '#333333',
  ringDivisions: 100,
  ringColorSteps: 30
};

/**
 * Get base planet
 *
 * @method getPlanet
 * @return {THREE.Mesh}
 */
Galaxy.prototype.getPlanet = function () {
  var planetMaterial = new THREE.MeshBasicMaterial();
  var planetGeometry = new THREE.SphereGeometry(5, 20, 20);
  var planet = new THREE.Mesh(planetGeometry, planetMaterial);

  return planet;
};

/**
 * Get base ring
 *
 * @method getRing
 * @return {THREE.Line}
 */
Galaxy.prototype.getRing = function () {
  var material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });

  var geometry = new THREE.Geometry();

  var step = 2 * Math.PI / this.parameters.ringDivisions;

  for (var i = 0; i < this.parameters.ringDivisions + 1; i++) {
    var theta = i * step;

    var vertex = new THREE.Vector3(1 * Math.cos(theta), 1 * Math.sin(theta), 0);

    geometry.vertices.push(vertex);
  }

  var fromColor = new THREE.Color(this.parameters.ringFromColor);
  var toColor = new THREE.Color(this.parameters.ringToColor);

  var colors = [];

  for (var j = 0; j < this.parameters.ringColorSteps; j++) {
    var percent = map(j + 1, [0, this.parameters.ringColorSteps], [0, 1]);
    colors[j] = fromColor.clone().lerp(toColor, percent);
  }

  var total = geometry.vertices.length;
  var start = 0;
  var current = start;

  var verticesColors = [];

  for (var k = 0; k < total; k++) {
    current++;

    if (current > total) {
      current = 0;
    }

    var vertexColor = colors[current] ? colors[current] : toColor;

    verticesColors.push(vertexColor);
  }

  geometry.colors = verticesColors;

  var ring = new THREE.Line(geometry, material);

  return ring;
};

module.exports = Galaxy;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvb2JqZWN0czNEL0dhbGF4eU9iamVjdDNELmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiLyoganNoaW50IGxheGJyZWFrOiB0cnVlICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGpRdWVyeSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydqUXVlcnknXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ2pRdWVyeSddIDogbnVsbCk7XG52YXIgVEhSRUUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snVEhSRUUnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1RIUkVFJ10gOiBudWxsKTtcbnZhciBUd2VlbkxpdGUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snVHdlZW5MaXRlJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydUd2VlbkxpdGUnXSA6IG51bGwpO1xuXG52YXIgcmFuZG9tID0gcmVxdWlyZSgnLi4vdXRpbHMvcmFuZG9tVXRpbCcpO1xudmFyIG1hcCA9IHJlcXVpcmUoJy4uL3V0aWxzL21hcFV0aWwnKTtcbnZhciBsb29wID0gcmVxdWlyZSgnLi4vdXRpbHMvbG9vcFV0aWwnKTtcblxuLyoqXG4gKiBAY2xhc3MgR2FsYXh5XG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAqIEBwYXJhbSB7U3RyaW5nfSBbcmluZ0Zyb21Db2xvcj0nI2ZmZmZmZiddIE9mZiBjb2xvclxuICogQHBhcmFtIHtTdHJpbmd9IFtyaW5nVG9Db2xvcj0nIzMzMzMzMyddIE9uIGNvbG9yXG4gKiBAcGFyYW0ge051bWJlcn0gW3JpbmdEaXZpc2lvbnM9MTAwXSBSaW5ncyBkaXZpc2lvbnNcbiAqIEBwYXJhbSB7TnVtYmVyfSBbcmluZ0NvbG9yU3RlcHM9MzBdIEdyYWRpZW50IHN0ZXBzXG4gKiBAcmVxdWlyZXMgalF1ZXJ5LCBUSFJFRSwgVHdlZW5MaXRlLCByYW5kb20sIG1hcCwgbG9vcFxuICovXG5mdW5jdGlvbiBHYWxheHkgKG9wdGlvbnMpIHtcbiAgdGhpcy5wYXJhbWV0ZXJzID0galF1ZXJ5LmV4dGVuZChHYWxheHkuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gIHZhciBncm91cCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuXG4gIHZhciByaW5nID0gdGhpcy5nZXRSaW5nKCk7XG4gIHZhciBwbGFuZXQgPSB0aGlzLmdldFBsYW5ldCgpO1xuXG4gIHZhciBncmV5UGxhbmV0ID0gcGxhbmV0LmNsb25lKCk7XG4gIGdyZXlQbGFuZXQubWF0ZXJpYWwgPSBncmV5UGxhbmV0Lm1hdGVyaWFsLmNsb25lKCk7XG4gIGdyZXlQbGFuZXQubWF0ZXJpYWwuY29sb3IgPSBuZXcgVEhSRUUuQ29sb3IoJyM0YzRjNGMnKTtcblxuICB2YXIgYmxhY2tQbGFuZXQgPSBwbGFuZXQuY2xvbmUoKTtcbiAgYmxhY2tQbGFuZXQubWF0ZXJpYWwgPSBibGFja1BsYW5ldC5tYXRlcmlhbC5jbG9uZSgpO1xuICBibGFja1BsYW5ldC5tYXRlcmlhbC5jb2xvciA9IG5ldyBUSFJFRS5Db2xvcignIzAwMDAwMCcpO1xuXG4gIHZhciByYWRpdXMgPSBbOCwgMTAsIDE2LCAyNSwgMzFdO1xuICB2YXIgcGxhbmV0cyA9IHtcbiAgICA4OiB7IGVsOiBwbGFuZXQuY2xvbmUoKSwgc2NhbGU6IDAuMiwgaW5jcmVtZW50OiAwLjAzIH0sXG4gICAgMTA6IHsgZWw6IGdyZXlQbGFuZXQuY2xvbmUoKSwgc2NhbGU6IDAuMSwgaW5jcmVtZW50OiAwLjAzIH0sXG4gICAgMTY6IHsgZWw6IGdyZXlQbGFuZXQuY2xvbmUoKSwgc2NhbGU6IDAuNSwgaW5jcmVtZW50OiAwLjAyIH0sXG4gICAgMjU6IHsgZWw6IHBsYW5ldC5jbG9uZSgpLCBzY2FsZTogMC43IH0sXG4gICAgMzE6IHsgZWw6IGJsYWNrUGxhbmV0LmNsb25lKCksIHNjYWxlOiAwLjUsIGluY3JlbWVudDogMC4wNSB9XG4gIH07XG5cbiAgZm9yICh2YXIgaSA9IDAsIGogPSByYWRpdXMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgdmFyIHJpbmdSYWRpdXMgPSByYWRpdXNbaV07XG5cbiAgICB2YXIgcmluZ0NvcHkgPSByaW5nLmNsb25lKCk7XG4gICAgcmluZ0NvcHkuc2NhbGUueCA9IHJpbmdDb3B5LnNjYWxlLnkgPSByaW5nUmFkaXVzO1xuICAgIHJpbmdDb3B5LnJvdGF0aW9uLnogPSByYW5kb20oMCwgTWF0aC5QSSk7XG5cbiAgICBncm91cC5hZGQocmluZ0NvcHkpO1xuXG4gICAgaWYgKHBsYW5ldHNbcmluZ1JhZGl1c10pIHtcbiAgICAgIHZhciBwbGFuZXRDb3B5ID0gcGxhbmV0c1tyaW5nUmFkaXVzXS5lbDtcbiAgICAgIHZhciBzY2FsZSA9IHBsYW5ldHNbcmluZ1JhZGl1c10uc2NhbGU7XG5cbiAgICAgIHBsYW5ldENvcHkuc2NhbGUueCA9IHBsYW5ldENvcHkuc2NhbGUueSA9IHBsYW5ldENvcHkuc2NhbGUueiA9IHNjYWxlO1xuXG4gICAgICAvLyByYW5kb20gc3RhcnQgdGhldGFcbiAgICAgIHZhciB0aGV0YSA9IHJhbmRvbSgwLCAyICogTWF0aC5QSSk7XG4gICAgICB2YXIgeCA9IHJpbmdSYWRpdXMgKiBNYXRoLmNvcyh0aGV0YSk7XG4gICAgICB2YXIgeSA9IHJpbmdSYWRpdXMgKiBNYXRoLnNpbih0aGV0YSk7XG4gICAgICBwbGFuZXRzW3JpbmdSYWRpdXNdLnRoZXRhID0gdGhldGE7XG4gICAgICBwbGFuZXRDb3B5LnBvc2l0aW9uLnNldCh4LCB5LCAwKTtcblxuICAgICAgZ3JvdXAuYWRkKHBsYW5ldENvcHkpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBjYWNoZSA9IHsgcm90YXRpb25YOiAwLCByb3RhdGlvblk6IDAgfTtcblxuICBmdW5jdGlvbiB1cGRhdGUgKCkge1xuICAgIGdyb3VwLnJvdGF0aW9uLnkgPSBjYWNoZS5yb3RhdGlvblk7XG4gICAgZ3JvdXAucm90YXRpb24ueCA9IGNhY2hlLnJvdGF0aW9uWDtcbiAgfVxuXG4gIHRoaXMuZWwgPSBncm91cDtcblxuICB0aGlzLmluID0gZnVuY3Rpb24gKHdheSkge1xuICAgIGNhY2hlID0gd2F5ID09PSAndXAnXG4gICAgICA/IHsgcm90YXRpb25ZOiAtMC42LCByb3RhdGlvblg6IC0wLjUgfVxuICAgICAgOiB7IHJvdGF0aW9uWTogMC42LCByb3RhdGlvblg6IC0xLjUgfTtcblxuICAgIHVwZGF0ZSgpO1xuXG4gICAgVHdlZW5MaXRlLnRvKGNhY2hlLCAyLCB7IHJvdGF0aW9uWDogLTEsIHJvdGF0aW9uWTogMC4yLCBvblVwZGF0ZTogdXBkYXRlIH0pO1xuICB9O1xuXG4gIHRoaXMub3V0ID0gZnVuY3Rpb24gKHdheSkge1xuICAgIHZhciB0byA9IHdheSA9PT0gJ3VwJ1xuICAgICAgPyB7IHJvdGF0aW9uWTogMC42LCByb3RhdGlvblg6IC0xLjUsIG9uVXBkYXRlOiB1cGRhdGUgfVxuICAgICAgOiB7IHJvdGF0aW9uWTogLTAuNiwgcm90YXRpb25YOiAtMC41LCBvblVwZGF0ZTogdXBkYXRlIH07XG4gIFxuICAgIFR3ZWVuTGl0ZS50byhjYWNoZSwgMSwgdG8pO1xuICB9O1xuXG4gIHZhciBpZGxlVHdlZW4gPSBUd2VlbkxpdGUudG8oe30sIDEwLCB7IHBhdXNlZDogdHJ1ZSxcbiAgICAgIG9uVXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZvciAodmFyIHJhZGl1cyBpbiBwbGFuZXRzKSB7XG4gICAgICAgICAgaWYgKHBsYW5ldHMuaGFzT3duUHJvcGVydHkocmFkaXVzKSkge1xuICAgICAgICAgICAgdmFyIGVsID0gcGxhbmV0c1tyYWRpdXNdLmVsO1xuICAgICAgICAgICAgdmFyIHRoZXRhID0gcGxhbmV0c1tyYWRpdXNdLnRoZXRhO1xuICAgICAgICAgICAgdmFyIGluY3JlbWVudCA9IHBsYW5ldHNbcmFkaXVzXS5pbmNyZW1lbnQgfHwgMC4wMTtcblxuICAgICAgICAgICAgdmFyIHggPSByYWRpdXMgKiBNYXRoLmNvcyh0aGV0YSk7XG4gICAgICAgICAgICB2YXIgeSA9IHJhZGl1cyAqIE1hdGguc2luKHRoZXRhKTtcblxuICAgICAgICAgICAgcGxhbmV0c1tyYWRpdXNdLnRoZXRhIC09IGluY3JlbWVudDtcblxuICAgICAgICAgICAgZWwucG9zaXRpb24ueCA9IHg7XG4gICAgICAgICAgICBlbC5wb3NpdGlvbi55ID0geTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByaW5nLmdlb21ldHJ5LmNvbG9ycyA9IHJpbmcuZ2VvbWV0cnkuY29sb3JzLmNvbmNhdChyaW5nLmdlb21ldHJ5LmNvbG9ycy5zcGxpY2UoMCwgMSkpO1xuICAgICAgICByaW5nLmdlb21ldHJ5LmNvbG9yc05lZWRVcGRhdGUgPSB0cnVlO1xuICAgICAgfSxcbiAgICAgIG9uQ29tcGxldGU6IGxvb3BcbiAgICB9KTtcblxuICB0aGlzLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgIGlkbGVUd2Vlbi5yZXN1bWUoKTtcbiAgfTtcblxuICB0aGlzLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWRsZVR3ZWVuLnBhdXNlKCk7XG4gIH07XG59XG5cbkdhbGF4eS5kZWZhdWx0T3B0aW9ucyA9IHtcbiAgcmluZ0Zyb21Db2xvcjogJyNmZmZmZmYnLFxuICByaW5nVG9Db2xvcjogJyMzMzMzMzMnLFxuICByaW5nRGl2aXNpb25zOiAxMDAsXG4gIHJpbmdDb2xvclN0ZXBzOiAzMFxufTtcblxuLyoqXG4gKiBHZXQgYmFzZSBwbGFuZXRcbiAqXG4gKiBAbWV0aG9kIGdldFBsYW5ldFxuICogQHJldHVybiB7VEhSRUUuTWVzaH1cbiAqL1xuR2FsYXh5LnByb3RvdHlwZS5nZXRQbGFuZXQgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBwbGFuZXRNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCgpO1xuICB2YXIgcGxhbmV0R2VvbWV0cnkgPSBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkoNSwgMjAsIDIwKTtcbiAgdmFyIHBsYW5ldCA9IG5ldyBUSFJFRS5NZXNoKHBsYW5ldEdlb21ldHJ5LCBwbGFuZXRNYXRlcmlhbCk7XG5cbiAgcmV0dXJuIHBsYW5ldDtcbn07XG5cbi8qKlxuICogR2V0IGJhc2UgcmluZ1xuICpcbiAqIEBtZXRob2QgZ2V0UmluZ1xuICogQHJldHVybiB7VEhSRUUuTGluZX1cbiAqL1xuR2FsYXh5LnByb3RvdHlwZS5nZXRSaW5nID0gZnVuY3Rpb24gKCkge1xuICB2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoeyB2ZXJ0ZXhDb2xvcnM6IFRIUkVFLlZlcnRleENvbG9ycyB9KTtcblxuICB2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuR2VvbWV0cnkoKTtcblxuICB2YXIgc3RlcCA9IDIgKiBNYXRoLlBJIC8gdGhpcy5wYXJhbWV0ZXJzLnJpbmdEaXZpc2lvbnM7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnBhcmFtZXRlcnMucmluZ0RpdmlzaW9ucyArIDE7IGkrKykge1xuICAgIHZhciB0aGV0YSA9IGkgKiBzdGVwO1xuXG4gICAgdmFyIHZlcnRleCA9IG5ldyBUSFJFRS5WZWN0b3IzKDEgKiBNYXRoLmNvcyh0aGV0YSksIDEgKiBNYXRoLnNpbih0aGV0YSksIDApO1xuXG4gICAgZ2VvbWV0cnkudmVydGljZXMucHVzaCh2ZXJ0ZXgpO1xuICB9XG5cbiAgdmFyIGZyb21Db2xvciA9IG5ldyBUSFJFRS5Db2xvcih0aGlzLnBhcmFtZXRlcnMucmluZ0Zyb21Db2xvcik7XG4gIHZhciB0b0NvbG9yID0gbmV3IFRIUkVFLkNvbG9yKHRoaXMucGFyYW1ldGVycy5yaW5nVG9Db2xvcik7XG5cbiAgdmFyIGNvbG9ycyA9IFtdO1xuXG4gIGZvciAodmFyIGogPSAwOyBqIDwgdGhpcy5wYXJhbWV0ZXJzLnJpbmdDb2xvclN0ZXBzOyBqKyspIHtcbiAgICB2YXIgcGVyY2VudCA9IG1hcChqICsgMSwgWzAsIHRoaXMucGFyYW1ldGVycy5yaW5nQ29sb3JTdGVwc10sIFswLCAxXSk7XG4gICAgY29sb3JzW2pdID0gZnJvbUNvbG9yLmNsb25lKCkubGVycCh0b0NvbG9yLCBwZXJjZW50KTtcbiAgfVxuXG4gIHZhciB0b3RhbCA9IGdlb21ldHJ5LnZlcnRpY2VzLmxlbmd0aDtcbiAgdmFyIHN0YXJ0ID0gMDtcbiAgdmFyIGN1cnJlbnQgPSBzdGFydDtcblxuICB2YXIgdmVydGljZXNDb2xvcnMgPSBbXTtcblxuICBmb3IgKHZhciBrID0gMDsgayA8IHRvdGFsOyBrKyspIHtcbiAgICBjdXJyZW50Kys7XG5cbiAgICBpZiAoY3VycmVudCA+IHRvdGFsKSB7XG4gICAgICBjdXJyZW50ID0gMDtcbiAgICB9XG5cbiAgICB2YXIgdmVydGV4Q29sb3IgPSBjb2xvcnNbY3VycmVudF0gPyBjb2xvcnNbY3VycmVudF0gOiB0b0NvbG9yO1xuXG4gICAgdmVydGljZXNDb2xvcnMucHVzaCh2ZXJ0ZXhDb2xvcik7XG4gIH1cblxuICBnZW9tZXRyeS5jb2xvcnMgPSB2ZXJ0aWNlc0NvbG9ycztcblxuICB2YXIgcmluZyA9IG5ldyBUSFJFRS5MaW5lKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cbiAgcmV0dXJuIHJpbmc7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbGF4eTsiXX0=
},{"../utils/loopUtil":62,"../utils/mapUtil":63,"../utils/randomUtil":65}],32:[function(require,module,exports){
(function (global){
'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var TweenLite = (typeof window !== "undefined" ? window['TweenLite'] : typeof global !== "undefined" ? global['TweenLite'] : null);

var map = require('../utils/mapUtil');
var random = require('../utils/randomUtil');

/**
 * Simple 3D grid that can receive forces
 *
 * @class Grid
 * @constructor
 * @param {Object} [options]
 * @param {Number} [options.stepsX=10] x steps
 * @param {Number} [options.stepsY=10] y steps
 * @param {Number} [options.stepSize=2] Step's size,
 * @param {String} [options.linesFromColor='#ffffff'] Height min color
 * @param {String} [options.linesToColor='#333333'] Height max color
 * @requires jQuery, THREE
 */
function Grid (options) {
  this.parameters = jQuery.extend(Grid.defaultOptions, options);

  this.lines = null;
  this.points = null;
  this.colorsCache = {}; // cache vertices colors

  this.el = null;

  this.init();
  this.render();
}

Grid.defaultOptions = {
  stepsX: 10,
  stepsY: 10,
  stepSize: 2,
  linesFromColor: '#ffffff',
  linesToColor: '#333333',
  points: false
};

/**
 * Initialize
 *
 * @method init
 */
Grid.prototype.init = function () {
  var width = (this.parameters.stepsX - 1) * this.parameters.stepSize;
  var height = (this.parameters.stepsY - 1) * this.parameters.stepSize;

  var points = new THREE.Geometry();

  for (var x = 0; x < this.parameters.stepsX; x++) {
    for (var y = 0; y < this.parameters.stepsY; y++) {
      var xPos = (x * this.parameters.stepSize) - (width / 2);
      var yPos = (y * this.parameters.stepSize) - (height / 2);
      var zPos = 0;

      var vertex = new THREE.Vector3(xPos, yPos, zPos);
      points.vertices.push(vertex);
    }
  }

  // init color cache
  var fromColor = new THREE.Color(this.parameters.linesFromColor);
  var toColor = new THREE.Color(this.parameters.linesToColor);

  for (var i = 0; i <= 1; i += 0.1) {
    var percent = Math.round(i * 10) / 10;
    this.colorsCache[percent] = fromColor.clone().lerp(toColor, percent);
  }

  this.points = points;
};

/**
 * Render the points and lines
 *
 * @method render
 */
Grid.prototype.render = function () {
  var group = new THREE.Object3D();

  // points
  var pointCloudMaterial = new THREE.PointCloudMaterial({
    size: 0.3
  });
  var pointCloud = new THREE.PointCloud(this.points, pointCloudMaterial);

  if (this.parameters.points) {
    group.add(pointCloud);
  }

  // lines
  var lines = new THREE.Object3D();

  var lineMaterial = new THREE.LineBasicMaterial({
    color: this.parameters.linesColor,
    vertexColors: THREE.VertexColors
  });

  // horizontal
  for (var i = 0; i < this.parameters.stepsY; i++) {
    var hLineGeometry = new THREE.Geometry();

    for (var j = 0; j < this.parameters.stepsX; j++) {
      hLineGeometry.vertices.push(
        this.points.vertices[i + (j * this.parameters.stepsY)]
      );
    }

    var hLine = new THREE.Line(hLineGeometry, lineMaterial);

    lines.add(hLine);
  }

  // vertical
  for (var k = 0; k < this.parameters.stepsX; k++) {
    var vLineGeometry = new THREE.Geometry();

    for (var l = 0; l < this.parameters.stepsY; l++) {
      vLineGeometry.vertices.push(
        this.points.vertices[(k * this.parameters.stepsY) + l]
      );        
    }

    var vLine = new THREE.Line(vLineGeometry, lineMaterial);

    lines.add(vLine);
  }

  group.add(lines);

  // exports
  this.points = pointCloud;
  this.lines = lines;
  this.el = group;
};

/**
 * Apply a force onto the grid
 *
 * @method applyForce
 * @param {THREE.Vector3} [center] Where to apply the force
 * @param {Number} [strength] Strength of the force
 */
Grid.prototype.applyForce = function (center, strength) {
  // update points
  for (var i = 0, j = this.points.geometry.vertices.length; i < j; i++) {
    var dist = this.points.geometry.vertices[i].distanceTo(center);

    this.points.geometry.vertices[i].z -= (strength * 10) / Math.sqrt(dist * 2 ) - (strength * 2);
  }
  this.points.geometry.verticesNeedUpdate = true;

  // update lines
  for (var k = 0, l = this.lines.children.length; k < l; k++) {
    var geometry = this.lines.children[k].geometry;

    // update vertices colors
    for (var m = 0, n = geometry.vertices.length; m < n; m++) {
      var vertex = geometry.vertices[m];
      var percent = map(vertex.z, [0, 5], [0, 1]);
      percent = Math.round(percent * 10) / 10;

      geometry.colors[m] = this.colorsCache[percent];
    }

    geometry.verticesNeedUpdate = true;
    geometry.colorsNeedUpdate = true;
  }
};

/**
 * Reset all the forces applied
 *
 * @method resetFroce
 */
Grid.prototype.resetForce = function () {
  for (var i = 0, j = this.points.geometry.vertices.length; i < j; i++) {
    this.points.geometry.vertices[i].z = 0;
  }
};

/**
 * Get grid total size
 *
 * @method getSize
 * @return {Object}
 */
Grid.prototype.getSize = function () {
  var width = (this.parameters.stepsX - 1) * this.parameters.stepSize;
  var height = (this.parameters.stepsY - 1) * this.parameters.stepSize;

  return {
    x: {
      min: -(width / 2),
      max: (this.parameters.stepsX * this.parameters.stepSize) - (width / 2)
    },
    y: {
      min: -(height / 2),
      max: (this.parameters.stepsY * this.parameters.stepSize) - (height / 2)
    }
  };
};

/**
 * Gravity grid
 *
 * @class GravityGrid
 * @constructor
 * @requires THREE, TWEEN
 */
function GravityGrid (options) {
  var group = new THREE.Object3D();

  var grid = new Grid({
    stepsX: 30,
    stepsY: 30,
    linesColor: options.linesColor || '#666666'
  });
  group.add(grid.el);

  var size = grid.getSize();
  var rangeX = size.x;
  var rangeY = size.y;

  var sphereRadius = 5;
  var mass = 5;
  var sphereGeometry = new THREE.SphereGeometry(sphereRadius, 20, 20);
  var sphereMaterial = new THREE.MeshBasicMaterial({
    color: '#ffffff'
  });
  var sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphereMesh.position.set(0, 30, 40);
  group.add(sphereMesh);

  var satelliteA = sphereMesh.clone();
  var satelliteB = sphereMesh.clone();

  satelliteA.scale.x = satelliteA.scale.y = satelliteA.scale.z = 0.5;
  satelliteB.scale.x = satelliteB.scale.y = satelliteB.scale.z = 0.25;

  satelliteA.position.z = 6;
  satelliteB.position.z = 6;

  var massA = 2.5;
  var massB = 2;

  group.add(satelliteA);
  group.add(satelliteB);
  
  var cache = { xA: 0, yA: 0, xB: 0, yB: 0 };

  function setIdleTween (paused) {
    var properties = {
      bezier: {
        type: 'soft',
        values: [
          {
            xA: random(rangeX.min, rangeX.max),
            yA: random(rangeX.min, rangeX.max),
            xB: random(rangeX.min, rangeX.max),
            yB: random(rangeY.min, rangeY.max)
          },
          {
            xA: random(rangeX.min, rangeX.max),
            yA: random(rangeX.min, rangeX.max),
            xB: random(rangeX.min, rangeX.max),
            yB: random(rangeY.min, rangeY.max)
          }
        ]
      },
      onUpdate: function () {
        satelliteA.position.x = this.target.xA;
        satelliteA.position.y = this.target.yA;

        satelliteB.position.x = this.target.xB;
        satelliteB.position.y = this.target.yB;

        grid.resetForce();
        grid.applyForce(sphereMesh.position, mass);
        grid.applyForce(satelliteA.position, massA);
        grid.applyForce(satelliteB.position, massB);
      },
      onComplete: function () {
        idleTween = setIdleTween();
      }
    };

    if (paused) {
      properties.paused = true;
    }

    return TweenLite.to(cache, 2, properties);
  }

  var idleTween = setIdleTween(true);
  
  // animate for 50 ms to put the sphere in the right position
  idleTween.resume();
  TweenLite.delayedCall(0.1, function () {
    idleTween.pause();
  });

  this.el = group;

  this.in = function () {
    TweenLite.to(sphereMesh.position, 1, {
        x: (rangeX.max + rangeX.min) / 2,
        y: (rangeY.max + rangeY.min) / 2,
        z: 5,
        delay: 0.2
      });
  };

  this.out = function () {
    TweenLite.to(sphereMesh.position, 1, { x: 0, y: 30, z: 40, delay: 0.2 });
  };

  this.start = function () {
    idleTween.resume();
  };

  this.stop = function () {
    idleTween.pause();
  };
}

module.exports = GravityGrid;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvb2JqZWN0czNEL0dyYXZpdHlHcmlkT2JqZWN0M0QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgalF1ZXJ5ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ2pRdWVyeSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnalF1ZXJ5J10gOiBudWxsKTtcbnZhciBUSFJFRSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydUSFJFRSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnVEhSRUUnXSA6IG51bGwpO1xudmFyIFR3ZWVuTGl0ZSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydUd2VlbkxpdGUnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1R3ZWVuTGl0ZSddIDogbnVsbCk7XG5cbnZhciBtYXAgPSByZXF1aXJlKCcuLi91dGlscy9tYXBVdGlsJyk7XG52YXIgcmFuZG9tID0gcmVxdWlyZSgnLi4vdXRpbHMvcmFuZG9tVXRpbCcpO1xuXG4vKipcbiAqIFNpbXBsZSAzRCBncmlkIHRoYXQgY2FuIHJlY2VpdmUgZm9yY2VzXG4gKlxuICogQGNsYXNzIEdyaWRcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnN0ZXBzWD0xMF0geCBzdGVwc1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnN0ZXBzWT0xMF0geSBzdGVwc1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnN0ZXBTaXplPTJdIFN0ZXAncyBzaXplLFxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmxpbmVzRnJvbUNvbG9yPScjZmZmZmZmJ10gSGVpZ2h0IG1pbiBjb2xvclxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmxpbmVzVG9Db2xvcj0nIzMzMzMzMyddIEhlaWdodCBtYXggY29sb3JcbiAqIEByZXF1aXJlcyBqUXVlcnksIFRIUkVFXG4gKi9cbmZ1bmN0aW9uIEdyaWQgKG9wdGlvbnMpIHtcbiAgdGhpcy5wYXJhbWV0ZXJzID0galF1ZXJ5LmV4dGVuZChHcmlkLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcblxuICB0aGlzLmxpbmVzID0gbnVsbDtcbiAgdGhpcy5wb2ludHMgPSBudWxsO1xuICB0aGlzLmNvbG9yc0NhY2hlID0ge307IC8vIGNhY2hlIHZlcnRpY2VzIGNvbG9yc1xuXG4gIHRoaXMuZWwgPSBudWxsO1xuXG4gIHRoaXMuaW5pdCgpO1xuICB0aGlzLnJlbmRlcigpO1xufVxuXG5HcmlkLmRlZmF1bHRPcHRpb25zID0ge1xuICBzdGVwc1g6IDEwLFxuICBzdGVwc1k6IDEwLFxuICBzdGVwU2l6ZTogMixcbiAgbGluZXNGcm9tQ29sb3I6ICcjZmZmZmZmJyxcbiAgbGluZXNUb0NvbG9yOiAnIzMzMzMzMycsXG4gIHBvaW50czogZmFsc2Vcbn07XG5cbi8qKlxuICogSW5pdGlhbGl6ZVxuICpcbiAqIEBtZXRob2QgaW5pdFxuICovXG5HcmlkLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgd2lkdGggPSAodGhpcy5wYXJhbWV0ZXJzLnN0ZXBzWCAtIDEpICogdGhpcy5wYXJhbWV0ZXJzLnN0ZXBTaXplO1xuICB2YXIgaGVpZ2h0ID0gKHRoaXMucGFyYW1ldGVycy5zdGVwc1kgLSAxKSAqIHRoaXMucGFyYW1ldGVycy5zdGVwU2l6ZTtcblxuICB2YXIgcG9pbnRzID0gbmV3IFRIUkVFLkdlb21ldHJ5KCk7XG5cbiAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLnBhcmFtZXRlcnMuc3RlcHNYOyB4KyspIHtcbiAgICBmb3IgKHZhciB5ID0gMDsgeSA8IHRoaXMucGFyYW1ldGVycy5zdGVwc1k7IHkrKykge1xuICAgICAgdmFyIHhQb3MgPSAoeCAqIHRoaXMucGFyYW1ldGVycy5zdGVwU2l6ZSkgLSAod2lkdGggLyAyKTtcbiAgICAgIHZhciB5UG9zID0gKHkgKiB0aGlzLnBhcmFtZXRlcnMuc3RlcFNpemUpIC0gKGhlaWdodCAvIDIpO1xuICAgICAgdmFyIHpQb3MgPSAwO1xuXG4gICAgICB2YXIgdmVydGV4ID0gbmV3IFRIUkVFLlZlY3RvcjMoeFBvcywgeVBvcywgelBvcyk7XG4gICAgICBwb2ludHMudmVydGljZXMucHVzaCh2ZXJ0ZXgpO1xuICAgIH1cbiAgfVxuXG4gIC8vIGluaXQgY29sb3IgY2FjaGVcbiAgdmFyIGZyb21Db2xvciA9IG5ldyBUSFJFRS5Db2xvcih0aGlzLnBhcmFtZXRlcnMubGluZXNGcm9tQ29sb3IpO1xuICB2YXIgdG9Db2xvciA9IG5ldyBUSFJFRS5Db2xvcih0aGlzLnBhcmFtZXRlcnMubGluZXNUb0NvbG9yKTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8PSAxOyBpICs9IDAuMSkge1xuICAgIHZhciBwZXJjZW50ID0gTWF0aC5yb3VuZChpICogMTApIC8gMTA7XG4gICAgdGhpcy5jb2xvcnNDYWNoZVtwZXJjZW50XSA9IGZyb21Db2xvci5jbG9uZSgpLmxlcnAodG9Db2xvciwgcGVyY2VudCk7XG4gIH1cblxuICB0aGlzLnBvaW50cyA9IHBvaW50cztcbn07XG5cbi8qKlxuICogUmVuZGVyIHRoZSBwb2ludHMgYW5kIGxpbmVzXG4gKlxuICogQG1ldGhvZCByZW5kZXJcbiAqL1xuR3JpZC5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKCkge1xuICB2YXIgZ3JvdXAgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKTtcblxuICAvLyBwb2ludHNcbiAgdmFyIHBvaW50Q2xvdWRNYXRlcmlhbCA9IG5ldyBUSFJFRS5Qb2ludENsb3VkTWF0ZXJpYWwoe1xuICAgIHNpemU6IDAuM1xuICB9KTtcbiAgdmFyIHBvaW50Q2xvdWQgPSBuZXcgVEhSRUUuUG9pbnRDbG91ZCh0aGlzLnBvaW50cywgcG9pbnRDbG91ZE1hdGVyaWFsKTtcblxuICBpZiAodGhpcy5wYXJhbWV0ZXJzLnBvaW50cykge1xuICAgIGdyb3VwLmFkZChwb2ludENsb3VkKTtcbiAgfVxuXG4gIC8vIGxpbmVzXG4gIHZhciBsaW5lcyA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuXG4gIHZhciBsaW5lTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoe1xuICAgIGNvbG9yOiB0aGlzLnBhcmFtZXRlcnMubGluZXNDb2xvcixcbiAgICB2ZXJ0ZXhDb2xvcnM6IFRIUkVFLlZlcnRleENvbG9yc1xuICB9KTtcblxuICAvLyBob3Jpem9udGFsXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5wYXJhbWV0ZXJzLnN0ZXBzWTsgaSsrKSB7XG4gICAgdmFyIGhMaW5lR2VvbWV0cnkgPSBuZXcgVEhSRUUuR2VvbWV0cnkoKTtcblxuICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGhpcy5wYXJhbWV0ZXJzLnN0ZXBzWDsgaisrKSB7XG4gICAgICBoTGluZUdlb21ldHJ5LnZlcnRpY2VzLnB1c2goXG4gICAgICAgIHRoaXMucG9pbnRzLnZlcnRpY2VzW2kgKyAoaiAqIHRoaXMucGFyYW1ldGVycy5zdGVwc1kpXVxuICAgICAgKTtcbiAgICB9XG5cbiAgICB2YXIgaExpbmUgPSBuZXcgVEhSRUUuTGluZShoTGluZUdlb21ldHJ5LCBsaW5lTWF0ZXJpYWwpO1xuXG4gICAgbGluZXMuYWRkKGhMaW5lKTtcbiAgfVxuXG4gIC8vIHZlcnRpY2FsXG4gIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5wYXJhbWV0ZXJzLnN0ZXBzWDsgaysrKSB7XG4gICAgdmFyIHZMaW5lR2VvbWV0cnkgPSBuZXcgVEhSRUUuR2VvbWV0cnkoKTtcblxuICAgIGZvciAodmFyIGwgPSAwOyBsIDwgdGhpcy5wYXJhbWV0ZXJzLnN0ZXBzWTsgbCsrKSB7XG4gICAgICB2TGluZUdlb21ldHJ5LnZlcnRpY2VzLnB1c2goXG4gICAgICAgIHRoaXMucG9pbnRzLnZlcnRpY2VzWyhrICogdGhpcy5wYXJhbWV0ZXJzLnN0ZXBzWSkgKyBsXVxuICAgICAgKTsgICAgICAgIFxuICAgIH1cblxuICAgIHZhciB2TGluZSA9IG5ldyBUSFJFRS5MaW5lKHZMaW5lR2VvbWV0cnksIGxpbmVNYXRlcmlhbCk7XG5cbiAgICBsaW5lcy5hZGQodkxpbmUpO1xuICB9XG5cbiAgZ3JvdXAuYWRkKGxpbmVzKTtcblxuICAvLyBleHBvcnRzXG4gIHRoaXMucG9pbnRzID0gcG9pbnRDbG91ZDtcbiAgdGhpcy5saW5lcyA9IGxpbmVzO1xuICB0aGlzLmVsID0gZ3JvdXA7XG59O1xuXG4vKipcbiAqIEFwcGx5IGEgZm9yY2Ugb250byB0aGUgZ3JpZFxuICpcbiAqIEBtZXRob2QgYXBwbHlGb3JjZVxuICogQHBhcmFtIHtUSFJFRS5WZWN0b3IzfSBbY2VudGVyXSBXaGVyZSB0byBhcHBseSB0aGUgZm9yY2VcbiAqIEBwYXJhbSB7TnVtYmVyfSBbc3RyZW5ndGhdIFN0cmVuZ3RoIG9mIHRoZSBmb3JjZVxuICovXG5HcmlkLnByb3RvdHlwZS5hcHBseUZvcmNlID0gZnVuY3Rpb24gKGNlbnRlciwgc3RyZW5ndGgpIHtcbiAgLy8gdXBkYXRlIHBvaW50c1xuICBmb3IgKHZhciBpID0gMCwgaiA9IHRoaXMucG9pbnRzLmdlb21ldHJ5LnZlcnRpY2VzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgIHZhciBkaXN0ID0gdGhpcy5wb2ludHMuZ2VvbWV0cnkudmVydGljZXNbaV0uZGlzdGFuY2VUbyhjZW50ZXIpO1xuXG4gICAgdGhpcy5wb2ludHMuZ2VvbWV0cnkudmVydGljZXNbaV0ueiAtPSAoc3RyZW5ndGggKiAxMCkgLyBNYXRoLnNxcnQoZGlzdCAqIDIgKSAtIChzdHJlbmd0aCAqIDIpO1xuICB9XG4gIHRoaXMucG9pbnRzLmdlb21ldHJ5LnZlcnRpY2VzTmVlZFVwZGF0ZSA9IHRydWU7XG5cbiAgLy8gdXBkYXRlIGxpbmVzXG4gIGZvciAodmFyIGsgPSAwLCBsID0gdGhpcy5saW5lcy5jaGlsZHJlbi5sZW5ndGg7IGsgPCBsOyBrKyspIHtcbiAgICB2YXIgZ2VvbWV0cnkgPSB0aGlzLmxpbmVzLmNoaWxkcmVuW2tdLmdlb21ldHJ5O1xuXG4gICAgLy8gdXBkYXRlIHZlcnRpY2VzIGNvbG9yc1xuICAgIGZvciAodmFyIG0gPSAwLCBuID0gZ2VvbWV0cnkudmVydGljZXMubGVuZ3RoOyBtIDwgbjsgbSsrKSB7XG4gICAgICB2YXIgdmVydGV4ID0gZ2VvbWV0cnkudmVydGljZXNbbV07XG4gICAgICB2YXIgcGVyY2VudCA9IG1hcCh2ZXJ0ZXgueiwgWzAsIDVdLCBbMCwgMV0pO1xuICAgICAgcGVyY2VudCA9IE1hdGgucm91bmQocGVyY2VudCAqIDEwKSAvIDEwO1xuXG4gICAgICBnZW9tZXRyeS5jb2xvcnNbbV0gPSB0aGlzLmNvbG9yc0NhY2hlW3BlcmNlbnRdO1xuICAgIH1cblxuICAgIGdlb21ldHJ5LnZlcnRpY2VzTmVlZFVwZGF0ZSA9IHRydWU7XG4gICAgZ2VvbWV0cnkuY29sb3JzTmVlZFVwZGF0ZSA9IHRydWU7XG4gIH1cbn07XG5cbi8qKlxuICogUmVzZXQgYWxsIHRoZSBmb3JjZXMgYXBwbGllZFxuICpcbiAqIEBtZXRob2QgcmVzZXRGcm9jZVxuICovXG5HcmlkLnByb3RvdHlwZS5yZXNldEZvcmNlID0gZnVuY3Rpb24gKCkge1xuICBmb3IgKHZhciBpID0gMCwgaiA9IHRoaXMucG9pbnRzLmdlb21ldHJ5LnZlcnRpY2VzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgIHRoaXMucG9pbnRzLmdlb21ldHJ5LnZlcnRpY2VzW2ldLnogPSAwO1xuICB9XG59O1xuXG4vKipcbiAqIEdldCBncmlkIHRvdGFsIHNpemVcbiAqXG4gKiBAbWV0aG9kIGdldFNpemVcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuR3JpZC5wcm90b3R5cGUuZ2V0U2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHdpZHRoID0gKHRoaXMucGFyYW1ldGVycy5zdGVwc1ggLSAxKSAqIHRoaXMucGFyYW1ldGVycy5zdGVwU2l6ZTtcbiAgdmFyIGhlaWdodCA9ICh0aGlzLnBhcmFtZXRlcnMuc3RlcHNZIC0gMSkgKiB0aGlzLnBhcmFtZXRlcnMuc3RlcFNpemU7XG5cbiAgcmV0dXJuIHtcbiAgICB4OiB7XG4gICAgICBtaW46IC0od2lkdGggLyAyKSxcbiAgICAgIG1heDogKHRoaXMucGFyYW1ldGVycy5zdGVwc1ggKiB0aGlzLnBhcmFtZXRlcnMuc3RlcFNpemUpIC0gKHdpZHRoIC8gMilcbiAgICB9LFxuICAgIHk6IHtcbiAgICAgIG1pbjogLShoZWlnaHQgLyAyKSxcbiAgICAgIG1heDogKHRoaXMucGFyYW1ldGVycy5zdGVwc1kgKiB0aGlzLnBhcmFtZXRlcnMuc3RlcFNpemUpIC0gKGhlaWdodCAvIDIpXG4gICAgfVxuICB9O1xufTtcblxuLyoqXG4gKiBHcmF2aXR5IGdyaWRcbiAqXG4gKiBAY2xhc3MgR3Jhdml0eUdyaWRcbiAqIEBjb25zdHJ1Y3RvclxuICogQHJlcXVpcmVzIFRIUkVFLCBUV0VFTlxuICovXG5mdW5jdGlvbiBHcmF2aXR5R3JpZCAob3B0aW9ucykge1xuICB2YXIgZ3JvdXAgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKTtcblxuICB2YXIgZ3JpZCA9IG5ldyBHcmlkKHtcbiAgICBzdGVwc1g6IDMwLFxuICAgIHN0ZXBzWTogMzAsXG4gICAgbGluZXNDb2xvcjogb3B0aW9ucy5saW5lc0NvbG9yIHx8ICcjNjY2NjY2J1xuICB9KTtcbiAgZ3JvdXAuYWRkKGdyaWQuZWwpO1xuXG4gIHZhciBzaXplID0gZ3JpZC5nZXRTaXplKCk7XG4gIHZhciByYW5nZVggPSBzaXplLng7XG4gIHZhciByYW5nZVkgPSBzaXplLnk7XG5cbiAgdmFyIHNwaGVyZVJhZGl1cyA9IDU7XG4gIHZhciBtYXNzID0gNTtcbiAgdmFyIHNwaGVyZUdlb21ldHJ5ID0gbmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5KHNwaGVyZVJhZGl1cywgMjAsIDIwKTtcbiAgdmFyIHNwaGVyZU1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtcbiAgICBjb2xvcjogJyNmZmZmZmYnXG4gIH0pO1xuICB2YXIgc3BoZXJlTWVzaCA9IG5ldyBUSFJFRS5NZXNoKHNwaGVyZUdlb21ldHJ5LCBzcGhlcmVNYXRlcmlhbCk7XG4gIHNwaGVyZU1lc2gucG9zaXRpb24uc2V0KDAsIDMwLCA0MCk7XG4gIGdyb3VwLmFkZChzcGhlcmVNZXNoKTtcblxuICB2YXIgc2F0ZWxsaXRlQSA9IHNwaGVyZU1lc2guY2xvbmUoKTtcbiAgdmFyIHNhdGVsbGl0ZUIgPSBzcGhlcmVNZXNoLmNsb25lKCk7XG5cbiAgc2F0ZWxsaXRlQS5zY2FsZS54ID0gc2F0ZWxsaXRlQS5zY2FsZS55ID0gc2F0ZWxsaXRlQS5zY2FsZS56ID0gMC41O1xuICBzYXRlbGxpdGVCLnNjYWxlLnggPSBzYXRlbGxpdGVCLnNjYWxlLnkgPSBzYXRlbGxpdGVCLnNjYWxlLnogPSAwLjI1O1xuXG4gIHNhdGVsbGl0ZUEucG9zaXRpb24ueiA9IDY7XG4gIHNhdGVsbGl0ZUIucG9zaXRpb24ueiA9IDY7XG5cbiAgdmFyIG1hc3NBID0gMi41O1xuICB2YXIgbWFzc0IgPSAyO1xuXG4gIGdyb3VwLmFkZChzYXRlbGxpdGVBKTtcbiAgZ3JvdXAuYWRkKHNhdGVsbGl0ZUIpO1xuICBcbiAgdmFyIGNhY2hlID0geyB4QTogMCwgeUE6IDAsIHhCOiAwLCB5QjogMCB9O1xuXG4gIGZ1bmN0aW9uIHNldElkbGVUd2VlbiAocGF1c2VkKSB7XG4gICAgdmFyIHByb3BlcnRpZXMgPSB7XG4gICAgICBiZXppZXI6IHtcbiAgICAgICAgdHlwZTogJ3NvZnQnLFxuICAgICAgICB2YWx1ZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB4QTogcmFuZG9tKHJhbmdlWC5taW4sIHJhbmdlWC5tYXgpLFxuICAgICAgICAgICAgeUE6IHJhbmRvbShyYW5nZVgubWluLCByYW5nZVgubWF4KSxcbiAgICAgICAgICAgIHhCOiByYW5kb20ocmFuZ2VYLm1pbiwgcmFuZ2VYLm1heCksXG4gICAgICAgICAgICB5QjogcmFuZG9tKHJhbmdlWS5taW4sIHJhbmdlWS5tYXgpXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB4QTogcmFuZG9tKHJhbmdlWC5taW4sIHJhbmdlWC5tYXgpLFxuICAgICAgICAgICAgeUE6IHJhbmRvbShyYW5nZVgubWluLCByYW5nZVgubWF4KSxcbiAgICAgICAgICAgIHhCOiByYW5kb20ocmFuZ2VYLm1pbiwgcmFuZ2VYLm1heCksXG4gICAgICAgICAgICB5QjogcmFuZG9tKHJhbmdlWS5taW4sIHJhbmdlWS5tYXgpXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgb25VcGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2F0ZWxsaXRlQS5wb3NpdGlvbi54ID0gdGhpcy50YXJnZXQueEE7XG4gICAgICAgIHNhdGVsbGl0ZUEucG9zaXRpb24ueSA9IHRoaXMudGFyZ2V0LnlBO1xuXG4gICAgICAgIHNhdGVsbGl0ZUIucG9zaXRpb24ueCA9IHRoaXMudGFyZ2V0LnhCO1xuICAgICAgICBzYXRlbGxpdGVCLnBvc2l0aW9uLnkgPSB0aGlzLnRhcmdldC55QjtcblxuICAgICAgICBncmlkLnJlc2V0Rm9yY2UoKTtcbiAgICAgICAgZ3JpZC5hcHBseUZvcmNlKHNwaGVyZU1lc2gucG9zaXRpb24sIG1hc3MpO1xuICAgICAgICBncmlkLmFwcGx5Rm9yY2Uoc2F0ZWxsaXRlQS5wb3NpdGlvbiwgbWFzc0EpO1xuICAgICAgICBncmlkLmFwcGx5Rm9yY2Uoc2F0ZWxsaXRlQi5wb3NpdGlvbiwgbWFzc0IpO1xuICAgICAgfSxcbiAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWRsZVR3ZWVuID0gc2V0SWRsZVR3ZWVuKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmIChwYXVzZWQpIHtcbiAgICAgIHByb3BlcnRpZXMucGF1c2VkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gVHdlZW5MaXRlLnRvKGNhY2hlLCAyLCBwcm9wZXJ0aWVzKTtcbiAgfVxuXG4gIHZhciBpZGxlVHdlZW4gPSBzZXRJZGxlVHdlZW4odHJ1ZSk7XG4gIFxuICAvLyBhbmltYXRlIGZvciA1MCBtcyB0byBwdXQgdGhlIHNwaGVyZSBpbiB0aGUgcmlnaHQgcG9zaXRpb25cbiAgaWRsZVR3ZWVuLnJlc3VtZSgpO1xuICBUd2VlbkxpdGUuZGVsYXllZENhbGwoMC4xLCBmdW5jdGlvbiAoKSB7XG4gICAgaWRsZVR3ZWVuLnBhdXNlKCk7XG4gIH0pO1xuXG4gIHRoaXMuZWwgPSBncm91cDtcblxuICB0aGlzLmluID0gZnVuY3Rpb24gKCkge1xuICAgIFR3ZWVuTGl0ZS50byhzcGhlcmVNZXNoLnBvc2l0aW9uLCAxLCB7XG4gICAgICAgIHg6IChyYW5nZVgubWF4ICsgcmFuZ2VYLm1pbikgLyAyLFxuICAgICAgICB5OiAocmFuZ2VZLm1heCArIHJhbmdlWS5taW4pIC8gMixcbiAgICAgICAgejogNSxcbiAgICAgICAgZGVsYXk6IDAuMlxuICAgICAgfSk7XG4gIH07XG5cbiAgdGhpcy5vdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgVHdlZW5MaXRlLnRvKHNwaGVyZU1lc2gucG9zaXRpb24sIDEsIHsgeDogMCwgeTogMzAsIHo6IDQwLCBkZWxheTogMC4yIH0pO1xuICB9O1xuXG4gIHRoaXMuc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWRsZVR3ZWVuLnJlc3VtZSgpO1xuICB9O1xuXG4gIHRoaXMuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZGxlVHdlZW4ucGF1c2UoKTtcbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBHcmF2aXR5R3JpZDsiXX0=
},{"../utils/mapUtil":63,"../utils/randomUtil":65}],33:[function(require,module,exports){
(function (global){
'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var TweenLite = (typeof window !== "undefined" ? window['TweenLite'] : typeof global !== "undefined" ? global['TweenLite'] : null);

var random = require('../utils/randomUtil');
var yoyo = require('../utils/yoyoUtil');

/**
 * Animated grid
 *
 * @class Grid
 * @constructor
 * @param {Object} [options]
 * @param {Boolean} [options.points=false] Points?
 * @param {Number} [options.divisionsSize=10] Divisions size
 * @param {Number} [options.divisionsX=11] X axis divisions
 * @param {Number} [options.divisionsY=11] Y axis divisions
 * @param {String} [options.fromColor='#ffffff'] On color
 * @param {String} [options.toColor='#0a0a0a'] Off color
 * @requires jQuery, THREE, TweenLite, random, yoyo
 */
function Grid (options) {
  this.parameters = jQuery.extend(Grid.defaultOptions, options);

  this.width = (this.parameters.divisionsX - 1) * this.parameters.divisionsSize;
  this.height = (this.parameters.divisionsY - 1) * this.parameters.divisionsSize;

  var group = new THREE.Object3D();

  var vertices = this.getVertices();

  if (this.parameters.points) {
    var pointsGeometry = new THREE.Geometry();

    for (var i = 0, j = vertices.length; i < j; i++) {
      pointsGeometry.vertices.push(vertices[i][0]);
      pointsGeometry.vertices.push(vertices[i][1]);
      pointsGeometry.vertices.push(vertices[i][2]);
    }
    
    var pointsMaterial = new THREE.PointCloudMaterial({ size: 0.2 });
    var points = new THREE.PointCloud(pointsGeometry, pointsMaterial);

    group.add(points);
  }

  var lineMaterial = new THREE.LineBasicMaterial({
    vertexColors: THREE.VertexColors,
    linewidth: 1
  });

  var colorsCache = {};
  var fromColor = new THREE.Color(this.parameters.fromColor);
  var toColor = new THREE.Color(this.parameters.toColor);

  var idleTweens = [];

  for (var k = 0, l = vertices.length; k < l; k++) {
    var lineGeometry = new THREE.Geometry();

    var firstTo = vertices[k][0].clone();
    var secondTo = vertices[k][2].clone();

    lineGeometry.vertices.push(vertices[k][1].clone());
    lineGeometry.vertices.push(vertices[k][1]);
    lineGeometry.vertices.push(vertices[k][1].clone());

    for (var m = 0, n = lineGeometry.vertices.length; m < n; m++) {

      var color = null;
      var percent = null;

      if (k >= this.parameters.divisionsX) {
        // horizontal
        var y = lineGeometry.vertices[m].y;
        percent = Math.abs((y * 100 / this.height) / 100);
      } else {
        // vertical
        var x = lineGeometry.vertices[m].x;
        percent = Math.abs((x * 100 / this.width) / 100);
      }

      if (!colorsCache[percent]) {
        color = fromColor.clone().lerp(toColor, percent + 0.2);
        colorsCache[percent] = color;
      } else {
        color = colorsCache[percent];
      }

      lineGeometry.colors.push(toColor);
      lineGeometry.colors.push(color);
      lineGeometry.colors.push(toColor);
    }

    var line = new THREE.Line(lineGeometry, lineMaterial);

    idleTweens.push(this.getTween(line, line.geometry.vertices[0], firstTo));
    idleTweens.push(this.getTween(line, line.geometry.vertices[2], secondTo));
    
    group.add(line);
  }

  this.el = group;

  this.start = function () {
    for (var i = 0, j = idleTweens.length; i < j; i++) {
      idleTweens[i].resume();
    }
  };

  this.stop = function () {
    for (var i = 0, j = idleTweens.length; i < j; i++) {
      idleTweens[i].pause();
    }
  };

  this.in = function () {
    TweenLite.to(group.position, 1, { y: 0 });
  };

  this.out = function (way) {
    var y = way === 'up' ? -50 : 50;
    TweenLite.to(group.position, 1, { y: y });
  };
}

Grid.defaultOptions = {
  points: false,
  divisionsSize: 10,
  divisionsX: 11,
  divisionsY: 11,
  fromColor: '#ffffff',
  toColor: '#0a0a0a'
};

/**
 * Get vertices
 *
 * @method getVertices
 * @return {Array} vertices
 */
Grid.prototype.getVertices = function () {
  var vertices = [];

  // horizontal
  for (var x = 0; x < this.parameters.divisionsX; x++) {
    var xPosH = (x * this.parameters.divisionsSize) - (this.width / 2);
    var yPosH = this.height - (this.height / 2);

    vertices.push([
      new THREE.Vector3(xPosH, -this.height / 2, 0),
      new THREE.Vector3(xPosH, yPosH - (this.height / 2) , 0),
      new THREE.Vector3(xPosH, yPosH, 0)
    ]);
  }

  // vertical
  for (var y = 0; y < this.parameters.divisionsY; y++) {
    var xPosV = this.width - (this.width / 2);
    var yPosV = (y * this.parameters.divisionsSize) - (this.height / 2);

    vertices.push([
      new THREE.Vector3(-this.width / 2, yPosV, 0),
      new THREE.Vector3(xPosV - (this.width / 2), yPosV, 0),
      new THREE.Vector3(xPosV, yPosV, 0)
    ]);
  }

  return vertices;
};

/**
 * Get line animation
 *
 * @method getTween
 * @param {THREE.Line} [line] Line to animate
 * @param {THREE.Vector3} [from] Start coordinates
 * @param {THREE.Vector3} [to] End coordinates
 */
Grid.prototype.getTween = function (line, from, to) {
  var parameters = {
    paused: true,
    delay: random(0, 2),
    onUpdate: function () {
      line.geometry.verticesNeedUpdate = true;
      line.geometry.computeBoundingSphere();
    },
    onComplete: yoyo,
    onReverseComplete: yoyo,
    x: to.x,
    y: to.y,
    z: to.z
  };

  return TweenLite.to(from, random(1, 2), parameters);
};

module.exports = Grid;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvb2JqZWN0czNEL0dyaWRPYmplY3QzRC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgalF1ZXJ5ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ2pRdWVyeSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnalF1ZXJ5J10gOiBudWxsKTtcbnZhciBUSFJFRSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydUSFJFRSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnVEhSRUUnXSA6IG51bGwpO1xudmFyIFR3ZWVuTGl0ZSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydUd2VlbkxpdGUnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1R3ZWVuTGl0ZSddIDogbnVsbCk7XG5cbnZhciByYW5kb20gPSByZXF1aXJlKCcuLi91dGlscy9yYW5kb21VdGlsJyk7XG52YXIgeW95byA9IHJlcXVpcmUoJy4uL3V0aWxzL3lveW9VdGlsJyk7XG5cbi8qKlxuICogQW5pbWF0ZWQgZ3JpZFxuICpcbiAqIEBjbGFzcyBHcmlkXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMucG9pbnRzPWZhbHNlXSBQb2ludHM/XG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuZGl2aXNpb25zU2l6ZT0xMF0gRGl2aXNpb25zIHNpemVcbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5kaXZpc2lvbnNYPTExXSBYIGF4aXMgZGl2aXNpb25zXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuZGl2aXNpb25zWT0xMV0gWSBheGlzIGRpdmlzaW9uc1xuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmZyb21Db2xvcj0nI2ZmZmZmZiddIE9uIGNvbG9yXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMudG9Db2xvcj0nIzBhMGEwYSddIE9mZiBjb2xvclxuICogQHJlcXVpcmVzIGpRdWVyeSwgVEhSRUUsIFR3ZWVuTGl0ZSwgcmFuZG9tLCB5b3lvXG4gKi9cbmZ1bmN0aW9uIEdyaWQgKG9wdGlvbnMpIHtcbiAgdGhpcy5wYXJhbWV0ZXJzID0galF1ZXJ5LmV4dGVuZChHcmlkLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcblxuICB0aGlzLndpZHRoID0gKHRoaXMucGFyYW1ldGVycy5kaXZpc2lvbnNYIC0gMSkgKiB0aGlzLnBhcmFtZXRlcnMuZGl2aXNpb25zU2l6ZTtcbiAgdGhpcy5oZWlnaHQgPSAodGhpcy5wYXJhbWV0ZXJzLmRpdmlzaW9uc1kgLSAxKSAqIHRoaXMucGFyYW1ldGVycy5kaXZpc2lvbnNTaXplO1xuXG4gIHZhciBncm91cCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuXG4gIHZhciB2ZXJ0aWNlcyA9IHRoaXMuZ2V0VmVydGljZXMoKTtcblxuICBpZiAodGhpcy5wYXJhbWV0ZXJzLnBvaW50cykge1xuICAgIHZhciBwb2ludHNHZW9tZXRyeSA9IG5ldyBUSFJFRS5HZW9tZXRyeSgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGogPSB2ZXJ0aWNlcy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgIHBvaW50c0dlb21ldHJ5LnZlcnRpY2VzLnB1c2godmVydGljZXNbaV1bMF0pO1xuICAgICAgcG9pbnRzR2VvbWV0cnkudmVydGljZXMucHVzaCh2ZXJ0aWNlc1tpXVsxXSk7XG4gICAgICBwb2ludHNHZW9tZXRyeS52ZXJ0aWNlcy5wdXNoKHZlcnRpY2VzW2ldWzJdKTtcbiAgICB9XG4gICAgXG4gICAgdmFyIHBvaW50c01hdGVyaWFsID0gbmV3IFRIUkVFLlBvaW50Q2xvdWRNYXRlcmlhbCh7IHNpemU6IDAuMiB9KTtcbiAgICB2YXIgcG9pbnRzID0gbmV3IFRIUkVFLlBvaW50Q2xvdWQocG9pbnRzR2VvbWV0cnksIHBvaW50c01hdGVyaWFsKTtcblxuICAgIGdyb3VwLmFkZChwb2ludHMpO1xuICB9XG5cbiAgdmFyIGxpbmVNYXRlcmlhbCA9IG5ldyBUSFJFRS5MaW5lQmFzaWNNYXRlcmlhbCh7XG4gICAgdmVydGV4Q29sb3JzOiBUSFJFRS5WZXJ0ZXhDb2xvcnMsXG4gICAgbGluZXdpZHRoOiAxXG4gIH0pO1xuXG4gIHZhciBjb2xvcnNDYWNoZSA9IHt9O1xuICB2YXIgZnJvbUNvbG9yID0gbmV3IFRIUkVFLkNvbG9yKHRoaXMucGFyYW1ldGVycy5mcm9tQ29sb3IpO1xuICB2YXIgdG9Db2xvciA9IG5ldyBUSFJFRS5Db2xvcih0aGlzLnBhcmFtZXRlcnMudG9Db2xvcik7XG5cbiAgdmFyIGlkbGVUd2VlbnMgPSBbXTtcblxuICBmb3IgKHZhciBrID0gMCwgbCA9IHZlcnRpY2VzLmxlbmd0aDsgayA8IGw7IGsrKykge1xuICAgIHZhciBsaW5lR2VvbWV0cnkgPSBuZXcgVEhSRUUuR2VvbWV0cnkoKTtcblxuICAgIHZhciBmaXJzdFRvID0gdmVydGljZXNba11bMF0uY2xvbmUoKTtcbiAgICB2YXIgc2Vjb25kVG8gPSB2ZXJ0aWNlc1trXVsyXS5jbG9uZSgpO1xuXG4gICAgbGluZUdlb21ldHJ5LnZlcnRpY2VzLnB1c2godmVydGljZXNba11bMV0uY2xvbmUoKSk7XG4gICAgbGluZUdlb21ldHJ5LnZlcnRpY2VzLnB1c2godmVydGljZXNba11bMV0pO1xuICAgIGxpbmVHZW9tZXRyeS52ZXJ0aWNlcy5wdXNoKHZlcnRpY2VzW2tdWzFdLmNsb25lKCkpO1xuXG4gICAgZm9yICh2YXIgbSA9IDAsIG4gPSBsaW5lR2VvbWV0cnkudmVydGljZXMubGVuZ3RoOyBtIDwgbjsgbSsrKSB7XG5cbiAgICAgIHZhciBjb2xvciA9IG51bGw7XG4gICAgICB2YXIgcGVyY2VudCA9IG51bGw7XG5cbiAgICAgIGlmIChrID49IHRoaXMucGFyYW1ldGVycy5kaXZpc2lvbnNYKSB7XG4gICAgICAgIC8vIGhvcml6b250YWxcbiAgICAgICAgdmFyIHkgPSBsaW5lR2VvbWV0cnkudmVydGljZXNbbV0ueTtcbiAgICAgICAgcGVyY2VudCA9IE1hdGguYWJzKCh5ICogMTAwIC8gdGhpcy5oZWlnaHQpIC8gMTAwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHZlcnRpY2FsXG4gICAgICAgIHZhciB4ID0gbGluZUdlb21ldHJ5LnZlcnRpY2VzW21dLng7XG4gICAgICAgIHBlcmNlbnQgPSBNYXRoLmFicygoeCAqIDEwMCAvIHRoaXMud2lkdGgpIC8gMTAwKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFjb2xvcnNDYWNoZVtwZXJjZW50XSkge1xuICAgICAgICBjb2xvciA9IGZyb21Db2xvci5jbG9uZSgpLmxlcnAodG9Db2xvciwgcGVyY2VudCArIDAuMik7XG4gICAgICAgIGNvbG9yc0NhY2hlW3BlcmNlbnRdID0gY29sb3I7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb2xvciA9IGNvbG9yc0NhY2hlW3BlcmNlbnRdO1xuICAgICAgfVxuXG4gICAgICBsaW5lR2VvbWV0cnkuY29sb3JzLnB1c2godG9Db2xvcik7XG4gICAgICBsaW5lR2VvbWV0cnkuY29sb3JzLnB1c2goY29sb3IpO1xuICAgICAgbGluZUdlb21ldHJ5LmNvbG9ycy5wdXNoKHRvQ29sb3IpO1xuICAgIH1cblxuICAgIHZhciBsaW5lID0gbmV3IFRIUkVFLkxpbmUobGluZUdlb21ldHJ5LCBsaW5lTWF0ZXJpYWwpO1xuXG4gICAgaWRsZVR3ZWVucy5wdXNoKHRoaXMuZ2V0VHdlZW4obGluZSwgbGluZS5nZW9tZXRyeS52ZXJ0aWNlc1swXSwgZmlyc3RUbykpO1xuICAgIGlkbGVUd2VlbnMucHVzaCh0aGlzLmdldFR3ZWVuKGxpbmUsIGxpbmUuZ2VvbWV0cnkudmVydGljZXNbMl0sIHNlY29uZFRvKSk7XG4gICAgXG4gICAgZ3JvdXAuYWRkKGxpbmUpO1xuICB9XG5cbiAgdGhpcy5lbCA9IGdyb3VwO1xuXG4gIHRoaXMuc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGogPSBpZGxlVHdlZW5zLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgICAgaWRsZVR3ZWVuc1tpXS5yZXN1bWUoKTtcbiAgICB9XG4gIH07XG5cbiAgdGhpcy5zdG9wID0gZnVuY3Rpb24gKCkge1xuICAgIGZvciAodmFyIGkgPSAwLCBqID0gaWRsZVR3ZWVucy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgIGlkbGVUd2VlbnNbaV0ucGF1c2UoKTtcbiAgICB9XG4gIH07XG5cbiAgdGhpcy5pbiA9IGZ1bmN0aW9uICgpIHtcbiAgICBUd2VlbkxpdGUudG8oZ3JvdXAucG9zaXRpb24sIDEsIHsgeTogMCB9KTtcbiAgfTtcblxuICB0aGlzLm91dCA9IGZ1bmN0aW9uICh3YXkpIHtcbiAgICB2YXIgeSA9IHdheSA9PT0gJ3VwJyA/IC01MCA6IDUwO1xuICAgIFR3ZWVuTGl0ZS50byhncm91cC5wb3NpdGlvbiwgMSwgeyB5OiB5IH0pO1xuICB9O1xufVxuXG5HcmlkLmRlZmF1bHRPcHRpb25zID0ge1xuICBwb2ludHM6IGZhbHNlLFxuICBkaXZpc2lvbnNTaXplOiAxMCxcbiAgZGl2aXNpb25zWDogMTEsXG4gIGRpdmlzaW9uc1k6IDExLFxuICBmcm9tQ29sb3I6ICcjZmZmZmZmJyxcbiAgdG9Db2xvcjogJyMwYTBhMGEnXG59O1xuXG4vKipcbiAqIEdldCB2ZXJ0aWNlc1xuICpcbiAqIEBtZXRob2QgZ2V0VmVydGljZXNcbiAqIEByZXR1cm4ge0FycmF5fSB2ZXJ0aWNlc1xuICovXG5HcmlkLnByb3RvdHlwZS5nZXRWZXJ0aWNlcyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHZlcnRpY2VzID0gW107XG5cbiAgLy8gaG9yaXpvbnRhbFxuICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMucGFyYW1ldGVycy5kaXZpc2lvbnNYOyB4KyspIHtcbiAgICB2YXIgeFBvc0ggPSAoeCAqIHRoaXMucGFyYW1ldGVycy5kaXZpc2lvbnNTaXplKSAtICh0aGlzLndpZHRoIC8gMik7XG4gICAgdmFyIHlQb3NIID0gdGhpcy5oZWlnaHQgLSAodGhpcy5oZWlnaHQgLyAyKTtcblxuICAgIHZlcnRpY2VzLnB1c2goW1xuICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoeFBvc0gsIC10aGlzLmhlaWdodCAvIDIsIDApLFxuICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoeFBvc0gsIHlQb3NIIC0gKHRoaXMuaGVpZ2h0IC8gMikgLCAwKSxcbiAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKHhQb3NILCB5UG9zSCwgMClcbiAgICBdKTtcbiAgfVxuXG4gIC8vIHZlcnRpY2FsXG4gIGZvciAodmFyIHkgPSAwOyB5IDwgdGhpcy5wYXJhbWV0ZXJzLmRpdmlzaW9uc1k7IHkrKykge1xuICAgIHZhciB4UG9zViA9IHRoaXMud2lkdGggLSAodGhpcy53aWR0aCAvIDIpO1xuICAgIHZhciB5UG9zViA9ICh5ICogdGhpcy5wYXJhbWV0ZXJzLmRpdmlzaW9uc1NpemUpIC0gKHRoaXMuaGVpZ2h0IC8gMik7XG5cbiAgICB2ZXJ0aWNlcy5wdXNoKFtcbiAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKC10aGlzLndpZHRoIC8gMiwgeVBvc1YsIDApLFxuICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoeFBvc1YgLSAodGhpcy53aWR0aCAvIDIpLCB5UG9zViwgMCksXG4gICAgICBuZXcgVEhSRUUuVmVjdG9yMyh4UG9zViwgeVBvc1YsIDApXG4gICAgXSk7XG4gIH1cblxuICByZXR1cm4gdmVydGljZXM7XG59O1xuXG4vKipcbiAqIEdldCBsaW5lIGFuaW1hdGlvblxuICpcbiAqIEBtZXRob2QgZ2V0VHdlZW5cbiAqIEBwYXJhbSB7VEhSRUUuTGluZX0gW2xpbmVdIExpbmUgdG8gYW5pbWF0ZVxuICogQHBhcmFtIHtUSFJFRS5WZWN0b3IzfSBbZnJvbV0gU3RhcnQgY29vcmRpbmF0ZXNcbiAqIEBwYXJhbSB7VEhSRUUuVmVjdG9yM30gW3RvXSBFbmQgY29vcmRpbmF0ZXNcbiAqL1xuR3JpZC5wcm90b3R5cGUuZ2V0VHdlZW4gPSBmdW5jdGlvbiAobGluZSwgZnJvbSwgdG8pIHtcbiAgdmFyIHBhcmFtZXRlcnMgPSB7XG4gICAgcGF1c2VkOiB0cnVlLFxuICAgIGRlbGF5OiByYW5kb20oMCwgMiksXG4gICAgb25VcGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGxpbmUuZ2VvbWV0cnkudmVydGljZXNOZWVkVXBkYXRlID0gdHJ1ZTtcbiAgICAgIGxpbmUuZ2VvbWV0cnkuY29tcHV0ZUJvdW5kaW5nU3BoZXJlKCk7XG4gICAgfSxcbiAgICBvbkNvbXBsZXRlOiB5b3lvLFxuICAgIG9uUmV2ZXJzZUNvbXBsZXRlOiB5b3lvLFxuICAgIHg6IHRvLngsXG4gICAgeTogdG8ueSxcbiAgICB6OiB0by56XG4gIH07XG5cbiAgcmV0dXJuIFR3ZWVuTGl0ZS50byhmcm9tLCByYW5kb20oMSwgMiksIHBhcmFtZXRlcnMpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBHcmlkOyJdfQ==
},{"../utils/randomUtil":65,"../utils/yoyoUtil":66}],34:[function(require,module,exports){
(function (global){
/* jshint laxbreak: true */
/* jshint shadow:true */

'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var TweenLite = (typeof window !== "undefined" ? window['TweenLite'] : typeof global !== "undefined" ? global['TweenLite'] : null);

var Events = require('../classes/EventsClass');

var random = require('../utils/randomUtil');
var map = require('../utils/mapUtil');

/**
 * Animated height map
 *
 * @class HeightMap
 * @constructor
 * @param {Object} [options]
 * @param {Boolean} [options.horizontal=true] Horizontal lines?
 * @param {Boolean} [options.vertical=false] Vertical lines?
 * @param {Boolean} [options.plane=false] Plane?
 * @param {Boolean} [options.points=false] Points?
 * @param {Number} [options.divisionsX=30] X axis divisions
 * @param {Number} [options.divisionsY=30] Y axis divisions
 * @param {String} [options.fromColor='#4c4c4c'] Height min color
 * @param {String} [options.toColor='#ffffff'] Height max color
 * @param {Array} [options.maps=[]] Maps sources
 * @requires jQuery, THREE, TweenLite, Events, random, map
 */
function HeightMap (options) {
  this.parameters = jQuery.extend(HeightMap.defaultOptions, options);

  this.events = new Events();

  this.fromColor = new THREE.Color(this.parameters.fromColor);
  this.toColor = new THREE.Color(this.parameters.toColor);
  this.colorsCache = {};
  this.faceIndices = ['a', 'b', 'c', 'd'];

  this.ready = false;
  this.data = null;
  this.total = this.parameters.maps.length;
  this.previous = undefined;
  this.current = undefined;

  var group = new THREE.Object3D();

  this.geometry = new THREE.PlaneGeometry(50, 50, this.parameters.divisionsX, this.parameters.divisionsY);

  if (this.parameters.plane) {
    this.plane = this.getPlane();
    group.add(this.plane);
  }

  if (this.parameters.points) {
    this.points = this.getPoints();
    group.add(this.points);
  }

  if (this.parameters.horizontal || this.parameters.vertical) {
    this.lines = this.getLines();
    group.add(this.lines);
  }

  this.loadMaps();

  this.el = group;

  this.start = function () {};
  
  this.stop = this.start;

  this.on('ready', function () {
    this.ready = true;

    var idleTween = this.getIdleTween();

    this.start = function () {
      idleTween.resume();
    };

    this.stop = function () {
      idleTween.pause();
    };
  }.bind(this));
}

HeightMap.defaultOptions = {
  horizontal: true,
  vertical: false,
  plane: false,
  points: false,
  divisionsX: 30,
  divisionsY: 30,
  fromColor: '#4c4c4c',
  toColor: '#ffffff',
  maps: []
};

/**
 * Get plane
 *
 * @method getPlane
 * @param {THREE.Geometry} geometry
 * @return {THREE.Mesh}
 */
HeightMap.prototype.getPlane = function () {
  var material = new THREE.MeshLambertMaterial({
    shading: THREE.FlatShading,
    vertexColors: THREE.VertexColors
  });

  var plane = new THREE.Mesh(this.geometry, material);

  return plane;
};

/**
 * Get points
 *
 * @method getPoints
 * @param {THREE.Geometry} geometry
 * @return {THREE.PointCloud}
 */
HeightMap.prototype.getPoints = function () {
  var material = new THREE.PointCloudMaterial({ size: 0.3 });
  var points = new THREE.PointCloud(this.geometry, material);

  return points;
};

/**
 * Get lines
 *
 * @method getLines
 * @param {THREE.Geometry} geometry
 * @return {THREE.Object3D}
 */
HeightMap.prototype.getLines = function () {
  var material = new THREE.LineBasicMaterial({
    vertexColors: THREE.VertexColors
  });

  var lines = new THREE.Object3D();

  if (this.parameters.vertical) {
    for (var x = 0; x < this.parameters.divisionsX + 1; x++) {
      var lineGeometry = new THREE.Geometry();

      for (var y = 0; y < this.parameters.divisionsY + 1; y++) {
        var vertex = this.geometry.vertices[x + ((y * this.parameters.divisionsX) + y)];
        lineGeometry.vertices.push(vertex);
      }

      var line = new THREE.Line(lineGeometry, material);
      lines.add(line);
    }
  }

  if (this.parameters.horizontal) {
    for (var y = 0; y < this.parameters.divisionsY + 1; y++) {
      var lineGeometry = new THREE.Geometry();

      for (var x = 0; x < this.parameters.divisionsX + 1; x++) {
        var vertex = this.geometry.vertices[(y * (this.parameters.divisionsX + 1)) + x];
        lineGeometry.vertices.push(vertex);

        if (x === 0) {
          vertex.x -= random(0, 20);
        }

        if (x === this.parameters.divisionsX) {
          vertex.x += random(0, 20);
        }
      }

      var line = new THREE.Line(lineGeometry, material);
      lines.add(line);
    }
  }

  return lines;
};

/**
 * Get animations
 *
 * @method getIdleTween
 * @return {TweenLite}
 */
HeightMap.prototype.getIdleTween = function () {
  var _this = this;

  return TweenLite.to({}, 2, { paused: true,
      onComplete: function () {
        _this.current++;

        if (_this.current === _this.total) {
          _this.current = 0;
        }

        _this.applyMap();

        this.duration(random(1.5, 5));
        this.restart();
      }
    });
};

/**
 * Load maps
 *
 * @method loadMaps
 */
HeightMap.prototype.loadMaps = function () {
  var totalData = (this.parameters.divisionsX + 1) * (this.parameters.divisionsY + 1);
  this.data = { default: new Float32Array(totalData) };
  
  var loader = new THREE.ImageLoader();
  var total = this.parameters.maps.length;
  var loaded = 0;

  var addMap = function (name, image) {
    var width = image.width;
    var height = image.height;

    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    var context = canvas.getContext('2d');

    context.drawImage(image, 0, 0);

    var stepX = width / this.parameters.divisionsX;
    var stepY = height / this.parameters.divisionsY;

    var data = new Float32Array(totalData);
    var i = 0;

    for (var y = 0; y < height; y += stepY) {
      for (var x = 0; x < width; x += stepX) {
        var pixelData = context.getImageData(x, y, 1, 1).data;

        // Luminance = R + G + B
        // int8 must be in the [-127, 127] range
        // Max luminance = 765 (255 * 3), dividing by 10 ensures it can only be 76.5 at max
        data[i++] = (pixelData[0] + pixelData[1] + pixelData[2]) / 100;
      }
    }

    _this.data[name] = data;
  }.bind(this);

  var _this = this;
  
  function loadMap (map, index) {
    loader.load(map.url, function (image) {
      addMap(map.name, image);

      loaded++;

      if (loaded === 1) {
        _this.current = index;
        _this.applyMap();
      }

      if (loaded === total) {
        _this.trigger('ready');
      }
    });
  }

  for (var i = 0; i < total; i++) {
    var map = this.parameters.maps[i];
    loadMap(map, i);
  }
};

/**
 * Apply current map
 *
 * @method applyMap
 */
HeightMap.prototype.applyMap = function () {
  var previousName = typeof this.previous === 'undefined'
    ? 'default'
    : this.parameters.maps[this.previous].name;

  var currentName = this.parameters.maps[this.current].name;

  var previousData = this.data[previousName];
  var currentData = this.data[currentName];

  var _this = this;

  TweenLite.to({ factor: 1 }, 1, { factor: 0, ease: window.Elastic.easeOut,
      onUpdate: function () {

        for (var i = 0, j = _this.geometry.vertices.length; i < j; i++) {
          var vertex = _this.geometry.vertices[i];
          var offset = currentData[i] + ((previousData[i] - currentData[i]) * this.target.factor);
          vertex.z = offset;
        }

        _this.geometry.verticesNeedUpdate = true;

        if (_this.lines) {
          for (var k = 0, l = _this.lines.children.length; k < l; k++) {
            _this.lines.children[k].geometry.verticesNeedUpdate = true;
          }
        }

        _this.setColors();
      }
    });

  this.previous = this.current;
};

/**
 * Set lines/points/plane vertices colors
 *
 * @method setColors
 */
HeightMap.prototype.setColors = function () {
  // lines
  if (this.lines) {
    for (var i = 0, j = this.lines.children.length; i < j; i++) {
      var line = this.lines.children[i];

      for (var k = 0, l = line.geometry.vertices.length; k < l; k++) {
        var vertex = line.geometry.vertices[k];

        // (255 + 255 + 255) / 10 = 76.5, 76.5 / 20 = 3.8
        var percent = map(vertex.z, [0, 3.8], [0, 2]);
        percent = Math.round(percent * 10) / 10;

        if (!this.colorsCache[percent]) {
          this.colorsCache[percent] = this.fromColor.clone().lerp(this.toColor, percent);
        }

        line.geometry.colors[k] = this.colorsCache[percent];
      }

      line.geometry.colorsNeedUpdate = true;
    }
  }

  // planes/points
  if (this.plane || this.points) {
    for (var i = 0, j = this.geometry.faces.length; i < j; i++) {
      var face = this.geometry.faces[i];

      // Assumption : instanceof THREE.Face3
      for (var k = 0; k < 3; k++) {
        var vertexIndex = face[this.faceIndices[k]];
        var vertex = this.geometry.vertices[vertexIndex];

        // (255 + 255 + 255) / 10 = 76.5, 76.5 / 20 = 3.8
        var percent = map(vertex.z, [0, 3.8], [0, 2]);
        percent = Math.round(percent * 10) / 10;

        if (!this.colorsCache[percent]) {
          this.colorsCache[percent] = this.fromColor.clone().lerp(this.toColor, percent);
        }

        face.vertexColors[k] = this.colorsCache[percent];
      }
    }

    this.geometry.colorsNeedUpdate = true;
  }
};

/**
 * Listen to event bus
 *
 * @method on
 */
HeightMap.prototype.on = function () {
  this.events.on.apply(this.events, arguments);
};

/**
 * Trigger event on event bus
 *
 * @method trigger
 */
HeightMap.prototype.trigger = function () {
  this.events.trigger.apply(this.events, arguments);
};

module.exports = HeightMap;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvb2JqZWN0czNEL0hlaWdodE1hcE9iamVjdDNELmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIi8qIGpzaGludCBsYXhicmVhazogdHJ1ZSAqL1xuLyoganNoaW50IHNoYWRvdzp0cnVlICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIGpRdWVyeSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydqUXVlcnknXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ2pRdWVyeSddIDogbnVsbCk7XG52YXIgVEhSRUUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snVEhSRUUnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1RIUkVFJ10gOiBudWxsKTtcbnZhciBUd2VlbkxpdGUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snVHdlZW5MaXRlJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydUd2VlbkxpdGUnXSA6IG51bGwpO1xuXG52YXIgRXZlbnRzID0gcmVxdWlyZSgnLi4vY2xhc3Nlcy9FdmVudHNDbGFzcycpO1xuXG52YXIgcmFuZG9tID0gcmVxdWlyZSgnLi4vdXRpbHMvcmFuZG9tVXRpbCcpO1xudmFyIG1hcCA9IHJlcXVpcmUoJy4uL3V0aWxzL21hcFV0aWwnKTtcblxuLyoqXG4gKiBBbmltYXRlZCBoZWlnaHQgbWFwXG4gKlxuICogQGNsYXNzIEhlaWdodE1hcFxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmhvcml6b250YWw9dHJ1ZV0gSG9yaXpvbnRhbCBsaW5lcz9cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMudmVydGljYWw9ZmFsc2VdIFZlcnRpY2FsIGxpbmVzP1xuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5wbGFuZT1mYWxzZV0gUGxhbmU/XG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnBvaW50cz1mYWxzZV0gUG9pbnRzP1xuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmRpdmlzaW9uc1g9MzBdIFggYXhpcyBkaXZpc2lvbnNcbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5kaXZpc2lvbnNZPTMwXSBZIGF4aXMgZGl2aXNpb25zXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuZnJvbUNvbG9yPScjNGM0YzRjJ10gSGVpZ2h0IG1pbiBjb2xvclxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLnRvQ29sb3I9JyNmZmZmZmYnXSBIZWlnaHQgbWF4IGNvbG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbb3B0aW9ucy5tYXBzPVtdXSBNYXBzIHNvdXJjZXNcbiAqIEByZXF1aXJlcyBqUXVlcnksIFRIUkVFLCBUd2VlbkxpdGUsIEV2ZW50cywgcmFuZG9tLCBtYXBcbiAqL1xuZnVuY3Rpb24gSGVpZ2h0TWFwIChvcHRpb25zKSB7XG4gIHRoaXMucGFyYW1ldGVycyA9IGpRdWVyeS5leHRlbmQoSGVpZ2h0TWFwLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcblxuICB0aGlzLmV2ZW50cyA9IG5ldyBFdmVudHMoKTtcblxuICB0aGlzLmZyb21Db2xvciA9IG5ldyBUSFJFRS5Db2xvcih0aGlzLnBhcmFtZXRlcnMuZnJvbUNvbG9yKTtcbiAgdGhpcy50b0NvbG9yID0gbmV3IFRIUkVFLkNvbG9yKHRoaXMucGFyYW1ldGVycy50b0NvbG9yKTtcbiAgdGhpcy5jb2xvcnNDYWNoZSA9IHt9O1xuICB0aGlzLmZhY2VJbmRpY2VzID0gWydhJywgJ2InLCAnYycsICdkJ107XG5cbiAgdGhpcy5yZWFkeSA9IGZhbHNlO1xuICB0aGlzLmRhdGEgPSBudWxsO1xuICB0aGlzLnRvdGFsID0gdGhpcy5wYXJhbWV0ZXJzLm1hcHMubGVuZ3RoO1xuICB0aGlzLnByZXZpb3VzID0gdW5kZWZpbmVkO1xuICB0aGlzLmN1cnJlbnQgPSB1bmRlZmluZWQ7XG5cbiAgdmFyIGdyb3VwID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XG5cbiAgdGhpcy5nZW9tZXRyeSA9IG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KDUwLCA1MCwgdGhpcy5wYXJhbWV0ZXJzLmRpdmlzaW9uc1gsIHRoaXMucGFyYW1ldGVycy5kaXZpc2lvbnNZKTtcblxuICBpZiAodGhpcy5wYXJhbWV0ZXJzLnBsYW5lKSB7XG4gICAgdGhpcy5wbGFuZSA9IHRoaXMuZ2V0UGxhbmUoKTtcbiAgICBncm91cC5hZGQodGhpcy5wbGFuZSk7XG4gIH1cblxuICBpZiAodGhpcy5wYXJhbWV0ZXJzLnBvaW50cykge1xuICAgIHRoaXMucG9pbnRzID0gdGhpcy5nZXRQb2ludHMoKTtcbiAgICBncm91cC5hZGQodGhpcy5wb2ludHMpO1xuICB9XG5cbiAgaWYgKHRoaXMucGFyYW1ldGVycy5ob3Jpem9udGFsIHx8IHRoaXMucGFyYW1ldGVycy52ZXJ0aWNhbCkge1xuICAgIHRoaXMubGluZXMgPSB0aGlzLmdldExpbmVzKCk7XG4gICAgZ3JvdXAuYWRkKHRoaXMubGluZXMpO1xuICB9XG5cbiAgdGhpcy5sb2FkTWFwcygpO1xuXG4gIHRoaXMuZWwgPSBncm91cDtcblxuICB0aGlzLnN0YXJ0ID0gZnVuY3Rpb24gKCkge307XG4gIFxuICB0aGlzLnN0b3AgPSB0aGlzLnN0YXJ0O1xuXG4gIHRoaXMub24oJ3JlYWR5JywgZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucmVhZHkgPSB0cnVlO1xuXG4gICAgdmFyIGlkbGVUd2VlbiA9IHRoaXMuZ2V0SWRsZVR3ZWVuKCk7XG5cbiAgICB0aGlzLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWRsZVR3ZWVuLnJlc3VtZSgpO1xuICAgIH07XG5cbiAgICB0aGlzLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZGxlVHdlZW4ucGF1c2UoKTtcbiAgICB9O1xuICB9LmJpbmQodGhpcykpO1xufVxuXG5IZWlnaHRNYXAuZGVmYXVsdE9wdGlvbnMgPSB7XG4gIGhvcml6b250YWw6IHRydWUsXG4gIHZlcnRpY2FsOiBmYWxzZSxcbiAgcGxhbmU6IGZhbHNlLFxuICBwb2ludHM6IGZhbHNlLFxuICBkaXZpc2lvbnNYOiAzMCxcbiAgZGl2aXNpb25zWTogMzAsXG4gIGZyb21Db2xvcjogJyM0YzRjNGMnLFxuICB0b0NvbG9yOiAnI2ZmZmZmZicsXG4gIG1hcHM6IFtdXG59O1xuXG4vKipcbiAqIEdldCBwbGFuZVxuICpcbiAqIEBtZXRob2QgZ2V0UGxhbmVcbiAqIEBwYXJhbSB7VEhSRUUuR2VvbWV0cnl9IGdlb21ldHJ5XG4gKiBAcmV0dXJuIHtUSFJFRS5NZXNofVxuICovXG5IZWlnaHRNYXAucHJvdG90eXBlLmdldFBsYW5lID0gZnVuY3Rpb24gKCkge1xuICB2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7XG4gICAgc2hhZGluZzogVEhSRUUuRmxhdFNoYWRpbmcsXG4gICAgdmVydGV4Q29sb3JzOiBUSFJFRS5WZXJ0ZXhDb2xvcnNcbiAgfSk7XG5cbiAgdmFyIHBsYW5lID0gbmV3IFRIUkVFLk1lc2godGhpcy5nZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXG4gIHJldHVybiBwbGFuZTtcbn07XG5cbi8qKlxuICogR2V0IHBvaW50c1xuICpcbiAqIEBtZXRob2QgZ2V0UG9pbnRzXG4gKiBAcGFyYW0ge1RIUkVFLkdlb21ldHJ5fSBnZW9tZXRyeVxuICogQHJldHVybiB7VEhSRUUuUG9pbnRDbG91ZH1cbiAqL1xuSGVpZ2h0TWFwLnByb3RvdHlwZS5nZXRQb2ludHMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5Qb2ludENsb3VkTWF0ZXJpYWwoeyBzaXplOiAwLjMgfSk7XG4gIHZhciBwb2ludHMgPSBuZXcgVEhSRUUuUG9pbnRDbG91ZCh0aGlzLmdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cbiAgcmV0dXJuIHBvaW50cztcbn07XG5cbi8qKlxuICogR2V0IGxpbmVzXG4gKlxuICogQG1ldGhvZCBnZXRMaW5lc1xuICogQHBhcmFtIHtUSFJFRS5HZW9tZXRyeX0gZ2VvbWV0cnlcbiAqIEByZXR1cm4ge1RIUkVFLk9iamVjdDNEfVxuICovXG5IZWlnaHRNYXAucHJvdG90eXBlLmdldExpbmVzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoe1xuICAgIHZlcnRleENvbG9yczogVEhSRUUuVmVydGV4Q29sb3JzXG4gIH0pO1xuXG4gIHZhciBsaW5lcyA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuXG4gIGlmICh0aGlzLnBhcmFtZXRlcnMudmVydGljYWwpIHtcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHRoaXMucGFyYW1ldGVycy5kaXZpc2lvbnNYICsgMTsgeCsrKSB7XG4gICAgICB2YXIgbGluZUdlb21ldHJ5ID0gbmV3IFRIUkVFLkdlb21ldHJ5KCk7XG5cbiAgICAgIGZvciAodmFyIHkgPSAwOyB5IDwgdGhpcy5wYXJhbWV0ZXJzLmRpdmlzaW9uc1kgKyAxOyB5KyspIHtcbiAgICAgICAgdmFyIHZlcnRleCA9IHRoaXMuZ2VvbWV0cnkudmVydGljZXNbeCArICgoeSAqIHRoaXMucGFyYW1ldGVycy5kaXZpc2lvbnNYKSArIHkpXTtcbiAgICAgICAgbGluZUdlb21ldHJ5LnZlcnRpY2VzLnB1c2godmVydGV4KTtcbiAgICAgIH1cblxuICAgICAgdmFyIGxpbmUgPSBuZXcgVEhSRUUuTGluZShsaW5lR2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICAgIGxpbmVzLmFkZChsaW5lKTtcbiAgICB9XG4gIH1cblxuICBpZiAodGhpcy5wYXJhbWV0ZXJzLmhvcml6b250YWwpIHtcbiAgICBmb3IgKHZhciB5ID0gMDsgeSA8IHRoaXMucGFyYW1ldGVycy5kaXZpc2lvbnNZICsgMTsgeSsrKSB7XG4gICAgICB2YXIgbGluZUdlb21ldHJ5ID0gbmV3IFRIUkVFLkdlb21ldHJ5KCk7XG5cbiAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdGhpcy5wYXJhbWV0ZXJzLmRpdmlzaW9uc1ggKyAxOyB4KyspIHtcbiAgICAgICAgdmFyIHZlcnRleCA9IHRoaXMuZ2VvbWV0cnkudmVydGljZXNbKHkgKiAodGhpcy5wYXJhbWV0ZXJzLmRpdmlzaW9uc1ggKyAxKSkgKyB4XTtcbiAgICAgICAgbGluZUdlb21ldHJ5LnZlcnRpY2VzLnB1c2godmVydGV4KTtcblxuICAgICAgICBpZiAoeCA9PT0gMCkge1xuICAgICAgICAgIHZlcnRleC54IC09IHJhbmRvbSgwLCAyMCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoeCA9PT0gdGhpcy5wYXJhbWV0ZXJzLmRpdmlzaW9uc1gpIHtcbiAgICAgICAgICB2ZXJ0ZXgueCArPSByYW5kb20oMCwgMjApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBsaW5lID0gbmV3IFRIUkVFLkxpbmUobGluZUdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgICBsaW5lcy5hZGQobGluZSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGxpbmVzO1xufTtcblxuLyoqXG4gKiBHZXQgYW5pbWF0aW9uc1xuICpcbiAqIEBtZXRob2QgZ2V0SWRsZVR3ZWVuXG4gKiBAcmV0dXJuIHtUd2VlbkxpdGV9XG4gKi9cbkhlaWdodE1hcC5wcm90b3R5cGUuZ2V0SWRsZVR3ZWVuID0gZnVuY3Rpb24gKCkge1xuICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gIHJldHVybiBUd2VlbkxpdGUudG8oe30sIDIsIHsgcGF1c2VkOiB0cnVlLFxuICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBfdGhpcy5jdXJyZW50Kys7XG5cbiAgICAgICAgaWYgKF90aGlzLmN1cnJlbnQgPT09IF90aGlzLnRvdGFsKSB7XG4gICAgICAgICAgX3RoaXMuY3VycmVudCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBfdGhpcy5hcHBseU1hcCgpO1xuXG4gICAgICAgIHRoaXMuZHVyYXRpb24ocmFuZG9tKDEuNSwgNSkpO1xuICAgICAgICB0aGlzLnJlc3RhcnQoKTtcbiAgICAgIH1cbiAgICB9KTtcbn07XG5cbi8qKlxuICogTG9hZCBtYXBzXG4gKlxuICogQG1ldGhvZCBsb2FkTWFwc1xuICovXG5IZWlnaHRNYXAucHJvdG90eXBlLmxvYWRNYXBzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgdG90YWxEYXRhID0gKHRoaXMucGFyYW1ldGVycy5kaXZpc2lvbnNYICsgMSkgKiAodGhpcy5wYXJhbWV0ZXJzLmRpdmlzaW9uc1kgKyAxKTtcbiAgdGhpcy5kYXRhID0geyBkZWZhdWx0OiBuZXcgRmxvYXQzMkFycmF5KHRvdGFsRGF0YSkgfTtcbiAgXG4gIHZhciBsb2FkZXIgPSBuZXcgVEhSRUUuSW1hZ2VMb2FkZXIoKTtcbiAgdmFyIHRvdGFsID0gdGhpcy5wYXJhbWV0ZXJzLm1hcHMubGVuZ3RoO1xuICB2YXIgbG9hZGVkID0gMDtcblxuICB2YXIgYWRkTWFwID0gZnVuY3Rpb24gKG5hbWUsIGltYWdlKSB7XG4gICAgdmFyIHdpZHRoID0gaW1hZ2Uud2lkdGg7XG4gICAgdmFyIGhlaWdodCA9IGltYWdlLmhlaWdodDtcblxuICAgIHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICBjYW52YXMud2lkdGggPSB3aWR0aDtcbiAgICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0O1xuXG4gICAgdmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgIGNvbnRleHQuZHJhd0ltYWdlKGltYWdlLCAwLCAwKTtcblxuICAgIHZhciBzdGVwWCA9IHdpZHRoIC8gdGhpcy5wYXJhbWV0ZXJzLmRpdmlzaW9uc1g7XG4gICAgdmFyIHN0ZXBZID0gaGVpZ2h0IC8gdGhpcy5wYXJhbWV0ZXJzLmRpdmlzaW9uc1k7XG5cbiAgICB2YXIgZGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkodG90YWxEYXRhKTtcbiAgICB2YXIgaSA9IDA7XG5cbiAgICBmb3IgKHZhciB5ID0gMDsgeSA8IGhlaWdodDsgeSArPSBzdGVwWSkge1xuICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB3aWR0aDsgeCArPSBzdGVwWCkge1xuICAgICAgICB2YXIgcGl4ZWxEYXRhID0gY29udGV4dC5nZXRJbWFnZURhdGEoeCwgeSwgMSwgMSkuZGF0YTtcblxuICAgICAgICAvLyBMdW1pbmFuY2UgPSBSICsgRyArIEJcbiAgICAgICAgLy8gaW50OCBtdXN0IGJlIGluIHRoZSBbLTEyNywgMTI3XSByYW5nZVxuICAgICAgICAvLyBNYXggbHVtaW5hbmNlID0gNzY1ICgyNTUgKiAzKSwgZGl2aWRpbmcgYnkgMTAgZW5zdXJlcyBpdCBjYW4gb25seSBiZSA3Ni41IGF0IG1heFxuICAgICAgICBkYXRhW2krK10gPSAocGl4ZWxEYXRhWzBdICsgcGl4ZWxEYXRhWzFdICsgcGl4ZWxEYXRhWzJdKSAvIDEwMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfdGhpcy5kYXRhW25hbWVdID0gZGF0YTtcbiAgfS5iaW5kKHRoaXMpO1xuXG4gIHZhciBfdGhpcyA9IHRoaXM7XG4gIFxuICBmdW5jdGlvbiBsb2FkTWFwIChtYXAsIGluZGV4KSB7XG4gICAgbG9hZGVyLmxvYWQobWFwLnVybCwgZnVuY3Rpb24gKGltYWdlKSB7XG4gICAgICBhZGRNYXAobWFwLm5hbWUsIGltYWdlKTtcblxuICAgICAgbG9hZGVkKys7XG5cbiAgICAgIGlmIChsb2FkZWQgPT09IDEpIHtcbiAgICAgICAgX3RoaXMuY3VycmVudCA9IGluZGV4O1xuICAgICAgICBfdGhpcy5hcHBseU1hcCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAobG9hZGVkID09PSB0b3RhbCkge1xuICAgICAgICBfdGhpcy50cmlnZ2VyKCdyZWFkeScpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0b3RhbDsgaSsrKSB7XG4gICAgdmFyIG1hcCA9IHRoaXMucGFyYW1ldGVycy5tYXBzW2ldO1xuICAgIGxvYWRNYXAobWFwLCBpKTtcbiAgfVxufTtcblxuLyoqXG4gKiBBcHBseSBjdXJyZW50IG1hcFxuICpcbiAqIEBtZXRob2QgYXBwbHlNYXBcbiAqL1xuSGVpZ2h0TWFwLnByb3RvdHlwZS5hcHBseU1hcCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHByZXZpb3VzTmFtZSA9IHR5cGVvZiB0aGlzLnByZXZpb3VzID09PSAndW5kZWZpbmVkJ1xuICAgID8gJ2RlZmF1bHQnXG4gICAgOiB0aGlzLnBhcmFtZXRlcnMubWFwc1t0aGlzLnByZXZpb3VzXS5uYW1lO1xuXG4gIHZhciBjdXJyZW50TmFtZSA9IHRoaXMucGFyYW1ldGVycy5tYXBzW3RoaXMuY3VycmVudF0ubmFtZTtcblxuICB2YXIgcHJldmlvdXNEYXRhID0gdGhpcy5kYXRhW3ByZXZpb3VzTmFtZV07XG4gIHZhciBjdXJyZW50RGF0YSA9IHRoaXMuZGF0YVtjdXJyZW50TmFtZV07XG5cbiAgdmFyIF90aGlzID0gdGhpcztcblxuICBUd2VlbkxpdGUudG8oeyBmYWN0b3I6IDEgfSwgMSwgeyBmYWN0b3I6IDAsIGVhc2U6IHdpbmRvdy5FbGFzdGljLmVhc2VPdXQsXG4gICAgICBvblVwZGF0ZTogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBqID0gX3RoaXMuZ2VvbWV0cnkudmVydGljZXMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICAgICAgdmFyIHZlcnRleCA9IF90aGlzLmdlb21ldHJ5LnZlcnRpY2VzW2ldO1xuICAgICAgICAgIHZhciBvZmZzZXQgPSBjdXJyZW50RGF0YVtpXSArICgocHJldmlvdXNEYXRhW2ldIC0gY3VycmVudERhdGFbaV0pICogdGhpcy50YXJnZXQuZmFjdG9yKTtcbiAgICAgICAgICB2ZXJ0ZXgueiA9IG9mZnNldDtcbiAgICAgICAgfVxuXG4gICAgICAgIF90aGlzLmdlb21ldHJ5LnZlcnRpY2VzTmVlZFVwZGF0ZSA9IHRydWU7XG5cbiAgICAgICAgaWYgKF90aGlzLmxpbmVzKSB7XG4gICAgICAgICAgZm9yICh2YXIgayA9IDAsIGwgPSBfdGhpcy5saW5lcy5jaGlsZHJlbi5sZW5ndGg7IGsgPCBsOyBrKyspIHtcbiAgICAgICAgICAgIF90aGlzLmxpbmVzLmNoaWxkcmVuW2tdLmdlb21ldHJ5LnZlcnRpY2VzTmVlZFVwZGF0ZSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgX3RoaXMuc2V0Q29sb3JzKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgdGhpcy5wcmV2aW91cyA9IHRoaXMuY3VycmVudDtcbn07XG5cbi8qKlxuICogU2V0IGxpbmVzL3BvaW50cy9wbGFuZSB2ZXJ0aWNlcyBjb2xvcnNcbiAqXG4gKiBAbWV0aG9kIHNldENvbG9yc1xuICovXG5IZWlnaHRNYXAucHJvdG90eXBlLnNldENvbG9ycyA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gbGluZXNcbiAgaWYgKHRoaXMubGluZXMpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgaiA9IHRoaXMubGluZXMuY2hpbGRyZW4ubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgICB2YXIgbGluZSA9IHRoaXMubGluZXMuY2hpbGRyZW5baV07XG5cbiAgICAgIGZvciAodmFyIGsgPSAwLCBsID0gbGluZS5nZW9tZXRyeS52ZXJ0aWNlcy5sZW5ndGg7IGsgPCBsOyBrKyspIHtcbiAgICAgICAgdmFyIHZlcnRleCA9IGxpbmUuZ2VvbWV0cnkudmVydGljZXNba107XG5cbiAgICAgICAgLy8gKDI1NSArIDI1NSArIDI1NSkgLyAxMCA9IDc2LjUsIDc2LjUgLyAyMCA9IDMuOFxuICAgICAgICB2YXIgcGVyY2VudCA9IG1hcCh2ZXJ0ZXgueiwgWzAsIDMuOF0sIFswLCAyXSk7XG4gICAgICAgIHBlcmNlbnQgPSBNYXRoLnJvdW5kKHBlcmNlbnQgKiAxMCkgLyAxMDtcblxuICAgICAgICBpZiAoIXRoaXMuY29sb3JzQ2FjaGVbcGVyY2VudF0pIHtcbiAgICAgICAgICB0aGlzLmNvbG9yc0NhY2hlW3BlcmNlbnRdID0gdGhpcy5mcm9tQ29sb3IuY2xvbmUoKS5sZXJwKHRoaXMudG9Db2xvciwgcGVyY2VudCk7XG4gICAgICAgIH1cblxuICAgICAgICBsaW5lLmdlb21ldHJ5LmNvbG9yc1trXSA9IHRoaXMuY29sb3JzQ2FjaGVbcGVyY2VudF07XG4gICAgICB9XG5cbiAgICAgIGxpbmUuZ2VvbWV0cnkuY29sb3JzTmVlZFVwZGF0ZSA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgLy8gcGxhbmVzL3BvaW50c1xuICBpZiAodGhpcy5wbGFuZSB8fCB0aGlzLnBvaW50cykge1xuICAgIGZvciAodmFyIGkgPSAwLCBqID0gdGhpcy5nZW9tZXRyeS5mYWNlcy5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgIHZhciBmYWNlID0gdGhpcy5nZW9tZXRyeS5mYWNlc1tpXTtcblxuICAgICAgLy8gQXNzdW1wdGlvbiA6IGluc3RhbmNlb2YgVEhSRUUuRmFjZTNcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgMzsgaysrKSB7XG4gICAgICAgIHZhciB2ZXJ0ZXhJbmRleCA9IGZhY2VbdGhpcy5mYWNlSW5kaWNlc1trXV07XG4gICAgICAgIHZhciB2ZXJ0ZXggPSB0aGlzLmdlb21ldHJ5LnZlcnRpY2VzW3ZlcnRleEluZGV4XTtcblxuICAgICAgICAvLyAoMjU1ICsgMjU1ICsgMjU1KSAvIDEwID0gNzYuNSwgNzYuNSAvIDIwID0gMy44XG4gICAgICAgIHZhciBwZXJjZW50ID0gbWFwKHZlcnRleC56LCBbMCwgMy44XSwgWzAsIDJdKTtcbiAgICAgICAgcGVyY2VudCA9IE1hdGgucm91bmQocGVyY2VudCAqIDEwKSAvIDEwO1xuXG4gICAgICAgIGlmICghdGhpcy5jb2xvcnNDYWNoZVtwZXJjZW50XSkge1xuICAgICAgICAgIHRoaXMuY29sb3JzQ2FjaGVbcGVyY2VudF0gPSB0aGlzLmZyb21Db2xvci5jbG9uZSgpLmxlcnAodGhpcy50b0NvbG9yLCBwZXJjZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZhY2UudmVydGV4Q29sb3JzW2tdID0gdGhpcy5jb2xvcnNDYWNoZVtwZXJjZW50XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmdlb21ldHJ5LmNvbG9yc05lZWRVcGRhdGUgPSB0cnVlO1xuICB9XG59O1xuXG4vKipcbiAqIExpc3RlbiB0byBldmVudCBidXNcbiAqXG4gKiBAbWV0aG9kIG9uXG4gKi9cbkhlaWdodE1hcC5wcm90b3R5cGUub24gPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuZXZlbnRzLm9uLmFwcGx5KHRoaXMuZXZlbnRzLCBhcmd1bWVudHMpO1xufTtcblxuLyoqXG4gKiBUcmlnZ2VyIGV2ZW50IG9uIGV2ZW50IGJ1c1xuICpcbiAqIEBtZXRob2QgdHJpZ2dlclxuICovXG5IZWlnaHRNYXAucHJvdG90eXBlLnRyaWdnZXIgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuZXZlbnRzLnRyaWdnZXIuYXBwbHkodGhpcy5ldmVudHMsIGFyZ3VtZW50cyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhlaWdodE1hcDsiXX0=
},{"../classes/EventsClass":2,"../utils/mapUtil":63,"../utils/randomUtil":65}],35:[function(require,module,exports){
(function (global){
'use strict';

var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var TweenLite = (typeof window !== "undefined" ? window['TweenLite'] : typeof global !== "undefined" ? global['TweenLite'] : null);

var SPRITE3D = require('../libs/sprite3DLib');
var HASH = require('../modules/hashModule');

/**
 * Hello title
 *
 * @class Title
 * @constructor
 * @requires THREE, TweenLite, SPRITE3D, HASH
 */
function Title () {
  var path;

  var sprites = {
    akqa: './app/public/img/sprite-AKQA.png',
    hki: './app/public/img/sprite-HKI.png',
    grouek: './app/public/img/sprite-grouek.png',
    mediamonks: './app/public/img/sprite-mediamonks.png',
    none: './app/public/img/sprite-none.png',
    soleilnoir: './app/public/img/sprite-soleilnoir.png',
    thread: './app/public/img/sprite-thread.png',
    ultranoir: './app/public/img/sprite-ultranoir.png'
  };

  if (sprites[HASH.hash]) {
    path = sprites[HASH.hash];
  } else {
    path = sprites.none;
  }

  var texture = new THREE.ImageUtils.loadTexture(path);
  texture.flipY = true;

  var sprite = new SPRITE3D.Sprite(texture, {
    horizontal: 4,
    vertical: 10,
    total: 40,
    duration: 70,
    loop: true
  });

  var material = new THREE.MeshBasicMaterial({
    map: texture,
    depthWrite: false,
    depthTest: true,
    transparent: true
  });

  var geometry = new THREE.PlaneGeometry(30, 15);
  var plane = new THREE.Mesh(geometry, material);

  function update () {
    plane.position.y = cache.y;
    material.opacity = cache.opacity;
  }

  var cache = { y: 20, opacity: 0 };
  var inTween = TweenLite.to(cache, 1, { y: 0, opacity: 1, paused: true, onUpdate: update});

  this.el = plane;

  this.in = function () {
    inTween.play();
  };

  this.out = function () {
    inTween.reverse();
  };

  this.start = function () {
    sprite.start();
  };

  this.stop = function () {
    sprite.stop();
  };
}

module.exports = Title;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvb2JqZWN0czNEL0hlbGxvVGl0bGVPYmplY3QzRC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBUSFJFRSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydUSFJFRSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnVEhSRUUnXSA6IG51bGwpO1xudmFyIFR3ZWVuTGl0ZSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydUd2VlbkxpdGUnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1R3ZWVuTGl0ZSddIDogbnVsbCk7XG5cbnZhciBTUFJJVEUzRCA9IHJlcXVpcmUoJy4uL2xpYnMvc3ByaXRlM0RMaWInKTtcbnZhciBIQVNIID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9oYXNoTW9kdWxlJyk7XG5cbi8qKlxuICogSGVsbG8gdGl0bGVcbiAqXG4gKiBAY2xhc3MgVGl0bGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHJlcXVpcmVzIFRIUkVFLCBUd2VlbkxpdGUsIFNQUklURTNELCBIQVNIXG4gKi9cbmZ1bmN0aW9uIFRpdGxlICgpIHtcbiAgdmFyIHBhdGg7XG5cbiAgdmFyIHNwcml0ZXMgPSB7XG4gICAgYWtxYTogJy4vYXBwL3B1YmxpYy9pbWcvc3ByaXRlLUFLUUEucG5nJyxcbiAgICBoa2k6ICcuL2FwcC9wdWJsaWMvaW1nL3Nwcml0ZS1IS0kucG5nJyxcbiAgICBncm91ZWs6ICcuL2FwcC9wdWJsaWMvaW1nL3Nwcml0ZS1ncm91ZWsucG5nJyxcbiAgICBtZWRpYW1vbmtzOiAnLi9hcHAvcHVibGljL2ltZy9zcHJpdGUtbWVkaWFtb25rcy5wbmcnLFxuICAgIG5vbmU6ICcuL2FwcC9wdWJsaWMvaW1nL3Nwcml0ZS1ub25lLnBuZycsXG4gICAgc29sZWlsbm9pcjogJy4vYXBwL3B1YmxpYy9pbWcvc3ByaXRlLXNvbGVpbG5vaXIucG5nJyxcbiAgICB0aHJlYWQ6ICcuL2FwcC9wdWJsaWMvaW1nL3Nwcml0ZS10aHJlYWQucG5nJyxcbiAgICB1bHRyYW5vaXI6ICcuL2FwcC9wdWJsaWMvaW1nL3Nwcml0ZS11bHRyYW5vaXIucG5nJ1xuICB9O1xuXG4gIGlmIChzcHJpdGVzW0hBU0guaGFzaF0pIHtcbiAgICBwYXRoID0gc3ByaXRlc1tIQVNILmhhc2hdO1xuICB9IGVsc2Uge1xuICAgIHBhdGggPSBzcHJpdGVzLm5vbmU7XG4gIH1cblxuICB2YXIgdGV4dHVyZSA9IG5ldyBUSFJFRS5JbWFnZVV0aWxzLmxvYWRUZXh0dXJlKHBhdGgpO1xuICB0ZXh0dXJlLmZsaXBZID0gdHJ1ZTtcblxuICB2YXIgc3ByaXRlID0gbmV3IFNQUklURTNELlNwcml0ZSh0ZXh0dXJlLCB7XG4gICAgaG9yaXpvbnRhbDogNCxcbiAgICB2ZXJ0aWNhbDogMTAsXG4gICAgdG90YWw6IDQwLFxuICAgIGR1cmF0aW9uOiA3MCxcbiAgICBsb29wOiB0cnVlXG4gIH0pO1xuXG4gIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XG4gICAgbWFwOiB0ZXh0dXJlLFxuICAgIGRlcHRoV3JpdGU6IGZhbHNlLFxuICAgIGRlcHRoVGVzdDogdHJ1ZSxcbiAgICB0cmFuc3BhcmVudDogdHJ1ZVxuICB9KTtcblxuICB2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSgzMCwgMTUpO1xuICB2YXIgcGxhbmUgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXG4gIGZ1bmN0aW9uIHVwZGF0ZSAoKSB7XG4gICAgcGxhbmUucG9zaXRpb24ueSA9IGNhY2hlLnk7XG4gICAgbWF0ZXJpYWwub3BhY2l0eSA9IGNhY2hlLm9wYWNpdHk7XG4gIH1cblxuICB2YXIgY2FjaGUgPSB7IHk6IDIwLCBvcGFjaXR5OiAwIH07XG4gIHZhciBpblR3ZWVuID0gVHdlZW5MaXRlLnRvKGNhY2hlLCAxLCB7IHk6IDAsIG9wYWNpdHk6IDEsIHBhdXNlZDogdHJ1ZSwgb25VcGRhdGU6IHVwZGF0ZX0pO1xuXG4gIHRoaXMuZWwgPSBwbGFuZTtcblxuICB0aGlzLmluID0gZnVuY3Rpb24gKCkge1xuICAgIGluVHdlZW4ucGxheSgpO1xuICB9O1xuXG4gIHRoaXMub3V0ID0gZnVuY3Rpb24gKCkge1xuICAgIGluVHdlZW4ucmV2ZXJzZSgpO1xuICB9O1xuXG4gIHRoaXMuc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgc3ByaXRlLnN0YXJ0KCk7XG4gIH07XG5cbiAgdGhpcy5zdG9wID0gZnVuY3Rpb24gKCkge1xuICAgIHNwcml0ZS5zdG9wKCk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVGl0bGU7Il19
},{"../libs/sprite3DLib":6,"../modules/hashModule":12}],36:[function(require,module,exports){
(function (global){
'use strict';
  
var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var TweenLite = (typeof window !== "undefined" ? window['TweenLite'] : typeof global !== "undefined" ? global['TweenLite'] : null);

var random = require('../utils/randomUtil');

/**
 * Cloud of meshes looking at the same coordinates
 *
 * @class LookAtField
 * @constructor
 * @param {Object} [options]
 * @param {Number} [options.count=100] Meshes number
 * @requires jQuery, THREE, TweenLite, random
 */
function LookAtField (options) {
  var parameters = jQuery.extend({
    count: 100
  }, options);

  var center = new THREE.Vector3(0, 50, 0);

  var triangleGeometry = new THREE.TetrahedronGeometry(3);

  var triangleMaterial = new THREE.MeshLambertMaterial({ shading: THREE.FlatShading });
  var triangleMesh = new THREE.Mesh(triangleGeometry, triangleMaterial);

  var group = new THREE.Object3D();

  for (var i = 0; i < parameters.count; i++) {
    var triangleCopy = triangleMesh.clone();
    triangleCopy.position.x = random(-50, 50);
    triangleCopy.position.y = random(-50, 50);
    triangleCopy.position.z = random(-50, 30);

    triangleCopy.rotation.x = random(0, 2 * Math.PI);
    triangleCopy.rotation.y = random(0, 2 * Math.PI);
    triangleCopy.rotation.z = random(0, 2 * Math.PI);

    triangleCopy.scale.x = triangleCopy.scale.y = triangleCopy.scale.z = random(0.6, 1);

    triangleCopy.lookAt(center);

    group.add(triangleCopy);
  }

  group.position.y = -50;

  function update () {
    for (var i = 0; i < parameters.count; i++) {
      group.children[i].lookAt(center);
    }
  }

  this.el = group;

  this.in = function () {
    group.visible = true;
    TweenLite.to(center, 2, { y: 0, onUpdate: update });
    TweenLite.to(group.position, 1, { y: 0 });
  };

  this.out = function () {
    TweenLite.to(center, 1, { y: 50, onUpdate: update, onComplete: function () { group.visible = false; } });
    TweenLite.to(group.position, 1, { y: -50 });
  };
}

module.exports = LookAtField;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvb2JqZWN0czNEL0xvb2tBdEZpZWxkT2JqZWN0M0QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcbiAgXG52YXIgalF1ZXJ5ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ2pRdWVyeSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnalF1ZXJ5J10gOiBudWxsKTtcbnZhciBUSFJFRSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydUSFJFRSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnVEhSRUUnXSA6IG51bGwpO1xudmFyIFR3ZWVuTGl0ZSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydUd2VlbkxpdGUnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1R3ZWVuTGl0ZSddIDogbnVsbCk7XG5cbnZhciByYW5kb20gPSByZXF1aXJlKCcuLi91dGlscy9yYW5kb21VdGlsJyk7XG5cbi8qKlxuICogQ2xvdWQgb2YgbWVzaGVzIGxvb2tpbmcgYXQgdGhlIHNhbWUgY29vcmRpbmF0ZXNcbiAqXG4gKiBAY2xhc3MgTG9va0F0RmllbGRcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmNvdW50PTEwMF0gTWVzaGVzIG51bWJlclxuICogQHJlcXVpcmVzIGpRdWVyeSwgVEhSRUUsIFR3ZWVuTGl0ZSwgcmFuZG9tXG4gKi9cbmZ1bmN0aW9uIExvb2tBdEZpZWxkIChvcHRpb25zKSB7XG4gIHZhciBwYXJhbWV0ZXJzID0galF1ZXJ5LmV4dGVuZCh7XG4gICAgY291bnQ6IDEwMFxuICB9LCBvcHRpb25zKTtcblxuICB2YXIgY2VudGVyID0gbmV3IFRIUkVFLlZlY3RvcjMoMCwgNTAsIDApO1xuXG4gIHZhciB0cmlhbmdsZUdlb21ldHJ5ID0gbmV3IFRIUkVFLlRldHJhaGVkcm9uR2VvbWV0cnkoMyk7XG5cbiAgdmFyIHRyaWFuZ2xlTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7IHNoYWRpbmc6IFRIUkVFLkZsYXRTaGFkaW5nIH0pO1xuICB2YXIgdHJpYW5nbGVNZXNoID0gbmV3IFRIUkVFLk1lc2godHJpYW5nbGVHZW9tZXRyeSwgdHJpYW5nbGVNYXRlcmlhbCk7XG5cbiAgdmFyIGdyb3VwID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXJhbWV0ZXJzLmNvdW50OyBpKyspIHtcbiAgICB2YXIgdHJpYW5nbGVDb3B5ID0gdHJpYW5nbGVNZXNoLmNsb25lKCk7XG4gICAgdHJpYW5nbGVDb3B5LnBvc2l0aW9uLnggPSByYW5kb20oLTUwLCA1MCk7XG4gICAgdHJpYW5nbGVDb3B5LnBvc2l0aW9uLnkgPSByYW5kb20oLTUwLCA1MCk7XG4gICAgdHJpYW5nbGVDb3B5LnBvc2l0aW9uLnogPSByYW5kb20oLTUwLCAzMCk7XG5cbiAgICB0cmlhbmdsZUNvcHkucm90YXRpb24ueCA9IHJhbmRvbSgwLCAyICogTWF0aC5QSSk7XG4gICAgdHJpYW5nbGVDb3B5LnJvdGF0aW9uLnkgPSByYW5kb20oMCwgMiAqIE1hdGguUEkpO1xuICAgIHRyaWFuZ2xlQ29weS5yb3RhdGlvbi56ID0gcmFuZG9tKDAsIDIgKiBNYXRoLlBJKTtcblxuICAgIHRyaWFuZ2xlQ29weS5zY2FsZS54ID0gdHJpYW5nbGVDb3B5LnNjYWxlLnkgPSB0cmlhbmdsZUNvcHkuc2NhbGUueiA9IHJhbmRvbSgwLjYsIDEpO1xuXG4gICAgdHJpYW5nbGVDb3B5Lmxvb2tBdChjZW50ZXIpO1xuXG4gICAgZ3JvdXAuYWRkKHRyaWFuZ2xlQ29weSk7XG4gIH1cblxuICBncm91cC5wb3NpdGlvbi55ID0gLTUwO1xuXG4gIGZ1bmN0aW9uIHVwZGF0ZSAoKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXJhbWV0ZXJzLmNvdW50OyBpKyspIHtcbiAgICAgIGdyb3VwLmNoaWxkcmVuW2ldLmxvb2tBdChjZW50ZXIpO1xuICAgIH1cbiAgfVxuXG4gIHRoaXMuZWwgPSBncm91cDtcblxuICB0aGlzLmluID0gZnVuY3Rpb24gKCkge1xuICAgIGdyb3VwLnZpc2libGUgPSB0cnVlO1xuICAgIFR3ZWVuTGl0ZS50byhjZW50ZXIsIDIsIHsgeTogMCwgb25VcGRhdGU6IHVwZGF0ZSB9KTtcbiAgICBUd2VlbkxpdGUudG8oZ3JvdXAucG9zaXRpb24sIDEsIHsgeTogMCB9KTtcbiAgfTtcblxuICB0aGlzLm91dCA9IGZ1bmN0aW9uICgpIHtcbiAgICBUd2VlbkxpdGUudG8oY2VudGVyLCAxLCB7IHk6IDUwLCBvblVwZGF0ZTogdXBkYXRlLCBvbkNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7IGdyb3VwLnZpc2libGUgPSBmYWxzZTsgfSB9KTtcbiAgICBUd2VlbkxpdGUudG8oZ3JvdXAucG9zaXRpb24sIDEsIHsgeTogLTUwIH0pO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IExvb2tBdEZpZWxkOyJdfQ==
},{"../utils/randomUtil":65}],37:[function(require,module,exports){
(function (global){
'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var TweenLite = (typeof window !== "undefined" ? window['TweenLite'] : typeof global !== "undefined" ? global['TweenLite'] : null);

var SOUNDS = require('../modules/soundsModule');
var random = require('../utils/randomUtil');
var yoyo = require('../utils/yoyoUtil');

/**
 * Animated Neon
 *
 * @class Neon
 * @constructor
 * @params {Object} [options]
 * @params {String} [options.color='#ffffff'] Neon color
 * @params {Number} [options.width=20] Neon width
 * @params {Boolean} [options.projection=true] Projection halo?
 * @params {Boolean} [options.planes=3] Glow planes
 * @requires jQuery, THREE, TweenLite, SOUNDS, random, yoyo
 */
function Neon (options) {
  this.parameters = jQuery.extend(Neon.defaultOptions, options);

  this.el = new THREE.Object3D();

  // setup 3d els
  this.tube = this.getTube();
  this.glow = this.getGlow();

  var glows = this.getGlows(this.glow);

  this.el.add(this.tube);
  this.el.add(glows);

  if (this.parameters.projection) {
    this.projection = this.getProjection();
    this.el.add(this.projection);
  }

  // flicker
  this.currentFlicker = 0;
  this.totalFlicker = random(3, 6, true);
  this.flickering = false;

  // animations
  var _this = this;

  this.idleIntensityTween = TweenLite.to({ projection: 0.08, glow: 0.4 }, random(0.8, 5), {
    projection: 0.15, glow: 0.7, paused: true,
    onStart: function () {
      _this.tube.material.emissive.set(_this.parameters.color);
    },
    onUpdate: function () {
      if (_this.flickering) {
        return false;
      }

      _this.glow.material.opacity = this.target.glow;
      if (_this.parameters.projection) {
        _this.projection.opacity = this.target.opacity;
      }
    },
    onComplete: yoyo,
    onReverseComplete: yoyo
  });

  this.idleFlickTween = TweenLite.to({}, random(0.1, 10), { paused: true,
    onComplete: function () {
      _this.flickOff();
      this.duration(random(0.1, 10));
      this.restart();
    }
  });

  this.inTween = TweenLite.to({}, random(0.2, 2), { paused: true,
    onComplete: function () {
      if (_this.currentFlicker++ < _this.totalFlicker) {
        _this.flickOn();
        this.duration(random(0.1, 0.5));
        this.restart();
      }
      else {
        _this.animations = [_this.idleIntensityTween, _this.idleFlickTween];
        _this.start();
      }
    }
  });

  this.animations = [this.inTween];
};

Neon.defaultOptions = {
  color: '#ffffff',
  width: 20,
  projection: true,
  planes: 3
};

/**
 * Start animations sequence
 */
Neon.prototype.start = function () {
  for (var i = 0, j = this.animations.length; i < j; i++) {
    this.animations[i].resume();
  }
};

/**
 * Stop animations sequence
 */
Neon.prototype.stop = function () {
  for (var i = 0, j = this.animations.length; i < j; i++) {
    this.animations[i].pause();
  }
};

/**
 * Flick on once
 * from off to on
 */
Neon.prototype.flickOn = function () {
  this.tube.material.emissive.set(this.parameters.color);
  this.tube.material.needsUpdate = true;

  this.glow.material.opacity = 0.3;

  if (this.parameters.projection) {
    this.projection.material.opacity = 0.05;
  }

  SOUNDS.neon.play();

  var _this = this;

  TweenLite.delayedCall(random(0.05, 0.07), function () {
    _this.tube.material.emissive.set('#000000');
    _this.tube.material.needsUpdate = true;

    _this.glow.material.opacity = 0;

    if (_this.parameters.projection) {
      _this.projection.material.opacity = 0;
    }
  });
};

/**
 * Flick off once
 * from on to off
 */
Neon.prototype.flickOff = function () {
  this.flickering = !this.flickering;
  
  this.glow.material.opacity = 0;

  if (this.parameters.projection) {
    this.projection.material.opacity = 0.05;
  }

  var _this = this;

  TweenLite.delayedCall(random(0.05, 0.1), function () {
    _this.flickering = !_this.flickering;

    SOUNDS.neon.play();
  });
};

/**
 * Get neon tube
 *
 * @method getTube
 * @return {THREE.Mesh}
 */
Neon.prototype.getTube = function () {
  var geometry = new THREE.CylinderGeometry(0.2, 0.2, this.parameters.width, 6);
  var material = new THREE.MeshLambertMaterial({
    color: '#808080',
    emissive: '#000000'
  });
  var mesh = new THREE.Mesh(geometry, material);

  return mesh;
};

/**
 * Get neon single glow
 *
 * @method getGlow
 * @return {THREE.Mesh}
 */
Neon.prototype.getGlow = function () {
  var texture = new THREE.ImageUtils.loadTexture('./app/public/img/texture-neonGlow.png');
  var material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    map: texture,
    depthWrite: false,
    depthTest: true,
    transparent: true,
    color: this.parameters.color,
    opacity: 0,
    blending: THREE.AdditiveBlending
  });

  var geometry = new THREE.PlaneGeometry(5, this.parameters.width + 3);
  var mesh = new THREE.Mesh(geometry, material);

  return mesh;
};

/**
 * Get neon glows
 *
 * @method getGlows
 * @param {THREE.Mesh} [glow]
 * @return {THREE.Object3D}
 */
Neon.prototype.getGlows = function (glow) {
  var glows = new THREE.Object3D();

  for (var i = 0; i < this.parameters.planes; i++) {
    var copy = glow.clone();
    copy.rotation.y = i * (0.7 * Math.PI);
    glows.add(copy);
  }

  return glows;
};

/**
 * Get neon projection
 *
 * @method getProjection
 * @return {THREE.Mesh}
 */
Neon.prototype.getProjection = function () {
  var texture = THREE.ImageUtils.loadTexture('./app/public/img/texture-neonProjection.png');
  var material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    map: texture,
    depthWrite: false,
    depthTest: true,
    transparent: true,
    color: this.parameters.color,
    opacity: 0,
    blending: THREE.AdditiveBlending
  });

  var geometry = new THREE.PlaneGeometry(this.parameters.width * 2, 50);
  var mesh = new THREE.Mesh(geometry, material);
  mesh.position.z = -1;

  return mesh;
};

module.exports = Neon;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvb2JqZWN0czNEL05lb25PYmplY3QzRC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbnZhciBqUXVlcnkgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snalF1ZXJ5J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydqUXVlcnknXSA6IG51bGwpO1xudmFyIFRIUkVFID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1RIUkVFJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydUSFJFRSddIDogbnVsbCk7XG52YXIgVHdlZW5MaXRlID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1R3ZWVuTGl0ZSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnVHdlZW5MaXRlJ10gOiBudWxsKTtcblxudmFyIFNPVU5EUyA9IHJlcXVpcmUoJy4uL21vZHVsZXMvc291bmRzTW9kdWxlJyk7XG52YXIgcmFuZG9tID0gcmVxdWlyZSgnLi4vdXRpbHMvcmFuZG9tVXRpbCcpO1xudmFyIHlveW8gPSByZXF1aXJlKCcuLi91dGlscy95b3lvVXRpbCcpO1xuXG4vKipcbiAqIEFuaW1hdGVkIE5lb25cbiAqXG4gKiBAY2xhc3MgTmVvblxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW1zIHtPYmplY3R9IFtvcHRpb25zXVxuICogQHBhcmFtcyB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nI2ZmZmZmZiddIE5lb24gY29sb3JcbiAqIEBwYXJhbXMge051bWJlcn0gW29wdGlvbnMud2lkdGg9MjBdIE5lb24gd2lkdGhcbiAqIEBwYXJhbXMge0Jvb2xlYW59IFtvcHRpb25zLnByb2plY3Rpb249dHJ1ZV0gUHJvamVjdGlvbiBoYWxvP1xuICogQHBhcmFtcyB7Qm9vbGVhbn0gW29wdGlvbnMucGxhbmVzPTNdIEdsb3cgcGxhbmVzXG4gKiBAcmVxdWlyZXMgalF1ZXJ5LCBUSFJFRSwgVHdlZW5MaXRlLCBTT1VORFMsIHJhbmRvbSwgeW95b1xuICovXG5mdW5jdGlvbiBOZW9uIChvcHRpb25zKSB7XG4gIHRoaXMucGFyYW1ldGVycyA9IGpRdWVyeS5leHRlbmQoTmVvbi5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgdGhpcy5lbCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuXG4gIC8vIHNldHVwIDNkIGVsc1xuICB0aGlzLnR1YmUgPSB0aGlzLmdldFR1YmUoKTtcbiAgdGhpcy5nbG93ID0gdGhpcy5nZXRHbG93KCk7XG5cbiAgdmFyIGdsb3dzID0gdGhpcy5nZXRHbG93cyh0aGlzLmdsb3cpO1xuXG4gIHRoaXMuZWwuYWRkKHRoaXMudHViZSk7XG4gIHRoaXMuZWwuYWRkKGdsb3dzKTtcblxuICBpZiAodGhpcy5wYXJhbWV0ZXJzLnByb2plY3Rpb24pIHtcbiAgICB0aGlzLnByb2plY3Rpb24gPSB0aGlzLmdldFByb2plY3Rpb24oKTtcbiAgICB0aGlzLmVsLmFkZCh0aGlzLnByb2plY3Rpb24pO1xuICB9XG5cbiAgLy8gZmxpY2tlclxuICB0aGlzLmN1cnJlbnRGbGlja2VyID0gMDtcbiAgdGhpcy50b3RhbEZsaWNrZXIgPSByYW5kb20oMywgNiwgdHJ1ZSk7XG4gIHRoaXMuZmxpY2tlcmluZyA9IGZhbHNlO1xuXG4gIC8vIGFuaW1hdGlvbnNcbiAgdmFyIF90aGlzID0gdGhpcztcblxuICB0aGlzLmlkbGVJbnRlbnNpdHlUd2VlbiA9IFR3ZWVuTGl0ZS50byh7IHByb2plY3Rpb246IDAuMDgsIGdsb3c6IDAuNCB9LCByYW5kb20oMC44LCA1KSwge1xuICAgIHByb2plY3Rpb246IDAuMTUsIGdsb3c6IDAuNywgcGF1c2VkOiB0cnVlLFxuICAgIG9uU3RhcnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgIF90aGlzLnR1YmUubWF0ZXJpYWwuZW1pc3NpdmUuc2V0KF90aGlzLnBhcmFtZXRlcnMuY29sb3IpO1xuICAgIH0sXG4gICAgb25VcGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChfdGhpcy5mbGlja2VyaW5nKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgX3RoaXMuZ2xvdy5tYXRlcmlhbC5vcGFjaXR5ID0gdGhpcy50YXJnZXQuZ2xvdztcbiAgICAgIGlmIChfdGhpcy5wYXJhbWV0ZXJzLnByb2plY3Rpb24pIHtcbiAgICAgICAgX3RoaXMucHJvamVjdGlvbi5vcGFjaXR5ID0gdGhpcy50YXJnZXQub3BhY2l0eTtcbiAgICAgIH1cbiAgICB9LFxuICAgIG9uQ29tcGxldGU6IHlveW8sXG4gICAgb25SZXZlcnNlQ29tcGxldGU6IHlveW9cbiAgfSk7XG5cbiAgdGhpcy5pZGxlRmxpY2tUd2VlbiA9IFR3ZWVuTGl0ZS50byh7fSwgcmFuZG9tKDAuMSwgMTApLCB7IHBhdXNlZDogdHJ1ZSxcbiAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICBfdGhpcy5mbGlja09mZigpO1xuICAgICAgdGhpcy5kdXJhdGlvbihyYW5kb20oMC4xLCAxMCkpO1xuICAgICAgdGhpcy5yZXN0YXJ0KCk7XG4gICAgfVxuICB9KTtcblxuICB0aGlzLmluVHdlZW4gPSBUd2VlbkxpdGUudG8oe30sIHJhbmRvbSgwLjIsIDIpLCB7IHBhdXNlZDogdHJ1ZSxcbiAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoX3RoaXMuY3VycmVudEZsaWNrZXIrKyA8IF90aGlzLnRvdGFsRmxpY2tlcikge1xuICAgICAgICBfdGhpcy5mbGlja09uKCk7XG4gICAgICAgIHRoaXMuZHVyYXRpb24ocmFuZG9tKDAuMSwgMC41KSk7XG4gICAgICAgIHRoaXMucmVzdGFydCgpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIF90aGlzLmFuaW1hdGlvbnMgPSBbX3RoaXMuaWRsZUludGVuc2l0eVR3ZWVuLCBfdGhpcy5pZGxlRmxpY2tUd2Vlbl07XG4gICAgICAgIF90aGlzLnN0YXJ0KCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICB0aGlzLmFuaW1hdGlvbnMgPSBbdGhpcy5pblR3ZWVuXTtcbn07XG5cbk5lb24uZGVmYXVsdE9wdGlvbnMgPSB7XG4gIGNvbG9yOiAnI2ZmZmZmZicsXG4gIHdpZHRoOiAyMCxcbiAgcHJvamVjdGlvbjogdHJ1ZSxcbiAgcGxhbmVzOiAzXG59O1xuXG4vKipcbiAqIFN0YXJ0IGFuaW1hdGlvbnMgc2VxdWVuY2VcbiAqL1xuTmVvbi5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gIGZvciAodmFyIGkgPSAwLCBqID0gdGhpcy5hbmltYXRpb25zLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgIHRoaXMuYW5pbWF0aW9uc1tpXS5yZXN1bWUoKTtcbiAgfVxufTtcblxuLyoqXG4gKiBTdG9wIGFuaW1hdGlvbnMgc2VxdWVuY2VcbiAqL1xuTmVvbi5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgZm9yICh2YXIgaSA9IDAsIGogPSB0aGlzLmFuaW1hdGlvbnMubGVuZ3RoOyBpIDwgajsgaSsrKSB7XG4gICAgdGhpcy5hbmltYXRpb25zW2ldLnBhdXNlKCk7XG4gIH1cbn07XG5cbi8qKlxuICogRmxpY2sgb24gb25jZVxuICogZnJvbSBvZmYgdG8gb25cbiAqL1xuTmVvbi5wcm90b3R5cGUuZmxpY2tPbiA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy50dWJlLm1hdGVyaWFsLmVtaXNzaXZlLnNldCh0aGlzLnBhcmFtZXRlcnMuY29sb3IpO1xuICB0aGlzLnR1YmUubWF0ZXJpYWwubmVlZHNVcGRhdGUgPSB0cnVlO1xuXG4gIHRoaXMuZ2xvdy5tYXRlcmlhbC5vcGFjaXR5ID0gMC4zO1xuXG4gIGlmICh0aGlzLnBhcmFtZXRlcnMucHJvamVjdGlvbikge1xuICAgIHRoaXMucHJvamVjdGlvbi5tYXRlcmlhbC5vcGFjaXR5ID0gMC4wNTtcbiAgfVxuXG4gIFNPVU5EUy5uZW9uLnBsYXkoKTtcblxuICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gIFR3ZWVuTGl0ZS5kZWxheWVkQ2FsbChyYW5kb20oMC4wNSwgMC4wNyksIGZ1bmN0aW9uICgpIHtcbiAgICBfdGhpcy50dWJlLm1hdGVyaWFsLmVtaXNzaXZlLnNldCgnIzAwMDAwMCcpO1xuICAgIF90aGlzLnR1YmUubWF0ZXJpYWwubmVlZHNVcGRhdGUgPSB0cnVlO1xuXG4gICAgX3RoaXMuZ2xvdy5tYXRlcmlhbC5vcGFjaXR5ID0gMDtcblxuICAgIGlmIChfdGhpcy5wYXJhbWV0ZXJzLnByb2plY3Rpb24pIHtcbiAgICAgIF90aGlzLnByb2plY3Rpb24ubWF0ZXJpYWwub3BhY2l0eSA9IDA7XG4gICAgfVxuICB9KTtcbn07XG5cbi8qKlxuICogRmxpY2sgb2ZmIG9uY2VcbiAqIGZyb20gb24gdG8gb2ZmXG4gKi9cbk5lb24ucHJvdG90eXBlLmZsaWNrT2ZmID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLmZsaWNrZXJpbmcgPSAhdGhpcy5mbGlja2VyaW5nO1xuICBcbiAgdGhpcy5nbG93Lm1hdGVyaWFsLm9wYWNpdHkgPSAwO1xuXG4gIGlmICh0aGlzLnBhcmFtZXRlcnMucHJvamVjdGlvbikge1xuICAgIHRoaXMucHJvamVjdGlvbi5tYXRlcmlhbC5vcGFjaXR5ID0gMC4wNTtcbiAgfVxuXG4gIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgVHdlZW5MaXRlLmRlbGF5ZWRDYWxsKHJhbmRvbSgwLjA1LCAwLjEpLCBmdW5jdGlvbiAoKSB7XG4gICAgX3RoaXMuZmxpY2tlcmluZyA9ICFfdGhpcy5mbGlja2VyaW5nO1xuXG4gICAgU09VTkRTLm5lb24ucGxheSgpO1xuICB9KTtcbn07XG5cbi8qKlxuICogR2V0IG5lb24gdHViZVxuICpcbiAqIEBtZXRob2QgZ2V0VHViZVxuICogQHJldHVybiB7VEhSRUUuTWVzaH1cbiAqL1xuTmVvbi5wcm90b3R5cGUuZ2V0VHViZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkN5bGluZGVyR2VvbWV0cnkoMC4yLCAwLjIsIHRoaXMucGFyYW1ldGVycy53aWR0aCwgNik7XG4gIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHtcbiAgICBjb2xvcjogJyM4MDgwODAnLFxuICAgIGVtaXNzaXZlOiAnIzAwMDAwMCdcbiAgfSk7XG4gIHZhciBtZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcblxuICByZXR1cm4gbWVzaDtcbn07XG5cbi8qKlxuICogR2V0IG5lb24gc2luZ2xlIGdsb3dcbiAqXG4gKiBAbWV0aG9kIGdldEdsb3dcbiAqIEByZXR1cm4ge1RIUkVFLk1lc2h9XG4gKi9cbk5lb24ucHJvdG90eXBlLmdldEdsb3cgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciB0ZXh0dXJlID0gbmV3IFRIUkVFLkltYWdlVXRpbHMubG9hZFRleHR1cmUoJy4vYXBwL3B1YmxpYy9pbWcvdGV4dHVyZS1uZW9uR2xvdy5wbmcnKTtcbiAgdmFyIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtcbiAgICBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlLFxuICAgIG1hcDogdGV4dHVyZSxcbiAgICBkZXB0aFdyaXRlOiBmYWxzZSxcbiAgICBkZXB0aFRlc3Q6IHRydWUsXG4gICAgdHJhbnNwYXJlbnQ6IHRydWUsXG4gICAgY29sb3I6IHRoaXMucGFyYW1ldGVycy5jb2xvcixcbiAgICBvcGFjaXR5OiAwLFxuICAgIGJsZW5kaW5nOiBUSFJFRS5BZGRpdGl2ZUJsZW5kaW5nXG4gIH0pO1xuXG4gIHZhciBnZW9tZXRyeSA9IG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KDUsIHRoaXMucGFyYW1ldGVycy53aWR0aCArIDMpO1xuICB2YXIgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cbiAgcmV0dXJuIG1lc2g7XG59O1xuXG4vKipcbiAqIEdldCBuZW9uIGdsb3dzXG4gKlxuICogQG1ldGhvZCBnZXRHbG93c1xuICogQHBhcmFtIHtUSFJFRS5NZXNofSBbZ2xvd11cbiAqIEByZXR1cm4ge1RIUkVFLk9iamVjdDNEfVxuICovXG5OZW9uLnByb3RvdHlwZS5nZXRHbG93cyA9IGZ1bmN0aW9uIChnbG93KSB7XG4gIHZhciBnbG93cyA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5wYXJhbWV0ZXJzLnBsYW5lczsgaSsrKSB7XG4gICAgdmFyIGNvcHkgPSBnbG93LmNsb25lKCk7XG4gICAgY29weS5yb3RhdGlvbi55ID0gaSAqICgwLjcgKiBNYXRoLlBJKTtcbiAgICBnbG93cy5hZGQoY29weSk7XG4gIH1cblxuICByZXR1cm4gZ2xvd3M7XG59O1xuXG4vKipcbiAqIEdldCBuZW9uIHByb2plY3Rpb25cbiAqXG4gKiBAbWV0aG9kIGdldFByb2plY3Rpb25cbiAqIEByZXR1cm4ge1RIUkVFLk1lc2h9XG4gKi9cbk5lb24ucHJvdG90eXBlLmdldFByb2plY3Rpb24gPSBmdW5jdGlvbiAoKSB7XG4gIHZhciB0ZXh0dXJlID0gVEhSRUUuSW1hZ2VVdGlscy5sb2FkVGV4dHVyZSgnLi9hcHAvcHVibGljL2ltZy90ZXh0dXJlLW5lb25Qcm9qZWN0aW9uLnBuZycpO1xuICB2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe1xuICAgIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGUsXG4gICAgbWFwOiB0ZXh0dXJlLFxuICAgIGRlcHRoV3JpdGU6IGZhbHNlLFxuICAgIGRlcHRoVGVzdDogdHJ1ZSxcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcbiAgICBjb2xvcjogdGhpcy5wYXJhbWV0ZXJzLmNvbG9yLFxuICAgIG9wYWNpdHk6IDAsXG4gICAgYmxlbmRpbmc6IFRIUkVFLkFkZGl0aXZlQmxlbmRpbmdcbiAgfSk7XG5cbiAgdmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkodGhpcy5wYXJhbWV0ZXJzLndpZHRoICogMiwgNTApO1xuICB2YXIgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gIG1lc2gucG9zaXRpb24ueiA9IC0xO1xuXG4gIHJldHVybiBtZXNoO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBOZW9uOyJdfQ==
},{"../modules/soundsModule":14,"../utils/randomUtil":65,"../utils/yoyoUtil":66}],38:[function(require,module,exports){
(function (global){
'use strict';

var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var TweenLite = (typeof window !== "undefined" ? window['TweenLite'] : typeof global !== "undefined" ? global['TweenLite'] : null);

var yoyo = require('../utils/yoyoUtil');

/**
 * 3D Rocks
 *
 * @class Rocks
 * @constructor
 * @requires THREE, TweenLite, yoyo
 */
function Rocks () {
  var group = new THREE.Object3D();

  var sphere = this.getSphere(); 
  group.add(sphere);

  var light = this.getLight();
  group.add(light);

  // rocks
  var rocksMaterial = new THREE.MeshLambertMaterial({
    color: '#0a0a0a',
    side: THREE.DoubleSide,
    shading: THREE.FlatShading
  });

  var fromColor = new THREE.Color('#0a0a0a');
  var toColor = new THREE.Color('#ffffff');

  var loader = new THREE.JSONLoader();
  loader.load('./app/public/3D/rocks.js', function (geometry) {
    var rocks = new THREE.Mesh(geometry, rocksMaterial);
    rocks.position.set(-70, 0, -30);
    group.add(rocks);

    var cache = { angle: 0, y: 11, intensity: 0, color: 0 };
    function update () {
      rocks.rotation.x = cache.angle;

      light.intensity = cache.intensity;
      
      light.position.y = cache.y;
      sphere.position.y = cache.y;

      sphere.material.color = fromColor.clone().lerp(toColor, cache.color);
    }

    this.in = function () {
      TweenLite.to(cache, 1, { angle: 0.3, y: 20, intensity: 15, color: 1, onUpdate: update });
    };

    this.out = function (way) {
      var y = way === 'up' ? 11 : 20;
      TweenLite.to(cache, 1, { angle: 0, y: y, intensity: 0, color: 0, onUpdate: update });
    };

    var idleTween = TweenLite.to({ x: -2, z: -45 }, 2, { x: 2, z: -35, paused: true,
      onUpdate: function () {
        light.position.z = this.target.z;
        sphere.position.z = this.target.z;
      },
      onComplete: yoyo,
      onReverseComplete: yoyo
    });

    this.start = function () {
      idleTween.resume();
    };

    this.stop = function () {
      idleTween.pause();
    };

  }.bind(this));

  this.el = group;

  this.in = function () {};

  this.out = this.in;

  this.start = this.in;

  this.stop = this.in;
}

/**
 * Get white sphere
 *
 * @method getSphere
 * @return {THREE.Mesh}
 */
Rocks.prototype.getSphere = function () {
  var material = new THREE.MeshBasicMaterial({ color: '#0a0a0a', fog: false });
  var geometry = new THREE.SphereGeometry(5, 20, 20);
  var mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(0, 11, -40);

  return mesh;
};

/**
 * Get light
 *
 * @method getLight
 * @return {THREE.Light}
 */
Rocks.prototype.getLight = function () {
  var light = new THREE.PointLight('#ffffff', 0, 50);
  light.position.set(0, 11, -40);

  return light;
};

module.exports = Rocks;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvb2JqZWN0czNEL1JvY2tzT2JqZWN0M0QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgVEhSRUUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snVEhSRUUnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1RIUkVFJ10gOiBudWxsKTtcbnZhciBUd2VlbkxpdGUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snVHdlZW5MaXRlJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydUd2VlbkxpdGUnXSA6IG51bGwpO1xuXG52YXIgeW95byA9IHJlcXVpcmUoJy4uL3V0aWxzL3lveW9VdGlsJyk7XG5cbi8qKlxuICogM0QgUm9ja3NcbiAqXG4gKiBAY2xhc3MgUm9ja3NcbiAqIEBjb25zdHJ1Y3RvclxuICogQHJlcXVpcmVzIFRIUkVFLCBUd2VlbkxpdGUsIHlveW9cbiAqL1xuZnVuY3Rpb24gUm9ja3MgKCkge1xuICB2YXIgZ3JvdXAgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKTtcblxuICB2YXIgc3BoZXJlID0gdGhpcy5nZXRTcGhlcmUoKTsgXG4gIGdyb3VwLmFkZChzcGhlcmUpO1xuXG4gIHZhciBsaWdodCA9IHRoaXMuZ2V0TGlnaHQoKTtcbiAgZ3JvdXAuYWRkKGxpZ2h0KTtcblxuICAvLyByb2Nrc1xuICB2YXIgcm9ja3NNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHtcbiAgICBjb2xvcjogJyMwYTBhMGEnLFxuICAgIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGUsXG4gICAgc2hhZGluZzogVEhSRUUuRmxhdFNoYWRpbmdcbiAgfSk7XG5cbiAgdmFyIGZyb21Db2xvciA9IG5ldyBUSFJFRS5Db2xvcignIzBhMGEwYScpO1xuICB2YXIgdG9Db2xvciA9IG5ldyBUSFJFRS5Db2xvcignI2ZmZmZmZicpO1xuXG4gIHZhciBsb2FkZXIgPSBuZXcgVEhSRUUuSlNPTkxvYWRlcigpO1xuICBsb2FkZXIubG9hZCgnLi9hcHAvcHVibGljLzNEL3JvY2tzLmpzJywgZnVuY3Rpb24gKGdlb21ldHJ5KSB7XG4gICAgdmFyIHJvY2tzID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIHJvY2tzTWF0ZXJpYWwpO1xuICAgIHJvY2tzLnBvc2l0aW9uLnNldCgtNzAsIDAsIC0zMCk7XG4gICAgZ3JvdXAuYWRkKHJvY2tzKTtcblxuICAgIHZhciBjYWNoZSA9IHsgYW5nbGU6IDAsIHk6IDExLCBpbnRlbnNpdHk6IDAsIGNvbG9yOiAwIH07XG4gICAgZnVuY3Rpb24gdXBkYXRlICgpIHtcbiAgICAgIHJvY2tzLnJvdGF0aW9uLnggPSBjYWNoZS5hbmdsZTtcblxuICAgICAgbGlnaHQuaW50ZW5zaXR5ID0gY2FjaGUuaW50ZW5zaXR5O1xuICAgICAgXG4gICAgICBsaWdodC5wb3NpdGlvbi55ID0gY2FjaGUueTtcbiAgICAgIHNwaGVyZS5wb3NpdGlvbi55ID0gY2FjaGUueTtcblxuICAgICAgc3BoZXJlLm1hdGVyaWFsLmNvbG9yID0gZnJvbUNvbG9yLmNsb25lKCkubGVycCh0b0NvbG9yLCBjYWNoZS5jb2xvcik7XG4gICAgfVxuXG4gICAgdGhpcy5pbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIFR3ZWVuTGl0ZS50byhjYWNoZSwgMSwgeyBhbmdsZTogMC4zLCB5OiAyMCwgaW50ZW5zaXR5OiAxNSwgY29sb3I6IDEsIG9uVXBkYXRlOiB1cGRhdGUgfSk7XG4gICAgfTtcblxuICAgIHRoaXMub3V0ID0gZnVuY3Rpb24gKHdheSkge1xuICAgICAgdmFyIHkgPSB3YXkgPT09ICd1cCcgPyAxMSA6IDIwO1xuICAgICAgVHdlZW5MaXRlLnRvKGNhY2hlLCAxLCB7IGFuZ2xlOiAwLCB5OiB5LCBpbnRlbnNpdHk6IDAsIGNvbG9yOiAwLCBvblVwZGF0ZTogdXBkYXRlIH0pO1xuICAgIH07XG5cbiAgICB2YXIgaWRsZVR3ZWVuID0gVHdlZW5MaXRlLnRvKHsgeDogLTIsIHo6IC00NSB9LCAyLCB7IHg6IDIsIHo6IC0zNSwgcGF1c2VkOiB0cnVlLFxuICAgICAgb25VcGRhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGlnaHQucG9zaXRpb24ueiA9IHRoaXMudGFyZ2V0Lno7XG4gICAgICAgIHNwaGVyZS5wb3NpdGlvbi56ID0gdGhpcy50YXJnZXQuejtcbiAgICAgIH0sXG4gICAgICBvbkNvbXBsZXRlOiB5b3lvLFxuICAgICAgb25SZXZlcnNlQ29tcGxldGU6IHlveW9cbiAgICB9KTtcblxuICAgIHRoaXMuc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZGxlVHdlZW4ucmVzdW1lKCk7XG4gICAgfTtcblxuICAgIHRoaXMuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlkbGVUd2Vlbi5wYXVzZSgpO1xuICAgIH07XG5cbiAgfS5iaW5kKHRoaXMpKTtcblxuICB0aGlzLmVsID0gZ3JvdXA7XG5cbiAgdGhpcy5pbiA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gIHRoaXMub3V0ID0gdGhpcy5pbjtcblxuICB0aGlzLnN0YXJ0ID0gdGhpcy5pbjtcblxuICB0aGlzLnN0b3AgPSB0aGlzLmluO1xufVxuXG4vKipcbiAqIEdldCB3aGl0ZSBzcGhlcmVcbiAqXG4gKiBAbWV0aG9kIGdldFNwaGVyZVxuICogQHJldHVybiB7VEhSRUUuTWVzaH1cbiAqL1xuUm9ja3MucHJvdG90eXBlLmdldFNwaGVyZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgY29sb3I6ICcjMGEwYTBhJywgZm9nOiBmYWxzZSB9KTtcbiAgdmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLlNwaGVyZUdlb21ldHJ5KDUsIDIwLCAyMCk7XG4gIHZhciBtZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcblxuICBtZXNoLnBvc2l0aW9uLnNldCgwLCAxMSwgLTQwKTtcblxuICByZXR1cm4gbWVzaDtcbn07XG5cbi8qKlxuICogR2V0IGxpZ2h0XG4gKlxuICogQG1ldGhvZCBnZXRMaWdodFxuICogQHJldHVybiB7VEhSRUUuTGlnaHR9XG4gKi9cblJvY2tzLnByb3RvdHlwZS5nZXRMaWdodCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGxpZ2h0ID0gbmV3IFRIUkVFLlBvaW50TGlnaHQoJyNmZmZmZmYnLCAwLCA1MCk7XG4gIGxpZ2h0LnBvc2l0aW9uLnNldCgwLCAxMSwgLTQwKTtcblxuICByZXR1cm4gbGlnaHQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJvY2tzOyJdfQ==
},{"../utils/yoyoUtil":66}],39:[function(require,module,exports){
(function (global){
'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);

var SPRITE3D = require('../libs/sprite3DLib');
var random = require('../utils/randomUtil');

/**
 * Animated smoke
 *
 * @class Smoke
 * @constructor
 * @param {Object} [options]
 * @param {String} [options.frontColor='#9b69b2'] Front layers color
 * @param {String} [options.backColor='#e1455f'] Back layers color
 * @param {Number} [options.layers=5] Planes number
 * @param {Array} [options.data=[]] Non random values
 * @requires jQuery, THREE, SPRITE3D, random
 */
function Smoke (options) {
  var parameters = jQuery.extend(Smoke.defaultOptions, options);

  var texture = new THREE.ImageUtils.loadTexture('./app/public/img/sprite-smoke.png');
  texture.flipY = false;

  this.sprite = new SPRITE3D.Sprite(texture, {
    horizontal: 8,
    vertical: 8,
    total: 64,
    duration: 50
  });

  var baseMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    depthWrite: false,
    depthTest: true,
    transparent: true,
    opacity: 0.2
  });

  var backMaterial = baseMaterial.clone();
  backMaterial.color = new THREE.Color(parameters.backColor);

  var frontMaterial = baseMaterial.clone();
  frontMaterial.color = new THREE.Color(parameters.frontColor);

  var geometry = new THREE.PlaneGeometry(10, 10);

  this.el = new THREE.Object3D();

  for (var i = 0; i < parameters.layers; i++) {
    var positionX;
    var positionY;
    var positionZ;
    var rotationZ;
    var scale;

    if (parameters.data[i]) {
      positionX = parameters.data[i].positionX || random(-20, 20);
      positionY = parameters.data[i].positionY || random(-20, 20);
      positionZ = parameters.data[i].positionZ || random(-20, 20);
      rotationZ = parameters.data[i].rotationZ || random(0, Math.PI);
      scale = parameters.data[i].scale || random(1, 10);
    } else {
      positionX = random(-20, 20);
      positionY = random(-20, 20);
      positionZ = random(-20, 20);
      rotationZ = random(0, Math.PI);
      scale = random(1, 10);
    }

    var material = positionZ < 0 ? backMaterial : frontMaterial;

    var plane = new THREE.Mesh(geometry, material);
    plane.position.set(positionX, positionY, positionZ);
    plane.rotation.z = rotationZ;
    plane.scale.set(scale, scale, 1);

    this.el.add(plane);
  }
}

Smoke.prototype.start = function () {
  this.sprite.start();
};

Smoke.prototype.stop = function () {
  this.sprite.stop();
};

Smoke.defaultOptions = {
  frontColor: '#9b69b2',
  backColor: '#e1455f',
  layers: 5,
  data: []
};

module.exports = Smoke;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvb2JqZWN0czNEL1Ntb2tlT2JqZWN0M0QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgalF1ZXJ5ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ2pRdWVyeSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnalF1ZXJ5J10gOiBudWxsKTtcbnZhciBUSFJFRSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydUSFJFRSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnVEhSRUUnXSA6IG51bGwpO1xuXG52YXIgU1BSSVRFM0QgPSByZXF1aXJlKCcuLi9saWJzL3Nwcml0ZTNETGliJyk7XG52YXIgcmFuZG9tID0gcmVxdWlyZSgnLi4vdXRpbHMvcmFuZG9tVXRpbCcpO1xuXG4vKipcbiAqIEFuaW1hdGVkIHNtb2tlXG4gKlxuICogQGNsYXNzIFNtb2tlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5mcm9udENvbG9yPScjOWI2OWIyJ10gRnJvbnQgbGF5ZXJzIGNvbG9yXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuYmFja0NvbG9yPScjZTE0NTVmJ10gQmFjayBsYXllcnMgY29sb3JcbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5sYXllcnM9NV0gUGxhbmVzIG51bWJlclxuICogQHBhcmFtIHtBcnJheX0gW29wdGlvbnMuZGF0YT1bXV0gTm9uIHJhbmRvbSB2YWx1ZXNcbiAqIEByZXF1aXJlcyBqUXVlcnksIFRIUkVFLCBTUFJJVEUzRCwgcmFuZG9tXG4gKi9cbmZ1bmN0aW9uIFNtb2tlIChvcHRpb25zKSB7XG4gIHZhciBwYXJhbWV0ZXJzID0galF1ZXJ5LmV4dGVuZChTbW9rZS5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgdmFyIHRleHR1cmUgPSBuZXcgVEhSRUUuSW1hZ2VVdGlscy5sb2FkVGV4dHVyZSgnLi9hcHAvcHVibGljL2ltZy9zcHJpdGUtc21va2UucG5nJyk7XG4gIHRleHR1cmUuZmxpcFkgPSBmYWxzZTtcblxuICB0aGlzLnNwcml0ZSA9IG5ldyBTUFJJVEUzRC5TcHJpdGUodGV4dHVyZSwge1xuICAgIGhvcml6b250YWw6IDgsXG4gICAgdmVydGljYWw6IDgsXG4gICAgdG90YWw6IDY0LFxuICAgIGR1cmF0aW9uOiA1MFxuICB9KTtcblxuICB2YXIgYmFzZU1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtcbiAgICBtYXA6IHRleHR1cmUsXG4gICAgZGVwdGhXcml0ZTogZmFsc2UsXG4gICAgZGVwdGhUZXN0OiB0cnVlLFxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxuICAgIG9wYWNpdHk6IDAuMlxuICB9KTtcblxuICB2YXIgYmFja01hdGVyaWFsID0gYmFzZU1hdGVyaWFsLmNsb25lKCk7XG4gIGJhY2tNYXRlcmlhbC5jb2xvciA9IG5ldyBUSFJFRS5Db2xvcihwYXJhbWV0ZXJzLmJhY2tDb2xvcik7XG5cbiAgdmFyIGZyb250TWF0ZXJpYWwgPSBiYXNlTWF0ZXJpYWwuY2xvbmUoKTtcbiAgZnJvbnRNYXRlcmlhbC5jb2xvciA9IG5ldyBUSFJFRS5Db2xvcihwYXJhbWV0ZXJzLmZyb250Q29sb3IpO1xuXG4gIHZhciBnZW9tZXRyeSA9IG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KDEwLCAxMCk7XG5cbiAgdGhpcy5lbCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcGFyYW1ldGVycy5sYXllcnM7IGkrKykge1xuICAgIHZhciBwb3NpdGlvblg7XG4gICAgdmFyIHBvc2l0aW9uWTtcbiAgICB2YXIgcG9zaXRpb25aO1xuICAgIHZhciByb3RhdGlvblo7XG4gICAgdmFyIHNjYWxlO1xuXG4gICAgaWYgKHBhcmFtZXRlcnMuZGF0YVtpXSkge1xuICAgICAgcG9zaXRpb25YID0gcGFyYW1ldGVycy5kYXRhW2ldLnBvc2l0aW9uWCB8fCByYW5kb20oLTIwLCAyMCk7XG4gICAgICBwb3NpdGlvblkgPSBwYXJhbWV0ZXJzLmRhdGFbaV0ucG9zaXRpb25ZIHx8IHJhbmRvbSgtMjAsIDIwKTtcbiAgICAgIHBvc2l0aW9uWiA9IHBhcmFtZXRlcnMuZGF0YVtpXS5wb3NpdGlvblogfHwgcmFuZG9tKC0yMCwgMjApO1xuICAgICAgcm90YXRpb25aID0gcGFyYW1ldGVycy5kYXRhW2ldLnJvdGF0aW9uWiB8fCByYW5kb20oMCwgTWF0aC5QSSk7XG4gICAgICBzY2FsZSA9IHBhcmFtZXRlcnMuZGF0YVtpXS5zY2FsZSB8fCByYW5kb20oMSwgMTApO1xuICAgIH0gZWxzZSB7XG4gICAgICBwb3NpdGlvblggPSByYW5kb20oLTIwLCAyMCk7XG4gICAgICBwb3NpdGlvblkgPSByYW5kb20oLTIwLCAyMCk7XG4gICAgICBwb3NpdGlvblogPSByYW5kb20oLTIwLCAyMCk7XG4gICAgICByb3RhdGlvblogPSByYW5kb20oMCwgTWF0aC5QSSk7XG4gICAgICBzY2FsZSA9IHJhbmRvbSgxLCAxMCk7XG4gICAgfVxuXG4gICAgdmFyIG1hdGVyaWFsID0gcG9zaXRpb25aIDwgMCA/IGJhY2tNYXRlcmlhbCA6IGZyb250TWF0ZXJpYWw7XG5cbiAgICB2YXIgcGxhbmUgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgIHBsYW5lLnBvc2l0aW9uLnNldChwb3NpdGlvblgsIHBvc2l0aW9uWSwgcG9zaXRpb25aKTtcbiAgICBwbGFuZS5yb3RhdGlvbi56ID0gcm90YXRpb25aO1xuICAgIHBsYW5lLnNjYWxlLnNldChzY2FsZSwgc2NhbGUsIDEpO1xuXG4gICAgdGhpcy5lbC5hZGQocGxhbmUpO1xuICB9XG59XG5cblNtb2tlLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5zcHJpdGUuc3RhcnQoKTtcbn07XG5cblNtb2tlLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLnNwcml0ZS5zdG9wKCk7XG59O1xuXG5TbW9rZS5kZWZhdWx0T3B0aW9ucyA9IHtcbiAgZnJvbnRDb2xvcjogJyM5YjY5YjInLFxuICBiYWNrQ29sb3I6ICcjZTE0NTVmJyxcbiAgbGF5ZXJzOiA1LFxuICBkYXRhOiBbXVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTbW9rZTsiXX0=
},{"../libs/sprite3DLib":6,"../utils/randomUtil":65}],40:[function(require,module,exports){
(function (global){
'use strict';
  
var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var TweenLite = (typeof window !== "undefined" ? window['TweenLite'] : typeof global !== "undefined" ? global['TweenLite'] : null);

var random = require('../utils/randomUtil');

/**
 * Animated strip
 *
 * @class Strip
 * @constructor
 * @param {Object} [options]
 * @pram {Number} [options.count=10] Strips count
 * @pram {Array} [options.colors=['#ffffff']] Strips colors
 * @pram {Number} [options.width=10] Strip width
 * @pram {Number} [options.height=3] Strip height
 * @pram {Number} [options.speed=1] Animations speed
 * @pram {Array} [options.rangeX=[-50, 50]] X position range
 * @pram {Array} [options.rangeY=[-50, 50]] Y position range
 * @pram {Array} [options.rangeZ=[-50, 50]] Z position range
 * @requires jQuery, THREE, TweenLite, random
 */
function Strip (options) {
  this.parameters = jQuery.extend(Strip.defaultOptions, options);

  this.geometry = new THREE.PlaneGeometry(this.parameters.width, this.parameters.height);

  this.el = new THREE.Object3D();

  var materials = {};

  for (var i = 0; i < this.parameters.count; i++) {
    var x = random(this.parameters.rangeX[0], this.parameters.rangeX[1]);
    var y = random(this.parameters.rangeY[0], this.parameters.rangeY[1]);
    var z = random(this.parameters.rangeZ[0], this.parameters.rangeZ[1]);

    var color = this.parameters.colors[random(0, this.parameters.colors.length, true)];

    if (!materials[color]) {
      var material = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide
      });

      materials[color] = material;
    }

    var mesh = new THREE.Mesh(this.geometry, materials[color]);
    mesh.position.set(x, y, z);
    this.el.add(mesh);
  }

  this.from = this.geometry.vertices[0].x;
  this.to = this.geometry.vertices[1].x;
  this.cache =  { x: this.from };

  this.geometry.vertices[1].x = this.geometry.vertices[3].x = this.geometry.vertices[0].x;
};

Strip.prototype.update = function () {
  this.geometry.vertices[1].x = this.geometry.vertices[3].x = this.cache.x;
  this.geometry.verticesNeedUpdate = true;
  this.geometry.computeBoundingSphere();
};

Strip.prototype.in = function () {
  TweenLite.to(this.cache, this.parameters.speed, { x: this.to,
    onUpdate: this.update.bind(this)
  });
};

Strip.prototype.out = function () {
  TweenLite.to(this.cache, this.parameters.speed, { x: this.from,
    onUpdate: this.update.bind(this)
  });
};

Strip.defaultOptions = {
  count: 10,
  colors: ['#ffffff'],
  width: 10,
  height: 3,
  speed: 1,
  rangeX: [-50, 50],
  rangeY: [-50, 50],
  rangeZ: [-50, 50]
};

module.exports = Strip;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvb2JqZWN0czNEL1N0cmlwc09iamVjdDNELmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuICBcbnZhciBqUXVlcnkgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snalF1ZXJ5J10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydqUXVlcnknXSA6IG51bGwpO1xudmFyIFRIUkVFID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1RIUkVFJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydUSFJFRSddIDogbnVsbCk7XG52YXIgVHdlZW5MaXRlID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1R3ZWVuTGl0ZSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnVHdlZW5MaXRlJ10gOiBudWxsKTtcblxudmFyIHJhbmRvbSA9IHJlcXVpcmUoJy4uL3V0aWxzL3JhbmRvbVV0aWwnKTtcblxuLyoqXG4gKiBBbmltYXRlZCBzdHJpcFxuICpcbiAqIEBjbGFzcyBTdHJpcFxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gKiBAcHJhbSB7TnVtYmVyfSBbb3B0aW9ucy5jb3VudD0xMF0gU3RyaXBzIGNvdW50XG4gKiBAcHJhbSB7QXJyYXl9IFtvcHRpb25zLmNvbG9ycz1bJyNmZmZmZmYnXV0gU3RyaXBzIGNvbG9yc1xuICogQHByYW0ge051bWJlcn0gW29wdGlvbnMud2lkdGg9MTBdIFN0cmlwIHdpZHRoXG4gKiBAcHJhbSB7TnVtYmVyfSBbb3B0aW9ucy5oZWlnaHQ9M10gU3RyaXAgaGVpZ2h0XG4gKiBAcHJhbSB7TnVtYmVyfSBbb3B0aW9ucy5zcGVlZD0xXSBBbmltYXRpb25zIHNwZWVkXG4gKiBAcHJhbSB7QXJyYXl9IFtvcHRpb25zLnJhbmdlWD1bLTUwLCA1MF1dIFggcG9zaXRpb24gcmFuZ2VcbiAqIEBwcmFtIHtBcnJheX0gW29wdGlvbnMucmFuZ2VZPVstNTAsIDUwXV0gWSBwb3NpdGlvbiByYW5nZVxuICogQHByYW0ge0FycmF5fSBbb3B0aW9ucy5yYW5nZVo9Wy01MCwgNTBdXSBaIHBvc2l0aW9uIHJhbmdlXG4gKiBAcmVxdWlyZXMgalF1ZXJ5LCBUSFJFRSwgVHdlZW5MaXRlLCByYW5kb21cbiAqL1xuZnVuY3Rpb24gU3RyaXAgKG9wdGlvbnMpIHtcbiAgdGhpcy5wYXJhbWV0ZXJzID0galF1ZXJ5LmV4dGVuZChTdHJpcC5kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgdGhpcy5nZW9tZXRyeSA9IG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KHRoaXMucGFyYW1ldGVycy53aWR0aCwgdGhpcy5wYXJhbWV0ZXJzLmhlaWdodCk7XG5cbiAgdGhpcy5lbCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xuXG4gIHZhciBtYXRlcmlhbHMgPSB7fTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucGFyYW1ldGVycy5jb3VudDsgaSsrKSB7XG4gICAgdmFyIHggPSByYW5kb20odGhpcy5wYXJhbWV0ZXJzLnJhbmdlWFswXSwgdGhpcy5wYXJhbWV0ZXJzLnJhbmdlWFsxXSk7XG4gICAgdmFyIHkgPSByYW5kb20odGhpcy5wYXJhbWV0ZXJzLnJhbmdlWVswXSwgdGhpcy5wYXJhbWV0ZXJzLnJhbmdlWVsxXSk7XG4gICAgdmFyIHogPSByYW5kb20odGhpcy5wYXJhbWV0ZXJzLnJhbmdlWlswXSwgdGhpcy5wYXJhbWV0ZXJzLnJhbmdlWlsxXSk7XG5cbiAgICB2YXIgY29sb3IgPSB0aGlzLnBhcmFtZXRlcnMuY29sb3JzW3JhbmRvbSgwLCB0aGlzLnBhcmFtZXRlcnMuY29sb3JzLmxlbmd0aCwgdHJ1ZSldO1xuXG4gICAgaWYgKCFtYXRlcmlhbHNbY29sb3JdKSB7XG4gICAgICB2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe1xuICAgICAgICBjb2xvcjogY29sb3IsXG4gICAgICAgIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGVcbiAgICAgIH0pO1xuXG4gICAgICBtYXRlcmlhbHNbY29sb3JdID0gbWF0ZXJpYWw7XG4gICAgfVxuXG4gICAgdmFyIG1lc2ggPSBuZXcgVEhSRUUuTWVzaCh0aGlzLmdlb21ldHJ5LCBtYXRlcmlhbHNbY29sb3JdKTtcbiAgICBtZXNoLnBvc2l0aW9uLnNldCh4LCB5LCB6KTtcbiAgICB0aGlzLmVsLmFkZChtZXNoKTtcbiAgfVxuXG4gIHRoaXMuZnJvbSA9IHRoaXMuZ2VvbWV0cnkudmVydGljZXNbMF0ueDtcbiAgdGhpcy50byA9IHRoaXMuZ2VvbWV0cnkudmVydGljZXNbMV0ueDtcbiAgdGhpcy5jYWNoZSA9ICB7IHg6IHRoaXMuZnJvbSB9O1xuXG4gIHRoaXMuZ2VvbWV0cnkudmVydGljZXNbMV0ueCA9IHRoaXMuZ2VvbWV0cnkudmVydGljZXNbM10ueCA9IHRoaXMuZ2VvbWV0cnkudmVydGljZXNbMF0ueDtcbn07XG5cblN0cmlwLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuZ2VvbWV0cnkudmVydGljZXNbMV0ueCA9IHRoaXMuZ2VvbWV0cnkudmVydGljZXNbM10ueCA9IHRoaXMuY2FjaGUueDtcbiAgdGhpcy5nZW9tZXRyeS52ZXJ0aWNlc05lZWRVcGRhdGUgPSB0cnVlO1xuICB0aGlzLmdlb21ldHJ5LmNvbXB1dGVCb3VuZGluZ1NwaGVyZSgpO1xufTtcblxuU3RyaXAucHJvdG90eXBlLmluID0gZnVuY3Rpb24gKCkge1xuICBUd2VlbkxpdGUudG8odGhpcy5jYWNoZSwgdGhpcy5wYXJhbWV0ZXJzLnNwZWVkLCB7IHg6IHRoaXMudG8sXG4gICAgb25VcGRhdGU6IHRoaXMudXBkYXRlLmJpbmQodGhpcylcbiAgfSk7XG59O1xuXG5TdHJpcC5wcm90b3R5cGUub3V0ID0gZnVuY3Rpb24gKCkge1xuICBUd2VlbkxpdGUudG8odGhpcy5jYWNoZSwgdGhpcy5wYXJhbWV0ZXJzLnNwZWVkLCB7IHg6IHRoaXMuZnJvbSxcbiAgICBvblVwZGF0ZTogdGhpcy51cGRhdGUuYmluZCh0aGlzKVxuICB9KTtcbn07XG5cblN0cmlwLmRlZmF1bHRPcHRpb25zID0ge1xuICBjb3VudDogMTAsXG4gIGNvbG9yczogWycjZmZmZmZmJ10sXG4gIHdpZHRoOiAxMCxcbiAgaGVpZ2h0OiAzLFxuICBzcGVlZDogMSxcbiAgcmFuZ2VYOiBbLTUwLCA1MF0sXG4gIHJhbmdlWTogWy01MCwgNTBdLFxuICByYW5nZVo6IFstNTAsIDUwXVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTdHJpcDsiXX0=
},{"../utils/randomUtil":65}],41:[function(require,module,exports){
(function (global){
'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var TweenLite = (typeof window !== "undefined" ? window['TweenLite'] : typeof global !== "undefined" ? global['TweenLite'] : null);
  
/**
 * Display a 2D text in 3D space
 *
 * @class TextPanel
 * @constructor
 * @param {String} [text] Text to display, use '\n' for line break
 * @param {Object} [options]
 * @param {Number} [options.size=100] Font size
 * @param {String} [options.font='Futura'] Fonts
 * @param {String} [options.style='Bold'] Font style
 * @param {String} [options.align='center'] Center, left or right
 * @param {Number} [options.lineSpacing=20] Height lines
 * @param {String} [options.color='rgba(200, 200, 200, 1)'] Text color
 * @requires jQuery, THREE, TweenLite
 */
function TextPanel (text, options) {
  var parameters = jQuery.extend(TextPanel.defaultOptions, options);

  text = text || '';

  // split and clean the words
  var words = text.split('\n');
  var wordsCount = words.length;
  for (var i = 0; i < wordsCount; i++) {
    words[i] = words[i].replace(/^\s+|\s+$/g, '');
  }

  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');

  var font = parameters.style + ' ' + parameters.size + 'px' + ' ' + parameters.font;

  context.font = font;

  // max width
  var width;

  var maxWidth = 0;
  for (var j = 0; j < wordsCount; j++) {
    var tempWidth = context.measureText(words[j]).width;
    if (tempWidth > maxWidth) {
      maxWidth = tempWidth;
    }
  }

  width = maxWidth;

  // get the line height and the total height
  var lineHeight = parameters.size + parameters.lineSpacing;
  var height = lineHeight * wordsCount;

  // security margin
  canvas.width = width + 20; 
  canvas.height = height + 20;

  // set the font once more to update the context
  context.font = font;
  context.fillStyle = parameters.color;
  context.textAlign = parameters.align;
  context.textBaseline = 'top';

  // draw text
  for (var k = 0; k < wordsCount; k++) {
    var word = words[k];

    var left;

    if (parameters.align === 'left') {
      left = 0;
    } else if (parameters.align === 'center') {
      left = canvas.width / 2;
    } else {
      left = canvas.width;
    }

    context.fillText(word, left, lineHeight * k);  
  }

  var texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  var material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    side: THREE.DoubleSide,
    opacity: 0
  });

  var geometry = new THREE.PlaneGeometry(canvas.width / 20, canvas.height / 20);

  // Group is exposed, mesh is animated
  var group = new THREE.Object3D();

  var mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = -20;
  group.add(mesh);

  group.visible = false;

  this.el = group;

  var cache = { y: mesh.position.y, opacity: mesh.material.opacity };

  function update () {
    mesh.position.y = cache.y;
    mesh.material.opacity = cache.opacity;
  }  

  this.in = function () {
    TweenLite.to(cache, 1.5, { y: 0, opacity: 1,
      onStart: function () { group.visible = true; },
      onUpdate: update
    });
  };

  this.out = function (way) {
    var y = way === 'up' ? -20 : 20;
    TweenLite.to(cache, 1, { y: y, opacity: 0,
      onUpdate: update,
      onComplete: function () { group.visible = false; }
    });
  };
}

TextPanel.defaultOptions = {
  size: 100,
  font: 'Futura, Trebuchet MS, Arial, sans-serif',
  style: 'Bold',
  align: 'center',
  lineSpacing: 20,
  color: 'rgba(200, 200, 200, 1)'
};

module.exports = TextPanel;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvb2JqZWN0czNEL1RleHRQYW5lbE9iamVjdDNELmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgalF1ZXJ5ID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ2pRdWVyeSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnalF1ZXJ5J10gOiBudWxsKTtcbnZhciBUSFJFRSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydUSFJFRSddIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbFsnVEhSRUUnXSA6IG51bGwpO1xudmFyIFR3ZWVuTGl0ZSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydUd2VlbkxpdGUnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1R3ZWVuTGl0ZSddIDogbnVsbCk7XG4gIFxuLyoqXG4gKiBEaXNwbGF5IGEgMkQgdGV4dCBpbiAzRCBzcGFjZVxuICpcbiAqIEBjbGFzcyBUZXh0UGFuZWxcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtTdHJpbmd9IFt0ZXh0XSBUZXh0IHRvIGRpc3BsYXksIHVzZSAnXFxuJyBmb3IgbGluZSBicmVha1xuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnNpemU9MTAwXSBGb250IHNpemVcbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5mb250PSdGdXR1cmEnXSBGb250c1xuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLnN0eWxlPSdCb2xkJ10gRm9udCBzdHlsZVxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmFsaWduPSdjZW50ZXInXSBDZW50ZXIsIGxlZnQgb3IgcmlnaHRcbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5saW5lU3BhY2luZz0yMF0gSGVpZ2h0IGxpbmVzXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuY29sb3I9J3JnYmEoMjAwLCAyMDAsIDIwMCwgMSknXSBUZXh0IGNvbG9yXG4gKiBAcmVxdWlyZXMgalF1ZXJ5LCBUSFJFRSwgVHdlZW5MaXRlXG4gKi9cbmZ1bmN0aW9uIFRleHRQYW5lbCAodGV4dCwgb3B0aW9ucykge1xuICB2YXIgcGFyYW1ldGVycyA9IGpRdWVyeS5leHRlbmQoVGV4dFBhbmVsLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcblxuICB0ZXh0ID0gdGV4dCB8fCAnJztcblxuICAvLyBzcGxpdCBhbmQgY2xlYW4gdGhlIHdvcmRzXG4gIHZhciB3b3JkcyA9IHRleHQuc3BsaXQoJ1xcbicpO1xuICB2YXIgd29yZHNDb3VudCA9IHdvcmRzLmxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB3b3Jkc0NvdW50OyBpKyspIHtcbiAgICB3b3Jkc1tpXSA9IHdvcmRzW2ldLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKTtcbiAgfVxuXG4gIHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgdmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICB2YXIgZm9udCA9IHBhcmFtZXRlcnMuc3R5bGUgKyAnICcgKyBwYXJhbWV0ZXJzLnNpemUgKyAncHgnICsgJyAnICsgcGFyYW1ldGVycy5mb250O1xuXG4gIGNvbnRleHQuZm9udCA9IGZvbnQ7XG5cbiAgLy8gbWF4IHdpZHRoXG4gIHZhciB3aWR0aDtcblxuICB2YXIgbWF4V2lkdGggPSAwO1xuICBmb3IgKHZhciBqID0gMDsgaiA8IHdvcmRzQ291bnQ7IGorKykge1xuICAgIHZhciB0ZW1wV2lkdGggPSBjb250ZXh0Lm1lYXN1cmVUZXh0KHdvcmRzW2pdKS53aWR0aDtcbiAgICBpZiAodGVtcFdpZHRoID4gbWF4V2lkdGgpIHtcbiAgICAgIG1heFdpZHRoID0gdGVtcFdpZHRoO1xuICAgIH1cbiAgfVxuXG4gIHdpZHRoID0gbWF4V2lkdGg7XG5cbiAgLy8gZ2V0IHRoZSBsaW5lIGhlaWdodCBhbmQgdGhlIHRvdGFsIGhlaWdodFxuICB2YXIgbGluZUhlaWdodCA9IHBhcmFtZXRlcnMuc2l6ZSArIHBhcmFtZXRlcnMubGluZVNwYWNpbmc7XG4gIHZhciBoZWlnaHQgPSBsaW5lSGVpZ2h0ICogd29yZHNDb3VudDtcblxuICAvLyBzZWN1cml0eSBtYXJnaW5cbiAgY2FudmFzLndpZHRoID0gd2lkdGggKyAyMDsgXG4gIGNhbnZhcy5oZWlnaHQgPSBoZWlnaHQgKyAyMDtcblxuICAvLyBzZXQgdGhlIGZvbnQgb25jZSBtb3JlIHRvIHVwZGF0ZSB0aGUgY29udGV4dFxuICBjb250ZXh0LmZvbnQgPSBmb250O1xuICBjb250ZXh0LmZpbGxTdHlsZSA9IHBhcmFtZXRlcnMuY29sb3I7XG4gIGNvbnRleHQudGV4dEFsaWduID0gcGFyYW1ldGVycy5hbGlnbjtcbiAgY29udGV4dC50ZXh0QmFzZWxpbmUgPSAndG9wJztcblxuICAvLyBkcmF3IHRleHRcbiAgZm9yICh2YXIgayA9IDA7IGsgPCB3b3Jkc0NvdW50OyBrKyspIHtcbiAgICB2YXIgd29yZCA9IHdvcmRzW2tdO1xuXG4gICAgdmFyIGxlZnQ7XG5cbiAgICBpZiAocGFyYW1ldGVycy5hbGlnbiA9PT0gJ2xlZnQnKSB7XG4gICAgICBsZWZ0ID0gMDtcbiAgICB9IGVsc2UgaWYgKHBhcmFtZXRlcnMuYWxpZ24gPT09ICdjZW50ZXInKSB7XG4gICAgICBsZWZ0ID0gY2FudmFzLndpZHRoIC8gMjtcbiAgICB9IGVsc2Uge1xuICAgICAgbGVmdCA9IGNhbnZhcy53aWR0aDtcbiAgICB9XG5cbiAgICBjb250ZXh0LmZpbGxUZXh0KHdvcmQsIGxlZnQsIGxpbmVIZWlnaHQgKiBrKTsgIFxuICB9XG5cbiAgdmFyIHRleHR1cmUgPSBuZXcgVEhSRUUuVGV4dHVyZShjYW52YXMpO1xuICB0ZXh0dXJlLm5lZWRzVXBkYXRlID0gdHJ1ZTtcblxuICB2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe1xuICAgIG1hcDogdGV4dHVyZSxcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcbiAgICBkZXB0aFdyaXRlOiBmYWxzZSxcbiAgICBkZXB0aFRlc3Q6IHRydWUsXG4gICAgc2lkZTogVEhSRUUuRG91YmxlU2lkZSxcbiAgICBvcGFjaXR5OiAwXG4gIH0pO1xuXG4gIHZhciBnZW9tZXRyeSA9IG5ldyBUSFJFRS5QbGFuZUdlb21ldHJ5KGNhbnZhcy53aWR0aCAvIDIwLCBjYW52YXMuaGVpZ2h0IC8gMjApO1xuXG4gIC8vIEdyb3VwIGlzIGV4cG9zZWQsIG1lc2ggaXMgYW5pbWF0ZWRcbiAgdmFyIGdyb3VwID0gbmV3IFRIUkVFLk9iamVjdDNEKCk7XG5cbiAgdmFyIG1lc2ggPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICBtZXNoLnBvc2l0aW9uLnkgPSAtMjA7XG4gIGdyb3VwLmFkZChtZXNoKTtcblxuICBncm91cC52aXNpYmxlID0gZmFsc2U7XG5cbiAgdGhpcy5lbCA9IGdyb3VwO1xuXG4gIHZhciBjYWNoZSA9IHsgeTogbWVzaC5wb3NpdGlvbi55LCBvcGFjaXR5OiBtZXNoLm1hdGVyaWFsLm9wYWNpdHkgfTtcblxuICBmdW5jdGlvbiB1cGRhdGUgKCkge1xuICAgIG1lc2gucG9zaXRpb24ueSA9IGNhY2hlLnk7XG4gICAgbWVzaC5tYXRlcmlhbC5vcGFjaXR5ID0gY2FjaGUub3BhY2l0eTtcbiAgfSAgXG5cbiAgdGhpcy5pbiA9IGZ1bmN0aW9uICgpIHtcbiAgICBUd2VlbkxpdGUudG8oY2FjaGUsIDEuNSwgeyB5OiAwLCBvcGFjaXR5OiAxLFxuICAgICAgb25TdGFydDogZnVuY3Rpb24gKCkgeyBncm91cC52aXNpYmxlID0gdHJ1ZTsgfSxcbiAgICAgIG9uVXBkYXRlOiB1cGRhdGVcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLm91dCA9IGZ1bmN0aW9uICh3YXkpIHtcbiAgICB2YXIgeSA9IHdheSA9PT0gJ3VwJyA/IC0yMCA6IDIwO1xuICAgIFR3ZWVuTGl0ZS50byhjYWNoZSwgMSwgeyB5OiB5LCBvcGFjaXR5OiAwLFxuICAgICAgb25VcGRhdGU6IHVwZGF0ZSxcbiAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uICgpIHsgZ3JvdXAudmlzaWJsZSA9IGZhbHNlOyB9XG4gICAgfSk7XG4gIH07XG59XG5cblRleHRQYW5lbC5kZWZhdWx0T3B0aW9ucyA9IHtcbiAgc2l6ZTogMTAwLFxuICBmb250OiAnRnV0dXJhLCBUcmVidWNoZXQgTVMsIEFyaWFsLCBzYW5zLXNlcmlmJyxcbiAgc3R5bGU6ICdCb2xkJyxcbiAgYWxpZ246ICdjZW50ZXInLFxuICBsaW5lU3BhY2luZzogMjAsXG4gIGNvbG9yOiAncmdiYSgyMDAsIDIwMCwgMjAwLCAxKSdcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVGV4dFBhbmVsOyJdfQ==
},{}],42:[function(require,module,exports){
(function (global){
'use strict';

var jQuery = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);
var TweenLite = (typeof window !== "undefined" ? window['TweenLite'] : typeof global !== "undefined" ? global['TweenLite'] : null);

var loop = require('../utils/loopUtil');

/**
 * Animated wave
 *
 * @class Wave
 * @constructor
 * @param {Object} [options]
 * @param {Object} [options.amplitude=10] Vertical amplitude
 * @param {Object} [options.divisionSize=2] Grid division size
 * @param {Object} [options.divisionX=50] X axis divisions
 * @param {Object} [options.divisionY=50] Y axis divisions
 * @param {Object} [options.speed=10] Animation speed
 * @requires jQuery, THREE, TweenLite, loop
 */
function Wave (options) {
  this.parameters = jQuery.extend(Wave.defaultOptions, options);

  var plane = this.getPlane();
  
  var time = 0;

  var divisionsX = this.parameters.divisionsX;
  var divisionsY = this.parameters.divisionsY;

  function updateWave () {
    var i= 0;

    for (var x = 0; x <= divisionsX; x++) {
      for (var y = 0; y <= divisionsY; y++) {
        var vertex = plane.geometry.vertices[i++];
        vertex.z =
          (Math.sin(((x + 1) + time) * 0.2) * 2) +
          (Math.sin(((y + 1) + time) * 0.2) * 5);
      }
    }

    plane.geometry.verticesNeedUpdate = true;
    time += 0.1;
  }

  updateWave();

  var idleTween = TweenLite.to({}, 5, { paused: true, ease: window.Linear.easeNone,
    onUpdate: updateWave,
    onComplete: loop
  });

  this.el = plane;

  this.in = function (way) {
    plane.position.y = way === 'up' ? 20 : -20;
    TweenLite.to(plane.position, 1.5, { y: -10 });
  };

  this.out = function (way) {
    var y = way === 'up' ? -20 : 20;
    TweenLite.to(plane.position, 1, { y: y });
  };

  this.start = function () {
    idleTween.resume();
  };

  this.stop = function () {
    idleTween.pause();
  };
}

Wave.defaultOptions = {
  amplitude: 10,
  divisionSize: 2,
  divisionsX: 50,
  divisionsY: 50,
  speed: 10
};

/**
 * Get wave's plane
 *
 * @method getPlane
 * @return {THREE.Mesh}
 */
Wave.prototype.getPlane = function () {
  var texture = THREE.ImageUtils.loadTexture('./app/public/img/texture-wave.png');
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(20, 20);

  var material = new THREE.MeshLambertMaterial({
    map: texture,
    color: '#ffffff',
    side: THREE.DoubleSide
  });

  var geometry = new THREE.PlaneGeometry(
    this.parameters.divisionsX * this.parameters.divisionSize,
    this.parameters.divisionsY * this.parameters.divisionSize,
    this.parameters.divisionsX,
    this.parameters.divisionsY
  );

  var mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = -20;
  mesh.rotation.x = -Math.PI / 2;

  return mesh;
};

module.exports = Wave;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvb2JqZWN0czNEL1dhdmVPYmplY3QzRC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIGpRdWVyeSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydqUXVlcnknXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ2pRdWVyeSddIDogbnVsbCk7XG52YXIgVEhSRUUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snVEhSRUUnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1RIUkVFJ10gOiBudWxsKTtcbnZhciBUd2VlbkxpdGUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snVHdlZW5MaXRlJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydUd2VlbkxpdGUnXSA6IG51bGwpO1xuXG52YXIgbG9vcCA9IHJlcXVpcmUoJy4uL3V0aWxzL2xvb3BVdGlsJyk7XG5cbi8qKlxuICogQW5pbWF0ZWQgd2F2ZVxuICpcbiAqIEBjbGFzcyBXYXZlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5hbXBsaXR1ZGU9MTBdIFZlcnRpY2FsIGFtcGxpdHVkZVxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLmRpdmlzaW9uU2l6ZT0yXSBHcmlkIGRpdmlzaW9uIHNpemVcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5kaXZpc2lvblg9NTBdIFggYXhpcyBkaXZpc2lvbnNcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5kaXZpc2lvblk9NTBdIFkgYXhpcyBkaXZpc2lvbnNcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5zcGVlZD0xMF0gQW5pbWF0aW9uIHNwZWVkXG4gKiBAcmVxdWlyZXMgalF1ZXJ5LCBUSFJFRSwgVHdlZW5MaXRlLCBsb29wXG4gKi9cbmZ1bmN0aW9uIFdhdmUgKG9wdGlvbnMpIHtcbiAgdGhpcy5wYXJhbWV0ZXJzID0galF1ZXJ5LmV4dGVuZChXYXZlLmRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcblxuICB2YXIgcGxhbmUgPSB0aGlzLmdldFBsYW5lKCk7XG4gIFxuICB2YXIgdGltZSA9IDA7XG5cbiAgdmFyIGRpdmlzaW9uc1ggPSB0aGlzLnBhcmFtZXRlcnMuZGl2aXNpb25zWDtcbiAgdmFyIGRpdmlzaW9uc1kgPSB0aGlzLnBhcmFtZXRlcnMuZGl2aXNpb25zWTtcblxuICBmdW5jdGlvbiB1cGRhdGVXYXZlICgpIHtcbiAgICB2YXIgaT0gMDtcblxuICAgIGZvciAodmFyIHggPSAwOyB4IDw9IGRpdmlzaW9uc1g7IHgrKykge1xuICAgICAgZm9yICh2YXIgeSA9IDA7IHkgPD0gZGl2aXNpb25zWTsgeSsrKSB7XG4gICAgICAgIHZhciB2ZXJ0ZXggPSBwbGFuZS5nZW9tZXRyeS52ZXJ0aWNlc1tpKytdO1xuICAgICAgICB2ZXJ0ZXgueiA9XG4gICAgICAgICAgKE1hdGguc2luKCgoeCArIDEpICsgdGltZSkgKiAwLjIpICogMikgK1xuICAgICAgICAgIChNYXRoLnNpbigoKHkgKyAxKSArIHRpbWUpICogMC4yKSAqIDUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHBsYW5lLmdlb21ldHJ5LnZlcnRpY2VzTmVlZFVwZGF0ZSA9IHRydWU7XG4gICAgdGltZSArPSAwLjE7XG4gIH1cblxuICB1cGRhdGVXYXZlKCk7XG5cbiAgdmFyIGlkbGVUd2VlbiA9IFR3ZWVuTGl0ZS50byh7fSwgNSwgeyBwYXVzZWQ6IHRydWUsIGVhc2U6IHdpbmRvdy5MaW5lYXIuZWFzZU5vbmUsXG4gICAgb25VcGRhdGU6IHVwZGF0ZVdhdmUsXG4gICAgb25Db21wbGV0ZTogbG9vcFxuICB9KTtcblxuICB0aGlzLmVsID0gcGxhbmU7XG5cbiAgdGhpcy5pbiA9IGZ1bmN0aW9uICh3YXkpIHtcbiAgICBwbGFuZS5wb3NpdGlvbi55ID0gd2F5ID09PSAndXAnID8gMjAgOiAtMjA7XG4gICAgVHdlZW5MaXRlLnRvKHBsYW5lLnBvc2l0aW9uLCAxLjUsIHsgeTogLTEwIH0pO1xuICB9O1xuXG4gIHRoaXMub3V0ID0gZnVuY3Rpb24gKHdheSkge1xuICAgIHZhciB5ID0gd2F5ID09PSAndXAnID8gLTIwIDogMjA7XG4gICAgVHdlZW5MaXRlLnRvKHBsYW5lLnBvc2l0aW9uLCAxLCB7IHk6IHkgfSk7XG4gIH07XG5cbiAgdGhpcy5zdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZGxlVHdlZW4ucmVzdW1lKCk7XG4gIH07XG5cbiAgdGhpcy5zdG9wID0gZnVuY3Rpb24gKCkge1xuICAgIGlkbGVUd2Vlbi5wYXVzZSgpO1xuICB9O1xufVxuXG5XYXZlLmRlZmF1bHRPcHRpb25zID0ge1xuICBhbXBsaXR1ZGU6IDEwLFxuICBkaXZpc2lvblNpemU6IDIsXG4gIGRpdmlzaW9uc1g6IDUwLFxuICBkaXZpc2lvbnNZOiA1MCxcbiAgc3BlZWQ6IDEwXG59O1xuXG4vKipcbiAqIEdldCB3YXZlJ3MgcGxhbmVcbiAqXG4gKiBAbWV0aG9kIGdldFBsYW5lXG4gKiBAcmV0dXJuIHtUSFJFRS5NZXNofVxuICovXG5XYXZlLnByb3RvdHlwZS5nZXRQbGFuZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHRleHR1cmUgPSBUSFJFRS5JbWFnZVV0aWxzLmxvYWRUZXh0dXJlKCcuL2FwcC9wdWJsaWMvaW1nL3RleHR1cmUtd2F2ZS5wbmcnKTtcbiAgdGV4dHVyZS53cmFwUyA9IHRleHR1cmUud3JhcFQgPSBUSFJFRS5SZXBlYXRXcmFwcGluZztcbiAgdGV4dHVyZS5yZXBlYXQuc2V0KDIwLCAyMCk7XG5cbiAgdmFyIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoe1xuICAgIG1hcDogdGV4dHVyZSxcbiAgICBjb2xvcjogJyNmZmZmZmYnLFxuICAgIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGVcbiAgfSk7XG5cbiAgdmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkoXG4gICAgdGhpcy5wYXJhbWV0ZXJzLmRpdmlzaW9uc1ggKiB0aGlzLnBhcmFtZXRlcnMuZGl2aXNpb25TaXplLFxuICAgIHRoaXMucGFyYW1ldGVycy5kaXZpc2lvbnNZICogdGhpcy5wYXJhbWV0ZXJzLmRpdmlzaW9uU2l6ZSxcbiAgICB0aGlzLnBhcmFtZXRlcnMuZGl2aXNpb25zWCxcbiAgICB0aGlzLnBhcmFtZXRlcnMuZGl2aXNpb25zWVxuICApO1xuXG4gIHZhciBtZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgbWVzaC5wb3NpdGlvbi55ID0gLTIwO1xuICBtZXNoLnJvdGF0aW9uLnggPSAtTWF0aC5QSSAvIDI7XG5cbiAgcmV0dXJuIG1lc2g7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdhdmU7Il19
},{"../utils/loopUtil":62}],43:[function(require,module,exports){
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
},{}],44:[function(require,module,exports){
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
},{}],45:[function(require,module,exports){
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
},{}],46:[function(require,module,exports){
'use strict';

var Section = require('../classes/SectionClass');

var TextPanel = require('../objects3D/TextPanelObject3D');
var Ball = require('../objects3D/BallObject3D');
var Grid = require('../objects3D/GridObject3D');

var ballSection = new Section('ball');

var ball = new Ball();
ball.el.rotation.z = 2;
ballSection.add(ball.el);

var grid = new Grid({
  step: 5,
  stepsX: 11,
  stepsY: 11,
  loop: true
});
grid.el.rotation.set(1.5, 1, 2);
grid.el.position.x = -20;
ballSection.add(grid.el);

var text = new TextPanel(
  'C  A  M  I  L  O \n S  A  L  I  N  A  S',
  {
    align: 'left',
    style: '',
    size: 50,
    lineSpacing: 40
  }
);
text.el.position.set(15, 0, 15);
text.el.rotation.y = -0.4;
ballSection.add(text.el);

ball.el.visible = false;
grid.el.visible = false;

ballSection.onIn(function () {
  ball.in();
  grid.in();
  text.in();
});

ballSection.onOut(function (way) {
  text.out(way);
  grid.out(way);

  if (way === 'up') {
    ball.out();
  }
});

ballSection.onStart(function () {
  ball.start();
  grid.start();

  ball.el.visible = true;
  grid.el.visible = true;
});

ballSection.onStop(function () {
  ball.stop();
  grid.stop();

  ball.el.visible = false;
  grid.el.visible = false;
});

module.exports = ballSection;
},{"../classes/SectionClass":4,"../objects3D/BallObject3D":25,"../objects3D/GridObject3D":33,"../objects3D/TextPanelObject3D":41}],47:[function(require,module,exports){
'use strict';

var Section = require('../classes/SectionClass');

var Beam = require('../objects3D/BeamObject3D');

var beamsSection = new Section('beams');

var leftBeam = new Beam({ color: '#808080', delay: 0.2 });
leftBeam.el.position.set(15, 25, -10);
beamsSection.add(leftBeam.el);

var middleBeam = new Beam({ color: '#ffffff', width: 4, cubeSize: 1, delay: 0.1 });
middleBeam.el.position.y = 15;
beamsSection.add(middleBeam.el);

var rightBeam = new Beam({ color: '#4c4c4c', delay: 0.4 });
rightBeam.el.position.set(-20, 30, -20);
beamsSection.add(rightBeam.el);

leftBeam.el.visible = false;
middleBeam.el.visible = false;
rightBeam.el.visible = false;

beamsSection.onIn(function () {
  leftBeam.in();
  middleBeam.in();
  rightBeam.in();
});

beamsSection.onOut(function (way) {
  leftBeam.out(way);
  middleBeam.out(way);
  rightBeam.out(way);
});

beamsSection.onStart(function () {
  leftBeam.start();
  middleBeam.start();
  rightBeam.start();

  leftBeam.el.visible = true;
  middleBeam.el.visible = true;
  rightBeam.el.visible = true;
});

beamsSection.onStop(function () {
  leftBeam.stop();
  middleBeam.stop();
  rightBeam.stop();

  leftBeam.el.visible = false;
  middleBeam.el.visible = false;
  rightBeam.el.visible = false;
});

module.exports = beamsSection;
},{"../classes/SectionClass":4,"../objects3D/BeamObject3D":26}],48:[function(require,module,exports){
(function (global){
'use strict';

var TweenLite = (typeof window !== "undefined" ? window['TweenLite'] : typeof global !== "undefined" ? global['TweenLite'] : null);

var Section = require('../classes/SectionClass');

var City = require('../objects3D/CityObject3D');

var citySection = new Section('city');

var city = new City();
city.addGroup({
  name: 'shanghai',
  objs: {
    ground: './app/public/3D/shanghai-grounds.js',
    buildings: './app/public/3D/shanghai-buildings.js',
    towers: './app/public/3D/shanghai-towers.js'
  },
  outline: {
    ground: {
      offset: 0.2,
      solid: true
    }
  }
});

// city.el.rotation.y = Math.PI / 6;
city.el.rotation.y = 0;
city.el.rotation.z = Math.PI / 16;
city.el.position.set(5, -10, 0);
citySection.add(city.el);
city.showGroup('shanghai');

TweenLite.to(city.el.rotation, 30, { y: 2 * Math.PI, ease: window.Linear.easeNone,
  onComplete: function () {
    this.restart();
  }
});

citySection.onIn(function (way) {

});

citySection.onOut(function (way) {

});

citySection.onStart(function (way) {

});

citySection.onStop(function (way) {

});

module.exports = citySection;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvc2VjdGlvbnMvY2l0eVNlY3Rpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIFR3ZWVuTGl0ZSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93WydUd2VlbkxpdGUnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1R3ZWVuTGl0ZSddIDogbnVsbCk7XG5cbnZhciBTZWN0aW9uID0gcmVxdWlyZSgnLi4vY2xhc3Nlcy9TZWN0aW9uQ2xhc3MnKTtcblxudmFyIENpdHkgPSByZXF1aXJlKCcuLi9vYmplY3RzM0QvQ2l0eU9iamVjdDNEJyk7XG5cbnZhciBjaXR5U2VjdGlvbiA9IG5ldyBTZWN0aW9uKCdjaXR5Jyk7XG5cbnZhciBjaXR5ID0gbmV3IENpdHkoKTtcbmNpdHkuYWRkR3JvdXAoe1xuICBuYW1lOiAnc2hhbmdoYWknLFxuICBvYmpzOiB7XG4gICAgZ3JvdW5kOiAnLi9hcHAvcHVibGljLzNEL3NoYW5naGFpLWdyb3VuZHMuanMnLFxuICAgIGJ1aWxkaW5nczogJy4vYXBwL3B1YmxpYy8zRC9zaGFuZ2hhaS1idWlsZGluZ3MuanMnLFxuICAgIHRvd2VyczogJy4vYXBwL3B1YmxpYy8zRC9zaGFuZ2hhaS10b3dlcnMuanMnXG4gIH0sXG4gIG91dGxpbmU6IHtcbiAgICBncm91bmQ6IHtcbiAgICAgIG9mZnNldDogMC4yLFxuICAgICAgc29saWQ6IHRydWVcbiAgICB9XG4gIH1cbn0pO1xuXG4vLyBjaXR5LmVsLnJvdGF0aW9uLnkgPSBNYXRoLlBJIC8gNjtcbmNpdHkuZWwucm90YXRpb24ueSA9IDA7XG5jaXR5LmVsLnJvdGF0aW9uLnogPSBNYXRoLlBJIC8gMTY7XG5jaXR5LmVsLnBvc2l0aW9uLnNldCg1LCAtMTAsIDApO1xuY2l0eVNlY3Rpb24uYWRkKGNpdHkuZWwpO1xuY2l0eS5zaG93R3JvdXAoJ3NoYW5naGFpJyk7XG5cblR3ZWVuTGl0ZS50byhjaXR5LmVsLnJvdGF0aW9uLCAzMCwgeyB5OiAyICogTWF0aC5QSSwgZWFzZTogd2luZG93LkxpbmVhci5lYXNlTm9uZSxcbiAgb25Db21wbGV0ZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucmVzdGFydCgpO1xuICB9XG59KTtcblxuY2l0eVNlY3Rpb24ub25JbihmdW5jdGlvbiAod2F5KSB7XG5cbn0pO1xuXG5jaXR5U2VjdGlvbi5vbk91dChmdW5jdGlvbiAod2F5KSB7XG5cbn0pO1xuXG5jaXR5U2VjdGlvbi5vblN0YXJ0KGZ1bmN0aW9uICh3YXkpIHtcblxufSk7XG5cbmNpdHlTZWN0aW9uLm9uU3RvcChmdW5jdGlvbiAod2F5KSB7XG5cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNpdHlTZWN0aW9uOyJdfQ==
},{"../classes/SectionClass":4,"../objects3D/CityObject3D":27}],49:[function(require,module,exports){
'use strict';

var Section = require('../classes/SectionClass');

var TextPanel = require('../objects3D/TextPanelObject3D');
var Drop = require('../objects3D/DropObject3D');

var dropSection = new Section('drop');

var drop = new Drop({ amplitude: 4 });
drop.el.rotation.x = -1.2;
drop.el.position.y = -10;
dropSection.add(drop.el);

var text = new TextPanel(
  'M  I  \nN O  M  B  R  E   E S',
  {
    align: 'right',
    style: '',
    size: 50,
    lineSpacing: 40
  }
);
text.el.position.set(-10, 8, 0);
dropSection.add(text.el);

drop.el.visible = false;

dropSection.onIn(function () {
  drop.in();
  text.in();
});

dropSection.onOut(function (way) {
  drop.out(way);
  text.out(way);
});

dropSection.onStart(function () {
  drop.start();

  drop.el.visible = true;
});

dropSection.onStop(function () {
  drop.stop();

  drop.el.visible = false;
});

module.exports = dropSection;
},{"../classes/SectionClass":4,"../objects3D/DropObject3D":28,"../objects3D/TextPanelObject3D":41}],50:[function(require,module,exports){
'use strict';
  
var Section = require('../classes/SectionClass');

var TextPanel = require('../objects3D/TextPanelObject3D');
var LookAtField = require('../objects3D/LookAtFieldObject3D');

var endSection = new Section('end');

var text = new TextPanel(
  'G  R  A  C  I  A  S \n P  O  R    V  E  R',
  {
    align: 'center',
    style: '',
    size: 50,
    lineSpacing: 40
  }
);
endSection.add(text.el);

var field = new LookAtField({
  count: 50
});
endSection.add(field.el);

endSection.onIn(function () {
  text.in();
  field.in();
});

endSection.onOut(function (way) {
  text.out(way);
  field.out(way);
});

module.exports = endSection;
},{"../classes/SectionClass":4,"../objects3D/LookAtFieldObject3D":36,"../objects3D/TextPanelObject3D":41}],51:[function(require,module,exports){
'use strict';

var Section = require('../classes/SectionClass');

var TextPanel = require('../objects3D/TextPanelObject3D');
var Face = require('../objects3D/FaceHpObject3D');
var Strips = require('../objects3D/StripsObject3D');

var faceSection = new Section('face');

var text = new TextPanel(
  'S O Y  \n P E R S E V E R A N T E',
  {
    align: 'left',
    style: '',
    size: 50,
    lineSpacing: 40
  }
);
text.el.position.set(23, 0, 0);
text.el.rotation.y = -0.4;
faceSection.add(text.el);

var face = new Face();
face.el.position.y = -5;
face.el.rotation.x = -0.1;
face.el.rotation.z = 0.25;
faceSection.add(face.el);

var strips = new Strips({
  count: 10,
  colors: ['#444444', '#333333', '#222222'],
  rangeY: [-60, 60]
});
faceSection.add(strips.el);

face.el.visible = false;
strips.el.visible = false;

faceSection.onIn(function () {
  face.in();
  strips.in();
  text.in();
});

faceSection.onOut(function (way) {
  face.out(way);
  strips.out();
  text.out();
});

faceSection.onStart(function () {
  face.start();

  face.el.visible = true;
  strips.el.visible = true;
});

faceSection.onStop(function () {
  face.stop();

  face.el.visible = false;
  strips.el.visible = false;
});

module.exports = faceSection;
},{"../classes/SectionClass":4,"../objects3D/FaceHpObject3D":29,"../objects3D/StripsObject3D":40,"../objects3D/TextPanelObject3D":41}],52:[function(require,module,exports){
(function (global){
'use strict';

var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);

var Section = require('../classes/SectionClass');

var FlowField = require('../objects3D/FlowFieldObject3D');
var TextPanel = require('../objects3D/TextPanelObject3D');

var flowSection = new Section('flow');

var points = [
  new THREE.Vector3(0, 50, 20),
  new THREE.Vector3(20, 0, -10),
  new THREE.Vector3(-20, -100, 0)
];

var field = new FlowField(points, {
  subsAmplitude: 50,
  subsNumber: 10
});
flowSection.add(field.el);

var text = new TextPanel(
  'H A G O \n E X P E R I E N C I A S   V I S U A L E S',
  {
    align: 'center',
    style: '',
    size: 50,
    lineSpacing: 40
  }
);
text.el.position.z = -10;
text.el.rotation.y = 0.4;
flowSection.add(text.el);

field.el.visible = false;

var fieldIn = false;

flowSection.fieldIn = function () {
  if (fieldIn) {
    return false;
  }

  fieldIn = true;

  field.in();
};

flowSection.onIn(function () {
  text.in();
});

flowSection.onOut(function (way) {
  text.out(way);
});

flowSection.onStart(function () {
  field.start();

  field.el.visible = true;
});

flowSection.onStop(function () {
  field.stop();

  field.el.visible = false;
});

module.exports = flowSection;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvc2VjdGlvbnMvZmxvd1NlY3Rpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxudmFyIFRIUkVFID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3dbJ1RIUkVFJ10gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsWydUSFJFRSddIDogbnVsbCk7XG5cbnZhciBTZWN0aW9uID0gcmVxdWlyZSgnLi4vY2xhc3Nlcy9TZWN0aW9uQ2xhc3MnKTtcblxudmFyIEZsb3dGaWVsZCA9IHJlcXVpcmUoJy4uL29iamVjdHMzRC9GbG93RmllbGRPYmplY3QzRCcpO1xudmFyIFRleHRQYW5lbCA9IHJlcXVpcmUoJy4uL29iamVjdHMzRC9UZXh0UGFuZWxPYmplY3QzRCcpO1xuXG52YXIgZmxvd1NlY3Rpb24gPSBuZXcgU2VjdGlvbignZmxvdycpO1xuXG52YXIgcG9pbnRzID0gW1xuICBuZXcgVEhSRUUuVmVjdG9yMygwLCA1MCwgMjApLFxuICBuZXcgVEhSRUUuVmVjdG9yMygyMCwgMCwgLTEwKSxcbiAgbmV3IFRIUkVFLlZlY3RvcjMoLTIwLCAtMTAwLCAwKVxuXTtcblxudmFyIGZpZWxkID0gbmV3IEZsb3dGaWVsZChwb2ludHMsIHtcbiAgc3Vic0FtcGxpdHVkZTogNTAsXG4gIHN1YnNOdW1iZXI6IDEwXG59KTtcbmZsb3dTZWN0aW9uLmFkZChmaWVsZC5lbCk7XG5cbnZhciB0ZXh0ID0gbmV3IFRleHRQYW5lbChcbiAgJ0ggQSBHIE8gXFxuIEUgWCBQIEUgUiBJIEUgTiBDIEkgQSBTICAgViBJIFMgVSBBIEwgRSBTJyxcbiAge1xuICAgIGFsaWduOiAnY2VudGVyJyxcbiAgICBzdHlsZTogJycsXG4gICAgc2l6ZTogNTAsXG4gICAgbGluZVNwYWNpbmc6IDQwXG4gIH1cbik7XG50ZXh0LmVsLnBvc2l0aW9uLnogPSAtMTA7XG50ZXh0LmVsLnJvdGF0aW9uLnkgPSAwLjQ7XG5mbG93U2VjdGlvbi5hZGQodGV4dC5lbCk7XG5cbmZpZWxkLmVsLnZpc2libGUgPSBmYWxzZTtcblxudmFyIGZpZWxkSW4gPSBmYWxzZTtcblxuZmxvd1NlY3Rpb24uZmllbGRJbiA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKGZpZWxkSW4pIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmaWVsZEluID0gdHJ1ZTtcblxuICBmaWVsZC5pbigpO1xufTtcblxuZmxvd1NlY3Rpb24ub25JbihmdW5jdGlvbiAoKSB7XG4gIHRleHQuaW4oKTtcbn0pO1xuXG5mbG93U2VjdGlvbi5vbk91dChmdW5jdGlvbiAod2F5KSB7XG4gIHRleHQub3V0KHdheSk7XG59KTtcblxuZmxvd1NlY3Rpb24ub25TdGFydChmdW5jdGlvbiAoKSB7XG4gIGZpZWxkLnN0YXJ0KCk7XG5cbiAgZmllbGQuZWwudmlzaWJsZSA9IHRydWU7XG59KTtcblxuZmxvd1NlY3Rpb24ub25TdG9wKGZ1bmN0aW9uICgpIHtcbiAgZmllbGQuc3RvcCgpO1xuXG4gIGZpZWxkLmVsLnZpc2libGUgPSBmYWxzZTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZsb3dTZWN0aW9uOyJdfQ==
},{"../classes/SectionClass":4,"../objects3D/FlowFieldObject3D":30,"../objects3D/TextPanelObject3D":41}],53:[function(require,module,exports){
'use strict';

var Section = require('../classes/SectionClass');

var TextPanel = require('../objects3D/TextPanelObject3D');
var Galaxy = require('../objects3D/GalaxyObject3D');

var galaxySection = new Section('galaxy');

var galaxy = new Galaxy();
galaxy.el.rotation.x = -1;
galaxySection.add(galaxy.el);

galaxy.el.visible = false;

var text = new TextPanel(
  'T R A B A J O  \n D U R O',
  {
    align: 'center',
    style: '',
    size: 50,
    lineSpacing: 40
  }
);
text.el.position.set(0, 20, -20);
galaxySection.add(text.el);

galaxySection.onIn(function (way) {
  galaxy.in(way);
  text.in();
});

galaxySection.onOut(function (way) {
  galaxy.out(way);
  text.out(way);
});

galaxySection.onStart(function () {
  galaxy.start();

  galaxy.el.visible = true;
});

galaxySection.onStop(function () {
  galaxy.stop();

  galaxy.el.visible = false;
});

module.exports = galaxySection;
},{"../classes/SectionClass":4,"../objects3D/GalaxyObject3D":31,"../objects3D/TextPanelObject3D":41}],54:[function(require,module,exports){
'use strict';

var Section = require('../classes/SectionClass');

var GravityGrid = require('../objects3D/GravityGridObject3D');

var gravitySection = new Section('gravity');

var grid = new GravityGrid({
  linesColor: '#666666'
});
grid.el.position.z = 0;
grid.el.rotation.x = -1;
gravitySection.add(grid.el);

grid.el.visible = false;

gravitySection.onIn(function () {
  grid.in();
});

gravitySection.onOut(function () {
  grid.out();
});

gravitySection.onStart(function () {
  grid.start();
});

gravitySection.onStop(function () {
  grid.stop();
});

gravitySection.show = function () {
  grid.el.visible = true;
};

gravitySection.hide = function () {
  grid.el.visible = false;
};

module.exports = gravitySection;
},{"../classes/SectionClass":4,"../objects3D/GravityGridObject3D":32}],55:[function(require,module,exports){
'use strict';

var Section = require('../classes/SectionClass');

var TextPanel = require('../objects3D/TextPanelObject3D');
var HeightMap = require('../objects3D/HeightMapObject3D');

var heightSection = new Section('height');

var heightMap = new HeightMap({
  horizontal: true,
  vertical: false,
  plane: false,
  points: false,
  maps: [
    { name: 'A', url: './app/public/img/heightMap-A.jpg' },
    { name: 'B', url: './app/public/img/heightMap-B.jpg' },
    { name: 'O', url: './app/public/img/heightMap-O.jpg' }
  ]
});
heightMap.el.position.z = -10;
heightMap.el.rotation.y = -0.6;
heightSection.add(heightMap.el);

var text = new TextPanel(
  'T R A N S F O R M O',
  {
    align: 'right',
    style: '',
    size: 50,
    lineSpacing: 40,
  }
);
text.el.position.set(-20, 0, 0);
heightSection.add(text.el);

heightMap.el.visible = false;

heightSection.onIn(function () {
  text.in();
});

heightSection.onOut(function (way) {
  text.out(way);
});

heightSection.onStart(function () {
  if (!heightMap.ready) {
    return false;
  }

  heightMap.start();
});

heightSection.onStop(function () {
  if (!heightMap.ready) {
    return false;
  }

  heightMap.stop();
});

heightSection.show = function () {
  heightMap.el.visible = true;
};

heightSection.hide = function () {
  heightMap.el.visible = false;
};

module.exports = heightSection;
},{"../classes/SectionClass":4,"../objects3D/HeightMapObject3D":34,"../objects3D/TextPanelObject3D":41}],56:[function(require,module,exports){
'use strict';

var Section = require('../classes/SectionClass');

var Title = require('../objects3D/HelloTitleObject3D');
var Smoke = require('../objects3D/SmokeObject3D');

var helloSection = new Section('hello');

var title = new Title();
helloSection.add(title.el);

var smoke = new Smoke({  
  frontColor: '#4c4c4c',
  backColor: '#ffffff',
  layers: 3,
  data: [
    { positionX : 10.7, positionY: 3.9, positionZ: 17.8, rotationZ: 2.7, scale: 3.9 },
    { positionX : -2.8, positionY: 2.6, positionZ: -11, rotationZ: 0.7, scale: 7.7 },
    { positionX : 13, positionY: 19.5, positionZ: -1.3, rotationZ: 2, scale: 2.7 }
  ]
});

helloSection.add(smoke.el);

smoke.el.visible = false;

helloSection.onIn(function () {
  title.in();
});

helloSection.onOut(function () {
  title.out();
});

helloSection.onStart(function () {
  title.start();
});

helloSection.onStop(function () {
  title.stop();
});

var smokePlaying = false;

helloSection.smokeStart = function () {
  if (smokePlaying) {
    return false;
  }

  smokePlaying = true;

  smoke.start();

  smoke.el.visible = true;
};

helloSection.smokeStop = function () {
  if (!smokePlaying) {
    return false;
  }

  smokePlaying = false;

  smoke.stop();

  smoke.el.visible = false;
};

module.exports = helloSection;
},{"../classes/SectionClass":4,"../objects3D/HelloTitleObject3D":35,"../objects3D/SmokeObject3D":39}],57:[function(require,module,exports){
'use strict';

var Section = require('../classes/SectionClass');

var Smoke = require('../objects3D/SmokeObject3D');
var Neon = require('../objects3D/NeonObject3D');

var neonsSection = new Section('neons');

var smoke = new Smoke({
  planesNumber: 3,
  frontColor: '#4c4c4c',
  backColor: '#ffffff',
  data: [
    { positionX : -2.5, positionY: -18.8, positionZ: -6, rotationZ: 2.7, scale: 8.5 },
    { positionX : -11.1, positionY: 10.3, positionZ: -10.4, rotationZ: 1.4, scale: 5.8 },
    { positionX : -15.1, positionY: -5.9, positionZ: -19.2, rotationZ: 1.6, scale: 7.4 }
  ]
});
neonsSection.add(smoke.el);

var neonA = new Neon();

var neonB = new Neon();
neonB.el.position.set(0, 0, 0);
neonB.el.rotation.z = 2;

var neonC = new Neon();
neonC.el.position.set(0, 13, 0);
neonC.el.rotation.z = 2;

var neonD = new Neon();
neonD.el.position.set(0, -13, 0);
neonD.el.rotation.z = 2;

neonsSection.add(neonA.el);
neonsSection.add(neonB.el);
neonsSection.add(neonC.el);
neonsSection.add(neonD.el);

neonA.el.visible = false;
neonB.el.visible = false;
neonC.el.visible = false;
neonD.el.visible = false;
smoke.el.visible = false;

neonsSection.onStart(function () {
  neonA.start();
  neonB.start();
  neonC.start();
  neonD.start();

  neonA.el.visible = true;
  neonB.el.visible = true;
  neonC.el.visible = true;
  neonD.el.visible = true;
});

neonsSection.onStop(function () {
  neonA.stop();
  neonB.stop();
  neonC.stop();
  neonD.stop();

  neonA.el.visible = false;
  neonB.el.visible = false;
  neonC.el.visible = false;
  neonD.el.visible = false;
});

var smokePlaying = false;

neonsSection.smokeStart = function () {
  if (smokePlaying) {
    return false;
  }

  smokePlaying = true;

  smoke.start();

  smoke.el.visible = true;
};

neonsSection.smokeStop = function () {
  if (!smokePlaying) {
    return false;
  }

  smokePlaying = false;

  smoke.stop();

  smoke.el.visible = false;
};

module.exports = neonsSection;
},{"../classes/SectionClass":4,"../objects3D/NeonObject3D":37,"../objects3D/SmokeObject3D":39}],58:[function(require,module,exports){
'use strict';

var Section = require('../classes/SectionClass');

var TextPanel = require('../objects3D/TextPanelObject3D');
var Rocks = require('../objects3D/RocksObject3D');

var rocksSection = new Section('rocks');

var rocks = new Rocks();
rocksSection.add(rocks.el);

var text = new TextPanel(
  'M E    E  N  C  A  N  T  A  \n  A  P  R  E  N  D  E  R ',
  {
    align: 'center',
    style: '',
    size: 50,
    lineSpacing: 40
  }
);
text.el.position.set(0, 0, 0);
rocksSection.add(text.el);
text.out('down');

rocks.el.visible = false;

rocksSection.onIn(function () {
  text.in();
  rocks.in();
});

rocksSection.onOut(function (way) {
  text.out('down');
  rocks.out(way);
});

rocksSection.onStart(function () {
  rocks.start();
});

rocksSection.onStop(function () {
  rocks.stop();
});

rocksSection.show = function () {
  rocks.el.visible = true;
};

rocksSection.hide = function () {
  rocks.el.visible = false;
};

module.exports = rocksSection;
},{"../classes/SectionClass":4,"../objects3D/RocksObject3D":38,"../objects3D/TextPanelObject3D":41}],59:[function(require,module,exports){
'use strict';

var Section = require('../classes/SectionClass');

var TextPanel = require('../objects3D/TextPanelObject3D');
var Wave = require('../objects3D/WaveObject3D');

var waveSection = new Section('wave');

var wave = new Wave();
waveSection.add(wave.el);

var text = new TextPanel(
  'R O M P O  \n H  O  R  I  Z  O  N  T  E  S',
  {
    align: 'center',
    style: '',
    size: 50,
    lineSpacing: 40
  }
);
text.el.position.y = 10;
text.el.rotation.x = 0.2;
waveSection.add(text.el);

wave.el.visible = false;

waveSection.onIn(function (way) {
  text.in();
  wave.in(way);
});

waveSection.onOut(function (way) {
  text.out(way);
  wave.out(way);
});

waveSection.onStart(function () {
  wave.start();

  wave.el.visible = true;
});

waveSection.onStop(function () {
  wave.stop();

  wave.el.visible = false;
});

module.exports = waveSection;
},{"../classes/SectionClass":4,"../objects3D/TextPanelObject3D":41,"../objects3D/WaveObject3D":42}],60:[function(require,module,exports){
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
},{}],61:[function(require,module,exports){
(function (global){
'use strict';

var THREE = (typeof window !== "undefined" ? window['THREE'] : typeof global !== "undefined" ? global['THREE'] : null);

/**
 * Dilate a geometry along the normals
 *
 * @method dilate
 * @param {THREE.Object3D} [geometry] Geometry to dilate
 * @param {Number} [offset] Desired offset
 */
function dilate (geometry, offset) {
  geometry.computeVertexNormals();

  // vertices normals
  var vertexNormals = new Array(geometry.vertices.length);

  for (var i = 0, j = geometry.faces.length; i < j; i++) {
    var face = geometry.faces[i];
    
    if (face instanceof THREE.Face4) {
      vertexNormals[face.a] = face.vertexNormals[0];
      vertexNormals[face.b] = face.vertexNormals[1];
      vertexNormals[face.c] = face.vertexNormals[2];
      vertexNormals[face.d] = face.vertexNormals[3]; 
    } else if (face instanceof THREE.Face3) {
      vertexNormals[face.a] = face.vertexNormals[0];
      vertexNormals[face.b] = face.vertexNormals[1];
      vertexNormals[face.c] = face.vertexNormals[2];
    }
  }

  // offset vertices
  for (var k = 0, l = geometry.vertices.length; k < l; k++) {
    var vertex = geometry.vertices[k];
    var normal = vertexNormals[k];

    vertex.x += normal.x * offset;
    vertex.y += normal.y * offset;
    vertex.z += normal.z * offset;
  }
}

module.exports = dilate;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC9zcmMvanMvdXRpbHMvZGlsYXRlVXRpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG52YXIgVEhSRUUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvd1snVEhSRUUnXSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWxbJ1RIUkVFJ10gOiBudWxsKTtcblxuLyoqXG4gKiBEaWxhdGUgYSBnZW9tZXRyeSBhbG9uZyB0aGUgbm9ybWFsc1xuICpcbiAqIEBtZXRob2QgZGlsYXRlXG4gKiBAcGFyYW0ge1RIUkVFLk9iamVjdDNEfSBbZ2VvbWV0cnldIEdlb21ldHJ5IHRvIGRpbGF0ZVxuICogQHBhcmFtIHtOdW1iZXJ9IFtvZmZzZXRdIERlc2lyZWQgb2Zmc2V0XG4gKi9cbmZ1bmN0aW9uIGRpbGF0ZSAoZ2VvbWV0cnksIG9mZnNldCkge1xuICBnZW9tZXRyeS5jb21wdXRlVmVydGV4Tm9ybWFscygpO1xuXG4gIC8vIHZlcnRpY2VzIG5vcm1hbHNcbiAgdmFyIHZlcnRleE5vcm1hbHMgPSBuZXcgQXJyYXkoZ2VvbWV0cnkudmVydGljZXMubGVuZ3RoKTtcblxuICBmb3IgKHZhciBpID0gMCwgaiA9IGdlb21ldHJ5LmZhY2VzLmxlbmd0aDsgaSA8IGo7IGkrKykge1xuICAgIHZhciBmYWNlID0gZ2VvbWV0cnkuZmFjZXNbaV07XG4gICAgXG4gICAgaWYgKGZhY2UgaW5zdGFuY2VvZiBUSFJFRS5GYWNlNCkge1xuICAgICAgdmVydGV4Tm9ybWFsc1tmYWNlLmFdID0gZmFjZS52ZXJ0ZXhOb3JtYWxzWzBdO1xuICAgICAgdmVydGV4Tm9ybWFsc1tmYWNlLmJdID0gZmFjZS52ZXJ0ZXhOb3JtYWxzWzFdO1xuICAgICAgdmVydGV4Tm9ybWFsc1tmYWNlLmNdID0gZmFjZS52ZXJ0ZXhOb3JtYWxzWzJdO1xuICAgICAgdmVydGV4Tm9ybWFsc1tmYWNlLmRdID0gZmFjZS52ZXJ0ZXhOb3JtYWxzWzNdOyBcbiAgICB9IGVsc2UgaWYgKGZhY2UgaW5zdGFuY2VvZiBUSFJFRS5GYWNlMykge1xuICAgICAgdmVydGV4Tm9ybWFsc1tmYWNlLmFdID0gZmFjZS52ZXJ0ZXhOb3JtYWxzWzBdO1xuICAgICAgdmVydGV4Tm9ybWFsc1tmYWNlLmJdID0gZmFjZS52ZXJ0ZXhOb3JtYWxzWzFdO1xuICAgICAgdmVydGV4Tm9ybWFsc1tmYWNlLmNdID0gZmFjZS52ZXJ0ZXhOb3JtYWxzWzJdO1xuICAgIH1cbiAgfVxuXG4gIC8vIG9mZnNldCB2ZXJ0aWNlc1xuICBmb3IgKHZhciBrID0gMCwgbCA9IGdlb21ldHJ5LnZlcnRpY2VzLmxlbmd0aDsgayA8IGw7IGsrKykge1xuICAgIHZhciB2ZXJ0ZXggPSBnZW9tZXRyeS52ZXJ0aWNlc1trXTtcbiAgICB2YXIgbm9ybWFsID0gdmVydGV4Tm9ybWFsc1trXTtcblxuICAgIHZlcnRleC54ICs9IG5vcm1hbC54ICogb2Zmc2V0O1xuICAgIHZlcnRleC55ICs9IG5vcm1hbC55ICogb2Zmc2V0O1xuICAgIHZlcnRleC56ICs9IG5vcm1hbC56ICogb2Zmc2V0O1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGlsYXRlOyJdfQ==
},{}],62:[function(require,module,exports){
'use strict';

/**
 * Set loop on a TweenLite tween
 * must be passed on onComplete
 *
 * @method loop
 */
function loop () {
  /*jshint validthis: true */
  
  this.restart();
}

module.exports = loop;
},{}],63:[function(require,module,exports){
'use strict';

/**
 * Map a value from one range to another
 *
 * @method map
 * @param {Number} [value] Value to map
 * @param {Array} [oldRange] Range to map from
 * @param {Array} [newRange] Range to map to
 * @return {Number} Mapped value
 */
function map (value, oldRange, newRange) {
  var newValue = (value - oldRange[0]) * (newRange[1] - newRange[0]) / (oldRange[1] - oldRange[0]) + newRange[0];
  return Math.min(Math.max(newValue, newRange[0]) , newRange[1]);
}

module.exports = map;
},{}],64:[function(require,module,exports){
// http://mrl.nyu.edu/~perlin/noise/
var ImprovedNoise = function () {
  var p = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,
       23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,
       174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,
       133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,
       89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,
       202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,
       248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,
       178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,
       14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,
       93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];

  for ( var i = 0; i < 256 ; i++ ) {

      p[ 256 + i ] = p[ i ];

  }

  function fade( t ) {

      return t * t * t * ( t * ( t * 6 - 15 ) + 10 );

  }

  function lerp( t, a, b ) {

      return a + t * ( b - a );

  }

  function grad( hash, x, y, z ) {

      var h = hash & 15;
      var u = h < 8 ? x : y, v = h < 4 ? y : h == 12 || h == 14 ? x : z;
      return ( ( h & 1 ) == 0 ? u : -u ) + ( ( h & 2 ) == 0 ? v : -v );

  }

  return {

      noise: function ( x, y, z ) {

          var floorX = Math.floor( x ), floorY = Math.floor( y ), floorZ = Math.floor( z );

          var X = floorX & 255, Y = floorY & 255, Z = floorZ & 255;

          x -= floorX;
          y -= floorY;
          z -= floorZ;

          var xMinus1 = x -1, yMinus1 = y - 1, zMinus1 = z - 1;

          var u = fade( x ), v = fade( y ), w = fade( z );

          var A = p[ X ] + Y, AA = p[ A ] + Z, AB = p[ A + 1 ] + Z, B = p[ X + 1 ] + Y, BA = p[ B ] + Z, BB = p[ B + 1 ] + Z;

          return lerp( w, lerp( v, lerp( u, grad( p[ AA ], x, y, z ),
                 grad( p[ BA ], xMinus1, y, z ) ),
                 lerp( u, grad( p[ AB ], x, yMinus1, z ),
                 grad( p[ BB ], xMinus1, yMinus1, z ) ) ),
                 lerp( v, lerp( u, grad( p[ AA + 1 ], x, y, zMinus1 ),
                 grad( p[ BA + 1 ], xMinus1, y, z - 1 ) ),
                 lerp( u, grad( p[ AB + 1 ], x, yMinus1, zMinus1 ),
                 grad( p[ BB + 1 ], xMinus1, yMinus1, zMinus1 ) ) ) );

      }
  }
}

var currentRandom = Math.random;

// Pseudo-random generator
function Marsaglia(i1, i2) {
  // from http://www.math.uni-bielefeld.de/~sillke/ALGORITHMS/random/marsaglia-c
  var z=i1 || 362436069, w= i2 || 521288629;
  var nextInt = function() {
    z=(36969*(z&65535)+(z>>>16)) & 0xFFFFFFFF;
    w=(18000*(w&65535)+(w>>>16)) & 0xFFFFFFFF;
    return (((z&0xFFFF)<<16) | (w&0xFFFF)) & 0xFFFFFFFF;
  };
 
  this.nextDouble = function() {
    var i = nextInt() / 4294967296;
    return i < 0 ? 1 + i : i;
  };
  this.nextInt = nextInt;
}
Marsaglia.createRandomized = function() {
  var now = new Date();
  return new Marsaglia((now / 60000) & 0xFFFFFFFF, now & 0xFFFFFFFF);
};      

// Noise functions and helpers
function PerlinNoise(seed) {
  var rnd = seed !== undefined ? new Marsaglia(seed) : Marsaglia.createRandomized();
  var i, j;
  // http://www.noisemachine.com/talk1/17b.html
  // http://mrl.nyu.edu/~perlin/noise/
  // generate permutation
  var p = new Array(512);
  for(i=0;i<256;++i) { p[i] = i; }
  for(i=0;i<256;++i) { var t = p[j = rnd.nextInt() & 0xFF]; p[j] = p[i]; p[i] = t; }
  // copy to avoid taking mod in p[0];
  for(i=0;i<256;++i) { p[i + 256] = p[i]; }
 
  function grad3d(i,x,y,z) {        
    var h = i & 15; // convert into 12 gradient directions
    var u = h<8 ? x : y,                
        v = h<4 ? y : h===12||h===14 ? x : z;
    return ((h&1) === 0 ? u : -u) + ((h&2) === 0 ? v : -v);
  }

  function grad2d(i,x,y) {
    var v = (i & 1) === 0 ? x : y;
    return (i&2) === 0 ? -v : v;
  }
 
  function grad1d(i,x) {
    return (i&1) === 0 ? -x : x;
  }
 
  function lerp(t,a,b) { return a + t * (b - a); }
   
  this.noise3d = function(x, y, z) {
    var X = Math.floor(x)&255, Y = Math.floor(y)&255, Z = Math.floor(z)&255;
    x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
    var fx = (3-2*x)*x*x, fy = (3-2*y)*y*y, fz = (3-2*z)*z*z;
    var p0 = p[X]+Y, p00 = p[p0] + Z, p01 = p[p0 + 1] + Z, p1  = p[X + 1] + Y, p10 = p[p1] + Z, p11 = p[p1 + 1] + Z;
    return lerp(fz,
      lerp(fy, lerp(fx, grad3d(p[p00], x, y, z), grad3d(p[p10], x-1, y, z)),
               lerp(fx, grad3d(p[p01], x, y-1, z), grad3d(p[p11], x-1, y-1,z))),
      lerp(fy, lerp(fx, grad3d(p[p00 + 1], x, y, z-1), grad3d(p[p10 + 1], x-1, y, z-1)),
               lerp(fx, grad3d(p[p01 + 1], x, y-1, z-1), grad3d(p[p11 + 1], x-1, y-1,z-1))));
  };
 
  this.noise2d = function(x, y) {
    var X = Math.floor(x)&255, Y = Math.floor(y)&255;
    x -= Math.floor(x); y -= Math.floor(y);
    var fx = (3-2*x)*x*x, fy = (3-2*y)*y*y;
    var p0 = p[X]+Y, p1  = p[X + 1] + Y;
    return lerp(fy,
      lerp(fx, grad2d(p[p0], x, y), grad2d(p[p1], x-1, y)),
      lerp(fx, grad2d(p[p0 + 1], x, y-1), grad2d(p[p1 + 1], x-1, y-1)));
  };

  this.noise1d = function(x) {
    var X = Math.floor(x)&255;
    x -= Math.floor(x);
    var fx = (3-2*x)*x*x;
    return lerp(fx, grad1d(p[X], x), grad1d(p[X+1], x-1));
  };
}

//  these are lifted from Processing.js
// processing defaults
var noiseProfile = { generator: undefined, octaves: 4, fallout: 0.5, seed: undefined};

function noise(x, y, z) {
  if(noiseProfile.generator === undefined) {
    // caching
    noiseProfile.generator = new PerlinNoise(noiseProfile.seed);
  }
  var generator = noiseProfile.generator;
  var effect = 1, k = 1, sum = 0;
  for(var i=0; i<noiseProfile.octaves; ++i) {
    effect *= noiseProfile.fallout;        
    switch (arguments.length) {
    case 1:
      sum += effect * (1 + generator.noise1d(k*x))/2; break;
    case 2:
      sum += effect * (1 + generator.noise2d(k*x, k*y))/2; break;
    case 3:
      sum += effect * (1 + generator.noise3d(k*x, k*y, k*z))/2; break;
    }
    k *= 2;
  }
  return sum;
}

module.exports = noise;
},{}],65:[function(require,module,exports){
'use strict';

/**
 * Return a random value in a specified range
 *
 * @method random
 * @param {Number} [low] Lowest value possible
 * @param {Number} [high] Highest value possible
 * @param {Boolean} [round=false] Floor the value?
 * @return {Number} Random value
 */
function random (low, high, round) {
  round = round || false;
  
  var randomValue = Math.random() * (high - low) + low;

  if (round) {
    return Math.floor(randomValue);
  }
  
  return randomValue;
}

module.exports = random;
},{}],66:[function(require,module,exports){
'use strict';

/**
 * Set yoyo on a TweenLite tween
 * must be passed on onComplete and onReverseComplete
 *
 * @method yoyo
 */
function yoyo () {
  /*jshint validthis: true */
  
  if (this.reversed()) {
    this.restart();
  } else {
    this.reverse();
  }
}

module.exports = yoyo;
},{}]},{},[1])