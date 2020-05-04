import React from 'react';
import GeneralFunctions from '../utilities/general-functions';

import InputCheckbox from '../inputs/checkbox';
import InputColorPicker from '../inputs/colorpicker';
import InputDate from '../inputs/date';
import InputEditor from '../inputs/editor';
import InputGroup from '../inputs/group';
import InputText from '../inputs/text';
import InputRadio from '../inputs/radio';
import InputSelect from '../inputs/select';
import InputTextarea from '../inputs/textarea';
import InputFile from '../inputs/file';
import InputCode from '../inputs/code';
import InputHidden from '../inputs/hidden';

export default class UIField extends React.Component {

  constructor(props) {
    super(props);

    this._handleValue = this._handleValue.bind(this);
    
		this.state = {
      field: this.props.field,
      values: this.props.values
		}
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let temp_state = prevState;
    temp_state.field = nextProps.field;
    temp_state.values = nextProps.values;
    return temp_state;
  }

  _handleValue(input_object) {
    if (typeof this.props.updateFieldfromInput === 'function') {
      this.props.updateFieldfromInput(this.state.field.title, input_object);
    }
  }

  render() {
    // Defaults
    let has_multiple_keys = false;
    let form = this.state.field.form;
    let keys = Object.keys(form);
    let input_classes = [];

    // Check if there are multiple keys
    if (keys.length > 1) {
      has_multiple_keys = true;
    }

    // Build UI
    let ui_fields = <div>
      {
        keys.map((key, i) => {
          let input;
          let value;

          // Set provided data if exist or set value to default
          if (this.state.values != null && form[key].input != "hidden") {
            if (has_multiple_keys) {
              value = this.state.values[key];
            } else {
              value = this.state.values;
            }
          } else {
            // Default value or provided value from hidden field
            value = form[key].value;
          }         

          // Add input type to return as classes on parent element
          // This allows for more precise UI styling, while keeping the structure consistent
          input_classes.push(form[key].input)

          // Set input based on input type
          switch (form[key].input) {
            case "checkbox" :
              input = <InputCheckbox key={i} useKey={has_multiple_keys} index={i} value={value} returnValue={this._handleValue}/>
            break;
            case "colorpicker" :
              input = <InputColorPicker key={i} useKey={has_multiple_keys} index={i} inputKey={key} value={value} returnValue={this._handleValue}/>
            break;
            case "datetime" :
              input = <InputDate key={i} useKey={has_multiple_keys} index={i} inputKey={key} value={value} options={form[key].options} returnValue={this._handleValue}/>
            break;
            case "editor" :
              input = <InputEditor key={i} useKey={has_multiple_keys} index={i} inputKey={key} value={value} options={form[key].options} returnValue={this._handleValue}/>
            break;
            case "group" :
              input = <InputGroup key={i} useKey={has_multiple_keys} index={i} inputKey={key} value={value} options={form[key].options} returnValue={this._handleValue}/>
            break;
            case "text" :
              input = <InputText key={i} useKey={has_multiple_keys} index={i} inputKey={key} value={value} returnValue={this._handleValue}/>
            break;
            case "radio" :
              input = <InputRadio key={i} useKey={has_multiple_keys} index={i} inputKey={key} value={value} options={form[key].options} slug={this.state.field.title} returnValue={this._handleValue}/>
            break;
            case "select" :
              input = <InputSelect key={i} useKey={has_multiple_keys} index={i} inputKey={key} value={value} options={form[key].options} returnValue={this._handleValue}/>
            break;
            case "textarea" :
              input = <InputTextarea key={i} useKey={has_multiple_keys} index={i} inputKey={key} value={value} returnValue={this._handleValue}/>
            break;
            case "file" :
              input = <InputFile key={i} useKey={has_multiple_keys} index={i} inputKey={key} value={value} returnValue={this._handleValue}/>
            break;
            case "code" :
              input = <InputCode key={i} useKey={has_multiple_keys} index={i} inputKey={key} value={value} returnValue={this._handleValue}/>
            break;
            case "hidden" :
              input = <InputHidden key={i} useKey={has_multiple_keys} index={i} inputKey={key} value={value} returnValue={this._handleValue}/>
            break;
          }

          return input;
        })
      }
    </div>;

    let ui = null;
    if (this.state.field.title != "") {
      ui = <div className={"ui-fieldtype__group " + input_classes.join(" ")}>
        <label>{GeneralFunctions.underscoresToSpacesAndCaps(this.state.field.title)}</label>
        {ui_fields}
      </div>
    }

    return ui;
  }
}

