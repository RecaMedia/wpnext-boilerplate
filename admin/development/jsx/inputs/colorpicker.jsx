import React from 'react';
import Curtain from '../components/curtain';
import { SketchPicker } from 'react-color';

export default class InputColorPicker extends React.Component {

  constructor(props) {
    super(props);
    
    this._onToggle = this._onToggle.bind(this);
    this._onChange = this._onChange.bind(this);

    let rgb = {
      r: 255,
      g: 255,
      b: 255,
      a: 1
    };

    if (this.props.value != null) {
      let regex1 = /rgba\(/gi;
      let regex2 = /\)/gi;

      let raw = this.props.value;
      raw = raw.replace(regex1, '');
      raw = raw.replace(regex2, '');

      let raw_array = raw.split(',');
      rgb = {
        r: raw_array[0],
        g: raw_array[1],
        b: raw_array[2],
        a: raw_array[3]
      };
    }

		this.state = {
      rgb,
      value: this.props.value,
      showPicker: false
		}
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let temp_state = prevState;
    temp_state.value = nextProps.value;

    if (nextProps.value != null && nextProps.value != "") {
      let regex1 = /rgba\(/gi;
      let regex2 = /\)/gi;

      let raw = nextProps.value;
      raw = raw.replace(regex1, '');
      raw = raw.replace(regex2, '');

      let raw_array = raw.split(',');
      let rgb = {
        r: raw_array[0],
        g: raw_array[1],
        b: raw_array[2],
        a: raw_array[3]
      };

      temp_state.rgb = rgb;
    } else { 
      temp_state.rgb = {
        r: 255,
        g: 255,
        b: 255,
        a: 1
      };
    }

    return temp_state;
  }

  _onToggle() {
    this.setState({
      showPicker: (this.state.showPicker?false:true)
    })
  }

  _onChange(color, e) {
    let return_data;
    let {r,g,b,a} = color.rgb;
    let value = 'rgba('+r+','+g+','+b+','+a+')';

    if (this.props.useKey) {
      return_data = {};
      return_data[this.props.inputKey] = value;
    } else {
      return_data = value;
    }

    this.setState({
      rgb: color.rgb
    })
    
    if (typeof this.props.returnValue === 'function') {
      this.props.returnValue(return_data);
    }
  }

  render() {
    
    let backgroundColor;
    if (this.state.rgb!=undefined) {
      let {r,g,b,a} = this.state.rgb;
      backgroundColor = 'rgba('+r+','+g+','+b+','+a+')';
    } else {
      backgroundColor = this.state.hex;
    }

    let style = {
      backgroundColor
    }

    return (
      <div className="ui-colorpicker">
        <Curtain show={this.state.showPicker} toggle={this._onToggle}>
          <SketchPicker className="ui-colorpicker__input" color={(this.state.rgb!=undefined?this.state.rgb:this.state.hex)} onChange={this._onChange}/>
        </Curtain>
        <button className="ui-colorpicker__button" style={style} onClick={this._onToggle}></button>
        <input className="ui-colorpicker__text form-control" type="text" value={this.state.value} disabled/>
      </div>
    );
  }
}

