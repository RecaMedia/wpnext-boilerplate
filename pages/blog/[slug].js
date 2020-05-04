import React from 'react';
import Wrapper from '../../jsx/util/wrapper';
import Post from '../../jsx/views/post';
import GetInitialProps from '../../jsx/util/get-initial-props';
import serverInfo from '../../configs/server-info.json';

let postCall = {
  url: serverInfo.WPJson + "wp/v2/posts?slug=[slug]",
  options: {
    method: "GET",
    headers: {
      "Content-Type":"application/json"
    }
  }
}

const postComp = GetInitialProps(postCall, (props) => (
  <Wrapper {...props}>
    <Post/>
  </Wrapper>
));

export default postComp;