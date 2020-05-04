import {useEffect, useState} from 'react';
import {Transition} from 'react-transition-group'
import apiCall from '../util/api-call';
import Loading from '../util/loading';

const MediaFile = ({id, size, children}) => {
  // Acceptable sizes are ['medium','large','thumbnail','medium_large','1536x1536','full']
  const [loading, setLoading] = useState(true);
  const [imageURL, setImageURL] = useState("/static/img/placeholder.png");

  const defaultStyle = {
    backgroundImage: "url('" + imageURL + "')",
    transition: 'opacity 200ms ease',
    opacity: 1
  };

  const transitionStyles = {
    entering: { opacity: 0}, 
    entered: { opacity: 1},
    exiting: { opacity: 0 },
    exited: { opacity: 0 }
  };

  useEffect(() => {
    apiCall("wp/v2/media/" + id).then((res) => {
      // Turn off loading
      setLoading(false);
      // Replace placeholder with actual image
      setImageURL(res.media_details.sizes[size].source_url)
    });
  });

  return <div className="media-file">
    <Transition in={!loading} timeout={250}>
      {sec_trans_state => (
        <div className="media-file__container" style={{...defaultStyle, ...transitionStyles[sec_trans_state]}}>
          {children}
        </div>
      )}
    </Transition >
    {(loading ? <Loading className="media-file__loading"/> : null)}
  </div>
}

export default MediaFile;