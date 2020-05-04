import React from 'react';

export default class Curtain extends React.Component { 

  constructor(props) {
    super(props);

    this._toggle = this._toggle.bind(this);

    this.state = {
      show: (this.props.show == undefined ? false : this.props.show)
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let temp_state = Object.assign({}, prevState);
    if (nextProps.show != undefined) {
      temp_state.show = nextProps.show;
    }
    return temp_state;
  }

  _toggle(e) {
    if (e.target.className == "ui-curtain__content" || e.target.className == "ui-curtain ui-curtain--show") {
      if (typeof this.props.toggle === 'function') {
        if (this.state.show) {
          this.props.toggle(false);
        } else {
          this.props.toggle(true);
        }
      }
    }
  }

  render() {
    return (
      <div className={"ui-curtain" + (this.state.show ? " ui-curtain--show" : "")} onClick={this._toggle}>
        <div className="ui-curtain__content">
          {this.props.children}
        </div>
      </div>
    )
  }
}

