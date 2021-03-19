import { Component, Input, OnInit } from '@angular/core';
import videojs from 'video.js';
import {
  VideoJSQualityPlugin,
  VideoJSIVSTech,
  registerIVSQualityPlugin,
  registerIVSTech,
  VideoJSEvents,
} from 'amazon-ivs-player';
`declare module 'amazon-ivs-player/dist/assets/amazon-ivs-wasmworker.min.js';`

// We use the TypeScript compiler (TSC) to check types; it doesn't know what this WASM module is, so let's ignore the error it throws (TS2307).
// @ts-ignore
import wasmBinaryPath from 'amazon-ivs-player/dist/assets/amazon-ivs-wasmworker.min.wasm';
//  @ts-ignore
import wasmWorkerPath from 'amazon-ivs-player/dist/assets/amazon-ivs-wasmworker.min.js';



const createAbsolutePath = (assetPath: string) => new URL(assetPath, document.URL).toString();

// register the tech with videojs
registerIVSTech(videojs, {
  wasmWorker: createAbsolutePath('amazon-ivs-player/dist/assets/amazon-ivs-wasmworker.min.js'),
  wasmBinary: createAbsolutePath('amazon-ivs-player/dist/assets/amazon-ivs-wasmworker.min.was'),
});

// register the quality plugin
registerIVSQualityPlugin(videojs)


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public player: videojs.Player | undefined;

  video = {
    media_Url: 'https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.xhP3ExfcX8ON.m3u8',
    type: 'application/x-mpegURL',
    media_thumbnailUrl: ''
  };


  constructor() {
  }

  ngOnInit(): void {
  }


  ngAfterViewInit() {
    this.playVideoPlayer();

    // ivsPlayer.addEventListener(events.PlayerState.PLAYING, () => { console.log('IVS Player is playing') });
  }

  playVideoPlayer() {
    var player: any;
    if (player) {
      player.pause()
    }

    const options = {
      techOrder: ["AmazonIVS"],
      'sources': [{
        'src': this.video.media_Url,
        'type': this.video.type
      }],
      'poster': this.video.media_thumbnailUrl
    };

    let temp: any = this;
    // this.player = videojs('video-player', options, function onPlayerReady() { });


    const vPlayer = videojs('video-player', {
      techOrder: ["AmazonIVS"],
      sources: [{
        src: this.video.media_Url,
        type: this.video.type
      }],
      poster: this.video.media_thumbnailUrl
    }, function () {
      console.warn('Player is ready to use')
    }) as videojs.Player & VideoJSIVSTech & VideoJSQualityPlugin;

    console.log(vPlayer, "events");
    // enable the quality plugin
    player?.enableIVSQualityPlugin();

    // listen to IVS specific events
    const events: VideoJSEvents = vPlayer?.getIVSEvents();

    const ivsPlayer = vPlayer?.getIVSPlayer();
    console.log(ivsPlayer, "ivsPlayer");


    // this.player.play();
  }

  ngOnDestroy(): void {
    if (this.player != null) {
      this.player.dispose();
    }
  }

}
