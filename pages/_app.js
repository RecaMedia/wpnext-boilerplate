import React from 'react';

import 'root/public/static/css/admin.css';

const App = ({Component, pageProps }) => (
  <React.Fragment>
    <Component {...pageProps} />
  </React.Fragment>
)

App.getInitialProps = async ({Component, ctx}) => {
  let pageProps = {}
  if(Component.getInitialProps){
    pageProps = await Component.getInitialProps(ctx)
  }
  return { pageProps }
}

export default App;