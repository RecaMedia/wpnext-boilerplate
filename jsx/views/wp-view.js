import React, {useEffect, useState} from 'react';
import {Transition} from 'react-transition-group';
import MainMenu from '../includes/main-menu';
import Head from '../modules/head';
import Header from '../modules/header';
import Builder from '../modules/builder';
import Blog from '../../components/blog/component';
import serverConfig from '../../configs/server-info.json';

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

  // Get response object depending on type
  response = (type == "post" ? (response.constructor === Array ? response[0] : response) : response);
  
  useEffect(() => {
    setShow(true)
  });

  if (response && response != "error") {
    
    // Meta update if response is not undefined
    let meta = {} 
    meta.name = (WPInfo != null ? WPInfo.name : "");
    if (type == "post") {
      // For Post
      meta.title = response.title.rendered;
      meta.description = response.excerpt.rendered;
      meta.url = response.link;
      meta.keywords = (typeof response.tags === 'object' ? Object.keys(response.tags).join(', ') : "");
      meta.image = (response.featured_media != 0 ? response.featured_media.media_details.sizes.medium_large.source_url : "/static/img/placeholder.png");
    } else {
      // For blog
      meta.title = (WPInfo != null ? WPInfo.name + " Blog" : "Blog");
      meta.description = "Read the latest post from " + meta.title ;
      meta.url = serverConfig.WPURL + "/blog";
    }

    // return content
    return (
      <Transition in={show} timeout={250}>
        {sec_trans_state => (
          <div className="main-content" style={{...defaultStyle, ...transitionStyles[sec_trans_state]}}>
            <Head meta={meta}/>
            <Header name={(WPInfo ? WPInfo.name : "")} menu={MainMenu} sticky={true} />
            {(type == "post" ? <Builder build={response.wpnext}/> : <Blog values={{list_count:10}} list={response}/>)}
          </div>
        )}
      </Transition >
    )
  } else {
    return null;
  }  
}

export default Post;