import React, { Component } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import '../src/css/common.css';

export class Contents3D extends Component {
	static distance = 5;
	static arrowModelName = "arrowGray.glb";
	static selectedArrowModelName = "arrowBlue.glb";
	static ButtonLeft = 0;
	static ButtonWheel = 1;
	static ButtonRight = 2;

	constructor(props) {
		super(props);

		this.ref3D = React.createRef();

		this.state =
		{
			loading: false
		};

		this.arrowModels_normal = [];
		this.arrowModels_selected = [];
		this.selectedArrow = null;
		this.useControls = false;
		this.cubemapTextures = {};
		this.tempModels = [];

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
		}
	}

	componentDidMount() {
		this.init();
		Contents3D.animate(this);
	}

	init() {
		const container = this.ref3D.current;
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
		//this.camera.position.set(0, 0, Contents3D.distance);
		this.scene = new THREE.Scene();

		this.setPointList();
		this.loadBackgroundTextures();

		this.loadArrowModel(Contents3D.arrowModelName, this.arrowModels_normal);
		this.loadArrowModel(Contents3D.selectedArrowModelName, this.arrowModels_selected);

		/*const video = document.getElementById('video');
		video.play();

		const texture = new THREE.VideoTexture(video);
		const material = new THREE.MeshBasicMaterial({ map: texture });

		const mesh = new THREE.Mesh(geometry, material);
		this.scene.add(mesh);*/

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

		//this.loadBackground(this.getCurrentViewName());

		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		container.appendChild(this.renderer.domElement);

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
		}

		//window.addEventListener('resize', () => this.onWindowResize());
	}

	loadArrowModel(contents, arrModels) {
		const fileName = "resource/gltf/" + contents;
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

		loader.load(fileName, function (object) {
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
			modelNode.name = contents;
			//modelNode.position.set(0, -Contents3D.distance / 2, -Contents3D.distance);
			modelNode.scale.set(10, 10, 10);

			for (let i = 0; i<_this.maxMovePoints; i++) {
				const arrowModel = modelNode.clone(true);
				arrowModel.name = contents + (i + 1).toString();
				arrowModel.visible = false;
				_this.scene.add(arrowModel);
				arrModels.push(arrowModel);
			}

			_this.setArrowModels();
			//_this.scene.add(modelNode);
			//modelNode.updateMatrix();
			
			//Contents3D.hideBoundingBoxes(modelNode, _3dOptions.buildingGroups, _3dOptions.buildings);
		});
	}

	setArrowModels() {
		const normalCount = this.arrowModels_normal.length;
		const selectedCount = this.arrowModels_selected.length;

		if (normalCount > 0 && selectedCount > 0 && normalCount === selectedCount) {
			const movePoints = this.getMovePoints();

			const distance = Contents3D.distance;
			const height = -Contents3D.distance / 2;
			const currentAngle = this.pointList[this.currentPointIndex][2];

			this.tempModels = [];

			for (let i = 0; i < movePoints.length; i++) {
				const movePoint = movePoints[i];

				const radius = Math.sqrt(movePoint.x * movePoint.x + movePoint.y * movePoint.y);
				// radian
				let theta1 = movePoint.x > -0.01 && movePoint.x < 0.01 ? Math.acos(-movePoint.y / radius) : Math.asin(movePoint.x / radius);

				/*if (movePoint.y > 0) {
					theta1 = Math.PI - theta1;
				}*/

				const theta = Contents3D.getMovePointAngle(movePoint) - THREE.MathUtils.degToRad(currentAngle);
				const x = -Math.cos(theta) * distance;
				const z = -Math.sin(theta) * distance;

				const theta2 = theta - Math.PI / 2;
				/*let theta = theta1 - THREE.MathUtils.degToRad(currentAngle);

				const x = Math.sin(theta) * distance;
				const z = -Math.cos(theta) * distance;*/

				const modelNormal = this.arrowModels_normal[i];
				const modelSelected = this.arrowModels_selected[i];

				modelNormal.rotation.y = -theta2;
				modelNormal.position.set(x, height, z);
				modelNormal.userData.isNormal = true;
				modelNormal.userData.otherModel = modelSelected;
				// targetIndex : 화살표가 가르키는 지점 번호
				modelNormal.userData.targetIndex = movePoint.targetIndex;
				modelNormal.userData.targetLon = this.normalizeAngle(THREE.MathUtils.radToDeg(theta1) + 90 - this.pointList[movePoint.targetIndex][2]);
				modelNormal.updateMatrix();
				modelNormal.visible = true;

				modelSelected.rotation.y = -theta2;
				modelSelected.position.set(x, height, z);
				modelSelected.userData.isNormal = false;
				modelSelected.userData.otherModel = modelNormal;
				modelSelected.userData.targetIndex = movePoint.targetIndex;
				modelSelected.userData.targetLon = modelNormal.userData.targetLon;
				modelSelected.updateMatrix();
				modelSelected.visible = false;

				this.tempModels.push(modelNormal);
				this.tempModels.push(modelSelected);
			}

			for (let i = movePoints.length; i < this.arrowModels_normal.length; i++) {
				this.arrowModels_normal[i].visible = false;
				this.arrowModels_selected[i].visible = false;
			}
		}
	}

	static getDistance(x1, y1, x2, y2) {
		const width = x2 - x1;
		const height = y2 - y1;
		return Math.sqrt(width * width + height * height);
    }

	// Return값 : radian
	static getMovePointAngle(movePoint) {
		const leftX = -100;
		const leftY = 0;
		const centerX = 0;
		const centerY = 0;

		const a = Contents3D.getDistance(leftX, leftY, centerX, centerY);
		const b = Contents3D.getDistance(movePoint.x, movePoint.y, centerX, centerY);
		const c = Contents3D.getDistance(movePoint.x, movePoint.y, leftX, leftY);

		let cosData = (a * a + b * b - c * c) / 2 / a / b;

		if (cosData < -1.0)
			cosData = -1.0;
		else if (cosData > 1.0)
			cosData = 1.0;

		if (movePoint.y > 0) {
			return Math.PI * 2 - Math.acos(cosData);
		}

		return Math.acos(cosData);
    }

	getCurrentViewName() {
		if (this.currentPointIndex < this.pointList.length) {
			return this.pointList[this.currentPointIndex][1];
		}

		return "";
    }

	setPointList() {
		this.pointList = [];

		this.pointList.push([new THREE.Vector2(244, 643), "R0010048", 0, 1, 9]);
		this.pointList.push([new THREE.Vector2(461, 643), "R0010049", 0, 0, 2, 8]);
		this.pointList.push([new THREE.Vector2(685, 643), "R0010050", 0, 1, 3, 7]);
		this.pointList.push([new THREE.Vector2(912, 643), "R0010051", 0, 2, 4, 6]);
		this.pointList.push([new THREE.Vector2(1165, 413), "R0010052", 90, 3, 5]);
		this.pointList.push([new THREE.Vector2(1165, 63), "R0010053", 90, 4, 6]);
		this.pointList.push([new THREE.Vector2(912, 63), "R0010054", 180, 3, 5, 7]);
		this.pointList.push([new THREE.Vector2(685, 63), "R0010055", 180, 2, 6, 8]);
		this.pointList.push([new THREE.Vector2(461, 63), "R0010056", 180, 1, 7, 9]);
		this.pointList.push([new THREE.Vector2(244, 63), "R0010057", 180, 0, 8]);

		this.currentPointIndex = 0;

		let maxMovePoints = 0;

		for (const points of this.pointList) {
			const movePoints = points.length - 3;

			if (movePoints > maxMovePoints) {
				maxMovePoints = movePoints;
            }
		}

		this.maxMovePoints = maxMovePoints;
	}

	loadBackgroundTextures() {
		const cubeMaps = this.cubemapTextures;
		const _this = this;

		for (const pointList of this.pointList) {
			const textureName = pointList[1];

			new THREE.CubeTextureLoader()
				.setPath('resource/image/une/' + textureName + '/')
				.load([
					'px.jpg',
					'nx.jpg',
					'py.jpg',
					'ny.jpg',
					'pz.jpg',
					'nz.jpg'
				], (cubemap) => {
						cubeMaps[textureName] = cubemap;

						if (textureName === "R0010048") {
							_this.loadBackground(textureName);
                        }
				});
        }
    }

	getMovePoints() {
		const movePoints = [];
		const currentPoint = this.pointList[this.currentPointIndex];
		const vCurrent = currentPoint[0];

		for (let i = 3; i < currentPoint.length; i++) {
			const targetIndex = currentPoint[i];
			const vMove = this.pointList[targetIndex][0];
			movePoints.push({ x: vMove.x - vCurrent.x, y: vMove.y - vCurrent.y, targetIndex: targetIndex });
		}

		return movePoints;
	}

	loadBackground(target) {
		const cubemap = this.cubemapTextures[target];

		if (cubemap) {
			// View가 바뀌기전에 감춰두었던 화살표가 나타나도록 한다.
			const tempModels = [...this.tempModels];

			for (const model of tempModels) {
				if (model.userData?.isNormal) {
					model.visible = true;
                }
            }

			this.tempModels = [];
			/////////////////////////////////////////////////////////
			this.scene.background = cubemap;
		}
		else {
			// texture가 로딩 완료될때까지 0.1초마다 타이머로 검사한다.
			setTimeout(() => this.loadBackground(target), 100);
        }
		/*const scene = this.scene;

		new THREE.CubeTextureLoader()
			.setPath('resource/image/une/' + target + '/')
			.load([
				'px.jpg',
				'nx.jpg',
				'py.jpg',
				'ny.jpg',
				'pz.jpg',
				'nz.jpg'
			], (cubemap) => {
					scene.background = cubemap;
			});*/
		/*this.scene.background = new THREE.CubeTextureLoader()
			.setPath('resource/image/une/' + target + '/')
			.load([
				'px.jpg',
				'nx.jpg',
				'py.jpg',
				'ny.jpg',
				'pz.jpg',
				'nz.jpg'
			]);*/
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

		if (event.button === Contents3D.ButtonLeft) {
			this.clickArrow(event);
        }
	}

	onPointerMove(event) {
		if (this.isUserInteracting === true) {
			this.lon = (this.onPointerDownPointerX - event.clientX) * 0.1 + this.onPointerDownLon;
			this.lat = (this.onPointerDownPointerY - event.clientY) * 0.1 + this.onPointerDownLat;
		}

		this.selectArrow(event);
	}

	selectArrow(event) {
		const x = event.clientX;
		const y = event.clientY;
		const mouse = new THREE.Vector2((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);

		const raycaster = new THREE.Raycaster();
		raycaster.setFromCamera(mouse, this.camera);

		const intersects = raycaster.intersectObjects(this.arrowModels_normal, true);
		const intersectCount = intersects.length;

		if (intersectCount > 0) {
			const arrowModel = this.getArrowModel(intersects);

			if (arrowModel) {
				if (this.selectedArrow === arrowModel) {
					return;
				}
				else {
					this.clearSelectedArrow();

					if (arrowModel.userData.isNormal) {
						arrowModel.userData.otherModel.visible = true;
						arrowModel.visible = false;
						this.selectedArrow = arrowModel.userData.otherModel;
					}
				}
			}
			else {
				this.clearSelectedArrow();
			}
		}
		else {
			this.clearSelectedArrow();
		}
	}

	clickArrow(event) {
		const x = event.clientX;
		const y = event.clientY;
		const mouse = new THREE.Vector2((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);

		const raycaster = new THREE.Raycaster();
		raycaster.setFromCamera(mouse, this.camera);

		const intersects = raycaster.intersectObjects(this.arrowModels_selected, true);
		const intersectCount = intersects.length;

		if (intersectCount > 0) {
			const arrowModel = this.getArrowModel(intersects);

			if (arrowModel) {
				this.changeView(arrowModel);
				this.isUserInteracting = false;
			}
		}
    }

	changeView(arrowModel) {
		const index = arrowModel.userData.targetIndex;

		if (index === 0 || index) {
			this.lon = arrowModel.userData.targetLon;
			this.currentPointIndex = index;
			this.clearSelectedArrow();

			this.setArrowModels();
			this.loadBackground(this.getCurrentViewName());
			console.log("changeView : " + this.currentPointIndex);
        }
	}

	normalizeAngle(lon) {
		if (lon < 0) {
			lon += 360;
		}
		else if (lon >= 360) {
			lon -= 360;
		}

		if (lon <= 45) {
			lon = 0;
		}
		else if (lon <= 135) {
			lon = 90;
		}
		else if (lon <= 225) {
			lon = 180;
		}
		else if (lon <= 315) {
			lon = 270;
		}
		else {
			lon = 0;
		}

		return lon;
    }

	clearSelectedArrow() {
		if (this.selectedArrow !== null && this.selectedArrow.userData.isNormal === false) {
			this.selectedArrow.userData.otherModel.visible = true;
			this.selectedArrow.visible = false;
			this.selectedArrow = null;
		}
    }

	getArrowModel(intersects) {
		for (const intersect of intersects) {
			let obj = intersect.object;

			while (obj && obj.parent) {
				if (obj.parent === this.scene) {
					if (obj.visible) {
						return obj;
					}
					else if (obj.userData?.otherModel?.visible) {
						return obj.userData.otherModel;
                    }
					else {
						break;
					}
				}

				obj = obj.parent;
			}
		}

		return null;
    }

	onPointerUp() {
		this.isUserInteracting = false;
	}

	static animate(_this) {
		requestAnimationFrame(() => {
			Contents3D.animate(_this);
		});

		_this.update();
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

				this.camera.position.x = Contents3D.distance * Math.sin(this.phi) * Math.cos(this.theta);
				this.camera.position.y = Contents3D.distance * Math.cos(this.phi);
				this.camera.position.z = Contents3D.distance * Math.sin(this.phi) * Math.sin(this.theta);

				this.camera.lookAt(0, 0, 0);
				this.renderer.render(this.scene, this.camera);
			}
		}
	}

	render() {
		return (
			<div>
				<div ref={this.ref3D}>
				</div>
				{
					/*<video id="video" loop muted crossOrigin="anonymous" playsInline style={{ display: "none" }}>
						<source src="resource/video/une.mp4" />
					</video>*/
				}
				{
					/*<img id="image" src="resource/image/une/R0010025.JPG" alt="360 image" />*/
				}
			</div>
		);
	}
}
