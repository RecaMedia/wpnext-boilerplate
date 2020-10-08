import serverInfo from '../../configs/server-info.json';
import apiCall from './api-call';

const mediaObj = async (id) => {
  let url = await new Promise((resolve) => {
    apiCall("wp/v2/media/" + id).then((res) => {
      resolve(res)
    });
  });
  return url;
}

const convertURLs = (url) => {
  // Replace WP admin url with front-end url
  return (url ? url.replace(serverInfo.WPURL, serverInfo.homeURL) : "");
}

// Strip HTML tags from string
const stripTags = (str, allow = '') => {
  // making sure the allow arg is a string containing only tags in lowercase (<a><b><c>)
  allow = (((allow || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
    var commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
    return str.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
    return allow.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 :'';
  });
}

export default {
  convertURLs,
  mediaObj,
  stripTags
}