import React from 'react';

class Dropdown extends React.PureComponent {

  constructor(props) {
    super(props);

    this._handleSend = this._handleSend.bind(this);

    this.state = {
      defaultValue: "",
      index: this.props.index,
      newComponents: this.props.newComponents,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let temp_state = prevState;
    temp_state.index = nextProps.index;
    temp_state.newComponents = nextProps.newComponents;
    return temp_state;
  }

  _handleSend (e) {
    let comp = null;
    let index = this.state.index;
    let value = e.target.value;
    let action;

    if (value != "" && value != "ignore") {
      action = "add";
      comp = JSON.parse(value);
    } else if (e.target.value == "ignore") {
      action = "ignore";
    } else {
      action = "remove";
    }

    this.setState({defaultValue: value}, () => {
      if (typeof this.props.sendSelection === 'function') {
        this.props.sendSelection(action, index, comp);
      }
    });
  }

  render() {
    return (
      <div className="form-group">
        <select className="form-control" onChange={this._handleSend} value={this.state.defaultValue}>
          <option value="">Select Component</option>
          {
            this.state.newComponents.map((comp, i) => {
              return <option key={i} value={JSON.stringify(comp)}>Component: {comp.slug} | Index: {comp.index}</option>
            })
          }
          <option value="ignore">Ignore this component</option>
        </select>
      </div>
    )
  }
}

export default class SyncComponents extends React.PureComponent {

  constructor(props) {
    super(props);

    this._buildOptions = this._buildOptions.bind(this);
    this._handleSelection = this._handleSelection.bind(this);
    this._handleUpdate = this._handleUpdate.bind(this);

    this.state = {
      sent: false,
      components: this.props.components,
      data: this.props.data,
      current_components: [],
      new_components: [],
      ignored_components: []
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let temp_state = prevState;
    temp_state.components = nextProps.components;
    temp_state.data = nextProps.data;
    return temp_state;
  }

  componentDidMount() {
    this._buildOptions();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.sent) {
      this.setState({
        sent: false
      }, () => {
        this._buildOptions();
      });
    }
  }

  _buildOptions() {
    let current_components = [];
    let new_components = [];

    if (this.state.data != null) {
      Object.keys(this.state.data).map((key) => {
        Object.keys(this.state.data[key]).map((indexKey) => {
          // The first conditional, if "True", does not consider the second conditional since there is an "OR" before it.
          if (this.state.components[indexKey] == undefined || this.state.components[indexKey].slug != key) {
            current_components.push({
              slug: key,
              index: indexKey
            });
          }
        });
      });

      this.state.components.map((component, i) => {
        if (this.state.data[component.slug] != undefined && this.state.data[component.slug][i] == undefined) {
          new_components.push({
            slug: component.slug,
            index: i
          });
        }
      });
    }

    this.setState({
      current_components,
      new_components
    })
  }

  _handleSelection(action, index, comp) {
    let current_components = Array.from(this.state.current_components);
    let ignored_components = Array.from(this.state.ignored_components);

    switch (action) {
      case "add" :
        current_components[index] = Object.assign({}, this.state.current_components[index], {
          to: comp
        });
      break;
      case "ignore" :
        // Set component to ignore
        current_components[index] = Object.assign({}, this.state.current_components[index], {
          ignore: true
        });
        // Default
        let is_on_list = false;
        // Get component currently selected
        let ignored_comp = current_components[index];
        // Check if it's already on the ignore list
        this.state.ignored_components.map((comp) => {
          if (comp.index == index) {
            is_on_list = true;
          }
        });
        // If not, then add
        if (!is_on_list) {
          ignored_components.push(ignored_comp);
        }
      break;
      case "remove" :
        if (current_components[index].hasOwnProperty("to")) {
          delete current_components[index].to;
        }
      break;
    }

    this.setState({
      current_components,
      ignored_components
    });
  }

  _handleUpdate() {
    // Declare data
    let data = Object.assign({}, this.state.data);
    let ignored_data = null;

    // Check if there are ignored components
    if (this.state.ignored_components.length) {

      ignored_data = {};

      // Loop through current components
      this.state.ignored_components.map((comp) => {

        // Create new object to insert data
        let ignored_component_data = {}

        // Create key of "Transfer to" component
        ignored_component_data[comp.slug] = {}

        // Create index within "Transfer to" component, and clone "Transfer from" data into object
        ignored_component_data[comp.slug][comp.index] = Object.assign({}, data[comp.slug][comp.index]);

        // Merge with existing data
        ignored_data = Object.assign({}, ignored_component_data);
      });
    }

    // Loop through current components
    this.state.current_components.map((comp) => {
      
      // Remove "Ignored" components
      if (comp.ignore != undefined && comp.ignore) {
        delete data[comp.slug];
      
      // Work only with comp items that contain the "To" object
      } else if (comp.to != undefined && comp.to != null) {

        // Create new object to insert data
        let new_component_data = {}

        // Create key of "Transfer to" component
        new_component_data[comp.to.slug] = {}

        // Create index within "Transfer to" component, and clone "Transfer from" data into object
        new_component_data[comp.to.slug][comp.to.index] = Object.assign({}, data[comp.slug][comp.index]);

        // Merge with existing data
        data = Object.assign({}, data, new_component_data);
      
        // Delete previous index
        delete data[comp.slug][comp.index];

        // Check if we're dealing with the same component
        if (comp.slug !== comp.to.slug) {
          // If not, check if previous component still has any keys after deletion of index
          if (Object.keys(data[comp.slug]).length == 0) {
            // If 0 keys, then just delete previous component key
            delete data[comp.slug];
          }
        }
      }
    });

    if (typeof this.props.sendBackComponentData === 'function') {
      this.setState({
        sent: true
      }, () => {
        this.props.sendBackComponentData(data, ignored_data)
      });
    }
  }

  render() {

    return (
      <div className="ui-card ui-card--alt ui-sync-components">
        <h5>Components are not synced!</h5>
        <p>Your components have been reordered or removed from the Post Type.</p>
        <p>Please choose how you would like the data to be handled below:</p>
        <ul className="list-group">
          {
            this.state.current_components.map((comp, i) => {
              return <li key={i} className="list-group-item">
                <div className="row">
                  <div className="col-6">
                    <input type="text" className="form-control" value={'Component: '+comp.slug+' | Index: '+comp.index} disabled/>
                  </div>
                  <div className="col-6">
                    <Dropdown index={i} newComponents={this.state.new_components} sendSelection={this._handleSelection}/>
                  </div>
                </div>
              </li>
            })
          }
        </ul>
        <div className="row">
          <div className="col-12 text-right">
            <button className="btn ui-btn" onClick={() => this._handleUpdate()}>Update</button>
          </div>
        </div>
      </div>
    )
  }
}

