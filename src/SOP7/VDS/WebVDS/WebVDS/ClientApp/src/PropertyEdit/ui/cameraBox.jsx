import React, { Component } from 'react';
import * as THREE from "three/build/three.module.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

import edit from '../../PropertyEdit/css/edit.module.css';
import ProjectResource from '../../Root/resource/id';
import Geometry from '../../Common/util/Geometry';
import Vertex3D from '../../Common/util/Vertex3D';
import Vertex2D from '../../Common/util/Vertex3D';
import { Vector3 } from 'three';
import wsManager from '../../Root/services/wsManager';

class CameraBox extends Component {
    static mode = {
        a: "a",
        u: "u",
        f: "f",
        b: "b",
        l: "l",
        r: "r"
    }

    static modeNumber = {
        a: 1,
        u: 2,
        f: 3,
        b: 4,
        l: 5,
        r: 6
    }

    constructor(props) {
        super(props);
        this.ref3D = React.createRef();

        this.target = null;
        this.origin = null;
        this.mode = {};

        this.movingCamera = null;

        this.clock = new THREE.Clock();
    }

    componentDidMount() {
        this.init();
        CameraBox.animate(this);

        const cubeUrl = ProjectResource.baseUrl + "/resource/glb/items/cameraBox/cube.glb";
        this.loadFile(cubeUrl);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeMethod);
        window.removeEventListener('keydown', this.onKeyDown);
        this.detach3D();
        this.loading = false;
    }

    init() {
        this.loading = true;

        const fov = 30;
        const near = 0.1;
        const far = 5000;
        this.camera = new THREE.PerspectiveCamera(fov, 1, near, far);

        this.scene = new THREE.Scene();

        this.scene.background = new THREE.Color(0x292a2e);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(ambientLight);

        this.dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
        this.dirLight.position.set(3, 10, 10);
        this.dirLight.castShadow = false;
        this.dirLight.shadow.bias = -0.0008;
        this.dirLight.shadow.mapSize.width = 2048;
        this.dirLight.shadow.mapSize.height = 2048;
        this.dirLight.shadow.camera.updateProjectionMatrix();
        this.scene.add(this.dirLight);
        this.scene.add(this.dirLight.target);

        const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
        dirLight2.position.set(-3, -10, -10);
        dirLight2.castShadow = false;
        dirLight2.shadow.bias = -0.0008;
        dirLight2.shadow.mapSize.width = 2048;
        dirLight2.shadow.mapSize.height = 2048;
        dirLight2.shadow.camera.updateProjectionMatrix();
        this.scene.add(dirLight2);
        this.scene.add(dirLight2.target);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.ref3D.current.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 0, 0);

        this.controls.enablePan = false;
        //this.controls.enableRotate = false;
        this.controls.enableZoom = false;

        // 최대 회전각
        this.controls.maxPolarAngle = Math.PI;
        this.controls.update();
    }

    detach3D() {
        if (!this.ref3D.current || !this.renderer?.domElement || this.ref3D.current.children.length === 0) {
            return;
        }

        this.ref3D.current.removeChild(this.renderer.domElement);

        const meshes = [];
        const materials = [];
        const textures = [];
        const geometries = [];

        this.scene.traverse(obj => {
            if (obj instanceof THREE.Mesh) {
                meshes.push(obj);

                if (obj.geometry instanceof THREE.BufferGeometry) {
                    geometries.push(obj.geometry);
                }

                if (obj.material instanceof THREE.Material) {
                    materials.push(obj.material);

                    if (obj.material.map instanceof THREE.Texture) {
                        textures.push(obj.material.map);
                    }
                }
            }
        });

        this.scene.clear();

        meshes.forEach((obj) => {
            if (obj.parent !== null) {
                obj.parent.remove(obj);
            }
            if (obj.dispose) {
                obj.dispose();
            }
        });

        materials.forEach((mat) => {
            if (mat.dispose) {
                mat.dispose();
            }
        });

        textures.forEach((tex) => {
            tex.dispose();
        });

        geometries.forEach((geom) => {
            geom.dispose();
        });

        if (this.scene.background instanceof THREE.Texture) {
            this.scene.background.dispose();
            this.scene.background = null;
        }

        this.renderer.dispose();

        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.dirLight = null;
        this.controls = null;
    }

    loadFile(contents) {
        const index = contents.lastIndexOf('/');
        const fileName = index >= 0 ? contents.substring(index + 1).trim() : contents;

        let loader = null;

        if (fileName.endsWith('.fbx')) {
            loader = new FBXLoader();
        } else if (fileName.endsWith('.glb') || fileName.endsWith('.gltf')) {
            loader = new GLTFLoader();
            // Optional: Provide a DRACOLoader instance to decode compressed mesh data
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath('/three/examples/js/libs/draco/');
            loader.setDRACOLoader(dracoLoader);
        }

        const _this = this;

        loader.load(contents, function (object) {
            const obj = loader instanceof GLTFLoader ? object.scene : object;
            obj.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = false;
                    child.receiveShadow = false;
                }
            });

            const modelNode = new THREE.Object3D();
            modelNode.add(obj);
            modelNode.matrixAutoUpdate = false;
            modelNode.name = fileName;

            const scene = _this.scene;

            if (scene) {
                scene.add(modelNode);
                modelNode.updateMatrixWorld(true);

                _this.cube = modelNode;
                _this.setCameraPosition(modelNode);

                _this.loading = false;
                _this.setState({});
            }
        });
    }

    setCameraPosition(modelNode) {
        const [min, max] = CameraBox.getBoundingBoxMinMax(modelNode);

        if ((min === 0 || min) && (max === 0 || max)) {
            CameraBox.setControlCamera(this.camera, this.controls, min, max);

            const vTarget = new THREE.Vector3(this.controls.target.x, this.controls.target.y, this.controls.target.z);
            const vFront = new Vertex3D(this.camera.position.x, this.camera.position.y, this.camera.position.z);

            this.mode[CameraBox.mode.f] = this.getCameraOption();

            const vBack = new THREE.Vector3(vTarget.x * 2 - vFront.x, vTarget.y * 2 - vFront.y, vTarget.z * 2 - vFront.z);
            this.camera.position.set(vBack.x, vBack.y, vBack.z);
            this.camera.lookAt(vTarget);

            this.mode[CameraBox.mode.b] = this.getCameraOption();

            const vRight = new Vertex3D(0.2147693496106697, vTarget.y, 0.0007404748971006868);
            const vLeft = new Vertex3D(vTarget.x * 2 - vRight.x, vTarget.y * 2 - vRight.y, vTarget.z * 2 - vRight.z);

            const len = vRight.getDistance(vLeft) / 2;
            const vTop = new Vertex3D(vTarget.x, vTarget.y + len, vTarget.z);
            const vBottom = new Vertex3D(vTarget.x, vTarget.y - len, vTarget.z);

            this.camera.position.set(vRight.x, vRight.y, vRight.z);
            this.camera.lookAt(vTarget);
            this.mode[CameraBox.mode.r] = this.getCameraOption();

            this.camera.position.set(vLeft.x, vLeft.y, vLeft.z);
            this.camera.lookAt(vTarget);
            this.mode[CameraBox.mode.l] = this.getCameraOption();

            this.camera.position.set(vTop.x, vTop.y, vTop.z);
            this.camera.lookAt(vTarget);
            this.mode[CameraBox.mode.a] = this.getCameraOption();

            this.camera.position.set(vBottom.x, vBottom.y, vBottom.z);
            this.camera.lookAt(vTarget);

            this.camera.quaternion.y = this.camera.quaternion.x;
            this.camera.quaternion.x = 0;
            this.camera.quaternion.z = -this.camera.quaternion.y;
            this.camera.quaternion.w = 0;

            this.camera.rotation.z = this.camera.rotation.x * 2;

            this.mode[CameraBox.mode.u] = this.getCameraOption();

            this.setCameraMode(this.props.getCameraMode(), false);
        }
    }

    setCameraMode(mode, sendSocket = true) {
        const option = this.mode[mode];

        this.camera.position.set(option.position[0], option.position[1], option.position[2]);
        this.camera.rotation.set(option.rotation[0], option.rotation[1], option.rotation[2]);
        this.camera.quaternion.set(option.quaternion[0], option.quaternion[1], option.quaternion[2], option.quaternion[3]);

        this.props.setCameraMode(mode);

        if (sendSocket) {
            this.props.wsManager.changeMode(wsManager.mode3D.edit, CameraBox.modeNumber[mode]);
        }
    }

    getCameraOption() {
        const option = {
            position: [this.camera.position.x, this.camera.position.y, this.camera.position.z],
            rotation: [this.camera.rotation.x, this.camera.rotation.y, this.camera.rotation.z],
            quaternion: [this.camera.quaternion.x, this.camera.quaternion.y, this.camera.quaternion.z, this.camera.quaternion.w]
        };

        return option;
    }

    static getBoundingBoxMinMax(model) {
        const boundingBox = new THREE.BoxHelper(model, 0xff0000);

        const posArray = boundingBox.geometry?.attributes?.position?.array;

        if (posArray) {
            const arrayCount = posArray.length;
            const min = new THREE.Vector3(null, null, null);
            const max = new THREE.Vector3(null, null, null);

            for (let i = 0; i < arrayCount; i += 3) {
                if (i === 0) {
                    min.x = max.x = posArray[i];
                    min.y = max.y = posArray[i + 1];
                    min.z = max.z = posArray[i + 2];
                }
                else {
                    if (min.x > posArray[i])
                        min.x = posArray[i];
                    if (min.y > posArray[i + 1])
                        min.y = posArray[i + 1];
                    if (min.z > posArray[i + 2])
                        min.z = posArray[i + 2];

                    if (max.x < posArray[i])
                        max.x = posArray[i];
                    if (max.y < posArray[i + 1])
                        max.y = posArray[i + 1];
                    if (max.z < posArray[i + 2])
                        max.z = posArray[i + 2];
                }
            }

            boundingBox.geometry.dispose();

            if (min.x === null)
                return [null, null];
            else
                return [min, max];
        }

        return [null, null];
    }

    static setControlCamera(camera, controls, min, max) {
        if ((min === 0 || min) && (max === 0 || max)) {
            const theta = Math.PI * camera.fov / 180;
            const depth = max.z - min.z;
            const height = max.y - min.y;
            const length = max.x - min.x;
            const len = length > height ? length : height;

            const distance = len / Math.tan(theta / 2);
            const vTarget = new THREE.Vector3((min.x + max.x) / 2, (min.y + max.y) / 2, (min.z + max.z) / 2);

            camera.position.set(vTarget.x, vTarget.y, vTarget.z + depth / 2 + distance);
            CameraBox.goToPercent(0.9, camera, vTarget);

            controls.target.set(vTarget.x, vTarget.y, vTarget.z);
            camera.lookAt(vTarget);
            controls.update();
        }
    }

    static goToPercent(ratio, camera, vOrigin) {
        const v1 = new Vertex3D(vOrigin.x, vOrigin.y, vOrigin.z);
        const v2 = new Vertex3D(camera.position.x, camera.position.y, camera.position.z);

        const len = v1.getDistance(v2);
        const vTarget = Geometry.getLinearVertex3(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z, len * ratio);
        camera.position.set(vTarget[0], vTarget[1], vTarget[2]);
    }

    setMovingCamera(cameraOptions, param) {
        const distancePos = Geometry.getDistance3(this.camera.position.x, this.camera.position.y, this.camera.position.z, cameraOptions.position[0], cameraOptions.position[1], cameraOptions.position[2]);
        const distanceQua = cameraOptions.quaternion === null ? null : Geometry.getDistance4(this.camera.quaternion.x, this.camera.quaternion.y, this.camera.quaternion.z, this.camera.quaternion.w, cameraOptions.quaternion[0], cameraOptions.quaternion[1], cameraOptions.quaternion[2], cameraOptions.quaternion[3]);
        const distanceRot = Geometry.getDistance3(this.camera.rotation.x, this.camera.rotation.y, this.camera.rotation.z, cameraOptions.rotation[0], cameraOptions.rotation[1], cameraOptions.rotation[2]);

        const movingTime = 0.75;
        
        this.movingCamera = {
            // 초
            movingTime: movingTime,
            elapsedTime: 0,
            distancePosition: distancePos,
            distanceQuaternion: distanceQua,
            distanceRotation: distanceRot,
            beginCameraPos: new THREE.Vector3(this.camera.position.x, this.camera.position.y, this.camera.position.z),
            beginCameraQuaternion: new THREE.Quaternion(this.camera.quaternion.x, this.camera.quaternion.y, this.camera.quaternion.z, this.camera.quaternion.w),
            beginCameraRotation: new THREE.Vector3(this.camera.rotation.x, this.camera.rotation.y, this.camera.rotation.z),
            targetCameraOptions: cameraOptions,
            param: param
        };
    }

    moveCamera(delta) {
        const cameraOptions = {
            position: [],
            quaternion: [],
            rotation: []
        }

        if (this.movingCamera) {
            this.movingCamera.elapsedTime += delta;

            if (this.movingCamera.elapsedTime >= this.movingCamera.movingTime) {
                const movingCamera = this.movingCamera;
                this.movingCamera = null;

                cameraOptions.position = [...movingCamera.targetCameraOptions.position];
                cameraOptions.quaternion = movingCamera.targetCameraOptions.quaternion === null ? null : [...movingCamera.targetCameraOptions.quaternion];
                cameraOptions.rotation = [...movingCamera.targetCameraOptions.rotation];

                CameraBox.setCamera(this.camera, cameraOptions, this.controls.target);

                if (cameraOptions.quaternion) {
                    this.camera.quaternion.set(cameraOptions.quaternion[0], cameraOptions.quaternion[1], cameraOptions.quaternion[2], cameraOptions.quaternion[3]);
                }

                this.camera.rotation.set(cameraOptions.rotation[0], cameraOptions.rotation[1], cameraOptions.rotation[2]);
                this.setCameraMode(this.props.getCameraMode());
            }
            else {
                cameraOptions.position = Geometry.getLinearVertex3(this.movingCamera.beginCameraPos.x, this.movingCamera.beginCameraPos.y, this.movingCamera.beginCameraPos.z, this.movingCamera.targetCameraOptions.position[0], this.movingCamera.targetCameraOptions.position[1], this.movingCamera.targetCameraOptions.position[2], this.movingCamera.distancePosition * this.movingCamera.elapsedTime / this.movingCamera.movingTime);
                cameraOptions.quaternion = this.movingCamera.targetCameraOptions.quaternion === null ? null : Geometry.getLinearVertex4(this.movingCamera.beginCameraQuaternion.x, this.movingCamera.beginCameraQuaternion.y, this.movingCamera.beginCameraQuaternion.z, this.movingCamera.beginCameraQuaternion.w, this.movingCamera.targetCameraOptions.quaternion[0], this.movingCamera.targetCameraOptions.quaternion[1], this.movingCamera.targetCameraOptions.quaternion[2], this.movingCamera.targetCameraOptions.quaternion[3], this.movingCamera.distanceQuaternion * this.movingCamera.elapsedTime / this.movingCamera.movingTime);
                cameraOptions.rotation = Geometry.getLinearVertex3(this.movingCamera.beginCameraRotation.x, this.movingCamera.beginCameraRotation.y, this.movingCamera.beginCameraRotation.z, this.movingCamera.targetCameraOptions.rotation[0], this.movingCamera.targetCameraOptions.rotation[1], this.movingCamera.targetCameraOptions.rotation[2], this.movingCamera.distanceRotation * this.movingCamera.elapsedTime / this.movingCamera.movingTime);

                CameraBox.setCamera(this.camera, cameraOptions, this.controls.target);
            }
        }
    }

    static setCamera(camera, cameraOptions, target) {
        camera.position.set(cameraOptions.position[0], cameraOptions.position[1], cameraOptions.position[2]);
        camera.lookAt(target);
    }

    static animate(_this) {
        requestAnimationFrame(() => {
            CameraBox.animate(_this);
        });

        const delta = _this.clock.getDelta();

        if (_this.movingCamera) {
            _this.moveCamera(delta);
        }

        if (_this.renderer && _this.scene && _this.camera && !_this.loading) {
            _this.renderer.render(_this.scene, _this.camera);
        }
    }

    goUp() {
        let nextMode = null;
        const currentMode = this.props.getCameraMode();

        if (currentMode === CameraBox.mode.a) {
            nextMode = CameraBox.mode.b;
        }
        else if (currentMode === CameraBox.mode.f ||
            currentMode === CameraBox.mode.r ||
            currentMode === CameraBox.mode.b ||
            currentMode === CameraBox.mode.l) {
            nextMode = CameraBox.mode.a;
        }
        else /*if (currentMode === CameraBox.mode.u)*/ {
            nextMode = CameraBox.mode.b;
        }

        const option = this.mode[nextMode];
        this.props.setCameraMode(nextMode);
        this.setMovingCamera(option);
    }

    goDown() {
        let nextMode = null;
        const currentMode = this.props.getCameraMode();

        if (currentMode === CameraBox.mode.a) {
            nextMode = CameraBox.mode.f;
        }
        else if (currentMode === CameraBox.mode.f ||
            currentMode === CameraBox.mode.r ||
            currentMode === CameraBox.mode.b ||
            currentMode === CameraBox.mode.l) {
            nextMode = CameraBox.mode.u;
        }
        else /*if (currentMode === CameraBox.mode.u)*/ {
            nextMode = CameraBox.mode.f;
        }

        const option = this.mode[nextMode];
        this.props.setCameraMode(nextMode);
        this.setMovingCamera(option);
    }

    goLeft() {
        let nextMode = null;
        const currentMode = this.props.getCameraMode();

        if (currentMode === CameraBox.mode.a) {
            nextMode = CameraBox.mode.l;
        }
        else if (currentMode === CameraBox.mode.f) {
            nextMode = CameraBox.mode.l;
        }
        else if (currentMode === CameraBox.mode.l) {
            nextMode = CameraBox.mode.b;
        }
        else if (currentMode === CameraBox.mode.b) {
            nextMode = CameraBox.mode.r;
        }
        else if (currentMode === CameraBox.mode.r) {
            nextMode = CameraBox.mode.f;
        }
        else /*if (currentMode === CameraBox.mode.u)*/ {
            nextMode = CameraBox.mode.r;
        }

        const option = this.mode[nextMode];
        this.props.setCameraMode(nextMode);
        this.setMovingCamera(option);
    }

    goRight() {
        let nextMode = null;
        const currentMode = this.props.getCameraMode();

        if (currentMode === CameraBox.mode.a) {
            nextMode = CameraBox.mode.r;
        }
        else if (currentMode === CameraBox.mode.f) {
            nextMode = CameraBox.mode.r;
        }
        else if (currentMode === CameraBox.mode.r) {
            nextMode = CameraBox.mode.b;
        }
        else if (currentMode === CameraBox.mode.b) {
            nextMode = CameraBox.mode.l;
        }
        else if (currentMode === CameraBox.mode.l) {
            nextMode = CameraBox.mode.f;
        }
        else /*if (currentMode === CameraBox.mode.u)*/ {
            nextMode = CameraBox.mode.l;
        }

        const option = this.mode[nextMode];
        this.props.setCameraMode(nextMode);
        this.setMovingCamera(option);
    }

    render() {
        if (this.loading) {
            return <></>;
        }

        return (
            <div className={edit.rack3Dmodeling}>
                <div ref={this.ref3D}>
                </div>
                <span className={edit.btnArrowTop} onClick={() => this.goUp()}></span>
                <span className={edit.btnArrowBottom} onClick={() => this.goDown()}></span>
                <span className={edit.btnArrowLeft} onClick={() => this.goLeft()}></span>
                <span className={edit.btnArrowRight} onClick={() => this.goRight()}></span>
            </div>
        )
    }
}
export default CameraBox;