import React from 'react';

export default class InputSelect extends React.Component {

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
        return <option key={i} value={item.value}>{item.name}</option>
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
      <div className="form-group">
        <select className="form-control" value={this.state.value} onChange={this._onChange}>
          {this._buildList()}
        </select>
      </div>
    );
  }
}