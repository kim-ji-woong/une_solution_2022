import * as THREE from 'three';
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import { BufferGeometryUtils } from './bufferGeometryUtils';
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import Vertex3D from '../../../Common/util/Vertex3D';
import Contents3D from './contents3D';
import SDMSMainMenu from '../sdmsMainMenu';
import { SDMSDataManager } from '../../services/sdmsDataManager';
import { PipePathManager } from './pipePathManager';

export class PipeManager {
    static ENTIRE_SCENE = 0;
    static BLOOM_SCENE = 1;

    static OutdoorElectricPipeName = "pipe";

    static AirFan_Data = {
        groupName: "공조설비",
        beginTag: "air_",
        selectedTag: "air_box-0",
        selectedBeginTag: "air_box",
        pipeTag: "air_pipe_",
        sphereModels: "air_sphere"
    }

    static ExitLight_Data = {
        groupName: "유도등",
        beginTag: "light_",
        selectedTag: "light_effect-0",
        selectedBeginTag: "light_effect_",
        pipeTag: "light_pipe_",
        sphereModels: "light_sphere"
    }

    static Electric_Data = {
        groupName: "전기",
        beginTag: "electric_",
        selectedTag: "electric_box-0",
        selectedBeginTag: "electric_box",
        pipeTag: "electric_pipe_",
        sphereModels: "electric_sphere"
    }

    static Panel1_Data = {
        groupName: "전기실",
        beginTag: "panel_1_",
        selectedTag: "panel_1_box-0",
        selectedBeginTag: "panel_1_box",
        pipeTag: "panel_1_pipe_",
        sphereModels: "panel_1_sphere"
    }

    static Panel2_Data = {
        groupName: "전기실",
        beginTag: "panel_2_",
        selectedTag: "panel_2_box-0",
        selectedBeginTag: "panel_2_box",
        pipeTag: "panel_2_pipe_",
        sphereModels: "panel_2_sphere"
    }

    static Fire_Data = {
        groupName: "소화설비",
        beginTag: "fire_",
        selectedTag: "fire_effect-0",
        selectedBeginTag: "fire_effect_"
    }

    static Escape_Data = {
        groupName: "",
        beginTag: "escape_s_",
        sphereModels: "escape_sphere"
    }

    /*static Electric_BeginTag = "light_";
    static Electric_Selected_Tag = "light_effect";*/

    constructor(contents3D) {
        this.contents3D = contents3D;

        // shader 사용안함
        //this.bloomComposer = this.setComposer();
        this.modelPipePaths = {};
        this.prevPathDatas = {};
        //this.pipePath = [];
        //this.setPath(PipeManager.Outdoor_Path, 3);
        //this.closePath = false;
        //this.pathTemp = 0;

        this.pipeModels = {
            outdoor: {
                layer: null
                /*공조설비: {
                    facilities: [],
                    pipes: {}
                },
                유도등: {
                    facilities: [],
                    pipes: {}
                },*/
            },
            indoors: {
                // 1 => zoneID
                /*1: {
                    공조설비: {
                        facilities: [],
                        pipes: {}
                    },
                    유도등: {
                        facilities: [],
                        pipes: {}
                    },
                },*/
            }
        };
        /*this.airFans = {
            outdoor: [],
            indoors: {}
        };

        this.exitLights = {
            outdoor: [],
            indoors: {}
        };

        this.electrics = {
            outdoor: [],
            indoors: {}
        };*/

        this.currentModels = this.makeNewPipeModel2();
        this.pipePathManager = new PipePathManager(contents3D);

        // 공조설비 리스트
        /*this.currentAirFanList = [];
        // 유도등 리스트
        this.currentExitLightList = [];
        // 전력설비 리스트
        this.currentElectricList = [];*/
    }

    setComposer() {
        //bloom renderer
        const renderScene = new RenderPass(this.contents3D.scene, this.contents3D.camera);
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5,
            0.4,
            0.85
        );
        bloomPass.threshold = 0;
        bloomPass.strength = 20; //intensity of glow
        bloomPass.radius = 0;

        this.bloomPass = bloomPass;

        const bloomComposer = new EffectComposer(this.contents3D.renderer);
        bloomComposer.setSize(window.innerWidth, window.innerHeight);
        bloomComposer.renderToScreen = true;
        bloomComposer.addPass(renderScene);
        bloomComposer.addPass(bloomPass);

        const finalPass = new ShaderPass(
            new THREE.ShaderMaterial({
                uniforms: {
                    baseTexture: { value: null },
                    bloomTexture: { value: bloomComposer.renderTarget2.texture }
                },
                vertexShader: `
		    varying vec2 vUv;
		    void main() {
			    vUv = uv;
			    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		    }
    `,
                fragmentShader: `
		    uniform sampler2D baseTexture;
            uniform sampler2D bloomTexture;

            varying vec2 vUv;

            void main() {

                gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );

            }
    `,
                defines: {}
            }), 'baseTexture'
        );
        finalPass.needsSwap = true;

