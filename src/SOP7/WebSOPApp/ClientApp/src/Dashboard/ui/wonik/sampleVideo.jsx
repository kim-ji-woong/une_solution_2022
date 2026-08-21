import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class SampleVideo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            
        }
        
        this.props = props;
    }

    render() {

		return (
            <video width="100%" height="100%" controls autoPlay loop>
                <source src="/resource/video/gridMovie.mp4" type="video/mp4" />
            </video>
        );
    }
}

export default withRouter(SampleVideo);