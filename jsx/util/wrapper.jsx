import React from 'react';
import HeadStatic from '../modules/head-static';
import store from '../redux/store';
import apiCall from '../util/api-call';
import preloads from '../includes/image-preloads';

class Wrapper extends React.Component {

	constructor(props) {
    super(props);
    
    this.state = {
      cookiesLoaded: false,
      WPInfo: null,
      preloads
    }
  }
  
  componentDidUpdate(nextProps, prevState) {
    if (!prevState.cookiesLoaded && nextProps.cookies != null) {
      this.processCookies(nextProps.cookies);
    }
  }

  componentDidMount() {
    // Store current page info
    store.dispatch({
      type: "CUR_PAGE",
      page: this.props.response
    });
    // Check for cookies
    if (!this.state.cookiesLoaded && this.props.cookies != null) {
      this.processCookies(this.props.cookies);
    }
    // Get general site info
    apiCall("").then((WPInfo) => {
      store.dispatch({
        type: "WP_INFO",
        WPInfo
      });
      this.setState({WPInfo});
    });
  }

  processCookies(cookies) {
    if (cookies != null) {
      store.dispatch({
        type: "FROM_COOKIES",
        cookies
      });
      this.setState({cookiesLoaded: true});
    }
  }

  /*
  * Script for stripe form - <script src="https://js.stripe.com/v3/"></script>
  */

	render() {
    return <div id="Wrapper">
      <HeadStatic/>
      <div className="preloaded-images">
        {this.state.preloads.map((item,i) => {
          return <img key={i} src={item}/>
        })}
      </div>
      <div id="App">
        {React.cloneElement(this.props.children, Object.assign({}, this.props, {store, WPInfo:this.state.WPInfo}))}
      </div>
      <script src="https://unpkg.com/ionicons@5.0.0/dist/ionicons.js"></script>
    </div>;
	}
}

export default Wrapper;