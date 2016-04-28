import videojs from 'video.js';
import RelatedModal from './related-modal';
import {catalogPlaylist, mapiRelatedPlaylist} from './playlist-builder.js';

// Default options for the plugin.
const defaults = {
  token: '4padFp2KtFo3R8px9Gy8ugjQ1Pedl6fqsdp71_6Z9b6YOmzse5_G5g..',
  limit: 8,
  debug: true
};

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

  // Set up modal - more customisation to do here
  let modal = new RelatedModal(player, {
    label: player.localize('End card with related videos'),
    content: player.localize('This is content'),
    temporary: false,
    uncloseable: true
  });
  
  const playlist = (object) => {
    console.info(object);
  }
  
  // Keep track of video id as source of truth about content change
  let currentVideoId;
  
  // Get related videos from Media api
  // TODO: feed in options
  player.on('loadedmetadata', () => {
    if (player.mediainfo &&
        player.mediainfo.id &&
        currentVideoId !== player.mediainfo.id) {
      currentVideoId = player.mediainfo.id;
      mapiRelatedPlaylist({
        videoid: currentVideoId,
        token: options.token,
        debug: options.debug,
        limit: options.limit
      }, function(e,d) {
        if(e) {
          console.error(e);
        } else {
          modal.fill(d);
        }
      });
    }
  });

player.relatedModal = modal;

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
 * @function related
 * @param    {Object} [options={}]
 *           An object of options left to the plugin author to define.
 */
const related = function(options) {
  this.ready(() => {
    onPlayerReady(this, videojs.mergeOptions(defaults, options));
  });
};

// Register the plugin with video.js.
videojs.plugin('related', related);

// Include the version number.
related.VERSION = '__VERSION__';

export default related;
