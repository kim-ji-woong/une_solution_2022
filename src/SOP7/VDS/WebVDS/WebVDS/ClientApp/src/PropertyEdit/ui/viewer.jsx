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
import CommonResource from '../../Common/resource/id';


class Viewer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loadingComplete: false,
            instance: this
        }

        this.ref3D = React.createRef();
    }

    componentDidMount() {
        this.init();
        Viewer.animate(this);

        this.fileUrl = this.props.url;
        this.loadFile(this.props.url);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeMethod);
        window.removeEventListener('keydown', this.onKeyDown);
        this.detach3D();
        this.loading = false;
    }

    static getDerivedStateFromProps(props, state) {
        if (props === state.prevProps) {
            return state;
        }

        if (state.loadingComplete && state.instance.fileUrl !== props.url && props.url && props.url.length > 0) {
            state.instance.fileUrl = props.url;
            state.instance.loadFile(props.url);
        }

        return state;
    }

    init() {
        this.loading = true;

        const rect = this.ref3D.current.getBoundingClientRect();

        const fov = 60;
        const near = 0.1;
        const far = 5000;
        this.camera = new THREE.PerspectiveCamera(fov, rect.width / rect.height, near, far);
        //this.camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, near, far);

        this.scene = new THREE.Scene();

        this.scene.background = new THREE.Color(0x6e6e6e);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(ambientLight);

        this.dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
        this.dirLight.position.set(3, 3, 3);
        this.dirLight.castShadow = false;
        this.dirLight.shadow.bias = -0.0008;
        this.dirLight.shadow.mapSize.width = 2048;
        this.dirLight.shadow.mapSize.height = 2048;
        this.dirLight.shadow.camera.updateProjectionMatrix();
        this.scene.add(this.dirLight);
        this.scene.add(this.dirLight.target);

        const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
        dirLight2.position.set(-1, -1, 1);
        dirLight2.castShadow = false;
        dirLight2.shadow.bias = -0.0008;
        dirLight2.shadow.mapSize.width = 2048;
        dirLight2.shadow.mapSize.height = 2048;
        dirLight2.shadow.camera.updateProjectionMatrix();
        this.scene.add(dirLight2);
        this.scene.add(dirLight2.target);

        this.dirLight3 = new THREE.DirectionalLight(0xffffff, 0.5);
        this.dirLight3.position.set(3, 3, -3);
        this.dirLight3.castShadow = false;
        this.dirLight3.shadow.bias = -0.0008;
        this.dirLight3.shadow.mapSize.width = 2048;
        this.dirLight3.shadow.mapSize.height = 2048;
        this.dirLight3.shadow.camera.updateProjectionMatrix();
        this.scene.add(this.dirLight3);
        this.scene.add(this.dirLight3.target);

        const dirLight4 = new THREE.DirectionalLight(0xffffff, 0.5);
        dirLight4.position.set(-1, -1, -1);
        dirLight4.castShadow = false;
        dirLight4.shadow.bias = -0.0008;
        dirLight4.shadow.mapSize.width = 2048;
        dirLight4.shadow.mapSize.height = 2048;
        dirLight4.shadow.camera.updateProjectionMatrix();
        this.scene.add(dirLight4);
        this.scene.add(dirLight4.target);

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

        // 최대 회전각
        this.controls.maxPolarAngle = Math.PI;
        this.controls.update();
    }

    detach3D() {
        if (!this.ref3D.current || !this.renderer?.domElement || this.ref3D.current.children.length === 0) {
            return;
        }

        try {
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
        }
        catch (e) {
            console.log('3d dispose error');
        }

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

            try {
                const modelNode = new THREE.Object3D();
                modelNode.add(obj);
                modelNode.matrixAutoUpdate = false;
                modelNode.name = fileName;

                _this.controls.minDistance = Viewer.getDistance(modelNode, _this.props.itemType, _this.props.itemModelName);

                const scene = _this.scene;

                if (scene) {
                    scene.add(modelNode);
                    modelNode.updateMatrixWorld(true);

                    _this.setCameraPosition(modelNode);

                    _this.loading = false;
                    _this.setState({ loadingComplete: true });

                    if (_this.ref3D.current !== _this.renderer.domElement.parentElement) {
                        _this.ref3D.current.appendChild(_this.renderer.domElement);
                    }
                }
            }
            catch (e) {
                console.log('3d file loading error : ' + contents);
            }
        });
    }

    static getDistance(modelNode, itemType, modelName) {
        const min = { x: null, y: null, z: null };
        const max = { x: null, y: null, z: null };
        Viewer.getModelBoundingBox(modelNode, min, max);

        const vMin = new Vertex3D(min.x, min.y, min.z);
        const vMax = new Vertex3D(max.x, max.y, max.z);
        const vOrigin = new Vertex3D(0, 0, 0);

        const len1 = vOrigin.getDistance(vMin);
        const len2 = vOrigin.getDistance(vMax);

        if (len1 && len2) {
            let ratio = 0.7;

            if (modelName === "WDR01" || modelName === "ADR01") {
                ratio = 1.2;
            }
            else if (modelName.startsWith("WDS") || modelName.startsWith("ADS") || modelName.startsWith("EDS")) {
                ratio = 1.0;
            }
            else if (modelName.startsWith("APOLLO 4200")) {
                ratio = 0.15;
            }

            if (len1 > len2) {
                return ratio * len1;
            }
            else {
                return ratio * len2;
            }
        }

        return 0;
    }

    static getModelBoundingBox(modelNode, min, max) {
        if (modelNode.isMesh) {
            const boundingBox = modelNode.geometry?.boundingBox;

            if (boundingBox) {
                if (min.x === null) {
                    min.x = boundingBox.min.x;
                    min.y = boundingBox.min.y;
                    min.z = boundingBox.min.z;

                    max.x = boundingBox.max.x;
                    max.y = boundingBox.max.y;
                    max.z = boundingBox.max.z;
                }
                else {
                    if (min.x > boundingBox.min.x) {
                        min.x = boundingBox.min.x;
                    }

                    if (min.y > boundingBox.min.y) {
                        min.y = boundingBox.min.y;
                    }

                    if (min.z > boundingBox.min.z) {
                        min.z = boundingBox.min.z;
                    }

                    if (max.x < boundingBox.max.x) {
                        max.x = boundingBox.max.x;
                    }

                    if (max.y < boundingBox.max.y) {
                        max.y = boundingBox.max.y;
                    }

                    if (max.z < boundingBox.max.z) {
                        max.z = boundingBox.max.z;
                    }
                }
            }
        }
        else {
            for (const child of modelNode.children) {
                Viewer.getModelBoundingBox(child, min, max);
            }
        }
    }

    setCameraPosition(modelNode) {
        const [min, max] = Viewer.getBoundingBoxMinMax(modelNode);

        if ((min === 0 || min) && (max === 0 || max)) {
            Viewer.setControlCamera(this.camera, this.controls, min, max, this.props.itemType);
        }
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

    static setControlCamera(camera, controls, min, max, itemType) {
        if ((min === 0 || min) && (max === 0 || max)) {
            const theta = Math.PI * camera.fov / 180;
            const depth = max.z - min.z;
            const height = max.y - min.y;
            const length = max.x - min.x;
            const len = length > height ? length / 2 : height / 2;

            const distance = len / Math.tan(theta / 2);
            const vTarget = new THREE.Vector3((min.x + max.x) / 2, (min.y + max.y) / 2, (min.z + max.z) / 2);

            camera.position.set(vTarget.x, vTarget.y, vTarget.z + depth / 2 + distance);

            if (itemType === ProjectResource.ID.edit.editPropertyDetail.rack) {
                camera.position.y *= 2.15;
                camera.position.z *= 0.75;
                camera.position.x = -camera.position.z / 2;

                Viewer.goToPercent(1.1, camera, vTarget);
            }
            else {
                Viewer.goToPercent(0.9, camera, vTarget);
            }

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

    static animate(_this) {
        requestAnimationFrame(() => {
            Viewer.animate(_this);
        });

        if (_this.renderer && _this.scene && _this.camera && !_this.loading) {
            _this.renderer.render(_this.scene, _this.camera);
        }
    }

    render() {
        if (this.loading) {
            return <></>;
        }

        return (
            <div id={edit.ITpropertyPop + " " + CommonResource.UISection}>
                <div>
                    <div>
                        <div className={edit.viewerBox + " " +  CommonResource.UISection}>
                            <span className={edit.viewerTitle}>{ProjectResource.ID.edit.view3d}</span>
                            <div ref={this.ref3D} className={edit.viewerContents}>
                                <span className={edit.viewerRackTitle}>{this.props.itemModelName}</span>
                                <span className={edit.viewerBack}>
                                    {
                                        this.state.loadingComplete &&
                                        <p onClick={() => this.props.show3DItem(null)}>{ProjectResource.ID.edit.view3dDetail.goBack}</p>
                                    }
                                    <span className={edit.viewerFastIcon}></span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Viewer;