import React from 'react';

export default class InputTextarea extends React.Component {

  constructor(props) {
    super(props);

    this._onChange = this._onChange.bind(this);
    
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

  _onChange(e) {
    let return_data
    let value = e.target.value;
 
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
      <div className="form-group">
        <textarea className="form-control" rows="4" value={this.state.value} onChange={this._onChange}/>
      </div>
    );
  }
}

