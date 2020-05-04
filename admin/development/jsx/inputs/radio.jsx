import React from 'react';

export default class InputRadio extends React.Component {

  constructor(props) {
    super(props);

    this._buildList = this._buildList.bind(this);
    this._onChange = this._onChange.bind(this);
    this._processValue = this._processValue.bind(this);

    this.epoch = new Date().valueOf();
    
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

  componentDidMount() {
    this._processValue(this.state.value);
  }

  _buildList() {
    let list = null;
    
    if (this.state.options.selections.length) {
      list = this.state.options.selections.map((item, i) => {
        let unique_epoch_id = "radio_" + (new Date().valueOf()) + "-" + this.props.slug + "_" + i;
        let name = this.epoch + "_" + this.props.slug;
        return <div key={i} className="custom-control custom-radio custom-control-inline">
          <input type="radio" id={unique_epoch_id} name={name} className="custom-control-input" value={item.value} onChange={this._onChange} checked={(this.state.value == item.value ? true : false)}/>
          <label className="custom-control-label" htmlFor={unique_epoch_id}>{item.name}</label>
        </div>
      })
    }

    return list;
  }

  _onChange(e) {
    let value = e.target.value;
    this._processValue(value);
  }

  _processValue(value) {
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

    return (
      <div>
        {this._buildList()}
      </div>
    );
  }
}