import React from 'react';
import Input from './form/input';
import Select from './form/select';
import Textarea from './form/textarea';

class Form extends React.Component {

	constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    
    this.state = {
      form: {
        values: {
          full_name: "",
          email: "",
          phone: "",
          photo: "",
          terms: false,
          my_option: "",
          business: "",
          bio: ""
        }
      }
    }
  }

  onChange(key, value) {
    let temp_obj = {};
    temp_obj[key] = value;

    let form = Object.assign({}, this.state.form, {
      values: Object.assign({}, this.state.form.values, temp_obj)
    });

    this.setState({form});
  }

	render() {

		return (
			<form className="form">
        <fieldset>
          <legend>Test Form</legend>
          <Input name="full_name" label="Full Name" type="text" value={this.state.form.values.full_name} onChange={(e) => this.onChange('full_name', e.target.value)} required={true}/>
          <Input name="email" label="Email" type="email" value={this.state.form.values.email} onChange={(e) => this.onChange('email', e.target.value)} required={true}/>
          <Input name="phone" label="Phone Number" type="tel" value={this.state.form.values.phone} onChange={(e) => this.onChange('phone', e.target.value)} required={true}/>
          <Input name="photo" label="Photo" type="file" value={this.state.form.values.photo} onChange={(e) => this.onChange('photo', e.target.value)} required={true}/>
          <Input name="terms" label="Agree to Terms" type="checkbox" value={this.state.form.values.terms} onChange={(e) => this.onChange('terms', e.target.checked)}/>
          <Input name="my_options" label="Option 1" type="radio" value="One" onChange={(e) => this.onChange('my_option', e.target.value)} required={true}/>
          <Input name="my_options" label="Option 2" type="radio" value="Two" onChange={(e) => this.onChange('my_option', e.target.value)} required={true}/>
          <Select name="business" label="Business" value={this.state.form.values.business} onChange={(e) => this.onChange('business', e.target.value)} options={[
            {
              name: "Select",
              value: ""
            },
            {
              name: "Web Development",
              value: "web"
            },
            {
              name: "Graphic Design",
              value: "graphic"
            },
            {
              name: "Photography",
              value: "photography"
            }
          ]} value="" required={true}/>
          <Textarea name="bio" label="Bio" value={this.state.form.values.bio} onChange={(e) => this.onChange('bio', e.target.value)} required={true}/>
          <button className="form__button" type="submit">Submit</button>
        </fieldset>
      </form>
		)
	}
}

export default Form;