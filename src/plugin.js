import videojs from 'video.js';
import window from 'global/window';
import RelatedModal from './related-modal';
import replaceUrlMacros from './replace-url-macros.js';
import compareVersions from 'compare-versions';
import 'whatwg-fetch';

// Default options for the plugin.
const defaults = {
  limit: 9,
  debug: true
};

const registerPlugin = videojs.registerPlugin || videojs.plugin;

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
    VERSION: '__VERSION__'
  };

  // Set up modal - more customisation to do here
  const modal = new RelatedModal(player, {
    label: player.localize('End card with related videos'),
    content: '',
    temporary: false,
    uncloseable: true
  });

  // Keep track of video id as source of truth about content change
  let currentVideoId;

  const MIN_RELATED = '6.31.0';

  const sources = {
    related: () => {
      if (!window.bc || compareVersions(window.bc.VERSION, MIN_RELATED) < 0) {
        videojs.log.error('Player version does not support related videos API');
        return;
      }
      const req = {
        type: 'related',
        id: player.mediainfo.id
      }

      if (options.key) {
        req.policyKey = options.key
      }
      player.catalog.get(req).then(data => {
        modal.fill(data);
      }).catch(err => {
        videojs.log.warn(err);
      });
    },
    url: () => {
      if (options.url) {
        const url = replaceUrlMacros(options.url, player.mediainfo, {
          'limit': options.limit,
          'player.id': player.id(),
          'player.duration': player.duration()
        });
        fetch(url).then((response) => {
          return response.json();
        }).then((json) => {
          modal.fill(json.videos);
        }).catch((error) => {
          videojs.log.warn(error);
        });
      }
    },
    playlist: () => {
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
            for (let item in data) {
              data[item].playbackAPI = true;
            }
            modal.fill(data);
          }
        });
      } else if (options.debug) {
        videojs.log.warn('No playlist supplied');
      }
    }
  }

  const getEndscreenData = () => {
    if (!sources[options.source]) {
      videojs.log.error('Unsupported type');
      return;
    }
    sources[options.source]();
  };

  player.relatedModal = modal;

  player.addChild(modal);

  // iOS fullscreen doesn't show modal
  if (videojs.browser.IS_IOS && !player.tech_.el_.hasAttribute('playsinline')) {
    player.on('ended', () => {
      player.exitFullscreen();
    });
  }

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
 *              - `related` | `playlist` | `url`
 * @param    {Object} options.link
 *              - If false, unset or link discovery fails, load video in player.
 * @param    {String} options.key
 *              - If set, use this policy key in place of the player's default
 * @param    {String} options.link.field
 *              - If set, use this video field to specify link.
 *                Could be `link.url` or `customFields.myfield`
 * @param    {String} options.link.pattern
 *              - NOT IMPLEMENTED - URL pattern with macros
 * @param    {String} options.playlistId
 *              - playlist id to be used if options.source === related
 * @param    {String} options.url
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
registerPlugin('related', related);

// Include the version number.
related.VERSION = '__VERSION__';

export default related;
