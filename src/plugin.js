import videojs from 'video.js';
import RelatedModal from './related-modal';
import mapiRelatedVideos from './mapi-related-videos.js';
import 'whatwg-fetch';
import 'es6-promise';

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
    content: '',
    temporary: false,
    uncloseable: true
  });
  let getEndscreenData;
  // Keep track of video id as source of truth about content change
  let currentVideoId;

  // Get list of videos
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
            videojs.log.warn(error);
          } else {
            modal.fill(data);
          }
        });
      } else if (options.debug) {
        videojs.log.warn('No token');
      }
      break;
    case 'url':
      if (options.url) {
        let url = options.url;
        let params = {
          '{limit}': options.limit,
          '{player.id}': player.id(),
          '{player.duration}': player.duration(),
          '{timestamp}': new Date().getTime(),
          '{document.referrer}': document.referrer,
          '{window.location.href}': window.location.href
        };

        if (player.mediainfo) {
          const tags = player.mediainfo.tags || [];
          const customFields = player.mediainfo.custom_fields || {};

          for (let param in player.mediainfo) {
            if ((typeof player.mediainfo[param] === 'string') ||
                (typeof player.mediainfo[param] === 'number')) {
              params[`{mediainfo.${param}}`] = player.mediainfo[param];
            }
          }
          params['{mediainfo.tags}'] = tags.join();
          for (let param in customFields) {
            params[`{mediainfo.custom_fields.${param}}`] = customFields[param];
          }
        }
        for (let param in params) {
          url = url.replace(param, params[param]);
        }

        fetch(url).then((response) => {
          return response.json();
        }).then((json) => {
          modal.fill(json.videos);
        }).catch((error) => {
          videojs.log(error);
        });
      }
      break;
    case 'playlist':
      if (options.playlistId) {
        player.getPlaylist(options.playlistId, (error, data) => {
          if (error) {
            videojs.log.warn(error);
          } else {
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
 * @param    {String} options.source
 *              - `related` | `playlist` | `url`
 * @param    {String} [options.token]
 *              - Media API token to be used if options.source === related
 * @param    {String} [options.japan]
 *              - If true, Brightcove KK Media API endpoint is used
 * @param    {Object} options.link
 *              - If false, unset or link discovery fails, load video in player.
 * @param    {String} options.link.field
 *              - If set, use this video field to specify link.
 *                Could be `link.url` or `custom_fields.my_field`
 * @param    {String} options.link.pattern
 *              - NOT IMPLEMENTED - URL pattern with macros
 * @param    {String} options.playlistId
 *              - playlist id to be used if options.source === related
 * @param    {String} options.url
 *              - url to be used if options.source === related
 *              - supports macros, e.g. {mediainfo.id}, {mediainfo.custom_fields.my_field}
 *              - must return an array of objects in the form of the playback API
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
