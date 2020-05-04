import React from 'react';
import ReactDOM from 'react-dom';
import UILayoutBuilder from './components/ui-layout-builder';

export default class PostsEditor extends React.Component {

	constructor(props) {
		super(props);

    this._handleContent = this._handleContent.bind(this);

    this.WPNComponents = document.getElementById('WPNComponents');
    this.WPNData = document.getElementById('WPNPostData');

    let components = (this.WPNComponents.value == "" ? null : JSON.parse(decodeURIComponent(this.WPNComponents.value)));
    let json = (this.WPNData.value == "" ? null : JSON.parse(decodeURIComponent(this.WPNData.value)));
    
		this.state = {
      components,
      json
		}
	}

  _handleContent(json) {
    this.setState({json});
    // update hidden input
    this.WPNData.value = encodeURIComponent(JSON.stringify(json));
  }

  render() {
    let content = "";
    
    if (this.state.components != null) {
      content = <div className="container">
        <div className="row">
          <div className="col-12">
            <UILayoutBuilder json={this.state.json} components={this.state.components} handleContent={this._handleContent}/>
          </div>
        </div>
      </div>
    }
      
    return content;
	}
}

ReactDOM.render(<PostsEditor/>, document.getElementById('WPNextUI'));