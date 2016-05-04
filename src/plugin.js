import videojs from 'video.js';
import RelatedModal from './related-modal';
import mapiRelatedVideos from './playlist-builder.js';

// Default options for the plugin.
const defaults = {
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

  player.related = {
    options: () => {
      return options;
    }
  };

  // Set up modal - more customisation to do here
  let modal = new RelatedModal(player, {
    label: player.localize('End card with related videos'),
    content: player.localize('This is content'),
    temporary: false,
    uncloseable: true
  });
  let getEndscreenData;
  // Keep track of video id as source of truth about content change
  let currentVideoId;

  // Get related videos from Media api
  player.on('loadedmetadata', () => {
    if (player.mediainfo &&
        player.mediainfo.id &&
        currentVideoId !== player.mediainfo.id) {
      currentVideoId = player.mediainfo.id;
      getEndscreenData();
    }
  });

  getEndscreenData = () => {
    switch (options.source) {
    case 'related':
      if (options.token) {
        mapiRelatedVideos({
          videoid: currentVideoId,
          token: options.token,
          debug: options.debug,
          limit: options.limit,
          japan: options.japan
        }, (error, data) => {
          if (error) {
            videojs.warn(error);
          } else {
            modal.fill(data);
          }
        });
      } else if (options.debug) {
        videojs.warn('No token');
      }
      break;
    case 'playlist':
      if (options.playlistId) {
        player.getPlaylist(options.playlistId, (error, data) => {
          if (error) {
            videojs.warn(error);
          } else {
            modal.fill(data);
          }
        });
      } else if (options.debug) {
        videojs.warn('No playlist supplied');
      }
      break;
    }
  };

  player.relatedModal = modal;

  player.addChild(modal);

  // iOS fullscreen doesn't show modal
  if (videojs.browser.IS_IOS) {
    player.on('ended', () => {
      player.exitFullscreen();
    });
  }
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
 * @param    {Object} options
 * @param    {String} options.source
 *              - `related` | `playlist` (`search` to be implemented)
 * @param    {String} [options.token]
 *              - Media API token to be used if source === related
 * @param    {String} [options.japan]
 *              - If true, Brightcove KK Media API endpoint is used
 * @param    {Object} options.link
 *              - If false, unset or link discovery fails, load video in player.
 * @param    {String} options.link.field
 *              - If set, use this video field to specify link.
 *                Could be `link.url` or `custom_fields.my_field`
 * @param    {String} options.link.pattern
 *              - NOT IMPLEMENTED - URL pattern with macros
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
