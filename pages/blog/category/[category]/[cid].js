import React from 'react';
import Wrapper from '../../../../jsx/util/wrapper';
import Blog from '../../../../jsx/views/blog';
import GetInitialProps from '../../../../jsx/util/get-initial-props';
import serverInfo from '../../../../configs/server-info.json';

let postCall = {
  url: serverInfo.WPJson + "wp/v2/posts?categories=[cid]",
  options: {
    method: "GET",
    headers: {
      "Content-Type":"application/json"
    }
  }
}

const postComp = GetInitialProps(postCall, (props) => (
  <Wrapper {...props}>
    <Blog/>
  </Wrapper>
));

export default postComp;