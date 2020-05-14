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

export default {
  convertURLs,
  mediaObj
}