import document from 'global/document';
import videojs from 'video.js';
import 'videojs-playlist-ui';

const ModalDialog = videojs.getComponent('ModalDialog');

/**
 * @class EndCardModal
 * @extends {ModalDialog}
 */
class EndCardModal extends ModalDialog {

  /**
   * Constructor for EndCardModal
   *
   * @method constructor
   * @param  {Player} player
   * @param  {Object} [options]
   */
  constructor(player, options) {
    super(player, options);
    this.on(player, 'ended', this.open);
    // Add playlist UI to endscreen
    //playlistUi.call(player, {elem: this.$('.vjs-modal-dialog-content')})
  }

  /**
   * Build the modal's CSS class.
   *
   * @method buildCSSClass
   * @return {String}
   */
  buildCSSClass() {
    return `vjs-endcard ${super.buildCSSClass()}`;
  }

  /**
   * Whether or not the associated player currently has the social plugin
   * activated on it.
   *
   * @method playerHasSocial
   * @return {Boolean}
   */
  playerHasSocial() {
    return !!this.player().socialOverlay;
  }

  /**
   * Toggles the display of the social button.
   *
   * @method toggleSocialButton
   */
  toggleSocialButton() {
    this.socialButton.toggleClass(CLASS_HIDDEN, !this.playerHasSocial());
  }

}

videojs.registerComponent('EndCardModal', EndCardModal);

export default EndCardModal;