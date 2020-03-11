import React from 'react';
import Wrapper from '../components/util/wrapper';
import Home from '../components/views/home';
import cookieParser from '../components/util/cookie-parser';

const homePage = cookieParser((props) => (
  <Wrapper {...props}>
    <Home/>
  </Wrapper>
));

export default homePage;