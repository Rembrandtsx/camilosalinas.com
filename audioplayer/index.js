const createLoop = require('raf-loop');
const createApp = require('./lib/app');
const geoScene = require('./lib/geoScene');
const getPalette = require('./lib/palette');
const setupInteractions = require('./lib/setupInteractions');
const log = require('./lib/log');

const showIntro = require('./lib/intro');
const EffectComposer = require('./lib/EffectComposer');
const BloomPass = require('./lib/BloomPass');
const SSAOShader = require('./lib/shader/SSAOShader');
const createAudio = require('./lib/audio');

const white = new THREE.Color('white');
const opt = { antialias: false, alpha: false, stencil: false };
const { updateProjectionMatrix, camera, scene, renderer, controls, canvas } = createApp(opt);

let supportsDepth = true;
if (!renderer.extensions.get('WEBGL_depth_texture')) {
  if (window.ga) window.ga('send', 'event', 'error', 'WEBGL_depth_texture', 0)
  console.warn('Requires WEBGL_depth_texture for certain post-processing effects.');
  supportsDepth = false;
}

var floatDepth = false;
renderer.gammaInput = true;
renderer.gammaOutput = true;
renderer.gammaFactor = 2.2;

const rt1 = createRenderTarget();
const rt2 = createRenderTarget();
const rtDepth = floatDepth ? rt1.clone() : null;
const rtInitial = createRenderTarget();
const composer = new EffectComposer(renderer, rt1, rt2, rtInitial);
const targets = [ rt1, rt2, rtInitial, rtDepth ].filter(Boolean);

if (floatDepth) {
  composer.depthTexture = rtDepth;  
  rtDepth.texture.type = THREE.FloatType;
} else if (supportsDepth) {
  rtInitial.depthTexture = new THREE.DepthTexture();
}

const depthTarget = floatDepth ? rtDepth : rtInitial.depthTexture;

const depthMaterial = new THREE.MeshDepthMaterial();
depthMaterial.depthPacking = THREE.BasicDepthPacking;
depthMaterial.blending = THREE.NoBlending;

let time = 0;
let mesh = null;

const loop = createLoop(render).start();
resize();
window.addEventListener('resize', resize);
helloWorld();



window.onkeydown = function (e) { 
  if (e.keyCode === 32) return false;
};
setupPost();

const supportsMedia = true;
setupScene({ palettes: getPalette(), supportsMedia });

function setupPost () {
  composer.addPass(new EffectComposer.RenderPass(scene, camera));

  if (supportsDepth) {
    var pass = new EffectComposer.ShaderPass(SSAOShader);
    pass.material.precision = 'highp'
    composer.addPass(pass);
    pass.uniforms.tDepth.value = depthTarget;
    pass.uniforms.cameraNear.value = camera.near;
    pass.uniforms.cameraFar.value = camera.far;
  }

  composer.addPass(new BloomPass(scene, camera));
  composer.passes[composer.passes.length - 1].renderToScreen = true;
}

function createRenderTarget (numAttachments) {
  numAttachments = numAttachments || 0;
  const target = numAttachments > 1
    ? new THREE.WebGLMultiRenderTarget(window.innerWidth, window.innerHeight)
    : new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
  target.texture.format = THREE.RGBFormat;
  target.texture.minFilter = THREE.NearestFilter;
  target.texture.magFilter = THREE.NearestFilter;
  target.texture.generateMipmaps = false;
  target.stencilBuffer = false;
  target.depthBuffer = true;
  if (numAttachments > 1) {
    var gBufferNormalRoughness = target.texture.clone();
    gBufferNormalRoughness.format = THREE.RGBAFormat;
    gBufferNormalRoughness.type = THREE.FloatType;
    target.attachments.push(gBufferNormalRoughness);
  }
  return target;
}

function resize () {
  const dpr = renderer.getPixelRatio();
  const size = renderer.getSize();
  const width = size.width * dpr;
  const height = size.height * dpr;
  targets.forEach(t => {
    t.setSize(width, height);
  });
}

function render (dt) {
  time += Math.min(30, dt) / 1000;
  if (mesh) {
    mesh.position.y = Math.sin(time) * 0.25 + 1;
    mesh.rotation.y += dt * 0.00005;
  }

  updateProjectionMatrix();

  const oldClear = renderer.getClearColor();
  if (floatDepth) {
    scene.overrideMaterial = depthMaterial;
    renderer.setRenderTarget(rtDepth);
    renderer.setClearColor(white, 1);
    renderer.clear(true, true, true);
    renderer.render(scene, camera, rtDepth);
  }

  composer.passes.forEach(pass => {
    if (pass.uniforms && pass.uniforms.resolution) {
      pass.uniforms.resolution.value.set(rtInitial.width, rtInitial.height);
    }
  });

  renderer.setRenderTarget(null);
  renderer.setClearColor(oldClear, 1);
  scene.overrideMaterial = null;
  if (composer.passes.length > 1) composer.render();
  else renderer.render(scene, camera);
}

function setupScene ({ palettes, envMap }) {
  document.querySelector('#canvas').style.display = 'block';

  // console.log('Total palettes', palettes.length);
  const geo = geoScene({ palettes, scene, envMap, loop, camera, renderer });

  const initialPalette = [ '#fff', '#e2e2e2' ];
  geo.setPalette(initialPalette);
  document.body.style.background = '#F9F9F9';

  const audio = createAudio();
  let started = false;
  let paletteCooldown = 0;
  let bassHits = 0;
  const whitePalette = ['#fff', '#d3d3d3', '#a5a5a5'];
  const interactions = setupInteractions({ whitePalette, scene, controls, audio, camera, geo });
  showIntro({ interactions }, () => { started = true; });
  audio.on('playing', () => { bassHits = 0; paletteCooldown = 0; geo.nextPalette(); });
  loop.on('tick', dt => {
    audio.update(dt);
    paletteCooldown = Math.max(0, paletteCooldown - dt);
    geo.bassLevel = audio.bassLevel;
    if (!started || interactions.keyDown || !audio.playing) return;
    geo.globalSpeed = 0.65 + audio.bassLevel * 0.85;
    audio.beats.forEach((beat, type) => { if (beat) geo.nextGeometry({ type }); });
    if (audio.beats.some(Boolean)) {
      bassHits++;
      // Make larger visual changes on musical accents, not a random timer.
      if (bassHits >= 4 && paletteCooldown === 0) {
        geo.nextPalette(); bassHits = 0; paletteCooldown = 1800;
      }
    }
  });
}

function helloWorld () {
  log.intro();
}