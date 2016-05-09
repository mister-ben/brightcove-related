import document from 'global/document';
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
    this.el_.style.backgroundImage = `url(${item.poster})`;
    this.$('.video-name').textContent = this.item_.name || this.localize('Untitled');
    if (this.item_.description &&
      (this.item_.description !== '') &&
      (this.item_.description !== this.item_.name)) {
      this.$('.video-description').textContent = this.item_.description;
    } else {
      videojs.addClass(this.$('.video-description'), 'vjs-hidden');
    }
  }

  createEl() {
    let li = document.createElement('li');
    let name = document.createElement('cite');
    let description = document.createElement('p');

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
        let props = link.field.split('.');

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
    // Fetch from playlist API if there are no sources to play
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
}

export default RelatedItem;
