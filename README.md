# videojs-related

End screen for the Brightcove Player

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

Fetch an array of videos from a URL.

The URL may contain macros for video fields, such as `{mediainfo.id}` or `{mediainfo.custom_fields.myfield}`. Any [standard video field](http://docs.brightcove.com/en/video-cloud/playback-api/references/video-fields-reference.html) that is a string or a number should work, as well as `{mediainfo.tags}`, which becomes a comma separated list of the video's tags.

See below for the format of data that your URL would need to return.

#### Media API Related Videos

Use related videos from the Video Cloud Media API as the source of data. A [read token for the Media API](https://videocloud.brightcove.com/admin/api) is needed. It does not need to have URL access.

    {
      "source": "related",
      "token": "MEDIA API READ TOKEN"
    }

**Important:** The Media API used by this option is [deprecated and will be retired by the end of 2017](https://brightcove.status.io/pages/incident/534ec4a0b79718bb73000083/579f4ae52d8d333607000250). Make sure you update to a different content source before then.

### Click behaviour

By default the item clicked will be loaded into the existing player. You can redirect to a new page instead, e.g. to an article page featuring that video.

    {
      "link": {
        "field": "custom_fields.articlepage",
        "url": "http://example.com/videopage/{mediainfo.id}"
      }
    }

If `link.field` is specified and that field contains a value, the browser will navigate to that page. If not, the video will be loaded into thr player.

To use the standard "related link" video, use `link.url`.

The URL can include macros as with the custom data URL option.

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
