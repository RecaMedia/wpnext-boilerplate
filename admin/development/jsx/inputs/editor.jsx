import React from 'react';
import JoditEditor from "../vendors/jodit-react";

export default class InputEditor extends React.Component {

  constructor(props) {
    super(props);
    
    this._onChange = this._onChange.bind(this);

    this.mode = (this.props.options != undefined && this.props.options.hasOwnProperty("mode") ? this.props.options.mode : "slim");

    let removeButtons;
    switch(this.mode) {
      case "full":
        removeButtons = []
      break;
      case "standard":
        removeButtons = [
          "hr",
          "ol",
          "about",
          "italic",
          "format",
          "fullsize",
          "justify"
        ]
      break;
      case "slim":
      default:
        removeButtons = [
          "hr",
          "ol",
          "about",
          "italic",
          "format",
          "fullsize",
          "justify"
        ]
      break;
    }

    this.state = {
      value: this.props.value,
      removeButtons
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
    
    this.setState({
      value
    }, () => {
      if (typeof this.props.returnValue === 'function') {
        this.props.returnValue(return_data);
      }
    });
  }

  render() {
    // https://xdsoft.net/jodit/v.2/doc/tutorial-uploader-settings.html

    return (
      <JoditEditor
        returnEditor={(editor) => {
          this.editor = editor;
        }}
        value={this.state.value}
        config={{
          removeButtons: this.state.removeButtons
        }}
        onChange={this._onChange}
      />
    );
  }
}