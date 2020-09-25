import React from 'react';
import {
  SortableContainer,
  SortableElement,
  arrayMove
} from 'react-sortable-hoc';
import UIField from '../components/ui-field';

const SortableItem = SortableElement(({itemIndex, fields, item, updateCallback, removeItem}) => {
  return <div key={itemIndex} className="ui-repeater__row row">
    {
      fields.map((field, i) => {
        let values = item[field.title];
        return <div key={i} className={"ui-input " + field.meta.ui_size}>
          <UIField field={field} values={values} updateFieldfromInput={(field, data) => updateCallback(itemIndex, field, data)}/>
        </div>
      })
    }
    <a id="RemoveRepeaterItem" className="btn btn-light ui-btn--icon ui-repeater__remove-btn" onClick={() => removeItem(itemIndex)}>
      <i className="icon ion-md-remove"></i>
    </a>
  </div>
});

const SortableList = SortableContainer(({value, fields, updateCallback, removeItem}) => {

  return <div className="container">
    {
      value.map((item, item_index) => {
        return <SortableItem key={`item-${item_index}`} index={item_index} itemIndex={item_index} fields={fields} item={item} updateCallback={updateCallback} removeItem={removeItem}/>
      })
    }
  </div>;
});

export default class InputRepeater extends React.Component {

  constructor(props) {
    super(props);

    this._shouldCancelStart = this._shouldCancelStart.bind(this);
    this._updateFieldfromInput = this._updateFieldfromInput.bind(this);
    this._buildList = this._buildList.bind(this);
    this._removeItem = this._removeItem.bind(this);
    this._addItem = this._addItem.bind(this);
    this._onSortEnd = this._onSortEnd.bind(this);
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

  _shouldCancelStart(e) {
    // Cancel sorting if the event target is an `input`, `textarea`, `select` or `option`
    if (
      e.target.id === "InputFileSelector" ||
      e.target.id === "InputFileButton" ||
      e.target.id === "RemoveRepeaterItem" ||
      e.target.tagName.toLowerCase() === "input" ||
      e.target.tagName.toLowerCase() === "textarea" ||
      e.target.tagName.toLowerCase() === "select" ||
      e.target.tagName.toLowerCase() === "option" ||
      e.target.tagName.toLowerCase() === "button" ||
      e.target.tagName.toLowerCase() === "a"
    ) {
      return true; // Return true to cancel sorting
    }
  }

  _updateFieldfromInput(item_index, field, data) {
    // Clone returnJSON object
    let value = Array.from(this.state.value);
    // Update correct field
    value[item_index][field] = data;

    this._onChange(value);
  }

  _buildList() {
    let list = null;
    
    if (this.state.value.length) {
      list = <SortableList value={this.state.value} fields={this.state.options.fields} updateCallback={this._updateFieldfromInput} removeItem={this._removeItem} onSortEnd={this._onSortEnd} shouldCancelStart={this._shouldCancelStart}/>
    } else {
      list = <div className="ui-repeater__message">You have no items here ¯\_(ツ)_/¯</div>
    }

    return list;
  }

  _removeItem(item_index) {
    let value = Array.from(this.state.value);

    if (value.length == 1) {
      value = [];
    } else {
      value.splice(item_index, 1)
    }

    this._onChange(value);
  }

  _addItem() {
    let value = Array.from(this.state.value);
    let data = {};

    this.state.options.fields.map((field, i) => {
      console.log(field);
      let keys = Object.keys(field.form);
      let key_value;
      if (keys.length == 1) {
        key_value = field.form[keys[0]].value;
      } else {
        key_value = {};
        keys.map((key, i) => {
          key_value[key] = field.form[key].value;
        })
      }
      data[field.title] = key_value;
    });
    
    value.push(data);

    this._onChange(value);
  }

  _onSortEnd({oldIndex, newIndex}) {
    let value = arrayMove(this.state.value, oldIndex, newIndex);
    this._onChange(value);
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
      <div className="ui-repeater">
        {this._buildList()}
        <a className="btn ui-btn ui-btn--icon ui-repeater__add-btn" onClick={() => this._addItem()}><i className="icon ion-md-add"></i></a>
      </div>
    );
  }
}