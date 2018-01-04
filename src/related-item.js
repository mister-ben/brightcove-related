import document from 'global/document';
import window from 'global/window';
import videojs from 'video.js';
import replaceUrlMacros from './replace-url-macros.js';

const ClickableComponent = videojs.getComponent('ClickableComponent');

/**
 * @class RelatedList
 * @extends {Component}
 */
class RelatedItem extends ClickableComponent {

  constructor(player, item) {

    if (!item) {
      throw new Error('No item');
    }

    super(player);
    this.item_ = item;
    this.$('.video-name').textContent = this.item_.name || this.localize('Untitled');
    if (this.item_.description &&
      (this.item_.description !== '') &&
      (this.item_.description !== this.item_.name)) {
      this.$('.video-description').textContent = this.item_.description;
    } else {
      videojs.dom.addClass(this.$('.video-description'), 'vjs-hidden');
    }

    // Media API results may not include an HTTPS poster image
    if (window.location.protocol === 'https:' &&
        this.item_.poster.substr(0, 6) !== 'https:') {
      player.catalog.getVideo(this.item_.id, (error, video) => {
        if (error && player.related.options().debug) {
          videojs.warn('Failed to get video');
        }
        this.el_.style.backgroundImage = `url(${video.poster})`;
        this.mediaAPI = false;
      });
    } else {
      this.el_.style.backgroundImage = `url(${item.poster})`;
    }
  }

  createEl() {
    const li = document.createElement('li');
    const name = document.createElement('cite');
    const description = document.createElement('p');

    li.className = 'vjs-playlist-item';
    name.className = 'video-name';
    description.className = 'video-description';
    li.appendChild(name);
    li.appendChild(description);

    return li;
  }

  handleClick() {
    const link = this.player_.related.options().link;
    let targetWindow = window;
    const inIframe = () => {
      try {
        return window.self !== window.top;
      } catch (e) {
        return true;
      }
    };

    // An iframed player should change parent location
    if (inIframe()) {
      targetWindow = window.parent;
    }

    if (link) {
      if (link.field) {
        const props = link.field.split('.');

        if (this.item_[props[0]] && this.item_[props[0]][props[1]]) {
          targetWindow.location.href = this.item_[props[0]][props[1]];
          return;
        }
      }
      // Handle URL pattern with macros
      if (link.url) {
        targetWindow.location.href = replaceUrlMacros(link.url, this.item_);
        return;
      }
    }

    // Load video into existing player
    this.player_.one('loadstart', function() {
      this.play();
    });
    // Fetch from playlist API if not known to be from that source
    if (!this.item_.playbackAPI) {
      this.player_.catalog.getVideo(this.item_.id, (error, video) => {
        if (error) {
          videojs.log.warn(error);
        }
        if (video) {
          this.player_.catalog.load(video);
        }
      });
      return;
    }
    this.player_.catalog.load(this.item_);
  }
}

export default RelatedItem;
