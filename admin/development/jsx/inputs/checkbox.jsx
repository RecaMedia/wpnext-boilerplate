import React from 'react';

export default class InputCheckbox extends React.Component {

  constructor(props) {
    super(props);

    this._onChange = this._onChange.bind(this);
    this._processValue = this._processValue.bind(this);
    
		this.state = {
      value: (this.props.value ? this.props.value : false)
		}
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let temp_state = prevState;
    temp_state.value = nextProps.value;
    return temp_state;
  }

  componentDidMount() {
    this._processValue(this.state.value);
  }

  _onChange(e) {
    let value = e.target.checked;
    this._processValue(value);
  }

  _processValue(value) {
    let return_data

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

    let unique_epoch_id = "checkbox_" + (new Date().valueOf()) + "-" + this.props.index;

    return (
      <div className="form-check">
        <input className="form-check-input" type="checkbox" id ={unique_epoch_id} onChange={this._onChange} checked={this.state.value} />
        <label className="form-check-label" htmlFor={unique_epoch_id}>{(this.state.value ? "Yes" : "No")}</label>
      </div>
    );
  }
}