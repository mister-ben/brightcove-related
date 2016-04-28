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
        let item = new RelatedItem(this.player_, list[i], {});
        this.items.push(item);
        this.addChild(item);
      }
    }
  }
}

class RelatedItem extends ClickableComponent {

  constructor(player, playlistItem, settings) {
    if (!playlistItem) {
      throw new Error('Cannot construct a PlaylistMenuItem without an item option');
    }
    
    super(player, settings);
    this.item_ = playlistItem;
    this.el_.style.backgroundImage = `url(${playlistItem.poster})`;
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
    this.player_.one('loadstart', function(){
      this.play();
    });
    this.player_.catalog.load(this.item_);
  }
}

export default RelatedList;