import React from 'react';
import ComponentList from '../util/components';

export default class Builder extends React.Component {

	constructor(props) {
    super(props);

    this.state = {
      build: (this.props.build ? this.props.build : null) 
    }
  }

	render() {
    // Confirm we have the necessary properties prior to moving on
    if (this.state.build != null && this.state.build.hasOwnProperty('order') && this.state.build.hasOwnProperty('data')) {
      return this.state.build.order.map((component_slug, i) => {
        if (ComponentList[component_slug] != undefined) {
          let Component = ComponentList[component_slug];
          let values = this.state.build.data[component_slug][i];
          return <Component key={i} values={values}/>
        }
      });
    } else {
      return null;
    }
  }
}