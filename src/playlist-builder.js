import fetchJsonp from 'fetch-jsonp';
import formatMapi from './format-mapi.js';

const catalogPlaylist = function(options, cb) {
  console.log(options);
  if (options.player && typeof options.player.catalog === 'function') {
    console.log('is function');
    options.player.catalog.getPlaylist(options.playlistId, function(error, data) {
      if (error) {
        cb(error, null);
      } else {
        cb(null, data);
      }
    })
  } else {
    cb('No catalog plugin', null);
  }
};

const mapiRelatedPlaylist = function(options, cb) {
  const fields =
  'name,id,customFields,videoFullLength,HLSURL,FLVURL,renditions,shortDescription,accountId,referenceId,thumbnailURL,videoStillURL,dashManifestUrl,linkURL,linkText,tags';
  // TODO: Make number of items configurable
  const url = `https://api.brightcove.com/services/library?command=find_related_videos&video_id=${options.videoid}&token=${options.token}&video_fields=${fields}&media_delivery=http&format=jsonp&page_size=10`;
  fetchJsonp(url).then(function(response) {
    return response.json()
  }).then(function(json) {
    const formatedResponse = formatMapi(json.items, true);
    cb(null, formatedResponse);
  }).catch(function(ex) {
    cb(['Failed to parse response', ex], null);
  });
};

export {catalogPlaylist, mapiRelatedPlaylist};