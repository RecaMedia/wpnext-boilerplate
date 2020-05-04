import React from 'react';
// More info can be found here - https://github.com/stripe/react-stripe-elements
import { StripeProvider, Elements, injectStripe, CardNumberElement, CardExpiryElement, CardCvcElement } from 'react-stripe-elements';
import Input from './form/input';

class CardForm extends React.Component {

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.setRef = this.setRef.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.cardElement = null;

    this.state = {
      form: {
        values: {
          full_name: "",
          address: "",
          address2: "",
          city: "",
          region: "",
          postal_code: ""
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

  setRef(type, ele) {
    switch(type) {
      case "number" :
        this.cardNum = ele;
      break;
      case "exp" :
        this.cardExp = ele;
      break;
      case "cvc" :
        this.cardCvc = ele;
      break;
    }
  }

  handleSubmit(e) {
    // We don't want to let default form submission happen here, which would refresh the page.
    e.preventDefault();

    // Create stripe payment source
    this.props.stripe.createSource({
      type: 'card',
      owner: {
        name: this.state.form.values.full_name,
        address: {
          line1: this.state.form.values.address,
          line2: this.state.form.values.address2,
          city: this.state.form.values.city,
          state: this.state.form.values.region,
          postal_code: this.state.form.values.postal_code,
        }
      }
    }).then((result) => {
      if (result.error) {
        // Handle error
        console.log(result.error.message);
      } else {
        // Clear card info
        this.cardNum.clear();
        this.cardExp.clear();
        this.cardCvc.clear();
        // Use payment source id
        console.log(result.source.id);
      }
    });
  }

  render() {

    return (
      <form className="form" onSubmit={this.handleSubmit}>
        <fieldset>
          <legend>Stripe Payment Source Form</legend>
          <Input name="full_name" label="Full Name" type="text" value={this.state.form.values.full_name} onChange={(e) => this.onChange('full_name', e.target.value)} required={true}/>
          <Input name="address" label="Address" type="text" value={this.state.form.values.address} onChange={(e) => this.onChange('address', e.target.value)} required={true}/>
          <Input name="address2" label="Address 2" type="text" value={this.state.form.values.address2} onChange={(e) => this.onChange('address2', e.target.value)} required={true}/>
          <Input name="city" label="City" type="text" value={this.state.form.values.city} onChange={(e) => this.onChange('city', e.target.value)} required={true}/>
          <Input name="region" label="Region" type="text" value={this.state.form.values.region} onChange={(e) => this.onChange('region', e.target.value)} required={true}/>
          <Input name="postal_code" label="Postal Code" type="text" value={this.state.form.values.postal_code} onChange={(e) => this.onChange('postal_code', e.target.value)} required={true}/>

          <div className="form__card form__card--wrapper">
            <label htmlFor="CardInfo">Card Information</label>
            <div id="CardInfo" className="form__card">
              <CardNumberElement className="form__card__number" onReady={(e) => this.setRef('number', e)}/>
              <CardExpiryElement className="form__card__exp" onReady={(e) => this.setRef('exp', e)}/>
              <CardCvcElement className="form__card__cvc" onReady={(e) => this.setRef('cvc', e)}/>
            </div>
          </div>
          <button className="form__button" type="submit">Add Card</button>
        </fieldset>
      </form>
    );
  }
}

const StripeInjectedForm = injectStripe(CardForm);

class StripeCardForm extends React.Component {

	constructor(props) {
    super(props);
    
    const dev = process.env.NODE_ENV == "development" ? true : false;

    if (dev) {
      this.publishable_key = 'pk_test_************************';
    } else {
      this.publishable_key = 'pk_live_************************';
    }

    this.state = {
      form: null
    }
  }

  componentDidMount() {
    // StripeProvider uses "window" var which is only available once the component has been mounted
    let form = <StripeProvider apiKey={this.publishable_key}>
      <Elements>
        <StripeInjectedForm/>
      </Elements>
    </StripeProvider>

    this.setState({form});
  }

	render() {
		return this.state.form;
	}
}

export default StripeCardForm;