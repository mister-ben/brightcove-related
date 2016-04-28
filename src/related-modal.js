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
    player.addClass('vjs-related-showing');
    super.open();
  }

  /*close() {
    player.removeClass('vjs-related-showing');
    console.log(super, super.close);
    super.close();
  }*/

  /**
   * Build the modal's CSS class.
   *
   * @method buildCSSClass
   * @return {String}
   */
  buildCSSClass() {
    return `vjs-related related-toptail ${super.buildCSSClass()}`;
  }

}

videojs.registerComponent('RelatedModal', RelatedModal);

export default RelatedModal;