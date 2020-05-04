import React from 'react';
import Wrapper from '../../../jsx/util/wrapper';
import Post from '../../../jsx/views/post';
import GetInitialProps from '../../../jsx/util/get-initial-props';
import serverInfo from '../../../configs/server-info.json';

let pageCall = {
  url: serverInfo.WPJson + "wp/v2/pages?slug=[grandchildslug]",
  options: {
    method: "GET",
    headers: {
      "Content-Type":"application/json"
    }
  }
}

const pageComp = GetInitialProps(pageCall, (props) => (
  <Wrapper {...props}>
    <Post/>
  </Wrapper>
));

export default pageComp;