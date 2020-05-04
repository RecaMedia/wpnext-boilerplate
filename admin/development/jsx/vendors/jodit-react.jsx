import React from 'react';
import PropTypes from 'prop-types';
import brace from 'brace';
import Jodit from 'jodit';
import FileManager from '../components/file-manager';

import 'brace/theme/idle_fingers';

class JoditEditor extends React.Component {

  constructor(props) {
    super(props);
    this.textArea = React.createRef();
  }

  componentDidMount() {

    const blurHandler = value => {
      this.props.onBlur && this.props.onBlur(value)
    };

    const changeHandler = value => {
      this.props.onChange && this.props.onChange(value)
    };

    this.textArea.current = new Jodit(this.textArea.current, Object.assign({}, this.props.config, {
      extraButtons: this._customButtons()
    }));

    this.textArea.current.value = this.props.value;
    this.textArea.current.events.on('blur', () => blurHandler(this.textArea.current.value));
    this.textArea.current.events.on('change', () => changeHandler(this.textArea.current.value));
    this.textArea.current.workplace.tabIndex = this.props.tabIndex || -1;

    // Pass up access to editor
    if (this.props.returnEditor != undefined && typeof this.props.returnEditor === "function") {
      this.props.returnEditor(this.textArea.current);
    }
  }

  _customButtons() {
    let admin_assets = window.location.protocol + "//" + window.location.hostname + "/wp-content/themes/wp-next/assets/";
    
    return [{
      name: 'File Manager',
      iconURL: admin_assets + "img/ionicons-folder.svg",
      exec: (editor) => {
        FileManager().then((attachment) => {
          editor.selection.insertImage(attachment.url, null, "25%");
        });
      }
    }]
  }

  render() {
    return (
      <textarea ref={this.textArea} name={this.props.name}></textarea>
    )
  }
}

JoditEditor.propTypes = {
	value: PropTypes.string,
  tabIndex: PropTypes.number,
	config: PropTypes.object,
	onChange: PropTypes.func,
  onBlur: PropTypes.func,
  dir: PropTypes.string
};

export default JoditEditor