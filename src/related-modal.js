import document from 'global/document';
import videojs from 'video.js';
import RelatedList from './related-list.js';

const ModalDialog = videojs.getComponent('ModalDialog');
const PosterImage = videojs.getComponent('PosterImage');

/**
 * @class relatedModal
 * @extends {ModalDialog}
 */
class RelatedModal extends ModalDialog {

  /**
   * Constructor for relatedModal
   *
   * @method constructor
   * @param  {Player} player
   * @param  {Object} [options]
   * @param  {Number} [options.smallCount] - number of items at which the `related-small` class is added
   * @param  {Number} [options.smallWidth] - player width at which the `related-small` class is added
   */
  constructor(player, options) {
    super(player, options);
    const modal = this;
    this.on(player, 'ended', this.open);
    this.replayPoster = new PosterImage(player, {});
    this.relatedList = new RelatedList(player, {});
    this.replayPoster.addClass('vjs-icon-replay');
    this.contentEl_.appendChild(this.relatedList.el_);
    this.contentEl_.appendChild(this.replayPoster.el_);
    this.smallCount = options.smallCount || 8;
    this.smallWidth = options.smallWidth || 480;
    player.on(['loadstart','play'], function() {
      modal.close();
    });
  }

  fill(list) {
    if(list) {
      this.relatedList.update(list);
    }
  }

  open() {
    if ((this.relatedList.items.length < this.smallCount) || (this.player_.currentWidth() < this.smallWidth)) {
      this.addClass('related-small');
    } else {
      this.removeClass('related-small');
    }
    this.player_.addClass('vjs-related-showing');
    super.open();
  }

  close() {
    super.close();
    this.player_.removeClass('vjs-related-showing');
  }

  /**
   * Build the modal's CSS class.
   *
   * @method buildCSSClass
   * @return {String}
   */
  buildCSSClass() {
    return `vjs-related related-wall ${super.buildCSSClass()}`;
  }

}

videojs.registerComponent('RelatedModal', RelatedModal);

export default RelatedModal;