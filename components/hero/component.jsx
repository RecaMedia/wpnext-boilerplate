import React from 'react';

export default class Hero extends React.Component {

	constructor(props) {
    super(props);

    this.state = {
      values: (this.props.values ? this.props.values : {
        hero_caption: "Default Value",
        background_image: "",
      })
    }
  }

	render() {
    return <div className="hero" style={{backgroundImage:'url("'+this.state.values.background_image+'")'}}>
      <div className="hero__content">
        {(this.state.values.hero_content ?
          <div>
            {(this.state.values.hero_content.hero_title ? <h1>{this.state.values.hero_content.hero_title}</h1> : null)}
            {(this.state.values.hero_content.hero_caption ? <p>{this.state.values.hero_content.hero_caption}</p> : null)}
          </div>
        : null)}
      </div>
    </div>;
  }
}