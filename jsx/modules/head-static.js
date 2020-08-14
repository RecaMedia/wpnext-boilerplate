import Head from 'next/head';

const headStatic = () => {
  return <Head>
    <meta httpEquiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"/>
    <link rel="apple-touch-icon" sizes="180x180" href="/static/img/favicon.ico"/>
    <link rel="icon" type="image/png" sizes="32x32" href="/static/img/favicon.ico"/>
    <link rel="icon" type="image/png" sizes="16x16" href="/static/img/favicon.ico"/>
  </Head>;
}

export default headStatic;