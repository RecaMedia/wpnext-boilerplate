import React from 'react';
import HeadStatic from '../modules/head-static';
import store from '../redux/store';

class Wrapper extends React.Component {

	constructor(props) {
    super(props);
    
    this.state = {
      cookiesLoaded: false
    }
  }
  
  componentDidUpdate(nextProps, prevState) {
    if (!prevState.cookiesLoaded && nextProps.cookies != null) {
      this.processCookies(nextProps.cookies);
    }
  }

  componentDidMount() {
    if (!this.state.cookiesLoaded && this.props.cookies != null) {
      this.processCookies(this.props.cookies);
    }
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

	render() {
    return <div id="Wrapper">
      <HeadStatic/>
      <div id="App">
        {React.cloneElement(this.props.children, Object.assign({}, this.props, {store}))}
      </div>
    </div>;
	}
}

export default Wrapper;