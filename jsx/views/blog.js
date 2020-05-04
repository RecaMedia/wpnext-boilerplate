import React from 'react';
import MainMenu from '../includes/main-menu';
import Head from '../modules/head';
import Header from '../modules/header';
import Blog from '../../components/blog/component';

const BlogPage = ({WPInfo, response}) => {

  let meta = {
    title: (WPInfo ? WPInfo.name + " | Blog" : "Blog")
  }

  return (
    <div className="main-content">
      <Head meta={meta}/>
      <Header className={(WPInfo ? "header--fadein" : "")} name={(WPInfo ? WPInfo.name : "")} menu={MainMenu} sticky={true} />
      <Blog values={{list_count:10}} list={response}/>
    </div>
  )
}

export default BlogPage;