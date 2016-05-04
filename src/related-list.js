import document from 'global/document';
import videojs from 'video.js';

const Component = videojs.getComponent('Component');
const ClickableComponent = videojs.getComponent('ClickableComponent');

/**
 * @class RelatedList
 * @extends {Component}
 */
class RelatedList extends Component {
  constructor(player, settings) {

    settings.el = document.createElement('ol');
    settings.el.className = 'vjs-related-list';

    super(player, settings);

    this.items = [];

    if (settings.list) {
      this.update(settings.list);
    }
  }

  update(list) {

    // Clear items
    for (let i = 0; i < this.items.length; i++) {
      this.removeChild(this.items[i]);
    }
    this.items = [];

    // Add items
    if (list && list.length > 0) {
      for (var i = 0; i < list.length; i++) {
        let item = new RelatedItem(this.player_, list[i]);
        this.items.push(item);
        this.addChild(item);
      }
    }
  }
}

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
    li.className = 'vjs-playlist-item';

    let name = document.createElement('cite');
    name.className = 'video-name';
    li.appendChild(name);

    let description = document.createElement('p');
    description.className = 'video-description';
    li.appendChild(description);

    return li;
  }

  handleClick() {
    // Get redirect URL from field
    if (this.player_.related.options().link) {
      if (this.player_.related.options().link.field) {
        let props = this.player_.related.options().link.field.split('.');
        if (this.item_[props[0]] && this.item_[props[0]][props[1]]) {
          window.location.href = this.item_[props[0]][props[1]];
          return;
        }
      }
      // TODO: URL pattern with macros
    }

    // Load video into existing player
    this.player_.one('loadstart', function(){
      this.play();
    });
    // Fetch from playlist API if there are no sources to play
    this.player_.catalog.getVideo(this.item_.id, (error, video) => {
      if (video) {
        this.player_.catalog.load(video);
      }
    });
    return;
  }
}

export default RelatedList;