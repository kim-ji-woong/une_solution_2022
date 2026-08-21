import React, { Component } from 'react';
import SettingsStore from '../../../../Settings/settingsStore';
import SDMS from '../../sdms';
import SDMSResource from '../../../resource/id';
import ProjectResource from '../../../../Root/resource/id';
import PopupDraggable from '../popupDraggable';

import $ from 'jquery';

import WorkerInfo from './workerInfo';
import WorkerStatus from './workerStatus';

class WorkerPath extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }

        this.props = props;
    }

    render() {
        const siteID =  ProjectResource.SiteID;   

        if (siteID === ProjectResource.Site.Soulbrain) {
            return (
                <WorkerInfo
                    setVisiblePopups={this.props.setVisiblePopups}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    zIndex={this.props.zIndex}
                    popupType={SDMSResource.popupLayer.workerPath}
                    popupState={this.props.popupState.workerInfo}
                    setPopupState={this.props.setPopupState}

                    buildingGroupList={this.props.buildingGroupList}
                    workerInfos={this.props.workerInfos}
                />
            );
        } else {
            return (
                <WorkerStatus 
                    setVisiblePopups={this.props.setVisiblePopups}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    zIndex={this.props.zIndex}
                    popupType={SDMSResource.popupLayer.workerPath}
                    popupState={this.props.popupState.workerStatus}
                    setPopupState={this.props.setPopupState}

                    buildingGroupList={this.props.buildingGroupList}
                    workerInfos={this.props.workerInfos}
                    setWorkerStatusPopup={this.props.setWorkerStatusPopup}
                    selectedWorkerStatusPopup={this.props.selectedWorkerStatusPopup}
                />
            );
        }
    }
}

export default WorkerPath;