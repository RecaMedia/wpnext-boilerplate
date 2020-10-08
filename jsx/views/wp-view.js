import React, {useEffect, useState} from 'react';
import {Transition} from 'react-transition-group';
import GeneralFunctions from 'root/jsx/util/general-functions';
import MainMenu from '../includes/main-menu';
import Head from '../modules/head';
import Header from '../modules/header';
import Builder from '../modules/builder';
import Blog from '../../components/blog/component';

const Post = ({type, WPInfo, response}) => {
  const [show, setShow] = useState(false);

  const defaultStyle = {
    transition: 'opacity 250ms ease',
    opacity: 1
  };

  const transitionStyles = {
    entering: { opacity: 0}, 
    entered: { opacity: 1},
    exiting: { opacity: 0 },
    exited: { opacity: 0 }
  };

  /*
	* All views are supplied with "cookies", "response", and "query" props
	*/

  // Get response object
  response = (type == "post" ? (response.constructor === Array ? response[0] : response) : response);
  
  // Meta title update if response is not undefined
  let meta = {} 
  if (response) {
    meta.name = (WPInfo != null ? WPInfo.name : "");
    if (type == "post") {
      meta.title = response.title.rendered;
      meta.description = (response.excerpt ? GeneralFunctions.stripTags(response.excerpt.rendered) : '');
      meta.url = response.link;
      meta.keywords = response.meta.join(", ");
      meta.image = (response.featured_media ? response.featured_media.source_url : '');
    }
  }

  useEffect(() => {
    setShow(true)
  });

  return (
    <Transition in={show} timeout={250}>
      {sec_trans_state => (
        <div className="main-content" style={{...defaultStyle, ...transitionStyles[sec_trans_state]}}>
          <Head meta={meta}/>
          <Header className={(WPInfo ? "header--fadein" : "")} name={(WPInfo ? WPInfo.name : "")} menu={MainMenu} sticky={true} />
          {(type == "post" ? <Builder build={(response != undefined ? response.wpnext : null)}/> : <Blog values={{list_count:10}} list={response}/>)}
        </div>
      )}
    </Transition >
  )
}

export default Post;