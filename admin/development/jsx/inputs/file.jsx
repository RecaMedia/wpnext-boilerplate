import React from 'react';
import FileManager from '../components/file-manager';

export default class InputFile extends React.Component {

  constructor(props) {
    super(props);

    this._showDialog = this._showDialog.bind(this);
    this._onChange = this._onChange.bind(this);
    
		this.state = {
      value: this.props.value
		}
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let temp_state = prevState;
    temp_state.value = nextProps.value;
    return temp_state;
  }

  _showDialog() {
    FileManager().then((attachment) => {
      this._onChange(attachment.url);
    });
  }

  _onChange(value) {
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

    let button_name = "Select File...";
    if (this.state.value) {
      button_name = this.state.value.replace(/^.*[\\\/]/, '');
    }

    return (
      <div>
        <div id="InputFileSelector" className="ui-file-input">
          {(this.state.value ? <a className="btn ui-btn--icon ui-file-input__remove-btn" onClick={() => this._onChange("")}></a> : null)}
          <div id="InputFileButton" className="btn ui-btn" onClick={() => this._showDialog()}>{button_name}</div>
          <input type="text" className="form-control" value={this.state.value} onChange={this._onChange} disabled/>
        </div>
      </div>
    );
  }
}

