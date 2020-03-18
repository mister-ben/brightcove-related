import videojs from 'video.js';
import RelatedList from './related-list.js';
import ReplayPoster from './replay-poster.js';

const ModalDialog = videojs.getComponent('ModalDialog');

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
   * @param  {number} [options.smallCount]
   *          - number of items at which the `related-small` class is added
   * @param  {number} [options.smallWidth]
   *          - player width at which the `related-small` class is added
   */
  constructor(player, options) {
    super(player, options);
    this.replayPoster = new ReplayPoster(player, {});
    this.relatedList = new RelatedList(player, {});
    this.replayPoster.addClass('vjs-icon-replay');
    this.contentEl_.appendChild(this.relatedList.el());
    this.contentEl_.appendChild(this.replayPoster.el());
    this.smallCount = options.smallCount || 8;
    this.smallWidth = options.smallWidth || 480;
    this.on(player, 'ended', this.open);
    this.on(this.player(), ['loadstart', 'play'], () => {
      this.close();
    });
  }

  fill(list, isPlaybackAPI = false) {
    if (list) {
      this.relatedList.update(list, isPlaybackAPI);
    }
  }

  open() {
    if (
      (this.relatedList.items.length < this.smallCount) ||
      (this.player().currentWidth() < this.smallWidth)) {
      this.addClass('related-small');
    } else {
      this.removeClass('related-small');
    }
    this.player().addClass('vjs-related-showing');
    super.open();
  }

  close() {
    super.close();
    this.player().removeClass('vjs-related-showing');
  }

  /**
   * Build the modal's CSS class.
   *
   * @method buildCSSClass
   * @return {string}
   */
  buildCSSClass() {
    return `vjs-related ${super.buildCSSClass()}`;
  }

}

videojs.registerComponent('RelatedModal', RelatedModal);

export default RelatedModal;
