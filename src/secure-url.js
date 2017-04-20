const startsWith = (string, searchString, position = 0) => {
  return string.substr(position, searchString.length) === searchString;
};

/**
 * Returns the HTTPS equivalent for a known HTTP CDN URL
 * @constructor
 * @param {String} url - HTTP URL
 * @returns {String} - Equivalent HTTPS URL
 */
const secureUrl = (url) => {
  const domains = {
    'http://c.brightcove.com': 'https://secure.brightcove.com',
    'http://brightcove04.brightcove.com': 'https://bcsecure04-a.akamaihd.net',
    'http://brightcove01.brightcove.com': 'https://bcsecure01-a.akamaihd.net',
    'http://brightcove.vo.llnwd.net/v1/': 'https://brightcove.hs.llnwd.net/v2/',
    'http://brightcove.vo.llnwd.net/': 'https://brightcove.hs.llnwd.net/'
  };

  if (url && startsWith(url, 'http://')) {
    for (let prop in domains) {
      if (startsWith(url, prop)) {
        return url.replace(prop, domains[prop]);
      }
    }
  }
  return null;
};

export default secureUrl;
