import React from 'react';
import Wrapper from 'root/jsx/util/wrapper';
import WPView from 'root/jsx/views/wp-view';
import GetInitialProps from 'root/jsx/util/get-initial-props';
import serverInfo from 'root/configs/server-info.json';

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
    <WPView type="post"/>
  </Wrapper>
));

export default pageComp;