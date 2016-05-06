if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position){
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
  };
}

/**
 * Returns the HTTPS equivalent for an HTTP Brightcove CDN URL
 * @constructor
 * @param {String} url - HTTP URL
 * @returns {String} - Equivalent HTTPS URL
 */
const secureUrl = (url) => {
  const domains = {
    'http://c.brightcove.com': 'https://secure.brightcove.com',
    'http://brightcove04.brightcove.com': 'https://bcsecure04-a.akamaihd.net',
    'http://brightcove01.brightcove.com': 'https://bcsecure01-a.akamaihd.net',
    'http://brightcove.vo.llnwd.net': 'https://brightcove.hs.llnwd.net'
  };

  if (url && url.startsWith('http://')) {
    for (let prop in domains) {
      if (url.startsWith(prop)) {
        return url.replace(prop, domains[prop]);
      }
    }
  }
  return null;
};

export default secureUrl;
