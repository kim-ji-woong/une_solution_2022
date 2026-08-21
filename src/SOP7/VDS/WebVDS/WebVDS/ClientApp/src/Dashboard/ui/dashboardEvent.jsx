import React, { Component } from 'react';

import dash from '../../Dashboard/css/dash.module.css';
import ProjectResource from '../../Root/resource/id';


class DashboardEvent extends Component {


    render() {
        const address = this.props.selectedNation;
        //const address = this.props.selectedCenter ? this.props.selectedNation : "";

        return (
            <>
                <div className={dash.dashboardEvent}>
                    <div className={dash.vdcText}><span className={dash.locationText}>{ProjectResource.ID.dashboard.location} : </span>{address}</div>
                </div>
            </>
        )
    }
}

export default DashboardEvent;