# videojs-related

End screen for related videos

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Installation

- [Installation](#installation)
- [Usage](#usage)
  - [`<script>` Tag](#script-tag)
  - [Browserify](#browserify)
  - [RequireJS/AMD](#requirejsamd)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
## Installation

```sh
npm install --save videojs-related
```

The npm installation is preferred, but Bower works, too.

```sh
bower install  --save videojs-related
```

## Usage

To include videojs-related on your website or web application, use any of the following methods.

### `<script>` Tag

This is the simplest case. Get the script in whatever way you prefer and include the plugin _after_ you include [video.js][videojs], so that the `videojs` global is available.

```html
<script src="//path/to/video.min.js"></script>
<script src="//path/to/videojs-related.min.js"></script>
<script>
  var player = videojs('my-video');

  player.related();
</script>
```

### Browserify

When using with Browserify, install videojs-related via npm and `require` the plugin as you would any other module.

```js
var videojs = require('video.js');

// The actual plugin function is exported by this module, but it is also
// attached to the `Player.prototype`; so, there is no need to assign it
// to a variable.
require('videojs-related');

var player = videojs('my-video');

player.related();
```

### RequireJS/AMD

When using with RequireJS (or another AMD library), get the script in whatever way you prefer and `require` the plugin as you normally would:

```js
require(['video.js', 'videojs-related'], function(videojs) {
  var player = videojs('my-video');

  player.related();
});
```

## License

Apache-2.0. Copyright (c) mister-ben &lt;git@misterben.me&gt;


[videojs]: http://videojs.com/
