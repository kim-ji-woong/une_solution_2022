import React, { Component } from 'react';

import main from '../../Main/css/main.module.css';
import $ from 'jquery';
import MainController from '../services/mainController';
import wsManager from '../../Root/services/wsManager';
import ProjectResource from '../../Root/resource/id';


class NavBar extends Component {

    constructor(props) {
        super(props);

        this.props = props;

        this.state = {

        }
    }

    componentDidMount() {

        $(document).ready(function () {
            $(".slide-toggle").click(function () {
                $(".box").animate({
                    width: "toggle"
                });
            });
        });
    }

    async goToHome() {
        this.props.alertMessage(ProjectResource.notImplementMessage(), ProjectResource.ID.messageBox.title.info);
        //const wsManager = this.props.wsManager;
        //const dataCenter = this.props.dataCenter;

        //if (wsManager && dataCenter) {
        //    const [result, /*errorMessage*/] = await MainController.requestViewport(dataCenter.id);

        //    if (result) {
        //        const datas = [];
        //        datas.push(result.dataCenterID);
        //        datas.push(result.positionX);
        //        datas.push(result.positionY);
        //        datas.push(result.positionZ);
        //        datas.push(result.rotationX);
        //        datas.push(result.rotationY);
        //        datas.push(result.rotationZ);

        //        wsManager.sendMessage(wsManager.webToApp.header.setViewport, wsManager.arrayToParameter(datas));
        //    }
        //}
    }

    async saveViewport() {
        this.props.alertMessage(ProjectResource.notImplementMessage(), ProjectResource.ID.messageBox.title.info);
        //const wsManager = this.props.wsManager;
        //const dataCenter = this.props.dataCenter;

        //if (wsManager && dataCenter) {
        //    wsManager.requestViewport(dataCenter.id);
        //}
    }

    async zoomIn() {
        const wsManager = this.props.wsManager;
        
        if (wsManager) {
            wsManager.zoomIn();
        }
    }

    async zoomOut() {
        const wsManager = this.props.wsManager;

        if (wsManager) {
            wsManager.zoomOut();
        }
    }

    changeViewMode() {
        this.props.changeModeFps(!this.props.modeFPS);
    }

    setNameTagVisible() {
        const onOff = this.props.getLayerState(wsManager.layer.nameTag);
        this.props.setLayerState(wsManager.layer.nameTag, !onOff);
    }

    onClickCameraOnOff() {
        if (this.props.getCameraOnOff()) {
            this.props.setCameraOnOff(false);
        }
        else {
            this.props.setCameraOnOff(true);
        }
    }

    onClickFMSOnOff() {
        if (this.props.getSensorOnOff()) {
            this.props.setSensorOnOff(false);
        }
        else {
            this.props.setSensorOnOff(true);
        }
    }

    render() {
        const nameTagVisible = this.props.getLayerState(wsManager.layer.nameTag);
        const menuClassName = nameTagVisible ? "nameOn" : "nameOff";
        const cameraOnOffClassName = this.props.getCameraOnOff() ? "model3DMenuOn" : "model3DMenuOff";
        const fmsOnOffClassName = this.props.getSensorOnOff() ? "fmsMenuOn" : "fmsMenuOff";

        return (
            <>
                {/* <div id={main.vdsNav}>
                    <button className={main.slideToggle}></button>
                    <div className={main.box}>
                        <ul className={main.vdsMenu + " " + main.boxInner}>
                            <li><a onClick={() => { }}></a></li>
                            <li><a onClick={() => { }}></a></li>
                            <li><a onClick={() => { }}></a></li>
                            <li><a onClick={() => { }}></a></li>
                            <li><a onClick={() => { }}></a></li>
                        </ul>
                    </div>
                </div> */}

                <div id="vdsNav">
                    <button className="slide-toggle"></button>
                    <div className="box">
                        <ul className="vdsMenu">
                            <li className="goHome"><a onClick={() => this.goToHome()}></a></li>
                            <li className="saveViewport"><a onClick={() => this.saveViewport()}></a></li>
                            <li className="zoomIn"><a onClick={() => this.zoomIn()}></a></li>
                            <li className="zoomOut"><a onClick={() => this.zoomOut()}></a></li>
                            <li className={menuClassName}><a onClick={() => this.setNameTagVisible()}></a></li>
                            <li className="changeView"><a onClick={() => this.changeViewMode()}></a></li>
                            <li className={cameraOnOffClassName}><a onClick={() => this.onClickCameraOnOff()}></a></li>
                            <li className={fmsOnOffClassName}><a onClick={() => this.onClickFMSOnOff()}></a></li>
                        </ul>
                    </div>
                </div>
            </>
        );
    }
}

export default NavBar;