        const finalComposer = new EffectComposer(this.contents3D.renderer);
        finalComposer.setSize(window.innerWidth, window.innerHeight);
        finalComposer.addPass(renderScene);
        finalComposer.addPass(finalPass);

        this.finalComposer = finalComposer;

        //sun object
        /*const color = new THREE.Color("#ff0000");
        //const color = new THREE.Color("#FDB813");
        const geometry = new THREE.IcosahedronGeometry(4, 15);
        const material = new THREE.MeshBasicMaterial({ color: color });

        this.spheres = new THREE.Object3D();
        this.contents3D.scene.add(this.spheres);
        this.spheres.visible = false;

        this.sphereCount = 10;

        for (let i = 1; i <= this.sphereCount; i++) {
            const sphere = new THREE.Mesh(geometry, material);
            sphere.layers.set(PipeManager.BLOOM_SCENE);
            //this.contents3D.scene.add(sphere);
            this.spheres.add(sphere);
        }*/

        //this.currentSphere = sphere;
        return bloomComposer;
    }

    addSpheres(name, sphereCount) {
        //sun object
        const color = new THREE.Color("#ff0000");
        //const color = new THREE.Color("#FDB813");
        const geometry = new THREE.IcosahedronGeometry(4, 15);
        const material = new THREE.MeshBasicMaterial({ color: color });

        const spheres = new THREE.Object3D();
        spheres.layers.set(PipeManager.BLOOM_SCENE);
        spheres.name = name;
        this.contents3D.scene.add(spheres);
        spheres.visible = false;

        for (let i = 1; i <= sphereCount; i++) {
            const sphere = new THREE.Mesh(geometry, material);
            //sphere.layers.set(PipeManager.BLOOM_SCENE);
            spheres.add(sphere);
        }

        return spheres;
    }

    setOutdoorPipe(modelNode) {
        const pipeMesh = this.getPipe(modelNode);

        if (pipeMesh) {
            pipeMesh.material.transparent = true;
            pipeMesh.material.opacity = 0.5;
        }
    }

    /*setPipeBall(modelNode, type, pipeName, mode) {
        const modelName = modelNode.name;
        let pipePaths = this.modelPipePaths[modelName];

        if (!pipePaths) {
            pipePaths = {};
            this.modelPipePaths[modelName] = pipePaths;
        }

        let pipePath = pipePaths[type];

        if (!pipePath) {
            pipePath = {};
            pipePaths[type] = pipePath;
        }

        //pipePath.push(pipeName);

        if (mode === Contents3D.Mode_Outdoor_All) {
            const pipeMesh = this.getPipe(modelNode);

            if (pipeMesh) {
                pipeMesh.material.transparent = true;
                pipeMesh.material.opacity = 0.5;
            }

            const sphereCount = 10;
            const pathData = this.setPath(PipeManager.Outdoor_Path, 3, sphereCount);
            pathData.spheres = this.addSpheres("outdoorSpheres", sphereCount);
            pipePath[pipeName] = pathData;
        }
    }*/

    getPipe(modelNode) {
        const childCount = modelNode.children.length;

        for (let i = 0; i < childCount; i++) {
            const child = modelNode.children[i];

            if (child.name.startsWith(PipeManager.OutdoorElectricPipeName) && child instanceof THREE.Mesh) {
                return child;
            }

            const model = this.getPipe(child);

            if (model) {
                return model;
            }
        }

        return null;
    }

    /*setPipeBall(modelNode, type) {
        this.pipeBallModel = modelNode;
        this.pipeBallModel.userData.typeName = type;
        this.pipeBallMesh = this.getPipeBall(modelNode);

        if (this.pipeBallMesh) {
            this.pipeBallMesh.scale.x = 0.1;
            this.pipeBallMesh.scale.y = 0.1;
            this.pipeBallMesh.scale.z = 0.1;
        }
    }

    getPipeBall(modelNode) {
        const childCount = modelNode.children.length;

        for (let i = 0; i < childCount; i++) {
            const child = modelNode.children[i];

            if (child instanceof THREE.Mesh) {
                return child;
            }

            const model = this.getPipeBall(child);

            if (model) {
                return model;
            }
        }

        return null;
    }*/

    // 중간점을 넣어서 속도를 늦추게 한다.
    // speed는 1 또는 그보다 큰 정수이어야 하며, 소수점은 쓸수 없다.
    setSpeed(path, speed/*: integer*/) {
        if (speed === null || speed === undefined || speed === 1) {
            //this.pipePath = path;
            return path;
        }

        //this.pipePath = [];
        const pipePath = [];
        const pathCount = path.length;

        for (let i = 0; i < pathCount; i++) {
            const vPos1 = path[i];
            pipePath.push(vPos1);

            if (i < pathCount - 1) {
                const vPos2 = path[i + 1];
                const len = vPos1.getDistance(vPos2);

                for (let j = 1; j < speed; j++) {
                    const vPos = vPos1.getLinearVertex(vPos2, len * j / speed);
                    pipePath.push(vPos);
                }
            }
        }

        return pipePath;
    }

    setPath(path, speed, sphereCount) {
        const pipePath = this.setSpeed(path, speed);

        const pathData = {};

        pathData.pathCount = pipePath.length;
        pathData.pathIndex = [];

        for (let i = 0; i < sphereCount; i++) {
            const index = Math.trunc(pathData.pathCount / sphereCount * i);
            pathData.pathIndex.push(index);
        }

        pathData.renderIndex = -1;
        pathData.path = pipePath;
        pathData.sphereCount = sphereCount;
        return pathData;
    }

    /*setPathCount() {
        this.pathCount = this.pipePath.length;
        this.pathIndex = [];

        for (let i = 0; i < this.sphereCount; i++) {
            const index = Math.trunc(this.pathCount / this.sphereCount * i);
            this.pathIndex.push(index);
        }

        for (let i = 0; i < this.pathCount; i++) {
            const vPos = this.pipePath[i];
            console.log(", new Vertex3D(" + vPos.x + ", " + vPos.y + ", " + vPos.z + ")");
        }

        this.renderIndex = -1;
    }*/

    traceSphereModels() {
        for (const typeName in this.sphereModels) {
            const spheres = this.sphereModels[typeName];

            for (const sphere of spheres) {
                /*if (this.checkSphereName(sphere.name))*/ {
                    console.log("[Sphere] " + sphere.name + " : " + sphere.position.x + ", " + sphere.position.y + ", " + sphere.position.z);
                }
            }
        }
    }

    /*checkSphereName(name) {
        if (name === "light_s_03_pipe_12")
            return true;

        return false;
    }*/

    showEscape(visibleSensorTypes, zoneID, delta) {
        const modelName = this.getModelName();

        if (modelName) {
            this.pipePathManager.showEscape(visibleSensorTypes, zoneID, delta);

            /*this.contents3D.camera.layers.set(PipeManager.BLOOM_SCENE);
            this.bloomComposer.render();
            this.contents3D.camera.layers.set(PipeManager.ENTIRE_SCENE);
            this.finalComposer.render();

            return true;*/
        }

        return false;
    }

    runPipeBall(visibleSensorTypes, zoneID, selectedSensorModel, selectedPOI, delta) {
        const modelName = this.getModelName();

        if (modelName) {
            //this.setVisible(visibleSensorTypes);

            /*if (this.sphereModels) {
                this.traceSphereModels();
            }*/

        //if (this.pipeBallModel && this.pipeBallMesh) {
            this.pipePathManager.showPathDatas(visibleSensorTypes, zoneID, selectedSensorModel, selectedPOI, delta, this.pipeModels);
            /*const pathDatas = this.getPathDatas(modelName, visibleSensorTypes, zoneID);
            this.hidePrevPathDatas(pathDatas);
            this.showPathDatas(pathDatas);*/
            /*if (this.pipeBallModel.visible) {
                if (this.pipeBallModel.userData?.typeName && visibleSensorTypes[this.pipeBallModel.userData.typeName]) {
                    this.setPosition();
                }
                else
                    this.spheres.visible = false;*/
                /*this.currentSphere.position.x = this.pipeBallMesh.position.x;
                this.currentSphere.position.y = this.pipeBallMesh.position.y;
                this.currentSphere.position.z = this.pipeBallMesh.position.z;
                this.currentSphere.visible = true;*/

                /*if (this.closePath === false) {
                    const v = new Vertex3D(this.pipeBallMesh.position.x, this.pipeBallMesh.position.y, this.pipeBallMesh.position.z);

                    if (this.pipePath.length >= 10) {
                        const len1 = this.pipePath[0].getDistance(this.pipePath[1]);
                        const len2 = this.pipePath[0].getDistance(v);
                        const len3 = this.pipePath[1].getDistance(v);

                        if (Math.abs(len1 - (len2 + len3)) < 0.1 && len2 < len1 && len3 < len1) {
                        //if (this.pipePath[0].getDistance(v) < 1) {
                            this.closePath = true;
                            this.setPathCount();
                        }
                        else
                            this.pipePath.push(v);

                        // 처음에 경로가 튀는 현상이 있어 새로 설정
                        if (this.pathTemp === 0) {
                            this.pipePath = [];
                            this.pathTemp += 1;
                        }
                    }
                    else
                        this.pipePath.push(v);
                }
                else {
                    this.renderIndex += 1;

                    if (this.renderIndex >= this.pathCount) {
                        this.renderIndex = 0;
                    }

                    for (let i = 0; i < this.sphereCount; i++) {
                        let index = this.pathIndex[i] + this.renderIndex;

                        if (index >= this.pathCount) {
                            index -= this.pathCount;
                        }

                        const vPos = this.pipePath[index];
                        const sphere = this.spheres.children[i];

                        sphere.position.x = vPos.x;
                        sphere.position.y = vPos.y;
                        sphere.position.z = vPos.z;
                    }

                    this.spheres.visible = true;
                }*/

                // shader 사용안함
                /*this.contents3D.camera.layers.set(PipeManager.BLOOM_SCENE);
                this.bloomComposer.render();
                this.contents3D.camera.layers.set(PipeManager.ENTIRE_SCENE);
                this.finalComposer.render();
                
                return true;*/
            /*}
            else {
                //this.currentSphere.visible = false;
                this.spheres.visible = false;
            }*/
        }

        return false;
    }

    setVisible(visibleSensorTypes) {
        const facilities = { ...this.currentModels.facilities };
        const pipes = { ...this.currentModels.pipes };

        this._setVisible(SDMSMainMenu.AirFan, visibleSensorTypes[SDMSMainMenu.AirFan], facilities, pipes);
        this._setVisible(SDMSMainMenu.ExitLight_Sensor, visibleSensorTypes[SDMSMainMenu.ExitLight_Sensor], facilities, pipes);
        this._setVisible(SDMSMainMenu.Electric_Sensor, visibleSensorTypes[SDMSMainMenu.Electric_Sensor], facilities, pipes);
        this._setVisible(SDMSMainMenu.Panel1, visibleSensorTypes[SDMSMainMenu.Panel1], facilities, pipes);
        this._setVisible(SDMSMainMenu.Panel2, visibleSensorTypes[SDMSMainMenu.Panel2], facilities, pipes);
    }

    _setVisible(typeName, visible, facilities, pipes) {
        const facilityList = facilities[typeName];

        if (facilityList) {
            for (const facility of facilityList) {
                if (facility.visible === visible) {
                    break;
                }

                if (visible) {
                    if (facility.userData.enable)
                        facility.visible = visible;
                }
                else {
                    facility.visible = visible;
                    facility.userData.enable = true;
                }
            }
        }

        const pipeList = pipes[typeName];

        if (pipeList) {
            for (const pipeName in pipeList) {
                const pipe = pipeList[pipeName];

                if (pipe.visible === visible) {
                    break;
                }

                if (visible) {
                    if (pipe.userData.enable)
                        pipe.visible = visible;
                }
                else {
                    pipe.visible = visible;
                    pipe.userData.enable = true;
                }
            }
        }
    }

    isEmpty() {
        for (const pipeName in this.prevPathDatas) {
            return false;
        }

        return true;
    }

    clearAll() {
        this.pipePathManager.clearPath();
        /*for (const pipeName in this.prevPathDatas) {
            const pathData = this.prevPathDatas[pipeName];

            if (pathData)
                pathData.spheres.visible = false;
        }

        this.prevPathDatas = {};*/
    }

    showPathDatas(pathDatas) {
        for (const pipeName in pathDatas) {
            const pathData = pathDatas[pipeName];

            if (pathData) {
                this.setPosition(pathData);
                pathData.spheres.visible = true;
            }
        }

        this.prevPathDatas = pathDatas;
    }

    hidePrevPathDatas(pathDatas) {
        for (const pipeName in this.prevPathDatas) {
            if (!pathDatas[pipeName]) {
                const pathData = this.prevPathDatas[pipeName];

                if (pathData)
                    pathData.spheres.visible = false;
            }
        }
    }

    getPathDatas(modelName, visibleSensorTypes, zoneID) {
        const pathDatas = {};
        const pipePath = this.modelPipePaths[modelName];

        if (!pipePath)
            return pathDatas;

        for (const typeName in pipePath) {
            if (visibleSensorTypes[typeName]) {
                const typePipePaths = pipePath[typeName];

                if (typePipePaths) {
                    for (const pipeName in typePipePaths) {
                        const pathData = typePipePaths[pipeName];

                        if (pathData?.spheres) {
                            pathDatas[pipeName] = pathData;
                        }
                    }
                }
            }
        }

        return pathDatas;
    }

    getModelName() {
        const currentModel = this.contents3D?.currentModel;

        if (!currentModel)
            return null;

        if (currentModel.userData.xrayMode)
            return currentModel.name;
        else if (currentModel.userData.pair?.userData?.xrayMode)
            return currentModel.userData.pair.name;

        return null;
    }

    setPosition(pathData) {
        pathData.renderIndex += 1;

        if (pathData.renderIndex >= pathData.pathCount) {
            pathData.renderIndex = 0;
        }

        for (let i = 0; i < pathData.sphereCount; i++) {
            let index = pathData.pathIndex[i] + pathData.renderIndex;

            if (index >= pathData.pathCount) {
                index -= pathData.pathCount;
            }

            const vPos = pathData.path[index];
            const sphere = pathData.spheres.children[i];

            sphere.position.x = vPos.x;
            sphere.position.y = vPos.y;
            sphere.position.z = vPos.z;
        }

        pathData.spheres.visible = true;
    }

    /*setPosition() {
        this.renderIndex += 1;

        if (this.renderIndex >= this.pathCount) {
            this.renderIndex = 0;
        }

        for (let i = 0; i < this.sphereCount; i++) {
            let index = this.pathIndex[i] + this.renderIndex;

            if (index >= this.pathCount) {
                index -= this.pathCount;
            }

            const vPos = this.pipePath[index];
            const sphere = this.spheres.children[i];

            sphere.position.x = vPos.x;
            sphere.position.y = vPos.y;
            sphere.position.z = vPos.z;
        }

        this.spheres.visible = true;
    }*/

    changePipes(zoneID) {
        this.setCurrentPipes(zoneID);

        if (this.contents3D.currentModel && this.contents3D.currentModel.userData.pair) {
            const currentModel = this.contents3D.currentModel.userData.xrayMode ? this.contents3D.currentModel : this.contents3D.currentModel.userData.pair;
            //this.pipePathManager.hideAnimationModels(zoneID, currentModel);
        }

        this.pipePathManager.clearBoundingBoxModels();

        /*if (zoneID === 9 && this.contents3D.currentModel.name === "LGCNS_P10-8F_T.glb") {
            if (!this.sphereModels) {
                this.sphereModels = this.getSpheres(this.contents3D.currentModel);
            }
        }*/
    }

    getSpheres(model) {
        const sphereModels = {};
        this._getSpheres(model, sphereModels);
        return sphereModels;
    }

    _getSpheres(model, sphereModels) {
        const airFans = PipeManager.getModel(model, PipeManager.AirFan_Data.groupName, true);

        if (airFans) {
            const sphereParent = PipeManager.getModel(airFans, PipeManager.AirFan_Data.sphereModels, false);
            const spheres = [];
            sphereModels[SDMSMainMenu.AirFan] = spheres;

            for (const sphere of sphereParent.children) {
                spheres.push(sphere);
                /*if (this.checkSphereName(sphere.name) === false)
                    sphere.visible = false;*/
            }
        }

        const exitLights = PipeManager.getModel(model, PipeManager.ExitLight_Data.groupName, true);

        if (exitLights) {
            const sphereParent = PipeManager.getModel(exitLights, PipeManager.ExitLight_Data.sphereModels, false);
            const spheres = [];
            sphereModels[SDMSMainMenu.ExitLight_Sensor] = spheres;

            for (const sphere of sphereParent.children) {
                spheres.push(sphere);
                /*if (this.checkSphereName(sphere.name) === false)
                    sphere.visible = false;*/
            }
        }

        const electrics = PipeManager.getModel(model, PipeManager.Electric_Data.groupName, true);

        if (electrics) {
            const sphereParent = PipeManager.getModel(electrics, PipeManager.Electric_Data.sphereModels, false);
            const spheres = [];
            sphereModels[SDMSMainMenu.Electric_Sensor] = spheres;

            for (const sphere of sphereParent.children) {
                spheres.push(sphere);
                /*if (this.checkSphereName(sphere.name) === false)
                    sphere.visible = false;*/
            }
        }

        const panel1s = PipeManager.getModel(model, PipeManager.Panel1_Data.groupName, true);

        if (panel1s) {
            const sphereParent = PipeManager.getModel(panel1s, PipeManager.Panel1_Data.sphereModels, false);
            const spheres = [];
            sphereModels[SDMSMainMenu.Panel1] = spheres;

            for (const sphere of sphereParent.children) {
                spheres.push(sphere);
            }
        }

        const panel2s = PipeManager.getModel(model, PipeManager.Panel2_Data.groupName, true);

        if (panel2s) {
            const sphereParent = PipeManager.getModel(panel2s, PipeManager.Panel2_Data.sphereModels, false);
            const spheres = [];
            sphereModels[SDMSMainMenu.Panel2] = spheres;

            for (const sphere of sphereParent.children) {
                spheres.push(sphere);
            }
        }
    }

    setPipes(model, isOutdoor, zoneID) {
        const airFanList = [];
        const exitLightList = [];
        const electricList = [];
        const panel1List = [];
        const panel2List = [];

        this._setPipes(model, airFanList, exitLightList, electricList, panel1List, panel2List);

        const airFans = this.getPipeModel(SDMSMainMenu.AirFan, isOutdoor, zoneID);
        const exitLights = this.getPipeModel(SDMSMainMenu.ExitLight_Sensor, isOutdoor, zoneID);
        const electrics = this.getPipeModel(SDMSMainMenu.Electric_Sensor, isOutdoor, zoneID);
        const panel1s = this.getPipeModel(SDMSMainMenu.Panel1, isOutdoor, zoneID);
        const panel2s = this.getPipeModel(SDMSMainMenu.Panel2, isOutdoor, zoneID);

        if (airFans)
            airFans.facilities = airFanList;

        if (exitLights)
            exitLights.facilities = exitLightList;

        if (electrics)
            electrics.facilities = electricList;

        if (panel1s)
            panel1s.facilities = panel1List;

        if (panel2s)
            panel2s.facilities = panel2List;

        if (isOutdoor) {
            if (electrics) {
                //const pipeName = this.setTemporaryOutdoorElectricPipes(model, electrics);
                //this.setPipeBall(model, SDMSMainMenu.Electric_Sensor, pipeName, Contents3D.Mode_Outdoor_All);
            }

            // Outdoor Model의 Pipe를 기본값으로 한다.
            this.setCurrentPipes(null);
        }
        else if (zoneID !== null) {
            if (airFans) {
                airFans.pipes = this.setPipeModel(model, PipeManager.AirFan_Data, zoneID, isOutdoor);
                this.setLinkedPipes(airFans);
            }

            if (exitLights) {
                exitLights.pipes = this.setPipeModel(model, PipeManager.ExitLight_Data, zoneID, isOutdoor);
                this.setLinkedPipes(exitLights);
            }

            if (electrics) {
                electrics.pipes = this.setPipeModel(model, PipeManager.Electric_Data, zoneID, isOutdoor);
                this.setLinkedPipes(electrics);
            }

            if (panel1s) {
                panel1s.pipes = this.setPipeModel(model, PipeManager.Panel1_Data, zoneID, isOutdoor);
                this.setLinkedPipes(panel1s);
            }

            if (panel2s) {
                panel2s.pipes = this.setPipeModel(model, PipeManager.Panel2_Data, zoneID, isOutdoor);
                this.setLinkedPipes(panel2s);
            }
        }

        /*if (isOutdoor) {
            this.airFans.outdoor = airFanList;
            this.exitLights.outdoor = exitLightList;
            this.electrics.outdoor = electricList;

            this.setTemporaryOutdoorElectricPipes(model);

            // Outdoor Model의 Pipe를 기본값으로 한다.
            this.setCurrentPipes(null);
        }
        else if (zoneID !== null) {
            this.airFans.indoors[zoneID] = airFanList;
            this.exitLights.indoors[zoneID] = exitLightList;
            this.electrics.indoors[zoneID] = electricList;
        }*/
    }

    setLinkedPipes(data) {
        const pipes = {};

        for (const pipeName in data.pipes) {
            const pipe = data.pipes[pipeName];
            pipes[pipe.userData.pipeID] = pipe;
        }

        for (const facility of data.facilities) {
            const idList = this.getPipeIDList(facility.name);
            const pipeList = [];
            facility.userData.pipes = pipeList;

            for (const pipeID of idList) {
                const pipe = pipes[pipeID];

                if (pipe) {
                    pipeList.push(pipe);

                    let facilities = pipe.userData.facilities;

                    if (!facilities) {
                        facilities = [];
                        pipe.userData.facilities = facilities;
                    }

                    if (facilities.includes(facility) === false)
                        facilities.push(facility);
                }
            }
        }
    }

    getPipeIDList(name) {
        const idList = [];
        const tag = "pipe_";
        const index = name.indexOf(tag);

        if (index < 0)
            return idList;

        const strIDs = name.substring(index + tag.length);
        const tokens = strIDs.split('_');

        for (const token of tokens) {
            const id = parseInt(token.trim());

            if (id === 0 || id) {
                idList.push(id);
            }
        }

        return idList;
    }

    setPipeModel(model, typeData, zoneID, isOutdoor) {
        const models = PipeManager.getModel(model, typeData.groupName, true);
        const pipes = {};
        const len = typeData.pipeTag.length;

        if (models) {
            const layer = this.getPipeLayer(zoneID, isOutdoor, models);
            const childCount = models.children.length;

            for (let i = childCount - 1; i >= 0;i--) {
                const model = models.children[i];

                if (model.name.startsWith(typeData.pipeTag)) {
                    const pipeID = parseInt(model.name.substring(len).trim());

                    if (pipeID === 0 || pipeID) {
                        model.userData.pipeID = pipeID;
                        model.userData.enable = true;
                        pipes[model.name] = model;

                        if (layer) {
                            // 원래 모델의 위치에서 layer로 위치를 이동한다.
                            const parentModel = model.parent;
                            models.remove(model);

                            if (layer.parent === parentModel) {
                                layer.add(model);
                            }
                            else {
                                const linkedLayer = this.getPipeLinkedLayer(layer, parentModel);
                                linkedLayer.add(model);
                            }
                        }
                    }
                }
            }
        }

        return pipes;
    }

    getPipeLinkedLayer(layer, parentModel) {
        for (const linkedLayer of layer.userData.linkedLayers) {
            if (linkedLayer === parentModel) {
                return linkedLayer;
            }
        }

        const linkedLayer = new THREE.Object3D();
        parentModel.add(linkedLayer);

        linkedLayer.matrixAutoUpdate = true;
        linkedLayer.name = "linkedLayer";
        linkedLayer.updateMatrixWorld(true);
        linkedLayer.visible = true;

        return linkedLayer;
    }

    getPipeLayer(zoneID, isOutdoor, models) {
        let layer = {};

        if (isOutdoor) {
            layer = this.pipeModels.outdoor.layer;

            if (!layer) {
                layer = new THREE.Object3D();
                models.add(layer);
                layer.matrixAutoUpdate = true;
                layer.name = "outdoor_pipe_layer";
                layer.updateMatrixWorld(true);
                layer.visible = true;
                layer.userData.linkedLayers = [];

                this.pipeModels.outdoor.layer = layer;
            }
        }
        else {
            layer = this.pipeModels.indoors[zoneID].layer;

            if (!layer) {
                layer = new THREE.Object3D();
                models.add(layer);
                layer.matrixAutoUpdate = true;
                layer.name = "indoor_" + zoneID + "_pipe_layer";
                layer.updateMatrixWorld(true);
                layer.visible = true;
                layer.userData.linkedLayers = [];

                this.pipeModels.indoors[zoneID].layer = layer;
            }
        }

        return layer;
    }

    getPipeModel(typeName, isOutdoor, zoneID) {
        let pipeModel = null;

        if (isOutdoor) {
            pipeModel = this.pipeModels.outdoor[typeName];

            if (!pipeModel) {
                pipeModel = this.makeNewPipeModel();
                this.pipeModels.outdoor[typeName] = pipeModel;
            }
        }
        else if (zoneID !== null) {
            let pipeModels = this.pipeModels.indoors[zoneID];

            if (!pipeModels) {
                pipeModels = {layer: null};
                this.pipeModels.indoors[zoneID] = pipeModels;
            }

            pipeModel = pipeModels[typeName];

            if (!pipeModel) {
                pipeModel = this.makeNewPipeModel();
                pipeModels[typeName] = pipeModel;
            }
        }

        return pipeModel;
    }

    makeNewPipeModel() {
        return {
            facilities: [],
            pipes: {}
        };
    }

    makeNewPipeModel2() {
        return {
            facilities: {},
            pipes: {}
        };
    }

    // 임시로 outdoor 모델의 전력설비 모델을 읽어온다.
    setTemporaryOutdoorElectricPipes(model, electrics) {
        const pipeModel = PipeManager.getModel(model, PipeManager.OutdoorElectricPipeName, false);

        if (pipeModel) {
            electrics.pipes[pipeModel.name] = pipeModel;
        }

        const pipeName = pipeModel ? pipeModel.name : "";
        const electricModel1 = PipeManager.getModel(model, "LG01", false);
        const electricModel1Selected = PipeManager.getModel(model, "LG01" + SDMSDataManager.BoundingBoxTag, false);

        if (electricModel1 && electricModel1Selected) {
            electricModel1.userData.boundingModel = false;
            electricModel1.userData.pair = electricModel1Selected;
            electricModel1Selected.userData.boundingModel = true;
            electricModel1Selected.userData.pair = electricModel1;

            electricModel1Selected.visible = false;
            electrics.facilities.push(electricModel1);

            electricModel1.userData.enable = true;
            electricModel1Selected.userData.enable = true;
        }

        const electricModel2 = PipeManager.getModel(model, "LG02", false);
        const electricModel2Selected = PipeManager.getModel(model, "LG02" + SDMSDataManager.BoundingBoxTag, false);

        if (electricModel2 && electricModel2Selected) {
            electricModel2.userData.boundingModel = false;
            electricModel2.userData.pair = electricModel2Selected;
            electricModel2Selected.userData.boundingModel = true;
            electricModel2Selected.userData.pair = electricModel2;

            electricModel2Selected.visible = false;
            electrics.facilities.push(electricModel2);

            electricModel2.userData.enable = true;
            electricModel2Selected.userData.enable = true;
        }

        return pipeName;
    }

    setCurrentPipes(zoneID) {
        const airFans = this.getPipeModel(SDMSMainMenu.AirFan, zoneID === null, zoneID);
        const exitLights = this.getPipeModel(SDMSMainMenu.ExitLight_Sensor, zoneID === null, zoneID);
        const electrics = this.getPipeModel(SDMSMainMenu.Electric_Sensor, zoneID === null, zoneID);
        const panel1s = this.getPipeModel(SDMSMainMenu.Panel1, zoneID === null, zoneID);
        const panel2s = this.getPipeModel(SDMSMainMenu.Panel2, zoneID === null, zoneID);

        const currentModels = this.makeNewPipeModel2();

        this.setCurrentModels(airFans, currentModels, SDMSMainMenu.AirFan);
        this.setCurrentModels(exitLights, currentModels, SDMSMainMenu.ExitLight_Sensor);
        this.setCurrentModels(electrics, currentModels, SDMSMainMenu.Electric_Sensor);
        this.setCurrentModels(panel1s, currentModels, SDMSMainMenu.Panel1);
        this.setCurrentModels(panel2s, currentModels, SDMSMainMenu.Panel2);

        this.currentModels = currentModels;
        this.pipePathManager.setCurrentPath(zoneID);

        /*if (zoneID === null) {
            this.currentAirFanList = this.airFans.outdoor;
            this.currentExitLightList = this.exitLights.outdoor;
            this.currentElectricList = this.electrics.outdoor;
        }
        else {
            const airFans = this.airFans.indoors[zoneID];
            const exitLights = this.exitLights.indoors[zoneID];
            const electrics = this.electrics.indoors[zoneID];

            this.currentAirFanList = airFans ? airFans : [];
            this.currentExitLightList = exitLights ? exitLights : [];
            this.currentElectricList = electrics ? electrics : [];
        }*/
    }

    setCurrentModels(datas, models, typeName) {
        if (datas) {
            models.facilities[typeName] = datas.facilities;

            let pipes = models.pipes[typeName];

            if (!pipes) {
                pipes = {};
                models.pipes[typeName] = pipes;
            }

            for (const pipeName in datas.pipes) {
                const pipe = datas.pipes[pipeName];
                pipes[pipeName] = pipe;
            }
        }
        else {
            models.facilities[typeName] = [];
            models.pipes[typeName] = {};
        }
    }

    _setPipes(model, airFanList, exitLightList, electricList, panel1List, panel2List) {
        this.setModels(model, airFanList, PipeManager.AirFan_Data);
        this.setModels(model, exitLightList, PipeManager.ExitLight_Data);
        this.setModels(model, electricList, PipeManager.Electric_Data);
        this.setModels(model, panel1List, PipeManager.Panel1_Data);
        this.setModels(model, panel2List, PipeManager.Panel2_Data);
    }

    setModels(model, modelList, data) {
        const groupModel = PipeManager.getModel(model, data.groupName, true);

        if (groupModel) {
            this.getModels(groupModel, data.beginTag, modelList);

            const parentModel = PipeManager.getModel(groupModel, data.selectedTag, false);

            if (parentModel) {
                this.setModelPairs(modelList, parentModel, data.beginTag, data.selectedBeginTag);
            }
        }
    }

    setModelPairs(modelList, selectedParentModel, beginTag, selectedBeginTag) {
        const modelMap = {};

        for (const model of modelList) {
            const modelNumber = model.name.substring(beginTag.length).trim();
            const num = parseInt(modelNumber);

            if (num === 0 || num) {
                modelMap[num] = model;
                model.userData.boundingModel = false;
            }
        }

        for (const child of selectedParentModel.children) {
            const modelNumber = child.name.substring(selectedBeginTag.length).trim();

            let num = 0;
            const len = modelNumber.length;

            for (let i = 0; i < len; i++) {
                const ch = modelNumber[i];


                if (ch >= '0' && ch <= '9') {
                    num = num * 10 + parseInt(ch);
                }
                else
                    break;
            }

            const normalModel = modelMap[num];

            if (normalModel) {
                normalModel.userData.pair = child;
                child.userData.pair = normalModel;
                child.userData.boundingModel = true;

                normalModel.userData.enable = true;
                child.userData.enable = true;
            }
        }
    }

    getModels(model, tag, modelList) {
        if (model.name.startsWith(tag)) {
            const modelNumber = model.name.substring(tag.length).trim();
            const num = parseInt(modelNumber);

            if (num === 0 || num) {
                modelList.push(model);
            }
        }

        for (const child of model.children) {
            this.getModels(child, tag, modelList);
        }
    }

    static getModel(model, tag, withStart) {
        if (withStart) {
            if (model.name.startsWith(tag))
                return model;
        }
        else {
            if (model.name === tag)
                return model;
        }

        for (const child of model.children) {
            const childModel = PipeManager.getModel(child, tag, withStart);

            if (childModel)
                return childModel;
        }

        return null;
    }

    setPipeBalls(animations, zoneID, modelNode, getEdmsFacility) {
        this.pipePathManager.setZonePath(animations, zoneID, modelNode, getEdmsFacility);
        this.pipePathManager.hideAnimationModels(zoneID, modelNode);
    }

    onClick(event, intersects, xrayMode) {
        return this.pipePathManager.onClick(event, this.contents3D, intersects, xrayMode);
    }

    pickModel(event, intersects, xrayMode) {
        return this.pipePathManager.pickModel(event, this.contents3D, intersects, xrayMode);
    }

    clearTypeBoundingBoxModels(type) {
        if (type === SDMSMainMenu.Electric_Sensor ||
            type === SDMSMainMenu.ExitLight_Sensor ||
            type === SDMSMainMenu.AirFan ||
            type === SDMSMainMenu.Panel1 ||
            type === SDMSMainMenu.Panel2) {
            const zoneID = this.contents3D.props.currentView?.zoneID;
            this.pipePathManager.clearTypeBoundingBoxModels(type, zoneID);
        }
    }

    static isSelectedModel(model, selectedModel) {
        if (!model || !selectedModel) {
            return false;
        }

        if (model === selectedModel || model === selectedModel.userData.pair) {
            return true;
        }

        return false;
    }

    checkSelectedModel(selectedSensorModel) {
        this.pipePathManager.checkSelectedModel(selectedSensorModel);
    }
}