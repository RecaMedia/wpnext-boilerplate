import React from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal)

class Dropdown extends React.PureComponent {

  constructor(props) {
    super(props);

    this._handleSend = this._handleSend.bind(this);
    this._getOptions = this._getOptions.bind(this);

    this.state = {
      defaultValue: "",
      newfields: this.props.newfields,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let temp_state = prevState;
    temp_state.newfields = nextProps.newfields;
    return temp_state;
  }

  _handleSend (e) {
    let _self = this;
    let value = e.target.value;

    function update(type, defaultValue, gotoJSON) {
      _self.setState({defaultValue}, () => {
        if (typeof _self.props.sendSelection === 'function') {
          _self.props.sendSelection(type, _self.props.currentField, gotoJSON);
        }
      });
    }

    if (value == "ignore") {
      update("ignore", value, null);
    } else if (value == "remove") {
      update("remove", value, null);
    } else {
      // Parse JSON string
      let valueJSON = JSON.parse(value);
      // Compare value type
      if (valueJSON.valueType === this.props.currentField.valueType) {
        update("update", JSON.stringify(valueJSON), valueJSON);
      } else {
        MySwal.fire({
          title: "Invalid Value Match",
          text: "Value type does not match.",
          showCloseButton: true
        })
      }
    }
  }

  _getOptions(options, parent_pathname = null, parent_slug = null) {
    return options.map((field, i) => {
      let option_name = (parent_pathname != null ? parent_pathname + " -> " : "") + (field.slug + " (" + field.valueType + ")");
      let objectPath = (parent_slug != null ? parent_slug + "." : "") + field.slug;      
      if (field.children != null) {
        return this._getOptions(field.children, option_name, field.slug);
      } else {
        return <option key={i} value={JSON.stringify({slug:field.slug,objectPath,valueType:field.valueType})}>{option_name}</option>;
      }
    })
  }

  render() {
    return (
      <div className="form-group">
        <select className="form-control" onChange={this._handleSend} value={this.state.defaultValue}>
          <option value="">Select Field</option>
          {this._getOptions(this.state.newfields)}
          <option value="ignore">Ignore this value</option>
          <option value="remove">Remove this value</option>
        </select>
      </div>
    )
  }
}

export default class SyncFields extends React.PureComponent {

  constructor(props) {
    super(props);

    this._buildOptions = this._buildOptions.bind(this);
    this._handleSelection = this._handleSelection.bind(this);
    this._handleUpdate = this._handleUpdate.bind(this);

    this.state = {
      sent: false,
      componentIndex: this.props.componentIndex,
      componentData: this.props.componentData,
      availableFields: this.props.availableFields,
      updatedData: null,
      ignoredData: null,
      current_fields: [],
      new_fields: []
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let temp_state = prevState;
    temp_state.componentIndex = nextProps.componentIndex;
    temp_state.availableFields = nextProps.availableFields;
    temp_state.componentData = nextProps.componentData;
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
    let current_fields = [];
    
    // Replicated logic from components/editor.jsx
    function getAllFields(fields, parent_name = false) {
      if (fields != null) {
        let new_fields = [];
        Object.keys(fields).map((field, i) => {

          let field_json = fields[field];
          let field_name = field_json.title!=""?field_json.title:"field"+i;

          Object.keys(field_json.form).map((sub_key) => {
            let child_field = field_json.form[sub_key];
            if ('options' in child_field && child_field.options != null && 'fields' in child_field.options) {

              let children = getAllFields(child_field.options.fields, field_name);
              let new_sub_fields = [];

              new_sub_fields.push({
                slug: field_name,
                children,
                valueType: typeof child_field.value
              });

              new_fields = new_fields.concat(new_sub_fields); 
            } else {
              let value = child_field.value;
              new_fields.push({
                slug: field_name,
                children: null,
                valueType: typeof value
              });
            }
          });
        });
        return new_fields;
      }
    }

    if (this.state.componentData != null) {
      Object.keys(this.state.componentData).map((field_name) => {
        let value = this.state.componentData[field_name];
        current_fields.push({
          slug: field_name,
          value,
          valueType: typeof value
        });
      });
    }

    let new_fields = getAllFields(this.state.availableFields);

    this.setState({
      current_fields,
      new_fields
    })
  }

  _handleSelection(action, originalJSON, gotoJSON) {
    
    let updatedData;
    let ignoredData;

    if (this.state.updatedData == null) {
      updatedData = Object.assign({}, this.state.componentData);
    } else {
      updatedData = Object.assign({}, this.state.updatedData);
    }

    if (this.state.ignoredData == null) {
      ignoredData = {};
    } else {
      ignoredData = Object.assign({}, this.state.ignoredData);
    }

    // Check if gotoJSON is null. This can happen when modifying the component field order while previously containing values
    if (gotoJSON != null) {
      // Where updating updatedData object to include where the original data is being moved to
      // Use the objectPath string to create an array in reverse which will allow for creation of the object containing the proper value
      let path_list = gotoJSON.objectPath.split(".").reverse();
      // Check if array contains more than one item
      if (path_list.length > 1) {
        // Temporary object that will be used within the loop
        let temp_obj = {};
        // Get last index to determine when loop is coming to an end
        let last_index = path_list.length - 1;
        // Loop through path list
        path_list.map((slug,i) => {
          // Check if this is the first slug
          if (i == 0) {
            // Create the last child as the first object with the correct value
            temp_obj[slug] = originalJSON.value;
          } else if (i == last_index) {
            // If last index use slug within updatedData object
            if (updatedData[slug] != undefined) {
              updatedData[slug] = Object.assign({}, updatedData[slug], temp_obj);
            } else {
              updatedData[slug] = temp_obj;
            }
          } else {
            // Create a parent object
            let parent_temp_obj = {};
            // Use current key as parent which has child as value
            parent_temp_obj[slug] = temp_obj;
            // Make original object the parent, as this will continue to be used within the loop
            temp_obj = parent_temp_obj;
          }
        });
      } else {
        updatedData[gotoJSON.slug] = originalJSON.value;
      }
      
      ignoredData[originalJSON.slug] = originalJSON.value;

      delete updatedData[originalJSON.slug];
    }

    this.setState({
      updatedData,
      ignoredData
    });
  }

  _handleUpdate() {
    if (typeof this.props.sendBackComponentData === 'function') {
      this.setState({
        sent: true
      }, () => {
        this.props.sendBackComponentData(this.state.updatedData, this.state.ignoredData);
      });
    }
  }

  render() {

    return (
      <div className="ui-card ui-card--alt ui-sync-components">
        <h5>Fields are not synced!</h5>
        <p>Your fields have been reordered or removed from the Post Type.</p>
        <p>Please choose how you would like the data to be handled below:</p>
        <ul className="list-group">
          {
            this.state.current_fields.map((field, i) => {
              return <li key={i} className="list-group-item">
                <div className="row">
                  <div className="col-6">
                    <input type="text" className="form-control" value={field.slug + " (" + field.valueType + ")"} disabled/>
                  </div>
                  <div className="col-6">
                    <Dropdown currentField={field} newfields={this.state.new_fields} sendSelection={this._handleSelection}/>
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

