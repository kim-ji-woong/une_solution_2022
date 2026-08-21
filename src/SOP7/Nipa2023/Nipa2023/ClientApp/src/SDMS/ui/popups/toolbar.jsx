import React, { Component } from 'react';
import $ from 'jquery';

import { ToolbarComponent } from '../../styled/sdmsPopupsStyled';
import { SdmsController } from '../../services/sdmsController';
import wsManager from '../../../Root/services/wsManager';
import ProjectResource from '../../../Root/resource/id';

class Toolbar extends Component {
    static keys = [];
    static shortcutKey = null;

    onClickNavigator = (event, campusID) => {
        const btn = event.target;
        const width = campusID === ProjectResource.campus.campus_1 ? "250px" : "200px";

        if (btn.classList.contains('on')) {
            btn.classList.remove('on');
            $(btn).next().animate({ width: "0" });
            $(btn).next().find('.dsnItem').css('visibility', 'hidden');
        }
        else {
            btn.classList.add('on');
            $(btn).next().animate({ width: width });
            $(btn).next().find('.dsnItem').css('visibility', 'visible');
        }
    }

    async onClickHome() {
        if (this.props.currentView && this.props.wsManager) {
            const zoneID = !this.props.currentView.zoneID ? -1 : this.props.currentView.zoneID;
            const [zoneData, message] = await SdmsController.requestZoneData(zoneID);

            if (zoneData &&
                zoneData.cameraPositionX !== null && zoneData.cameraPositionY !== null && zoneData.cameraPositionZ !== null &&
                zoneData.cameraRotationX !== null && zoneData.cameraRotationY !== null && zoneData.cameraRotationZ !== null) {
                this.props.wsManager.moveCamera(wsManager.makeCoord(zoneData.cameraPositionX, zoneData.cameraPositionY, zoneData.cameraPositionZ), wsManager.makeCoord(zoneData.cameraRotationX, zoneData.cameraRotationY, zoneData.cameraRotationZ));
            }
            else {
                console.log(message);
            }
        }
    }

    onClickSaveAsHome() {
        if (this.props.wsManager) {
            this.props.wsManager.requestCurrentViewport();
        }
    }

    onClickZoom(zoomIn) {
        if (this.props.wsManager) {
            this.props.wsManager.zoom(zoomIn);
        }
    }

    onClickAutoRotation(on, type) {
        if (this.props.wsManager) {
            this.props.wsManager.autoRotation(on);
        }

        this.props.checkRotationFromClick(type)
    }

    moveToOutdoor = (campusID, outdoorZones) => {
        this.props.moveToOutdoor(campusID, outdoorZones);
        this.props.resetSelectedStatus();
    }

    render() {
        const campusID = ProjectResource.campusID;

        return (
            <ToolbarComponent id={'dsNav'} className='UI_Section toolbar'>
                <button onClick={(e) => this.onClickNavigator(e, campusID)}>지도옵션 열기</button>
                <div>
                    {
                        campusID === ProjectResource.campus.campus_1 &&
                        <ul className={'dsnMenu'}>
                            <li className='dsnItem'><button onClick={() => this.moveToOutdoor(campusID, this.props.outdoorZones)}> </button></li>
                            {/* <li className='dsnItem'><button onClick={() => this.onClickSaveAsHome()}> </button></li> */}
                            <li className='dsnItem'><button onClick={() => this.onClickZoom(1)}> </button></li>
                            <li className='dsnItem'><button onClick={() => this.onClickZoom(0)}> </button></li>
                            <li className='dsnItem'><button className='on' onClick={() => this.onClickAutoRotation(1, true)}> </button></li>
                            <li className='dsnItem'><button className='off' onClick={() => this.onClickAutoRotation(0, false)}> </button></li>
                        </ul>
                    }
                    {
                        campusID === ProjectResource.campus.campus_2 &&
                        <ul className={'dsnMenu short'}>
                            <li className='dsnItem'><button onClick={() => this.onClickZoom(1)}> </button></li>
                            <li className='dsnItem'><button onClick={() => this.onClickZoom(0)}> </button></li>
                            <li className='dsnItem'><button className='on' onClick={() => this.onClickAutoRotation(1, true)}> </button></li>
                            <li className='dsnItem'><button className='off' onClick={() => this.onClickAutoRotation(0, false)}> </button></li>
                        </ul>
                    }
                </div>
            </ToolbarComponent>
        );
    }
}

export default Toolbar;