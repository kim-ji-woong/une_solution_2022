import { ui } from 'jquery';
import React, { Component } from 'react';
import content from '../../../Common/css/content.module.css';
import sdmsStyle from '../../css/sdms.module.css';
import imgClose from '../../../Common/image/icon/close_x.svg';
import imgMinimap from '../../../Common/image/temp/mini_img1.png';
import SDMS from '../sdms';
import SettingsStore from '../../../Settings/settingsStore';
import * as THREE from "three/build/three.module.js";
import SdmsResource from '../../resource/id';
import ProjectResource from '../../../Root/resource/id';

import PopupDraggable from './popupDraggable';
import $ from 'jquery';

import { MiniMapComponent } from '../../styled/sdmsPopupsStyled';
import { i18n, withTranslation } from '../../../language/i18n';

class MiniMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            popupMinWidth: 350,
        }

        SettingsStore.subscribe(function () {
            this.resetPopupState(SettingsStore.getState());
        }.bind(this));

        if (SDMS.UseWalkingAvatar) {
            this.refPosX = React.createRef();
            this.refPosY = React.createRef();
            this.refPosZ = React.createRef();
            this.refScaleX = React.createRef();
            this.refScaleY = React.createRef();
            this.refScaleZ = React.createRef();
        }
    }

    componentDidMount() {
        // 창이 서서히 나타나는 효과
        let cssLeft = null;
        let cssTop = null;
        let cssWidth = null;
        let cssHeight = null;

        const popup = document.getElementById(this.props.popupType);
        const target = document.getElementById("dsBot_" + this.props.popupType);
        const popupState = this.props.popupState;

        if (popup !== null && popup !== undefined &&
            target !== null && target !== undefined &&
            popupState !== null && popupState !== undefined) {
            const clientRect = target.getBoundingClientRect();
            cssLeft = clientRect.left + "px";
            cssTop = clientRect.top + "px";

            popup.style.width = 0;
            popup.style.height = 0;
            popup.style.left = cssLeft;
            popup.style.top = cssTop;

            cssLeft = popupState.x;
            cssTop = popupState.y;
            cssWidth = popupState.width;
            cssHeight = popupState.height;

            $('#' + this.props.popupType).animate({ opacity: 1, width: cssWidth, height: cssHeight, left: cssLeft, top: cssTop }, SdmsResource.PopupAniTime, () => {
                if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
                    document.getElementById(this.props.popupType).style.opacity = 1;
                }
            });
        }
        else {
            $('#' + this.props.popupType).animate({ opacity: 1 }, SdmsResource.PopupAniTime, () => {
                if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
                    document.getElementById(this.props.popupType).style.opacity = 1;
                }
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // 팝업이 선택 됐을 때(Drag 될때) 맨 앞에 팝업 위치
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popup.style.zIndex = this.props.zIndex;
            console.log('miniMapZIndex changed', this.state.popup.style.zIndex);
        }
    }

    repositionPopup(popupState) {
        let data = popupState.miniMap;

        if (data === null || data === undefined)
            return;

        //let popup = document.getElementsByClassName(content.viewDashboardBoxD + ' ' + content.viewDashboardMiniMap)[0];
        let popup = document.getElementById(this.props.popupType);
        if (popup === null || popup === undefined)
            return;

        popup.style.left = data.x;
        popup.style.top = data.y;
        popup.style.width = data.width;
        popup.style.height = data.height;

        this.setState({ popup: popup });
    }

    resetPopupState = (popupState) => {
        let data = popupState;

        if (data.actionType === 'RESET_POPUP') {
            this.repositionPopup(data.popupState);
        }
    }

    getImageURL() {
        if (this.props.currentView.buildingID === null) {

            // .TODO: 멀티캠퍼스 관련 미니맵 수정
            if (ProjectResource.IsMultiSite) {
                const rootSiteID = ProjectResource.SiteID;
                let currentSiteID = this.props.currentSiteID;

                if (!currentSiteID)
                    currentSiteID = rootSiteID;

                let siteID = currentSiteID - rootSiteID;
                if (siteID === 0)
                    siteID = "";

                return '/resource/image/minimap/outdoor' + siteID + '.png';
            }

            return '/resource/image/minimap/outdoor.png';
        }
        else if (this.props.currentView.buildingID >= 100) {
            return '/resource/image/minimap/outdoor_' + this.props.currentView.buildingID + '.png';
        }
        else if (this.props.currentView.buildingID >= 10) {
            return '/resource/image/minimap/outdoor_0' + this.props.currentView.buildingID + '.png';
        }

        return '/resource/image/minimap/outdoor_00' + this.props.currentView.buildingID + '.png';
    }

    getImageTitle() {
        if (this.props.currentView.zoneName.length === 0) {
            return <></>;
        }

        return <p>{this.props.currentView.zoneName}</p>;
    }

    getWalkerInfo() {
        if (!this.props.walker || !this.props.walker.model) {
            return [0, 0, 0, 0, 0, 0, true];
        }

        let globalCamera = true;

        if (this.props.walker.contents3D) {
            if (this.props.walker.contents3D.camera === this.props.walker.camera) {
                globalCamera = false;
            }
        }

        const model = this.props.walker.model;
        return [model.position.x, model.position.y, model.position.z, model.scale.x, model.scale.y, model.scale.z, globalCamera];
    }

    onChangeText = (event) => {
    }

    onClickChangePosition = (event) => {
        if (!this.props.walker || !this.props.walker.model) {
            return;
        }

        const x = Number(this.refPosX.current.value.trim());
        const y = Number(this.refPosY.current.value.trim());
        const z = Number(this.refPosZ.current.value.trim());

        if (isNaN(x) || isNaN(y) || isNaN(z)) {
            return;
        }

        this.props.walker.model.position.set(x, y, z);
        this.props.walker.moveCamera(new THREE.Vector3(x, y, z));
        this.props.walker.model.position.set(x, y, z);
    }

    onClickChangeScale = (event) => {
        if (!this.props.walker || !this.props.walker.model) {
            return;
        }

        const x = Number(this.refScaleX.current.value.trim());
        const y = Number(this.refScaleY.current.value.trim());
        const z = Number(this.refScaleZ.current.value.trim());

        if (isNaN(x) || isNaN(y) || isNaN(z)) {
            return;
        }

        this.props.walker.model.scale.set(x, y, z);
        this.props.walker.moveCamera(new THREE.Vector3(this.props.walker.model.position.x, this.props.walker.model.position.y, this.props.walker.model.position.z));
    }

    changeCamera(globalCamera) {
        if (this.props.walker) {
            if (globalCamera) {
                this.props.walker.setGlobalCamera();
            }
            else {
                this.props.walker.setAvatarCamera();
            }

            this.setState({ popupMinWidth: this.state.popupMinWidth });
        }
    }

    setCameraDistance(faraway) {
        if (this.props.walker) {
            this.props.walker.farFromModel(faraway);
        }
    }

    setCameraElevation(upper) {
        if (this.props.walker) {
            this.props.walker.goUpCamera(upper);
        }
    }

    setCameraAngle(mode) {
        if (this.props.walker) {
            if (mode === 1) {
                this.props.walker.rotateVerticalCamera(true);
            }
            else if (mode === 2) {
                this.props.walker.rotateVerticalCamera(false);
            }
            else if (mode === 3) {
                this.props.walker.rotateHorizontalCamera(true);
            }
            else if (mode === 4) {
                this.props.walker.rotateHorizontalCamera(false);
            }
        }
    }

    setCameraToRight(right) {
        if (this.props.walker) {
            this.props.walker.cameraToRight(right);
        }
    }

    getAvatarElements() {
        const [posX, posY, posZ, scaleX, scaleY, scaleZ, globalCamera] = this.getWalkerInfo();
        return (
            <div id={this.props.popupType} className={'viewDashboardBoxD viewDashboardMiniMap'}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={260}
                    popupMinHeight={260}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                >

                    <div className={'dslTop dslGrd'}>
                        <h5 className={'dslTitle'} >
                            {i18n.t('sdms.miniMap.미니맵')}
                        </h5>
                        <a className={'dslX'} onClick={() => this.props.setVisiblePopups(SDMS.menu.miniMap, false)}></a>
                    </div>

                    <div className={'miniMapConts'}>
                        <div>
                            <h5 className={'sensorName'}>{i18n.t('sdms.miniMap.Model 위치')}</h5>
                            <div className={'horzArea'}>
                                <input ref={this.refPosX} className={'inputText width100'} type="text" placeholder="X" defaultValue={posX} onChange={this.onChangeText} />
                                <input ref={this.refPosY} className={'inputText width100'} type="text" placeholder="Y" defaultValue={posY} onChange={this.onChangeText} />
                                <input ref={this.refPosZ} className={'inputText width100'} type="text" placeholder="Z" defaultValue={posZ} onChange={this.onChangeText} />
                                <button className={'menuBtnModel'} onClick={this.onClickChangePosition}>{i18n.t('sdms.miniMap.이동')}</button>
                            </div>

                            <br />

                            <h5 className={'sensorName'}>{i18n.t('sdms.miniMap.Model Scale')}</h5>
                            <div className={'horzArea'}>
                                <input ref={this.refScaleX} className={'inputText width100'} type="text" placeholder="X" defaultValue={scaleX} onChange={this.onChangeText} />
                                <input ref={this.refScaleY} className={'inputText width100'} type="text" placeholder="Y" defaultValue={scaleY} onChange={this.onChangeText} />
                                <input ref={this.refScaleZ} className={'inputText width100'} type="text" placeholder="Z" defaultValue={scaleZ} onChange={this.onChangeText} />
                                <button className={'menuBtnModel'} onClick={this.onClickChangeScale}>{i18n.t('sdms.miniMap.변경')}</button>
                            </div>

                            <br />

                            <h5 className={'sensorName marginBottom10'}>{i18n.t('sdms.miniMap.카메라 설정')}</h5>
                            <div className={'horzArea'}>
                                <label className={'clickable whiteText'}>
                                    <input type="checkbox" className={'labelInput'} checked={globalCamera} onChange={() => this.changeCamera(true)} />
                                    {i18n.t('sdms.miniMap.전역 카메라')}
							    </label>

                                <label className={'clickable whiteText'}>
                                    <input type="checkbox" className={'labelInput'} checked={!globalCamera} onChange={() => this.changeCamera(false)} />
                                    {i18n.t('sdms.miniMap.1인칭 카메라')}
							    </label>
                            </div>

                            <br />

                            <h5 className={'sensorName marginBottom10'}>{i18n.t('sdms.miniMap.거리')}</h5>
                            <div className={'horzArea'}>
                                <button className={'menuBtnModel'} onClick={() => this.setCameraDistance(true)}>{i18n.t('sdms.miniMap.멀리')}</button>
                                <button className={'menuBtnModel'} onClick={() => this.setCameraDistance(false)}>{i18n.t('sdms.miniMap.가까이')}</button>
                                <button className={'menuBtnModel'} onClick={() => this.setCameraElevation(true)}>{i18n.t('sdms.miniMap.위로')}</button>
                                <button className={'menuBtnModel'} onClick={() => this.setCameraElevation(false)}>{i18n.t('sdms.miniMap.아래로')}</button>
                                <button className={'menuBtnModel'} onClick={() => this.setCameraToRight(true)}>{i18n.t('sdms.miniMap.오른쪽')}</button>
                                <button className={'menuBtnModel'} onClick={() => this.setCameraToRight(false)}>{i18n.t('sdms.miniMap.왼쪽')}</button>
                            </div>

                            <br />

                            <h5 className={'sensorName marginBottom10'}>카메라 각도</h5>
                            <div className={'horzArea'}>
                                <button className={'menuBtnModel'} onClick={() => this.setCameraAngle(1)}>{i18n.t('sdms.miniMap.위로')}</button>
                                <button className={'menuBtnModel'} onClick={() => this.setCameraAngle(2)}>{i18n.t('sdms.miniMap.아래로')}</button>
                                <button className={'menuBtnModel'} onClick={() => this.setCameraAngle(3)}>{i18n.t('sdms.miniMap.오른쪽')}</button>
                                <button className={'menuBtnModel'} onClick={() => this.setCameraAngle(4)}>{i18n.t('sdms.miniMap.왼쪽')}</button>
                            </div>
                        </div>
                    </div>
                </PopupDraggable>
            </div>
        );
    }

    render() {
        const url = this.getImageURL();//'/resource/image/minimap/outdoor.png';

        if (SDMS.UseWalkingAvatar) {
            return this.getAvatarElements();
        }

        return (
            <MiniMapComponent id={this.props.popupType} className={'viewDashboardBoxD viewDashboardMiniMap'}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={260}
                    popupMinHeight={290}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                >
                    <div className={'dslTop dslGrd'}>
                        <h5 className={'dslTitle'} >
                            {i18n.t('sdms.miniMap.미니맵')}
                        </h5>
                        <a className={'dslX'} onClick={() => this.props.setVisiblePopups(SDMS.menu.miniMap, false)}></a>
                    </div>

                    <div className={'miniMapConts'}>
                        {
                            this.getImageTitle()
                        }
                        {
                            <img sync="true" importance="high" src={url} alt={i18n.t('sdms.miniMap.미니맵')} />
                            //<img src={imgMinimap} alt="미니맵" />
                        }
                    </div>

                </PopupDraggable>
            </MiniMapComponent>
        );
    }
}

export default withTranslation()(MiniMap);