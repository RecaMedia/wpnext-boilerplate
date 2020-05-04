import React from 'react';
import Pagination from "react-js-pagination";
import ProcessCategories from './process-categories';
import GeneralFunc from '../../jsx/util/general-functions';
import apiCall from '../../jsx/util/api-call';

export default class Blog extends React.Component {

	constructor(props) {
		super(props);

		this.processPages = this.processPages.bind(this);
		this.handlePageChange = this.handlePageChange.bind(this);

		this.state = {
			values: (this.props.values ? this.props.values : {
				list_count: 0
			}),
			list: (this.props.list ? this.props.list : []),
			displayList: [],
			currentPage: 1,
			postCall: false
		}
	}

	componentDidMount() {
		if (this.state.list.length == 0) {
			apiCall("wp/v2/posts").then((list) => {
				this.setState({
					list,
					displayList: this.processPages(list, this.state.currentPage),
					postCall: true
				});
			});
		} else {
			this.setState({
				displayList: this.processPages(this.state.list, this.state.currentPage)
			});
		}
	}

	processPages(list, current_page) {
		let end_index = current_page * this.state.values.list_count;
		let start_index = end_index - this.state.values.list_count;
		return list.slice(start_index, end_index);
	}

	handlePageChange(go_to_page) {
		this.setState({
			displayList: this.processPages(this.state.list, go_to_page),
			currentPage: go_to_page,
		});
	}

	render() {
		let posts = <div>
			{this.state.displayList.map((post,i) => {
				return <div key={i} className="blog__item">
					{(post.featured_media ? <div className="blog__featured"><GeneralFunc.MediaFile id={post.featured_media} size="medium_large"/></div> : null)}
					<div className="blog__text">
						<a href={GeneralFunc.convertURLs(post.link)}><h3>{post.title.rendered}</h3></a>
						<div className="blog__categories">
							<ProcessCategories categories={post.categories}/>
						</div>
						<p dangerouslySetInnerHTML={{__html: post.excerpt.rendered}}/>
					</div>
				</div>
			})}
			<div className="blog__pagination">
				<Pagination
					activePage={this.state.currentPage}
					itemsCountPerPage={Number(this.state.values.list_count)}
					totalItemsCount={this.state.list.length}
					pageRangeDisplayed={5}
					onChange={this.handlePageChange.bind(this)}
				/>
			</div>
		</div>

		return <div className="blog">
			{(this.state.list.length ? posts : (this.state.postCall ? <p>Sorry, I haven't written anything yet.</p> : null))}
		</div>;
	}
}