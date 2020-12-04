import React from 'react';
import {Transition} from 'react-transition-group';
import apiCall from '../util/api-call';
import Loading from '../util/loading';

const transitionStyles = {
  entering: { opacity: 0}, 
  entered: { opacity: 1},
  exiting: { opacity: 0 },
  exited: { opacity: 0 }
};

export default class MediaFile extends React.Component {

	constructor(props) {
    super(props);

    console.log(this.props.media, this.props.size);
    
    // Acceptable sizes are ['medium','large','thumbnail','medium_large','1536x1536','full']
    // Loading is set to true if a media ID is received rather than an object
    this.state = {
      loading: (typeof this.props.media === 'object' ? false : true),
      imageURL: (typeof this.props.media === 'object' ? (this.props.media.media_details.sizes[this.props.size] != undefined ? this.props.media.media_details.sizes[this.props.size].source_url : this.props.media.media_details.sizes.medium.source_url) : "/static/img/placeholder.png"),
      media: this.props.media
		}
  }

  static getDerivedStateFromProps(props, state) {
    if ((typeof props.media === 'object' ? props.media.title.rendered !== state.media.title.rendered : props.media !== state.media)) {
      return {
        loading: (typeof props.media === 'object' ? false : true),
        imageURL: (typeof props.media === 'object' ? (props.media.media_details.sizes[props.size] != undefined ? props.media.media_details.sizes[props.size].source_url : props.media.media_details.sizes.medium.source_url) : "/static/img/placeholder.png"),
        media: props.media
      }
    } else {
      return null;
    }
  }
  
  componentDidMount() {
    if (typeof this.state.media === 'number') {
      apiCall("wp/v2/media/" + this.state.media).then((res) => {
        let imageURL = (res.media_details.sizes[this.props.size] != undefined ? res.media_details.sizes[this.props.size].source_url : res.media_details.sizes.medium.source_url);
        this.setState({
          loading: false,
          imageURL,
          media: res
        })
      });
    }
  }

	render() {

    const defaultStyle = {
      backgroundImage: "url('" + this.state.imageURL + "')",
      transition: 'opacity 250ms ease',
      opacity: 1
    };

    return (
      <div className="media-file">
        <Transition in={!this.state.loading} timeout={250}>
          {sec_trans_state => (
            <div className="media-file__container" style={{...defaultStyle, ...transitionStyles[sec_trans_state]}}>
              {this.props.children}
            </div>
          )}
        </Transition >
        {(this.state.loading ? <Loading className="media-file__loading"/> : null)}
      </div>
    )
  }
}