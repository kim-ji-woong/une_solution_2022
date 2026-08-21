import React, { Component } from 'react';

import { View360Box, SeosorCloseIcon, Viewarea } from './../../styled';
import { ViewBottomBar, ViewLeftBox, ViewRightBox, ViewPlusIcon, ViewMinusIcon, ViewEntire, ViewMinimap } from './../../styled';
import { MinimapBoxView, MinimapImage, MinimapPOI, MinimapPOIAlarmed } from './../../styled';

import '../../css/popup.css';
import SDMS from '../sdms';

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import * as THREE from 'three';

import $ from 'jquery';
import ProjectResource from '../../../Root/resource/id';
import SdmsResource from '../../resource/id';

class View360Popup extends Component {
    static distance = 5;

    constructor(props) {
        super(props);

        this.ref3D = React.createRef();

        this.props = props;

        this.state = {
            loading: true,
            imageType: "",
            curSensor: this.props.curSensor,
            alarms: this.props.alarms,
            minimapState: true,
            sensorDatas: this.props.sensorDatas,
            coordinates: null,
        }

        this.cubemapTextures = {};
        this.useControls = false;

        if (!this.useControls) {
            this.lon = 90;
            this.lat = 0;
            this.phi = 0;
            this.theta = 0;
            this.isUserInteracting = false;
            this.onPointerDownPointerX = 0;
            this.onPointerDownPointerY = 0;
            this.onPointerDownLon = 0;
            this.onPointerDownLat = 0;
            this.fov = 75;
        }

        //this.standardCoordinates = {
        //    viewX: 148,
        //    viewY: 153,
        //    latitude: 34.8472,
        //    longitude: 127.6819,
        //    convertedX: -1016629.48265084, 
        //    convertedY: 1650298.40218525,
        //    devideNumX: -6876.789348362432,
        //    devideNumY: 10780.47960957307
        //}

        this.miniMapUI = [];
    }

