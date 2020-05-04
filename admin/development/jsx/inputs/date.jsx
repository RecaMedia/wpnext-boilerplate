import React from 'react';
import DatePicker from "react-datepicker";

export default class InputText extends React.Component {

  constructor(props) {
    super(props);

    this._onChange = this._onChange.bind(this);
    
		this.state = {
      mode: this.props.options.mode,
      value: (this.props.value == "" ? null : new Date(this.props.value))
		}
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let temp_state = prevState;
    temp_state.mode = nextProps.options.mode;
    temp_state.value = (nextProps.value == "" ? null : new Date(nextProps.value));
    return temp_state;
  }

  _onChange(value) {
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
    let input;
    let class_name = "";
    let value = (this.state.value == "" ? null : this.state.value);

    if (this.state.mode == 'both') {
      class_name = "ui-datetime--both";
      input = <DatePicker
        selected={value}
        onChange={this._onChange}
        showTimeSelect
        timeFormat="h:mm aa"
        timeIntervals={15}
        dateFormat="MMMM d, yyyy h:mm aa"
        timeCaption="Time"
      />
    } else if (this.state.mode == 'date') {
      class_name = "ui-datetime--date";
      input = <DatePicker
        selected={value}
        onChange={this._onChange}
      />
    } else if (this.state.mode == 'time') {
      class_name = "ui-datetime--time";
      input = <DatePicker
        selected={value}
        onChange={this._onChange}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        dateFormat="h:mm aa"
        timeCaption="Time"
      />
    }

    return (
      <div className={class_name}>
        {input}
      </div>
    );
  }
}

