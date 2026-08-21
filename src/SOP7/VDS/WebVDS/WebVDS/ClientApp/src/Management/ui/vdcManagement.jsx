import React, { Component } from 'react';
import Management from './management';

import VDCManagementList from './vdcManagementList';
import VDCRegistration from './vdcRegistration';

class VDCManagement extends Component {

    render() {
        return (
            <>
                {
                    /* VDC 목록 */
                    this.props.currentMode === Management.mode.vdcList &&
                    <VDCManagementList sites={this.props.sites} nations={this.props.nations} allNations={this.props.allNations} onClose={this.props.onClose} getRefreshSites={this.props.getRefreshSites} setRefreshSites={this.props.setRefreshSites} alertMessage={this.props.alertMessage} showConfirmDialog={this.props.showConfirmDialog} onCloseConfirmDialog={this.props.onCloseConfirmDialog} enableEdit={this.props.enableEdit} onLoading={this.props.onLoading} />
                }
                {
                    /* VDC 신규등록 */
                    this.props.currentMode === Management.mode.newRegist &&
                    <VDCRegistration sites={this.props.sites} nations={this.props.nations} allNations={this.props.allNations} wsManager={this.props.wsManager} onClose={this.props.onClose} getRefreshSites={this.props.getRefreshSites} setRefreshSites={this.props.setRefreshSites} alertMessage={this.props.alertMessage} enableEdit={this.props.makeDataCenter} setCameraOnOff={this.props.setCameraOnOff} setSensorOnOff={this.props.setSensorOnOff} />
                }
            </>
        );
    }
}

export default VDCManagement;