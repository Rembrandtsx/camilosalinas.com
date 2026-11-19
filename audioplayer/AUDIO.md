# Music playback and visualization

The source MP3s are unchanged. Playback uses the cue points in `lib/tracks.json`, with a 60 ms fade-in and 150 ms fade-out at each loop boundary. Cue values are seconds in the original file. The confirmed noisy intros are skipped at 9.9 seconds for Walk This Way and 18.4 seconds for Final Song; their endings stop at 207.1 and 247.6 seconds respectively. Kamikaze starts at 9.2 seconds and ends at 216.8; When I Was Young starts at 10.4 and ends at 227.8. These skip the remaining rumble/quiet lead-ins and trailing fades. Other cues remove leading padding and quiet trailing material based on signal inspection. They remain editable without recompressing the recordings.

Readiness is rechecked during playback to recover when browsers deliver media events before a cue seek completes. The loading label stays visible until the audio graph is running and the track is ready. A small ambient layer recycles so loading and quiet passages never drain the scene of shapes.

The player streams one current track plus a queued track while holding the control. Switching releases the previous audio element and its audio nodes. Playback starts on release, including when the file is still downloading. Controls are enabled immediately, without the former timed loading introduction. The playlist now begins with its first song instead of skipping it.

The analyzer reads 35–85 Hz and 85–180 Hz bands from a 4096-sample FFT. It adapts the energy baseline and recent peak to each song, resetting when the song changes or loops. Sudden bass increases trigger geometry; sustained bass controls a subtle scale pulse and movement speed. Four bass accents advance the palette, with a minimum delay between color changes. There are no random geometry/color timers or fabricated frequency values during playback. The audible song is not bass-filtered. The old switching reverb was replaced with a short volume reduction, avoiding a noisy reverb tail.

The page cursor subscribes to mouse movement in the same-origin player iframe and converts its coordinates into page viewport coordinates. It still respects touch and reduced-motion settings. For cross-origin iframes, where those events are inaccessible, the custom cursor hides instead of freezing.

## Build and check

From the repository root, with Node.js 20.19+:

```sh
npm ci
npm --prefix audioplayer ci --ignore-scripts
npm --prefix audioplayer run build
npm run test:audio
npm test
npm run preview
```

For an installed Chrome, set `CHROME_PATH` when running the tests; otherwise install Playwright Chromium. `test:audio` covers bass detection at multiple volumes/frame rates, treble rejection, missed-readiness-event recovery and audible gain, all nine songs, cue looping, network-failure recovery, rapid switching, iframe cursor tracking, and mobile hold/release/cancel controls. The local preview server supports HTTP byte ranges so audio seeks behave as they do on the host.

Browser checks use desktop Chrome and iPhone emulation in Chrome. Physical iOS/Safari playback has not been verified. Existing Three.js rendering and audio licensing are unchanged.

The persistent playback bar shows the current title and artist, Pause/Resume, Next track, and a direct Spotify link. Pausing stops both the media element and the rendering loop; resuming retains the playback position. Next track also works while paused. Spotify links were matched to the tracks in the existing Personal Website Best playlist, and open in a separate tab so visitors can save them within Spotify.
