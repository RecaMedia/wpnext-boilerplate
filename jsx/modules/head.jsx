import React from 'react';
import Head from 'next/head';
import meta from "../util/meta-default";

class HeadMeta extends React.Component {

	constructor(props) {
		super(props);
		
    this.state = {
			render: Object.assign({}, meta, this.props.meta)
		}
	}
	
	static getDerivedStateFromProps(nextProps, prevState) {
		let render = Object.assign({}, meta, nextProps.meta);
		return {render};
  }

	render() {

		let indexing;

		if (this.state.render.seo) {
			indexing = <meta name="robots" content="index,follow"/>
		} else {
			indexing = <meta name="robots" content="noindex,nofollow"/>
		}

		return (
			<Head>
				<title>{this.state.render.title}</title>
				<meta name="example" content="whatever" />
				<meta name="keywords" content={this.state.render.keywords}/>
				<meta name="description" content={this.state.render.description}/>
				<meta name="twitter:card" content="summary_large_image"/>
				<meta name="twitter:description" content={this.state.render.description}/>
				<meta name="twitter:title" content={this.state.render.title}/>
				<meta property="og:locale" content="en_US"/>
				<meta property="og:type" content="website"/>
				<meta property="og:title" content={this.state.render.title}/>
				<meta property="og:description" content={this.state.render.description}/>
				<meta property="og:url" content={this.state.render.url}/>
				<meta property="og:site_name" content={this.state.render.name}/>
				<meta property="og:image" content={this.state.render.image}/>
				{indexing}
				<link rel="canonical" href={this.state.render.url}/>
			</Head>
    )
	}
}

export default HeadMeta;