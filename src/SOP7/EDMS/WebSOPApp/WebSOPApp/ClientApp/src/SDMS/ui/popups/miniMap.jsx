import { ui } from 'jquery';
import React, { Component } from 'react';
import content from '../../../Common/css/content.module.css';
import sdmsStyle from '../../css/sdms.module.css';
import imgClose from '../../../Common/image/icon/close_x.png';
import imgMinimap from '../../../Common/image/temp/mini_img1.png';
import SDMS from '../sdms';
import SettingsStore from '../../../Settings/settingsStore';
import * as THREE from "three/build/three.module.js";
import SDMSResource from '../../resource/id';

import PopupDraggable from './popupDraggable';
import $ from 'jquery';


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

            $('#' + this.props.popupType).animate({ opacity: 1, width: cssWidth, height: cssHeight, left: cssLeft, top: cssTop }, SDMSResource.PopupAniTime, () => {
                if (document.getElementById(this.props.popupType) !== null && document.getElementById(this.props.popupType) !== undefined) {
                    document.getElementById(this.props.popupType).style.opacity = 1;
                }
            });
        }
        else {
            $('#' + this.props.popupType).animate({ opacity: 1 }, SDMSResource.PopupAniTime, () => {
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
            <div id={this.props.popupType} className={content.viewDashboardBoxD + ' ' + content.viewDashboardMiniMap}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={350}
                    popupMinHeight={260}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                >

                 <div className={content.dslTop + " " + content.dslGrd}>
                        <h5 className={content.dslTitle} >
                            미니맵
                        </h5>
                        <a className={content.dslX} onClick={() => this.props.setVisiblePopups(SDMS.menu.miniMap, false)}></a>
                    </div>

                    <div className={sdmsStyle.miniMapConts}>
                        <div>
                            <h5 className={sdmsStyle.sensorName}>Model 위치</h5>
                            <div className={sdmsStyle.horzArea}>
                                <input ref={this.refPosX} className={sdmsStyle.inputText + " " + sdmsStyle.width100} type="text" placeholder="X" defaultValue={posX} onChange={this.onChangeText} />
                                <input ref={this.refPosY} className={sdmsStyle.inputText + " " + sdmsStyle.width100} type="text" placeholder="Y" defaultValue={posY} onChange={this.onChangeText} />
                                <input ref={this.refPosZ} className={sdmsStyle.inputText + " " + sdmsStyle.width100} type="text" placeholder="Z" defaultValue={posZ} onChange={this.onChangeText} />
                                <button className={sdmsStyle.menuBtnModel} onClick={this.onClickChangePosition}>이동</button>
                            </div>

                            <br />

                            <h5 className={sdmsStyle.sensorName}>Model Scale</h5>
                            <div className={sdmsStyle.horzArea}>
                                <input ref={this.refScaleX} className={sdmsStyle.inputText + " " + sdmsStyle.width100} type="text" placeholder="X" defaultValue={scaleX} onChange={this.onChangeText} />
                                <input ref={this.refScaleY} className={sdmsStyle.inputText + " " + sdmsStyle.width100} type="text" placeholder="Y" defaultValue={scaleY} onChange={this.onChangeText} />
                                <input ref={this.refScaleZ} className={sdmsStyle.inputText + " " + sdmsStyle.width100} type="text" placeholder="Z" defaultValue={scaleZ} onChange={this.onChangeText} />
                                <button className={sdmsStyle.menuBtnModel} onClick={this.onClickChangeScale}>변경</button>
                            </div>

                            <br />

                            <h5 className={sdmsStyle.sensorName + " " + sdmsStyle.marginBottom10}>카메라 설정</h5>
                            <div className={sdmsStyle.horzArea}>
                                <label className={sdmsStyle.clickable + " " + sdmsStyle.whiteText}>
                                    <input type="checkbox" className={sdmsStyle.labelInput} checked={globalCamera} onChange={() => this.changeCamera(true)} />
								    전역 카메라
							    </label>

                                <label className={sdmsStyle.clickable + " " + sdmsStyle.whiteText}>
                                    <input type="checkbox" className={sdmsStyle.labelInput} checked={!globalCamera} onChange={() => this.changeCamera(false)} />
								    1인칭 카메라
							    </label>
                            </div>

                            <br />

                            <h5 className={sdmsStyle.sensorName + " " + sdmsStyle.marginBottom10}>카메라 거리</h5>
                            <div className={sdmsStyle.horzArea}>
                                <button className={sdmsStyle.menuBtnModel} onClick={() => this.setCameraDistance(true)}>멀리</button>
                                <button className={sdmsStyle.menuBtnModel} onClick={() => this.setCameraDistance(false)}>가까이</button>
                                <button className={sdmsStyle.menuBtnModel} onClick={() => this.setCameraElevation(true)}>위로</button>
                                <button className={sdmsStyle.menuBtnModel} onClick={() => this.setCameraElevation(false)}>아래로</button>
                                <button className={sdmsStyle.menuBtnModel} onClick={() => this.setCameraToRight(true)}>오른쪽</button>
                                <button className={sdmsStyle.menuBtnModel} onClick={() => this.setCameraToRight(false)}>왼쪽</button>
                            </div>

                            <br />

                            <h5 className={sdmsStyle.sensorName + " " + sdmsStyle.marginBottom10}>카메라 각도</h5>
                            <div className={sdmsStyle.horzArea}>
                                <button className={sdmsStyle.menuBtnModel} onClick={() => this.setCameraAngle(1)}>위로</button>
                                <button className={sdmsStyle.menuBtnModel} onClick={() => this.setCameraAngle(2)}>아래로</button>
                                <button className={sdmsStyle.menuBtnModel} onClick={() => this.setCameraAngle(3)}>오른쪽</button>
                                <button className={sdmsStyle.menuBtnModel} onClick={() => this.setCameraAngle(4)}>왼쪽</button>
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
            <div id={this.props.popupType} className={content.viewDashboardBoxD + ' ' + content.viewDashboardMiniMap}>
                <PopupDraggable
                    id={this.props.popupType}
                    popupMinWidth={350}
                    popupMinHeight={260}
                    topSize={32}
                    popupState={this.props.popupState}
                    setActiveDragPopup={this.props.setActiveDragPopup}
                    setPopupState={this.props.setPopupState}
                >

                   <div className={content.dslTop + " " + content.dslGrd}>
                        <h5 className={content.dslTitle} >
                            미니맵
                        </h5>
                        <a className={content.dslX} onClick={() => this.props.setVisiblePopups(SDMS.menu.miniMap, false)}></a>
                    </div>

                    <div className={sdmsStyle.miniMapConts}>
                        {
                            this.getImageTitle()
                        }
                        {
                            <img sync="true" importance="high" src={url} alt="미니맵" />
                        }
                    </div>
                </PopupDraggable>
            </div>
        );
    }
}

export default MiniMap;