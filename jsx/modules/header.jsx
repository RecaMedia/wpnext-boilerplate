import React, {useEffect, useState} from 'react';
import {decode} from 'html-entities';
import Nav from './nav';
import apiCall from '../util/api-call';

export default class Header extends React.Component {

	constructor(props) {
		super(props);
		
    this.state = {
			menu: this.props.menu
		}
  }
  
  componentDidMount() {
    apiCall("wp-api-menus/v2/menu-locations/header").then((wp_menu) => {
      this.setState({
        menu: wp_menu
      })
    });
  }

	render() {

    let attr = {
      className: (this.props.className ? this.props.className : "")
    }

    if (this.props.sticky) {
      attr.className = attr.className + " header--sticky";
    }

    return (
      <header {...attr}>
        <div id="SiteName">
          <a href="/">
            <img className="logo" src="/static/img/sr.svg"/>
            <span dangerouslySetInnerHTML={{__html: decode(this.props.name)}}/>
          </a>
        </div>
        <Nav menu={this.state.menu}/>
      </header>
    )
  }
}