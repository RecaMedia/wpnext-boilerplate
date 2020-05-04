import fetch from 'isomorphic-unfetch';
import serverInfo from '../../configs/server-info.json';

const api = async (path) => {
  const res = await fetch(serverInfo.WPJson + path, {
    method: "GET",
    headers: {
      "Content-Type":"application/json"
    }
  });
  return await res.json();
}

export default api;