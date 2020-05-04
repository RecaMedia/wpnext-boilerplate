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
    return (
      <div>
        <div className="ui-file-input" onClick={() => this._showDialog()}>
          <div className="btn ui-btn">Select File</div>
          <input type="text" className="form-control" value={this.state.value} onChange={this._onChange} disabled/>
        </div>
      </div>
    );
  }
}

