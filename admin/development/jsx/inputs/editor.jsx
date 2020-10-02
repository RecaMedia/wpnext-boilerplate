import React from 'react';
import FileManager from '../components/file-manager';
import JoditEditor from "../vendors/jodit-react";
import JoditButtons from "../utilities/jodit_buttons";

export default class InputEditor extends React.Component {

  constructor(props) {
    super(props);
    
    this._onChange = this._onChange.bind(this);

    this.mode = (this.props.options != undefined && this.props.options.hasOwnProperty("mode") ? this.props.options.mode : "slim");

    let buttons;
    switch(this.mode) {
      case "full":
        buttons = JoditButtons.buttons_full
      break;
      case "standard":
        buttons = JoditButtons.buttons_med
      break;
      case "slim":
      default:
        buttons = JoditButtons.buttons_slim
      break;
    }

    this.state = {
      value: this.props.value,
      buttons
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
          buttons: this.state.buttons,
          buttonsMD: JoditButtons.buttons_med,
          buttonsXS: JoditButtons.buttons_slim,
        }}
        onChange={this._onChange}
      />
    );
  }
}