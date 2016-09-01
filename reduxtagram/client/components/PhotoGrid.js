import React from 'react';
import { render } from 'react-dom';
import autobind from 'autobind-decorator';
import Photo from './Photo';

// @autobind
class PhotoGrid extends React.Component {
    render() {
        return (
            <div className="photo-grid">
                {this.props.posts.map((post, i) => <Photo {...this.props} key={i} i={i} post={post} />)}
            </div>
        )
    }
}

export default PhotoGrid;
