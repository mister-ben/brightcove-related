import document from 'global/document';
import window from 'global/window';

const replaceUrlMacros = (url, mediainfo, customProps = {}) => {
  const params = {
    '{timestamp}': new Date().getTime(),
    '{document.referrer}': document.referrer,
    '{window.location.href}': window.location.href
  };

  for (const prop in customProps) {
    params[`{${prop}}`] = customProps[prop];
  }

  if (mediainfo) {
    const tags = mediainfo.tags || [];
    const customFields = mediainfo.customFields || mediainfo.custom_fields || {};

    for (const param in mediainfo) {
      if ((typeof mediainfo[param] === 'string') ||
          (typeof mediainfo[param] === 'number')) {
        params[`{mediainfo.${param}}`] = mediainfo[param];
      }
    }
    params['{mediainfo.tags}'] = tags.join();
    for (const param in customFields) {
      params[`{customFields.${param}}`] = customFields[param];
    }
  }
  for (const param in params) {
    url = url.replace(param, params[param]);
  }
  return url;
};

export default replaceUrlMacros;
