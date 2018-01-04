import videojs from 'video.js';
import RelatedModal from './related-modal';
import replaceUrlMacros from './replace-url-macros.js';
import {version as VERSION} from '../package.json';

// Default options for the plugin.
const defaults = {
  limit: 9,
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
    },
    VERSION
  };

  // Set up modal - more customisation to do here
  const modal = new RelatedModal(player, {
    label: player.localize('End card with related videos'),
    content: '',
    temporary: false,
    uncloseable: true
  });
  let getEndscreenData;
  // Keep track of video id as source of truth about content change
  let currentVideoId;

  // Get list of videos immediately if mediainfo is populated, and update
  // on loadedmetadata

  if (player.mediainfo && player.mediainfo.id) {
    currentVideoId = player.mediainfo.id;
    getEndscreenData();
  }

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
      videojs.log.warn('The related videos API is unavailable.');
      break;
    case 'url':
      if (options.url) {
        const url = replaceUrlMacros(options.url, player.mediainfo, {
          'limit': options.limit,
          'player.id': player.id(),
          'player.duration': player.duration()
        });

        videojs.xhr({
          url,
          json: true
        }, (response, error) => {
          if (error) {
            videojs.log(error);
            return;
          }
          if (!Array.isArray(response.videos)) {
            videojs.log('URL did not contain videos');
            return;
          }
          modal.fill(response.videos);
        });
      }
      break;
    case 'playlist':
      let playlistId = options.playlistId;

      if (options.playlistField && player.mediainfo) {
        const field = options.playlistField.split('.');
        const idFromField = player.mediainfo[field[0]][field[1]];

        if (idFromField) {
          playlistId = idFromField;
        }
      }
      if (playlistId) {
        player.catalog.getPlaylist(playlistId, (error, data) => {
          if (error && options.debug) {
            videojs.log.warn(error);
          } else {
            for (const item in data) {
              data[item].playbackAPI = true;
            }
            modal.fill(data);
          }
        });
      } else if (options.debug) {
        videojs.log.warn('No playlist supplied');
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
 * @param    {string} options.source
 *              - `related` | `playlist` | `url`
 * @param    {string} [options.token]
 *              - Media API token to be used if options.source === related
 * @param    {string} [options.japan]
 *              - If true, Brightcove KK Media API endpoint is used
 * @param    {Object} options.link
 *              - If false, unset or link discovery fails, load video in player.
 * @param    {string} options.link.field
 *              - If set, use this video field to specify link.
 *                Could be `link.url` or `customFields.myfield`
 * @param    {string} options.link.pattern
 *              - NOT IMPLEMENTED - URL pattern with macros
 * @param    {string} options.playlistId
 *              - playlist id to be used if options.source === related
 * @param    {string} options.url
 *              - url to be used if options.source === related
 *              - supports macros, e.g. {mediainfo.id}, {mediainfo.customFields.myfield}
 *              - must return an array of objects in the form of the playback API
 */
const related = function(options) {
  this.ready(() => {
    onPlayerReady(this, videojs.mergeOptions(defaults, options));
  });
};

// Register the plugin with video.js.
videojs.registerPlugin('related', related);

// Include the version number.
related.VERSION = VERSION;

export default related;
