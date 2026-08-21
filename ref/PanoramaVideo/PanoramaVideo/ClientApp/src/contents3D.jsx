import React, { Component } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import '../src/css/common.css';
import { Controller } from './controller';

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
			loading: true,
			imageType: "",
			folders: [],
			selectedIndex: -1
		};

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
		}
	}

	componentDidMount() {
		this.init();
		Contents3D.animate(this);
	}

	async readOptions() {
		const options = await Controller.requestOptions();

		if (options) {
			const selectedIndex = options.folders && options.folders.length > 0 ? 0 : -1;
			this.setState({ imageType: options.imageType, folders: options.folders, selectedIndex });

			this.loadBackgroundTextures(options.folders, selectedIndex, options.imageType);
        }
    }

	init() {
		const container = this.ref3D.current;
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
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

		this.readOptions();
	}

	loadBackgroundTextures(folders, selectedIndex, imageType) {
		const cubeMaps = this.cubemapTextures;
		const _this = this;

		if (selectedIndex < 0 || selectedIndex >= folders.length) {
			return;
        }

		for (let i = 0; i < folders.length; i++) {
			const folderName = folders[i];

			new THREE.CubeTextureLoader()
				.setPath('resource/image/' + folderName + '/')
				.load([
					'px.' + imageType,
					'nx.' + imageType,
					'py.' + imageType,
					'ny.' + imageType,
					'pz.' + imageType,
					'nz.' + imageType
				], (cubemap) => {
					cubeMaps[folderName] = cubemap;

					if (i === selectedIndex) {
						_this.loadBackground(folderName);
					}
				});
		}
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

	onClick(dir) {
		let selectedIndex = this.state.selectedIndex + dir;
		const folders = [...this.state.folders];

		if (selectedIndex < 0 || selectedIndex >= folders.length) {
			return;
		}

		const folderName = folders[selectedIndex];
		this.loadBackground(folderName);

		this.setState({ selectedIndex });
    }

	render() {
		const prevClassName = this.state.selectedIndex > 0 ? "goPrev enable" : "goPrev";
		const nextClassName = this.state.selectedIndex < this.state.folders.length - 1 ? "goNext enable" : "goNext";

		return (
			<div>
				<div ref={this.ref3D}>
					{
						!this.state.loading &&
						<div className="buttonBox">
							<span className={nextClassName} onClick={() => this.onClick(1)}><a>다음</a></span>
							<span className={prevClassName} onClick={() => this.onClick(-1)}><a>이전</a></span>
						</div>
					}
				</div>
			</div>
		);
	}
}
