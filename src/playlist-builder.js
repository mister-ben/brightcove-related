import fetchJsonp from 'fetch-jsonp';
import formatMapi from './format-mapi.js';

const mapiRelatedVideos = (options, cb) => {
  const fields = 'name,id,customFields,linkURL,shortDescription,referenceId,videoStillURL,length';
  const domain = (options.japan ? 'api.brightcove.co.jp' : 'api.brightcove.com');
  const url = `https://${domain}/services/library?command=find_related_videos&video_id=${options.videoid}&token=${options.token}&video_fields=${fields}&media_delivery=http&format=jsonp&page_size=${options.limit}`;
  fetchJsonp(url).then(function(response) {
    return response.json()
  }).then(function(json) {
    const formatedResponse = formatMapi(json.items, true);
    cb(null, formatedResponse);
  }).catch(function(ex) {
    cb(['Failed to parse response', ex], null);
  });
};

export default mapiRelatedVideos;