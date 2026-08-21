import React, { Component } from 'react';

import edit from '../../PropertyEdit/css/edit.module.css';
import CameraBox from './cameraBox';


class Rack3Ddeploy extends Component {
    render() {
        return (
            <>
                <div id="app3D_edit" className={edit.rack3Ddeploy}>
                    <CameraBox />
                </div>
            </>
        )
    }
}
export default Rack3Ddeploy;