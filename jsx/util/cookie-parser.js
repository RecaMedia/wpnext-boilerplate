import { parseCookies } from 'nookies';
import JSCookies from 'js-cookie';

export default (ctx) => {

  // Default
  let cookies = null;

  // Check if request is on server side
  if (ctx.req) {
    // On server, need to copy cookies from req
    cookies = parseCookies(ctx);
  } else {
    // On client, cookies are automatic
    cookies = JSCookies.get();
  }

  return cookies;
}