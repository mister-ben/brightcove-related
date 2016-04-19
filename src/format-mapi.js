import secureUrl from './secure-url.js';

/**
 * Converts a video or playlist from the Media API format for the Brightcove Player.
 * @constructor
 * @param {Object|Array} data - Media API video or array of videos
 * @param {Boolean} includeZeroSrc - Whether videos with no (convertible) sources should be returned.
 * @returns {Object|Array} - Player API formatted video or array of videos
 */
const formatMapi = function (data, includeZeroSrc = false) {
  if (Array.isArray(data)) {
    let playlist = [];
    for (let i = 0; i < data.length; i++) {
      let video = getVideo(data[i]);
      if (video.sources.length > 0 || includeZeroSrc) {
        playlist.push(video);
      }
    }
    return playlist;
  } else {
    let video = getVideo(data);
    if (video.sources.length > 0 || includeZeroSrc) {
      return video;
    }
  }
  return null;
}

/**
 * Converts a video from the Media API format for the Brightcove Player.
 * @constructor
 * @param {Object} data - Media API video
 * @returns {Object} - Player API formatted video
 */
const getVideo = function (mapiVideo) {
  const propsMap = {
    name: 'name',
    id: 'id',
    shortDescription: 'description',
    referenceId: 'reference_id',
    accountId: 'account_id',
    customFields: 'custom_fields',
    thumbnailURL: 'thumbnail',
    videoStillURL: 'poster',
    longDescription: 'long_description',
    tags: 'tags',
    economics: 'economics',
    duration: 'duration'
  };
  let video = {};
  for (let prop in propsMap) {
    if (mapiVideo[prop]) {
      video[propsMap[prop]] = mapiVideo[prop];
    }
  }
  if(mapiVideo.videoStillURL) {
    video.posterSources = [{
      src: mapiVideo.videoStillURL
    }];
  }
  video.link = {};
  if(mapiVideo.linkText) {
    video.link.text = mapiVideo.linkText;
  }
  if(mapiVideo.linkURL) {
    video.link.url = mapiVideo.linkURL;
  }
  video.sources = [];
  if (mapiVideo.dashManifestUrl && mapiVideo.dashManifestUrl !== '') {
    if (secureUrl(mapiVideo.dashManifestUrl)) {
      video.sources.push(dashSource(secureUrl(mapiVideo.dashManifestUrl)));
    }
    video.sources.push(dashSource(mapiVideo.dashManifestUrl));
  }
  if (mapiVideo.HLSURL && mapiVideo.HLSURL !== '') {
    // HLSURL should come first if set
    if (secureUrl(mapiVideo.HLSURL)) {
      video.sources.push(hlsSource(secureUrl(mapiVideo.HLSURL)));
    }
    video.sources.push(hlsSource(mapiVideo.HLSURL));
  } else if (mapiVideo.FLVURL && mapiVideo.FLVURL.indexOf('.m3u8') > 0) {
    // Some live videos have m3u8 in FLVURL
    if (secureUrl(mapiVideo.FLVURL)) {
      video.sources.push(hlsSource(secureUrl(mapiVideo.FLVURL)));
    }
    video.sources.push(hlsSource(mapiVideo.FLVURL));
  }
  for (let i = 0; i < mapiVideo.renditions.length; i++) {
    let source = {};
    const rendition = mapiVideo.renditions[i];
    const propsMap = {
      encodingRate: 'avg_bitrate',
      frameHeight: 'height',
      frameWidth: 'width',
      videoCodec: 'codec',
      videoContainer: 'container'
    };
    for (let prop in propsMap) {
      source[propsMap[prop]] = rendition[prop];
    }
    if (rendition.videoCodec === 'MP4') {
      source.type = 'video/mp4';
    }
    if (rendition.url) {
      if (secureUrl(rendition.url)) {
        let secureSource = Object.assign({}, source);
        secureSource.src = secureUrl(rendition.url);
        video.sources.push(secureSource);
      }
      source.src = rendition.url;
      video.sources.push(source);
    }
  }
  return video;
}

/**
 * Returns an HLS source object
 * @constructor
 * @param {String} url - HLS source URL
 * @returns {Object} - Player API formatted HLS source
 */
const hlsSource = function(url) {
  return {
    codec: 'H264',
    container: 'M2TS',
    src: url,
    type: 'application/vnd.apple.mpegurl'
  }
}

/**
 * Returns an MPEG-DASH source object
 * @constructor
 * @param {String} url - DASH source URL
 * @returns {Object} - Player API formatted DASH source
 */
const dashSource = function(url) {
  return {
    src: url,
    type: 'application/dash+xml'
  }
}

export default formatMapi;