    componentDidMount() {

        $('.entireView').click(function () {
            $('#viewBottomBar').hide();
        });

        $('.viewarea').click(function () {
            $('#viewBottomBar').show();
        });

        const circle = document.querySelector(".mapCircle");

        document.addEventListener("mousemove", (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            circle.style.left = mouseX + 'px';
            circle.style.top = mouseY + 'px';
        });

        this.init();
        View360Popup.animate(this);

        this.getEventPicker();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.zIndex !== prevProps.zIndex) {
            this.state.popup.style.zIndex = this.props.zIndex;
        }
    }

    getEventPicker = () => {
        let result = [];

        const sensorDatas = this.state.sensorDatas;

        let sensorAlarms = [];

        if (this.state.alarms !== null && this.state.alarms !== undefined) {
            sensorAlarms = this.state.alarms;
        }

        const aTop = 125;
        const aLeft = 132;
        const bTop = 161;
        const bLeft = 90;

        const aLatitude = 34.8392;
        const aLongitude = 127.6943;
        const bLatitude = 34.8559;
        const bLongitude = 127.7069;

        const calculateWebCoords = (latitude, longitude) => {
            const webTop = aTop + ((bTop - aTop) * (latitude - aLatitude) * -1) / (bLatitude - aLatitude) * 1.15 - 34;
            const webLeft = aLeft + ((bLeft - aLeft) * (longitude - aLongitude) * -1) / (bLongitude - aLongitude) * 0.65 + 17;
            return { top: webTop, left: webLeft };
        };

        for (let i = 0; i < sensorDatas.length; i++) {

            let sensorData = sensorDatas[i];
            let longitude = sensorData.longitude; // x1
            let latitude = sensorData.latitude; // y

            const webCoords = calculateWebCoords(latitude, longitude);

            let webTop = webCoords.top + 5;
            let webLeft = webCoords.left + 17;

            if (sensorData.sensorID === this.state.curSensor.zoneID) {

                if (sensorAlarms.length !== 0) {
                    for (let k = 0; k < sensorAlarms.length; k++) {
                        const alarm = sensorAlarms[k];
                        if (alarm.zoneID === sensorData.sensorID) {
                            const el = <MinimapPOIAlarmed key={sensorData.sensorID + " 360_Imange"} id={sensorData.sensorID} style={{ top: webTop, left: webLeft }} ></MinimapPOIAlarmed>
                            result.push(el);
                            break;
                        } else {
                            const el = <MinimapPOI key={sensorData.sensorID + " 360_Imange_AlarmedPOI"} id={sensorData.sensorID} style={{ top: webTop, left: webLeft }}></MinimapPOI>
                            result.push(el);
                            break;
                        }
                    }
                } else {
                    const el = <MinimapPOI key={sensorData.sensorID + " 360_Imange_POI"} id={sensorData.sensorID} style={{ top: webTop, left: webLeft }}></MinimapPOI>
                    result.push(el);
                    break;
                }
                
            }

        }

        return result;
    }

    static animate(_this) {
        requestAnimationFrame(() => {
            View360Popup.animate(_this);
        });

        _this.update();
    }

    loadBackgroundTextures(zoneID) {
        const cubeMaps = this.cubemapTextures;
        const _this = this;

        if (!zoneID) {
            return;
        }

        const _zoneID = zoneID.toString();

        let imageType = '.png';

        let src = process.env.PUBLIC_URL + '/image/cubeMap/' + _zoneID + '/px.png';
        //.setPath('../../img/cubeMap/' + zoneID.toString() + '/')

        new THREE.CubeTextureLoader()
            .setPath('resource/image/cubeMap/' + _zoneID + '/')
            .load([
                'px' + imageType,
                'nx' + imageType,
                'py' + imageType,
                'ny' + imageType,
                'pz' + imageType,
                'nz' + imageType
            ], (cubemap) => {
                cubeMaps[zoneID] = cubemap;

                _this.loadBackground(zoneID);
            });
    }

    loadBackground(target) {
        const cubemap = this.cubemapTextures[target];

        if (cubemap) {
            this.scene.background = cubemap;
            this.setState({ loading: false });
        }
        else {
            // texture가 로딩 완료될때까지 0.1초마다 타이머로 검사한다.
            setTimeout(() => this.loadBackground(target), 100);
        }
    }

    update() {
        if (this.camera && this.scene && this.renderer) {
            if (this.useControls) {
                this.renderer.render(this.scene, this.camera);
            }
            else {
                this.lat = Math.max(- 85, Math.min(85, this.lat));
                this.phi = THREE.MathUtils.degToRad(90 - this.lat);
                this.theta = THREE.MathUtils.degToRad(this.lon);

                this.camera.position.x = View360Popup.distance * Math.sin(this.phi) * Math.cos(this.theta);
                this.camera.position.y = View360Popup.distance * Math.cos(this.phi);
                this.camera.position.z = View360Popup.distance * Math.sin(this.phi) * Math.sin(this.theta);

                this.camera.lookAt(0, 0, 0);
                this.renderer.render(this.scene, this.camera);
            }
        }
    }

    init() {
        const container = this.ref3D.current;
        this.camera = new THREE.PerspectiveCamera(this.fov, window.innerWidth / window.innerHeight, 1, 1100);
        this.scene = new THREE.Scene();

        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
        hemiLight.position.set(0, 20, 0);
        this.scene.add(hemiLight);

        this.dirLight = new THREE.DirectionalLight(0xffffff);
        this.dirLight.position.set(-3, 10, -10);
        this.dirLight.castShadow = true;

        this.dirLight.shadow.bias = -0.0008;
        this.dirLight.shadow.mapSize.width = 2048;
        this.dirLight.shadow.mapSize.height = 2048;
        this.dirLight.shadow.camera.updateProjectionMatrix();
        this.scene.add(this.dirLight);
        this.scene.add(this.dirLight.target);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(this.renderer.domElement);

        const zoomInButton = document.getElementById("zoom-in");
        const zoomOutButton = document.getElementById("zoom-out");

        if (this.useControls) {
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            this.controls.target.set(0, 0, 0);
            // 최대 회전각
            this.controls.maxPolarAngle = Math.PI / 3;
            this.controls.update();
        }
        else {
            document.addEventListener('pointerdown', (event) => this.onPointerDown(event));
            document.addEventListener('pointermove', (event) => this.onPointerMove(event));
            document.addEventListener('pointerup', (event) => this.onPointerUp(event));
            document.addEventListener('mousewheel', (event) => this.onMouseWheel(event));
            zoomInButton.addEventListener('click', (event) => this.zoomInFunction(event));
            zoomOutButton.addEventListener('click', (event) => this.zoomOutFunction(event));
        }

        this.readOptions();
    }

    zoomInFunction = (event) => {
        const fov = this.getFov();
        this.camera.fov = this.clickZoom(fov, "zoomIn");
        this.camera.updateProjectionMatrix();
    }

    zoomOutFunction = (event) => {
        const fov = this.getFov();
        this.camera.fov = this.clickZoom(fov, "zoomOut");
        this.camera.updateProjectionMatrix();
    }

    getFov = () => {
        return Math.floor(
            (2 *
                Math.atan(this.camera.getFilmHeight() / 2 / this.camera.getFocalLength()) *
                180) / Math.PI
        );
    }

    clickZoom = (value, zoomType) => {
        if (value >= 20 && zoomType === "zoomIn") {
            return value - 5;
        } else if (value <= 75 && zoomType === "zoomOut") {
            return value + 5;
        } else {
            return value;
        }
    };

    readOptions() {
        const zoneID = this.props.curSensor.zoneID;

        this.loadBackgroundTextures(zoneID);
    }

    onMouseWheel(event) {
        const fov = this.camera.fov + event.deltaY * 0.05;

        this.camera.fov = THREE.MathUtils.clamp(fov, 30, 75);

        this.camera.updateProjectionMatrix();
    }

    onPointerUp() {
        this.isUserInteracting = false;
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onPointerDown(event) {
        this.isUserInteracting = true;

        this.onPointerDownPointerX = event.clientX;
        this.onPointerDownPointerY = event.clientY;

        this.onPointerDownLon = this.lon;
        this.onPointerDownLat = this.lat;
    }

    onPointerMove(event) {
        if (this.isUserInteracting === true) {
            this.lon = (this.onPointerDownPointerX - event.clientX) * 0.1 + this.onPointerDownLon;
            this.lat = (this.onPointerDownPointerY - event.clientY) * 0.1 + this.onPointerDownLat;
        }
    }

    getSensorInfo = () => {

        if (this.state.curSensor === null || this.state.curSensor === undefined)
            return;

        const sensorName = this.state.curSensor.position;
        const sensorAddress = this.state.curSensor.address;

        return [sensorName, sensorAddress]

    }

    onClickCloseMiniMap = () => {
        this.setState({ minimapState: false });
    }

    onClickMiniMap = () => {

        let state = !this.state.minimapState;

        this.setState({ minimapState: state });
    }
    preventClickChild = (e) => {
        if (e.target !== this) {
            return;
        }
    }

    render() {

        const [sensorName, sensorAddress] = this.getSensorInfo();

        const miniMapUI = this.getEventPicker();

        return (
            <>
                <View360Box>
                    <SeosorCloseIcon className={SdmsResource.UISection} onClick={() => this.props.setVisiblePopups(SDMS.menu.view360Popup ,false)}></SeosorCloseIcon>

                    <Viewarea ref={this.ref3D} className={"viewarea " + SdmsResource.UISection}></Viewarea>

                    <ViewBottomBar id="viewBottomBar">
                        <ViewLeftBox>
                            <span>{sensorName}</span><span>|</span><span>{sensorAddress}</span>
                        </ViewLeftBox>
                        <ViewRightBox>
                        <div className="viewTool"><ViewPlusIcon id="zoom-in" data-tooltip="확대"></ViewPlusIcon></div>
                        <div className="viewTool"><ViewMinusIcon id="zoom-out" data-tooltip="축소"></ViewMinusIcon></div>
                        <div className="viewTool"><ViewEntire data-tooltip="전체보기"><span className="entireView"></span></ViewEntire></div>
                        <div className="viewTool"><ViewMinimap data-tooltip="미니맵" onClick={() => this.onClickMiniMap()}></ViewMinimap></div>
                        </ViewRightBox>
                    </ViewBottomBar>
                </View360Box>

                { this.state.minimapState &&
                <MinimapBoxView id="miniMap">
                    <SeosorCloseIcon onClick={() => this.onClickCloseMiniMap()}></SeosorCloseIcon>
                    <MinimapImage></MinimapImage>
                        {miniMapUI}
                </MinimapBoxView>
                }

                {/* 마우스에 따라붙는 도형으로 현재 어떤 영역에 마우스를 위치하고 있는지 보여주는 기능 */}
                <div className="mapCircle" style={{ pointerEvents: 'none' }} onClick={(e) => this.preventClickChild(e)}></div>
            </>
        );
    }
};

export default View360Popup;