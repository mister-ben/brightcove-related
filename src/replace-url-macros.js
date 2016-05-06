const replaceUrlMacros = (url, mediainfo, customProps = {}) => {
  let params = {
    '{timestamp}': new Date().getTime(),
    '{document.referrer}': document.referrer,
    '{window.location.href}': window.location.href
  };

  for (let prop in customProps) {
    params[`{${prop}}`] = customProps[prop];
  }

  if (mediainfo) {
    const tags = mediainfo.tags || [];
    const customFields = mediainfo.custom_fields || {};

    for (let param in mediainfo) {
      if ((typeof mediainfo[param] === 'string') ||
          (typeof mediainfo[param] === 'number')) {
        params[`{mediainfo.${param}}`] = mediainfo[param];
      }
    }
    params['{mediainfo.tags}'] = tags.join();
    for (let param in customFields) {
      params[`{mediainfo.custom_fields.${param}}`] = customFields[param];
    }
  }
  for (let param in params) {
    url = url.replace(param, params[param]);
  }
  return url;
};

export default replaceUrlMacros;
