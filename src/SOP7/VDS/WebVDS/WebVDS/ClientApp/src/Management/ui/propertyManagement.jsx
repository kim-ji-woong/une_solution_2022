import React, { Component } from 'react';
import EditController from '../../PropertyEdit/services/editController';
import ProjectResource from '../../Root/resource/id';
import Management from './management';

import Property3DList from './property3DList';
import Property3DRegistration from './property3DRegistration';


class PropertyManagement extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                {
                    this.props.currentMode === Management.mode.itPropertyList &&
                    <Property3DList
                        user={this.props.user}
                        onClose={this.props.onClose}
                        alertMessage={this.props.alertMessage}
                        showConfirmDialog={this.props.showConfirmDialog}
                        onCloseConfirmDialog={this.props.onCloseConfirmDialog}
                    />
                }
                {/*<Property3DRegistration />*/}  {/* 3D자산 신규등록 */}
            </>
        );
    }
}

export default PropertyManagement;