import React from 'react';
import { v4 as uuidv4 } from 'uuid';

export default class Input extends React.Component {

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);

    let type = (this.props.type ? this.props.type : "text");
    let name = (this.props.name ? this.props.name : "input");
    let UID = type + "_" + name;

    this.state = {
      UID,
      type,
      label: (this.props.label ? this.props.label : "Text"),
      name,
      help: (this.props.help ? this.props.help : null),
      required: (this.props.required ? this.props.required : false),
      value: (this.props.value ? this.props.value : "")
		}
	}
	
	static getDerivedStateFromProps(nextProps, prevState) {
    let temp_state = prevState;
    temp_state.value = (nextProps.value ? nextProps.value : "");
    return temp_state;
  }

  onChange(e) {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(e);
    }
  }

	render() {

    let helpID = "";
    let attr = {
      id: this.state.UID,
      name: this.state.name,
      type: this.state.type,
      "aria-label": this.state.label,
      "aria-required": this.state.required.toString(),
      required: this.state.required
    }

    if (this.state.type == "checkbox") {
      attr.checked = this.state.value;
    } else {
      attr.value = this.state.value;
    }

    if (this.state.help != null) {
      helpID = "help_" + this.state.UID;
      attr["aria-describedby"] = helpID;
    }

    return (
      <div className={"form__input form__input--" + this.state.type}>
        <label htmlFor={this.state.UID}>{this.state.label}</label>
        <span data-value={this.state.value}><input {...attr} onChange={this.onChange}/></span>
        {(this.state.help != null ? <small id={helpID}>{this.state.help}</small> : null)}
      </div>
    )
  }
}