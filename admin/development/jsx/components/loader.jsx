import React from 'react';

export default class Loader extends React.PureComponent { 

  render() {
    return (
      <div className="ui-loader">
        <div className="item-1"></div>
        <div className="item-2"></div>
        <div className="item-3"></div>
        <div className="item-4"></div>
        <div className="item-5"></div>
      </div>
    )
  }
}

