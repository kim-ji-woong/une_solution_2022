import React, { Component } from 'react';
import Management from './management';

import UserRightsManagement from './userRightsManagement';


class SystemManagement extends Component {

    render() {
        return (
            <>
                {
                this.props.currentMode === Management.mode.userAccess &&
                    <UserRightsManagement currentMode={this.props.currentMode} site={this.props.site} onClose={this.props.onClose} alertMessage={this.props.alertMessage} enableEdit={this.props.enableEditUser} />
                }
            </>
        );
    }
}

export default SystemManagement;