import { parseCookies } from 'nookies';
import JSCookies from 'js-cookie';

export default (comp) => {
  comp.getInitialProps = (ctx) => {
    let cookies = null;
    if (ctx.req) {
      // On server, need to copy cookies from req
      cookies = parseCookies(ctx);
    } else {
      // On client, cookies are automatic
      cookies = JSCookies.get();
    }
    return {cookies};
  }
  return comp;
}