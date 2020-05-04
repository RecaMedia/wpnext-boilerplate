import React from 'react';

export default class InputHidden extends React.Component {

  constructor(props) {
    super(props);

    this._returnValue = this._returnValue.bind(this);
    
		this.state = {
      value: this.props.value
		}
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let temp_state = prevState;
    if (nextProps.value != null) {
      temp_state.value = nextProps.value;
      return temp_state;
    } else {
      return null;
    }
  }
  
  componentDidMount() {
    // Return the default value without any interactions from user
    this._returnValue(this.state.value)
  }

  _returnValue(value) {
    let return_data;

    if (this.props.useKey) {
      return_data = {};
      return_data[this.props.inputKey] = value;
    } else {
      return_data = value;
    }
    
    if (typeof this.props.returnValue === 'function') {
      this.props.returnValue(return_data);
    }
  }

  render() {
    return (
      <input type="hidden" className="form-control" value={this.state.value}/>
    );
  }
}

