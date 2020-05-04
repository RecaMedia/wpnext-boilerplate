import CookieParser from './cookie-parser';
import fetch from 'isomorphic-unfetch';

export default (call = null, comp) => {

  // Comp represent the wrapper function that will return props
  comp.getInitialProps = async (ctx) => {

    // Default props, CookieParser will provide any existing cookies for the site
    let cookies = CookieParser(ctx);
    let response = null;

    // Make call on server side
    if (call != null) {
      // Replace query parameters within url string
      let url = call.url;
      Object.keys(ctx.query).map((item) => {
        url = url.replace('['+item+']', ctx.query[item]);
      });
      // Make call
      const res = await fetch(url, call.options);
      // Return response
      response = await res.json();
    }
    
    return {
      cookies,
      response,
      query: ctx.query
    };
  }

  return comp;
}