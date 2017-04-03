import videojs from 'video.js';

const PosterImage = videojs.getComponent('PosterImage');

/**
 * @class RelatedList
 * @extends {Component}
 */
class ReplayPoster extends PosterImage {
  // Standard PosterImage now doesn't play if controls are hidden
  handleClick(event) {
    this.player_.play();
  }
}

export default ReplayPoster;
