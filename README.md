# videojs-related

End screen for the Brightcove Player that presents a list of content to a user to watch next. Not a recommendation engine itself.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Configuration](#configuration)
  - [Data source](#data-source)
    - [Video Cloud Playlist](#video-cloud-playlist)
    - [Custom data URL](#custom-data-url)
    - [Media API Related Videos (deprecated)](#media-api-related-videos-deprecated)
  - [Click behaviour](#click-behaviour)
  - [Custom URL data](#custom-url-data)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Configuration

Add the plugin to your player configuration in the Studio:

*   **Javascript:** URL to Javascript
*   **Stylesheet:** URL to CSS
*   **Name:** `related`
*   **Options:** Example - see options below

        {
          "source": "playlist",
          "playlistField": "custom_fields.mycustomfield",
          "link": {
            "url": "http://example.com/videopage/{mediainfo.id}"
          }
        }

### Data source

#### Video Cloud Playlist

You can use a playlist as a source of related videos. This might be a smart playlist of videos with tags, or a manual playlist with curated items.

You can specify the id of the playlist to be used as `playlistId`:

    {
      "source": "playlist",
      "playlistId": "123456"
    }

Alternatively, you can use a field on the video to specify what playlist to use:

    {
      "source": "playlist",
      "playlistField": "custom_fields.mycustomfield"
    }

If both `playlistField` and `playlistId` are used, `playlistField` takes precedence. If the field is not populated on a video, the `playlistId` is used as fallback.

#### Custom data URL

    {
      "source": "url",
      "url": "http://example.com/relatedvideos/{mediainfo.id}"
    }

Fetches an array of videos from a URL. This will need CORS if hosted separately at a different domain as the page the player is embedded.

The URL may contain macros for video fields, such as `{mediainfo.id}` or `{mediainfo.custom_fields.myfield}`. Any [standard video field](http://docs.brightcove.com/en/video-cloud/playback-api/references/video-fields-reference.html) that is a string or a number should work, as well as `{mediainfo.tags}`, which becomes a comma separated list of the video's tags.

{
  "source": "url",
  "url": "http://example.com/relatedvideos?tags={mediainfo.tags}"
}

See below for the format of data that your URL would need to return.

#### Media API Related Videos (deprecated)

This option used the deprecated related videos API.

**Important:** The Media API used by this option is [deprecated and will unavailable after the end of 2017](https://brightcove.status.io/pages/incident/534ec4a0b79718bb73000083/579f4ae52d8d333607000250). Make sure you update to a different content source before then.

### Click behaviour

By default when a video in the end screen is clicked on, that video will be loaded into the existing player. You may redirect to a new page instead, e.g. to the article page featuring that video.

    {
      "link": {
        "field": "custom_fields.articlepage",
        "url": "http://example.com/videopage/{mediainfo.id}"
      }
    }

If `link.field` is specified and that field contains a value, the browser will navigate to that page. If not, the video will be loaded into the player.

To use the standard "related link" field in Video Cloud, use `link.url`.

The URL may also include macros as with the custom data URL option.

### Custom URL data

If you are using your own URL as the source of data, it should return videos in the same format as the Playback API. The following fields are required:

    [
      {
        "id": 1234,
        "name": "Video name",
        "description": "Video description",
        "poster": "https://example.com/image.jpg",
        "duration": 120,
        "custom_fields": {
          "myfield": "some value"
        },
        "link": {
          "text": "Related link text",
          "url": "http://example.com"
        }
      },
      { ... }
    ]

You only need `custom_fields` and/or `link` if you intend to use them for customising the behaviour when the item is clicked, as described above.


## License

Apache-2.0. Copyright (c) mister-ben &lt;git@misterben.me&gt;


[videojs]: http://videojs.com/
