import document from 'global/document';
import videojs from 'video.js';
import RelatedItem from './related-item.js';

const Component = videojs.getComponent('Component');

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
      for (let i = 0; i < list.length; i++) {
        let item = new RelatedItem(this.player_, list[i]);

        this.items.push(item);
        this.addChild(item);
      }
    }
  }
}

export default RelatedList;
