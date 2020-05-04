import React from 'react';
import MainMenu from '../includes/main-menu';
import Head from '../modules/head';
import Header from '../modules/header';
import Builder from '../modules/builder';

const Post = ({WPInfo, response}) => {

  /*
	* All views are supplied with "cookies", "response", and "query" props
	*/

  // Get response object
  response = (response.constructor === Array ? response[0] : response);
  
  // Meta title update if response is not undefined
  let meta = {}
  if (response) {
    meta.title = response.title.rendered;
  }

  return (
    <div className="main-content">
      <Head meta={meta}/>
      <Header className={(WPInfo ? "header--fadein" : "")} name={(WPInfo ? WPInfo.name : "")} menu={MainMenu} sticky={true} />
      <Builder build={response.wpnext}/>
    </div>
  )
}

export default Post;