import serverInfo from '../../configs/server-info.json';
import MediaFile from '../modules/media-file';

const convertURLs = (url) => {
  // Replace WP admin url with front-end url
  return (url ? url.replace(serverInfo.WPURL, serverInfo.homeURL) : "");
}

export default {
  convertURLs,
  MediaFile
}