import React from 'react';
import Editor from '../components/editor';

export default class InputCode extends React.Component {

  constructor(props) {
    super(props);

    this._onChange = this._onChange.bind(this);
    
		this.state = {
      value: this.props.value
		}
  }

  _onChange(value) {
    let return_data;
 
    if (this.props.useKey) {
      return_data = {};
      return_data[this.props.inputKey] = value;
    } else {
      return_data = value;
    }

    this.setState({value});
    
    if (typeof this.props.returnValue === 'function') {
      this.props.returnValue(return_data);
    }
  }

  render() {
    return (
      <Editor mode="html" width="100%" height="160px" theme="light" code={this.state.value} component={{fields:[]}} componentSlug={""} onChange={(code) => this._onChange(code)} leaveBlank={true}/>
    );
  }
}

