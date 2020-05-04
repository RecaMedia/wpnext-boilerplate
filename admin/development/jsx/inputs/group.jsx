import React from 'react';
import UIField from '../components/ui-field';

export default class InputGroup extends React.Component {

  constructor(props) {
    super(props);

    this._updateFieldfromInput = this._updateFieldfromInput.bind(this);
    this._buildList = this._buildList.bind(this);
    this._onChange = this._onChange.bind(this);
    
		this.state = {
      options: this.props.options,
      value: this.props.value
		}
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let temp_state = prevState;
    temp_state.value = nextProps.value;
    return temp_state;
  }

  _updateFieldfromInput(item_index, field, data) {
    // Create data object
    let return_value = {}
    return_value[field] = data;
    // Clone returnJSON object with data
    let value = Object.assign({}, this.state.value, return_value);
    
    this._onChange(value);
  }

  _buildList() {
    let list = null;
    
    if (this.state.options.fields.length) {
      list = this.state.options.fields.map((field, i) => {
        let values = this.state.value[field.title];
        return <div key={i} className={"ui-input " + field.meta.ui_size}>
          <UIField field={field} values={values} updateFieldfromInput={(field, data) => this._updateFieldfromInput(i, field, data)}/>
        </div>
      })
    } else {
      list = <div className="ui-repeater__message">You have no items here ¯\_(ツ)_/¯</div>
    }

    return list;
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
      <div className="ui-group row">
        {this._buildList()}
      </div>
    );
  }
}

