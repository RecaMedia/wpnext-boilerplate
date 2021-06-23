import React, {useEffect, useState} from 'react';
import {decode} from 'html-entities';
import GeneralFunc from '../util/general-functions';

const screen_reader_class = {
  marginTop: '-1px',
  border: 0,
  clip: 'rect(0, 0, 0, 0)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  width: '1px',
}

const MenuItem = ({item}) => {

  const [current, setCurrent] = useState(false);
  const [expanded, setExpanded] = useState(false);

  function toggleExpand() {
    setExpanded(expanded ? false : true)
  }

  // Replace WP admin url with front-end url
  let URL = GeneralFunc.convertURLs(item.url);
  // Set defaults
  let children = (item.children != undefined && item.children.length ? item.children : null);
  let list_attr = {
    onMouseOver: () => setExpanded(true),
    onMouseOut: () => setExpanded(false)
  }
  let attr = {
    'aria-haspopup': (children != null ? "true" : "false")
  }

  if (children != null) {
    attr['aria-expanded'] = expanded.toString();
  }

  if (item.target) {
    attr.target = item.target;
    attr.title = item.attr;
  }

  useEffect(() => {
    let full_url = window.location.protocol+'//'+window.location.host+window.location.pathname;
    let path_url = window.location.pathname;
    if (full_url == URL || path_url == URL) {
      setCurrent(true);
    }
  });

  return <li className={"nav__menu-item" + (expanded ? " nav__menu-item--open" : "")} {...list_attr} onClick={() => toggleExpand()}>
    {(item.description ? <span className="nav__menu-desc">{item.description}</span> : null)}
    <a className="nav__menu-link" href={URL} {...attr}>{decode(item.title)}{(current ? <span style={screen_reader_class}>(current)</span> : null)}</a>
    {children != null ? <Menu items={children}/> : null}
  </li>
}

const Menu = ({items = []}) => {
  return <ul className="nav__menu-list">
    {items.map((item, i) => {
      return <MenuItem key={i} item={item}/>
    })}
  </ul>
}

export default class Nav extends React.Component {

	constructor(props) {
		super(props);
		
    this.state = {
			expanded: false
		}
	}

	render() {

    return (
      <nav className="nav">
        <button className="nav__button" type="button" aria-controls="navbarSupportedContent" aria-expanded={this.state.expanded.toString()} onClick={() => this.setState({expanded: (this.state.expanded ? false : true)})}>
          <span style={screen_reader_class}>Menu</span>
          <ion-icon name="menu"></ion-icon>
        </button>
        <div className={"nav__menu" + (this.state.expanded ? " nav__menu--open" : "")} id="navbarSupportedContent">
          <Menu items={this.props.menu}/>
        </div>
      </nav>
    )
  }
}