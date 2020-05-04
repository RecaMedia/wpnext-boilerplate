import apiCall from '../../jsx/util/api-call';
import store from '../../jsx/redux/store';

export default class ProcessCategories extends React.Component {

	constructor(props) {
		super(props);

    this.app_state = store.getState();

    this.getCategories = this.getCategories.bind(this);

		this.state = {
			WPCategories: this.app_state.global.WPCategories
		}
	}

	componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      this.app_state = store.getState();
      if (this.app_state.global.lastAction === "WP_CATEGORIES") {
        this.setState({
          WPCategories: this.app_state.global.WPCategories
        });
      }
    });

    this.getCategories();
  }

  componentWillUnmount() {
		this.unsubscribe();
	}

  getCategories() {
    this.app_state = store.getState();
    if (this.app_state.global.WPCategories.length == 0) {
      apiCall("wp/v2/categories").then((categories) => {
        store.dispatch({
          type: "WP_CATEGORIES",
          WPCategories: categories
        });
      });
    }
  }

  render() {
    return this.state.WPCategories.map((category,i) => {
      if (this.props.categories.includes(category.id)) {
        return <a key={i} href={"/blog/category/" + category.slug + "/" + category.id}>{category.name}</a>;
      }      
    })
  }
}