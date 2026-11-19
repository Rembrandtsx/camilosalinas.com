const EventEmitter = require("events").EventEmitter;
const isMobile = require("./isMobile");
const log = require("./log");

module.exports = function ({
  scene,
  whitePalette,
  audio,
  camera,
  controls,
  geo,
}) {
  let previousPalette = geo.getFullPalette();
  const ret = new EventEmitter();
  ret.keyDown = false;
  ret.easterEggDown = false;
  ret.enable = enable;
  let isLoaded = false;
  let enabled = false;

  const originalDistance = controls.distance;
  const trackContainer = document.querySelector(".track-aligner");
  const trackName = document.querySelector(".track-name");
  const trackNumber = document.querySelector(".track-number");
  const trackArtist = document.querySelector(".track-artist");
  const musicContainer = document.querySelector(".music-container");

  const playback = document.querySelector(".playback-controls");
  const toggle = document.querySelector(".playback-toggle");
  const status = document.querySelector(".playback-status");
  const currentTrack = document.querySelector(".current-track");
  const spotify = document.querySelector(".spotify-track");
  toggle.addEventListener("click", () => audio.togglePause());
  document.querySelector(".next-track").addEventListener("click", () => { beginEvent(); endEvent(); });
  audio.on("trackchange", track => {
    playback.hidden = false;
    currentTrack.textContent = track.title + " — " + track.artist;
    spotify.href = track.spotify;
    spotify.setAttribute("aria-label", "Open " + track.title + " by " + track.artist + " in Spotify (new tab)");
    const mobile = document.querySelector(".mobileButton");
    if (mobile) mobile.hidden = true;
  });
  function showPlaybackState(paused) {
    toggle.textContent = paused ? "Resume" : "Pause";
    toggle.setAttribute("aria-label", (paused ? "Resume" : "Pause") + " music and animation");
    status.textContent = paused ? "Paused" : "Now playing";
  }
  audio.on("pause", () => showPlaybackState(true));
  audio.on("resume", () => showPlaybackState(false));
  audio.on("ready", () => { isLoaded = true; });
  audio.on("loading", () => {
    trackContainer.style.display = "table";
    trackNumber.textContent = "Loading track…";
    status.textContent = "Loading…";
    toggle.disabled = true;
  });
  audio.on("playing", () => {
    if (!ret.keyDown) setupName(null);
    toggle.disabled = false;
    showPlaybackState(false);
  });
  audio.on("playbackerror", () => {
    trackContainer.style.display = "table";
    trackNumber.textContent = "Could not play this track";
    toggle.disabled = true;
    status.textContent = "Unable to play — try next track";
    trackName.textContent = "Hold and release to try the next song";
    trackArtist.textContent = "";
  });
  window.addEventListener("blur", () => { if (ret.keyDown) endEvent(); });

  return ret;

  function enable() {
    if (enabled) return;
    enabled = true;
    window.addEventListener("keydown", (ev) => {
      if (ev.target.closest("button, a, input, textarea, select")) return;
      if (ev.keyCode === 32 && !ret.keyDown) {
        ev.preventDefault();
        beginEvent();
        return false;
      } else if (ev.keyCode === 67 && !ret.easterEggDown) {
        // ret.easterEggDown = true;
        // controls.position[0] = 10;
        // controls.position[2] = 0;
        // controls.distance = 5;
        // return false;
      }
    });
    window.addEventListener("keyup", (ev) => {
      if (ev.keyCode === 32 && ret.keyDown) {
        ev.preventDefault();
        endEvent();
        return false;
      } else if (ev.keyCode === 67 && ret.easterEggDown) {
        // ret.easterEggDown = false;
        // controls.position[0] = 0;
        // controls.position[2] = 0;
        // controls.distance = originalDistance;
        // return false;
      }
    });

    if (isMobile) {
      const canvas = document.querySelector("#canvas");
      const mobileButton = document.createElement("div");
      mobileButton.innerText = "Hold and release to change track";
      mobileButton.className = "mobileButton";
      musicContainer.appendChild(mobileButton);
      mobileButton.addEventListener("touchstart", (event) => { event.preventDefault(); beginEvent(); }, { passive: false });
      mobileButton.addEventListener("touchend", endEvent);
      mobileButton.addEventListener("touchcancel", endEvent);
    }
  }

  function beginEvent() {
    if (ret.keyDown) return;
    ret.emit("start");
    previousPalette = geo.getFullPalette();
    geo.setPalette(whitePalette);
    ret.keyDown = true;

    isLoaded = false;

    const name = audio.queue();
    setupName(name);
    audio.effect = 1;
    geo.globalSpeed = 0.75;
    controls.position[1] = -1;
  }

  function endEvent() {
    if (!ret.keyDown) return;
    ret.keyDown = false;
    setupName(null);
    geo.setPalette(previousPalette);
    audio.playQueued();
    audio.effect = 0;
    controls.position[1] = 1;
    controls.distance = originalDistance;
    geo.globalSpeed = 1;
    geo.nextPalette();
    ret.emit("stop", isLoaded);
  }

  function setupName(name) {
    if (!name) {
      trackContainer.style.display = "none";
      return;
    }
    trackContainer.style.display = "table";

    const parts = name.split("-").map((x) => x.trim());
    trackNumber.textContent = "next track";
    trackName.textContent = parts[1];
    trackArtist.textContent = parts[2];
  }
};
