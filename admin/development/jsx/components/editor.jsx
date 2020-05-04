import React from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/css';
import 'brace/mode/sass';
import 'brace/mode/scss';
import 'brace/mode/javascript';
import 'brace/mode/json';
import 'brace/mode/html';

import 'brace/theme/xcode';
import 'brace/theme/monokai';

export default class Editor extends React.Component {
  constructor(props) {
    super(props);

    this._onLoad = this._onLoad.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onCursorChange = this._onCursorChange.bind(this);
    this._replace = this._replace.bind(this);
    this._buildPrints = this._buildPrints.bind(this);
    this._processInserts = this._processInserts.bind(this);
    this._toggleShortcode = this._toggleShortcode.bind(this);

    let code = 'Loading...';
    if (this.props.code != undefined) {
      code = this.props.code;
    }

    this.state = {
      leaveBlank: (this.props.leaveBlank != undefined ? this.props.leaveBlank : false),
      editor: null,
      selection: null,
      code,
      component: (this.props.component==undefined?{}:this.props.component),
      showShortcodes: false
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let temp_state = Object.assign({}, prevState);
    if (nextProps.code != undefined) {
      temp_state.code = nextProps.code;
    }
    temp_state.component = (nextProps.component==undefined?{}:nextProps.component);
    return temp_state;
  }

  componentDidMount() {
    // if ((this.state.code == undefined || this.state.code.trim().length == 0) && !this.state.leaveBlank) {
    //   MakeCall.api("components/codesample/"+this.props.mode+"/").then((response) => {
    //     if (response.success) {
    //       this.setState({
    //         code: response.code
    //       }, () => {
    //         this._onChange(response.code, null);
    //       })
    //     }
    //   });
    // }
  }

  _onLoad(editor) {
    this.setState({
      editor
    });
  }

  _onChange(code, e) {
    if (typeof this.props.onChange === 'function') {
			this.props.onChange(code);
		}
  }

  _onCursorChange(selection, e) {
    let start = {
      column: selection.selectionAnchor.column,
      row: selection.selectionAnchor.row
    }
    let end = {
      column: selection.selectionLead.column,
      row: selection.selectionLead.row
    }
    let select;
    if (start.row > end.row || (start.column > end.column && start.row == end.row)) {
      select = {
        start: end,
        end: start
      }
    } else {
      select = {
        start,
        end
      }
    }
    this.setState({
      selection: select
    })
  }

  _replace(print) {
    if (this.state.selection != null) {
      this.state.editor.session.replace(this.state.selection, print);
    }
  }

  _buildPrints(fields, parent = false, path = false) {

    let _self = this;

    function returnFieldData(name, value) {
      
      let regex = /(childField\.)/g;
      let found = name.match(regex);
      let pre_name = "[JDMS_field.";
      let desc_name = name;
      
      if (found != null) {
        pre_name = "";
        desc_name = parent + " -> " + name;
      } else {
        name = name + "]";
      }

      if (Array.isArray(value)) {
        let print = '{% for childField in [JDMS_field.' + name + ' %}'+"\n"+'{% endfor %}';
        return {
          name: desc_name,
          print
        }
      } else if (typeof value === 'object') {
        return {
          name: desc_name,
          print: '{{ ' + pre_name + name + ' }}'
        };
      } else {
        return {
          name: desc_name,
          print: '{{ ' + pre_name + name + ' }}'
        };
      }
    }

    let inserts = [];
    const keys = Object.keys(fields);

    keys.map((key) => {
      const parent_field = fields[key];
      const parent_name = (parent_field.title!=""?parent_field.title:"field"+key);
      const full_path = (!path ? "" : path + ".") + parent_name;
      const form_keys = Object.keys(parent_field.form);

      form_keys.map((sub_key) => {
        let child_field = parent_field.form[sub_key];
        let array_full_path = (Array.isArray(child_field.value) ? "childField" : full_path);

        if ('options' in child_field && 'fields' in child_field.options) {
          inserts.push(returnFieldData(full_path, child_field.value));
          let sub_array = this._buildPrints(child_field.options.fields, parent_name, array_full_path);
          inserts = inserts.concat(sub_array); 
        } else {
          inserts.push(returnFieldData(full_path, child_field.value));
        }
      });
    });

    return inserts;
  }

  _processInserts() {
    if (this.state.component.hasOwnProperty("fields")) {
      return this._buildPrints(this.state.component.fields, false);
    } else {
      return [];
    }
  }

  _toggleShortcode(showShortcodes) {
    this.setState({showShortcodes});
  }

  render() {
    const inserts = this._processInserts();

    return (
      <div>
        <div className="ui-editor">
          <div className="ui-editor__title-bar">
            <div className="ui-editor__title">
              Editor: <span>{this.props.mode}</span>
            </div>
            <div className="ui-editor__insert-list">
              <div className="ui-editor__inserts">
                {
                  inserts.map((insert, i) => {
                    return <button key={i} className="ui-editor__insert-btn" onClick={() => this._replace(insert.print)}>{insert.name}</button>
                  })
                }
              </div>
            </div>
          </div>
          <AceEditor
            mode={this.props.mode}
            theme={(this.props.theme=="light"?"xcode":"monokai")}
            onLoad={this._onLoad}
            value={this.state.code}
            onChange={this._onChange}
            onCursorChange={this._onCursorChange}
            name={this.props.id}
            editorProps={{$blockScrolling: true}}
            height={this.props.height}
            width={this.props.width}
            fontSize="12px"
          />
        </div>
      </div>
    );
  }
}