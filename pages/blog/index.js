import React from 'react';
import Wrapper from 'root/jsx/util/wrapper';
import WPView from 'root/jsx/views/wp-view';
import GetInitialProps from 'root/jsx/util/get-initial-props';
import serverInfo from 'root/configs/server-info.json';

let postCall = {
  url: serverInfo.WPJson + "wp/v2/posts",
  options: {
    method: "GET",
    headers: {
      "Content-Type":"application/json"
    }
  }
}

const postComp = GetInitialProps(postCall, (props) => (
  <Wrapper {...props}>
    <WPView type="blog"/>
  </Wrapper>
));

export default postComp;