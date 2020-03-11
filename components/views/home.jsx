import React from 'react';
import Head from '../modules/head';

class Home extends React.Component {

	constructor(props) {
		super(props);

		this.meta = {
			title: "Home Page | Next JS"
		};
	}

	render() {

		return (
			<div className="main-content">
				<Head meta={this.meta}/>
				<div>
          <h1>Hello World</h1>
				</div>
			</div>
		)
	}
}

export default Home;