import videojs from 'video.js';
import EndCardModal from './endcard-modal';
import playlist from 'videojs-playlist';
import {catalogPlaylist, mapiRelatedPlaylist} from './playlist-builder.js';

// Default options for the plugin.
const defaults = {};

/**
 * Function to invoke when the player is ready.
 *
 * This is a great place for your plugin to initialize itself. When this
 * function is called, the player will have its DOM and child components
 * in place.
 *
 * @function onPlayerReady
 * @param    {Player} player
 * @param    {Object} [options={}]
 */
const onPlayerReady = (player, options) => {
  player.addClass('vjs-endcard');

  let modal = new EndCardModal(player, {
    fillAlways: true,
    label: player.localize('End card with related videos'),
    content: player.localize('This is content'),
    temporary: false,
    uncloseable: false
  });
  
  mapiRelatedPlaylist({videoid: '3825749346001', token: '4padFp2KtFo3R8px9Gy8ugjQ1Pedl6fqsdp71_6Z9b6YOmzse5_G5g..', debug: true}, function(e,d) {
    if(e) {
      console.error(e);
    } else if (player.mediainfo) {
      d.shift(player.mediainfo);
    }
    player.playlist(d);
  });

player.customEndscreenModal = modal;

player.addChild(modal);
};

/**
 * A video.js plugin.
 *
 * In the plugin function, the value of `this` is a video.js `Player`
 * instance. You cannot rely on the player being in a "ready" state here,
 * depending on how the plugin is invoked. This may or may not be important
 * to you; if not, remove the wait for "ready"!
 *
 * @function endcard
 * @param    {Object} [options={}]
 *           An object of options left to the plugin author to define.
 */
const endcard = function(options) {
  playlist.call(this);
  this.ready(() => {
    onPlayerReady(this, videojs.mergeOptions(defaults, options));
  });
};

// Register the plugin with video.js.
videojs.plugin('endcard', endcard);

// Include the version number.
endcard.VERSION = '__VERSION__';

export default endcard;
