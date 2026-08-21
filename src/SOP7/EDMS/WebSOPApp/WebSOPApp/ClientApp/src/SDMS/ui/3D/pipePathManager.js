import Vertex3D from '../../../Common/util/Vertex3D';
import SDMSMainMenu from '../sdmsMainMenu';
import * as THREE from 'three';
import { PipeManager } from './pipeManager';
import { SDMSDataManager } from '../../services/sdmsDataManager';

export class PipePathManager {
	static OutdoorZoneID = -1000000;

	static OutdoorSphereCount = 80;
	static IndoorSphereCount = 10;
	static EscapeSphereCount = 2.5;

	static PathDataModelsTag = "PathDataModels";
	static AnimationTrackPosition = ".position";

	static FacilityTag = "facilities";
	static BoundingFacilityTag = "boundingFacilities";

	static Outdoor_Electric_Facilities = ["LG01", "LG02"];

	static Outdoor_Path = {
		zoneID: PipePathManager.OutdoorZoneID,
		pathData: [
			{
				name: "electric_outdoor_sphere_pipe",
				vertices: [
					new Vertex3D(3.7240939140319824, -0.6407305002212524, -42.60188293457031),
					new Vertex3D(3.72406268119812, -53.55046081542969, -42.60188293457031),
					new Vertex3D(10.542157173156738, -57.314361572265625, -42.60188293457031),
					new Vertex3D(867.6798706054688, -57.314361572265625, -42.60187911987305),
					new Vertex3D(872.3037109375, -57.314361572265625, -48.559959411621094),
					new Vertex3D(872.3037719726562, -57.314361572265625, -112.05162811279297),
					new Vertex3D(872.3037719726562, -53.55049514770508, -118.86971282958984),
					new Vertex3D(872.3037719726562, -0.6407344341278076, -118.86971282958984)
				],
				times: [0, 0.5000000149011612, 0.6000000089406967, 8.700000286102295, 0.3, 0.9, 0.3, 0.6]
				//times: [0, 0.1666666716337204, 0.20000000298023224, 2.9000000953674316, 2.933333396911621, 3.133333444595337, 3.1666667461395264, 3.3333332538604736]
			}
		]
	}

	static OutdoorColor = new THREE.Color("#ff0000");
	static IndoorColor = new THREE.Color("#ffff00");
	static EscapeColor = new THREE.Color("#ff0000");

	constructor(contents3D) {
		this.contents3D = contents3D;

		this.zonePaths = {
			// 시간설정없는 버전
            /*zoneID: {
                "air_pipe_01": {
                    pipeType: "airFan",
					vertexCount: 2,
                    vertices: [new Vertex3D(0, 0, 0), new Vertex3D(1, 0, 1)],
					renderIndex: -1,
					sphereCount: 0,
					spheres: null,
					sphereIndex: [] // vertices에 대한 정수 인덱스
                }
            }*/
			// 시간설정 있는 버전
			/*zoneID: {
                "air_pipe_01": {
                    pipeType: "airFan",
					vertexCount: 2,
                    vertices: [new Vertex3D(0, 0, 0), new Vertex3D(1, 0, 1)],
					times: [0.1, 0.2],
					pipeLength: 0,
					totalTimes: 0.3,
					renderTime: 0,
					sphereCount: 0,
					spheres: null,
					sphereTimes: []
			 }
			 */
		};

		// pipeName별 pathData(sphereData)
		this.prevZoneID = null;
		this.selectedBoundingModels = [];
		this.selectedPipes = {};

		this.colorMaterials = {};
        this.initPath();
	}

	setZonePath(animations, zoneID, modelNode, getEdmsFacility) {
		if (zoneID === null) {
			this.setOutdoorZonePath(modelNode, getEdmsFacility);
			return;
		}

		const zonePathData = {};

		let color = PipePathManager.OutdoorColor, colorEscape = PipePathManager.EscapeColor;
		const speed = 1;
		let radius = 4, radiusEscape = 0.15;

		if (zoneID !== PipePathManager.OutdoorZoneID && (zoneID === 0 || zoneID)) {
			color = PipePathManager.IndoorColor;
			radius = 0.2;
		}

		const airSpheresPosition = this.getParentSphereModelPosition(modelNode, PipeManager.AirFan_Data.groupName, PipeManager.AirFan_Data.sphereModels);
		const lightSpheresPosition = this.getParentSphereModelPosition(modelNode, PipeManager.ExitLight_Data.groupName, PipeManager.ExitLight_Data.sphereModels);
		const electricSpheresPosition = this.getParentSphereModelPosition(modelNode, PipeManager.Electric_Data.groupName, PipeManager.Electric_Data.sphereModels);
		const panel1SpheresPosition = this.getParentSphereModelPosition(modelNode, PipeManager.Panel1_Data.groupName, PipeManager.Panel1_Data.sphereModels);
		const panel2SpheresPosition = this.getParentSphereModelPosition(modelNode, PipeManager.Panel2_Data.groupName, PipeManager.Panel2_Data.sphereModels);
		//const escapeSphersPosition = this.getParentSphereModelPosition(modelNode, PipeManager.Escape_Data.groupName, PipeManager.Escape_Data.sphereModels);

		const model = PipeManager.getModel(modelNode, PipeManager.Escape_Data.sphereModels, false);
		const escapeSphersPosition = model ? PipePathManager.getAbsolutePosition(model) : new Vertex3D(0, 0, 0);

		this.setFacilities(zonePathData, modelNode, getEdmsFacility);

		for (const animation of animations) {
			const tracks = animation.tracks;

			if (tracks) {
				for (const animationTrack of tracks) {
					if (animationTrack.times && animationTrack.name && animationTrack.values) {
						const name = animationTrack.name.endsWith(PipePathManager.AnimationTrackPosition) ? animationTrack.name.substring(0, animationTrack.name.length - PipePathManager.AnimationTrackPosition.length) : animationTrack.name;

						const [typeName, pipeName] = this.parseFacilityName(name);

						if (typeName === null)
							continue;

						let pathDataModelNames = zonePathData[PipePathManager.PathDataModelsTag];

						if (!pathDataModelNames) {
							pathDataModelNames = [];
							zonePathData[PipePathManager.PathDataModelsTag] = pathDataModelNames;
						}

						pathDataModelNames.push(name);

						const facilityData = {};
						zonePathData[pipeName] = facilityData;

						facilityData.pipeType = typeName;
						facilityData.times = [];
						
						const vertices = [];
						const vertexCount = animationTrack.times.length;

						facilityData.vertexCount = vertexCount;
						facilityData.vertices = vertices;

						let firstTime  = null;
						let lenFirst = null;
						
						for (let i = 0; i < vertexCount; i++) {
							//const time = animationTrack.times[i];
							//facilityData.times.push(time);

							const x = animationTrack.values[i * 3];
							const y = animationTrack.values[i * 3 + 1];
							const z = animationTrack.values[i * 3 + 2];

							if (typeName === SDMSMainMenu.AirFan) {
								vertices.push(new Vertex3D(x + airSpheresPosition.x, y + airSpheresPosition.y, z + airSpheresPosition.z));
							}
							else if (typeName === SDMSMainMenu.ExitLight_Sensor) {
								vertices.push(new Vertex3D(x + lightSpheresPosition.x, y + lightSpheresPosition.y, z + lightSpheresPosition.z));
							}
							else if (typeName === SDMSMainMenu.Electric_Sensor) {
								vertices.push(new Vertex3D(x + electricSpheresPosition.x, y + electricSpheresPosition.y, z + electricSpheresPosition.z));
							}
							else if (typeName === SDMSMainMenu.Panel1) {
								vertices.push(new Vertex3D(x + panel1SpheresPosition.x, y + panel1SpheresPosition.y, z + panel1SpheresPosition.z));
							}
							else if (typeName === SDMSMainMenu.Panel2) {
								vertices.push(new Vertex3D(x + panel2SpheresPosition.x, y + panel2SpheresPosition.y, z + panel2SpheresPosition.z));
							}
							else if (typeName.startsWith(SDMSMainMenu.Escape)) {
								vertices.push(new Vertex3D(x + escapeSphersPosition.x, y + escapeSphersPosition.y, z + escapeSphersPosition.z));
							}

							if (i >= 1 && lenFirst === null) {
								const v1 = vertices[i - 1];
								const v2 = vertices[i];

								const len = v1.getDistance(v2);

								if (len > 0.001) {
									lenFirst = len;
									firstTime = animationTrack.times[i];
                                }
                            }
						}

						for (let i = 0; i < vertexCount; i++) {
							if (lenFirst === null || i === 0) {
								const time = animationTrack.times[i];
								facilityData.times.push(time);
							}
							else {
								// 전구간에서 속도가 일정하게 한다.
								const v1 = vertices[i - 1];
								const v2 = vertices[i];
								const lenCurrent = v1.getDistance(v2);

								const time = firstTime / lenFirst * lenCurrent;
								facilityData.times.push(time);
							}
						}

						if (pipeName.startsWith(SDMSMainMenu.Escape)) {
							this.setPipeBall(facilityData, pipeName, colorEscape, speed, radiusEscape, PipePathManager.EscapeSphereCount);
						}
						else if (pipeName.startsWith(PipeManager.AirFan_Data.beginTag)) {
							this.setPipeBall(facilityData, pipeName, color, speed / 4, radius, PipePathManager.IndoorSphereCount);
						}
						else {
							this.setPipeBall(facilityData, pipeName, color, speed, radius, PipePathManager.IndoorSphereCount);
						}
					}
                }
            }
		}

		this.zonePaths[zoneID] = zonePathData;
	}

	setOutdoorZonePath(modelNode, getEdmsFacility) {
		const zoneID = PipePathManager.OutdoorZoneID;
		const zonePathData = this.zonePaths[zoneID];

		const facilities = {};
		const boundingFacilities = {};
		zonePathData[PipePathManager.FacilityTag] = facilities;
		zonePathData[PipePathManager.BoundingFacilityTag] = boundingFacilities;

		const pipeModels = {};
		const pipeNames = zonePathData[PipePathManager.PathDataModelsTag];

		if (pipeNames) {
			for (const pipeName of pipeNames) {
				const model = PipeManager.getModel(modelNode, pipeName, false);

				if (model) {
					pipeModels[pipeName] = model;
                }
            }
        }

		for (const facilityName of PipePathManager.Outdoor_Electric_Facilities) {
			const model = PipeManager.getModel(modelNode, facilityName, false);

			if (model) {
				const boundingBoxModel = PipeManager.getModel(modelNode, facilityName + SDMSDataManager.BoundingBoxTag, false);

				if (boundingBoxModel) {
					if (pipeNames) {
						facilities[facilityName] = pipeNames;
					}

					boundingFacilities[facilityName] = model;
					boundingFacilities[boundingBoxModel.name] = boundingBoxModel;

					const modelPipes = [];
					model.userData.pair = boundingBoxModel;
					model.userData.boundingModel = false;
					model.userData.pipes = modelPipes;

					boundingBoxModel.userData.pair = model;
					boundingBoxModel.visible = false;
					boundingBoxModel.userData.boundingModel = true;
					
					for (const pipeName of pipeNames) {
						const pipe = pipeModels[pipeName];

						if (pipe) {
							modelPipes.push(pipe);

							let facilities = pipe.userData.facilities;

							if (!facilities) {
								facilities = [model, boundingBoxModel];
								pipe.userData.facilities = facilities;
							}
							else {
								facilities.push(model);
								facilities.push(boundingBoxModel);
							}

							model.userData.edmsFacility = getEdmsFacility(model.name, null);
                        }
					}
                }
            }
		}
    }

	setFacilities(zonePathData, modelNode, getEdmsFacility) {
		const facilities = {};
		const boundingFacilities = {};
		zonePathData[PipePathManager.FacilityTag] = facilities;
		zonePathData[PipePathManager.BoundingFacilityTag] = boundingFacilities;

		this.getTypeFacilities(facilities, boundingFacilities, PipeManager.AirFan_Data, modelNode, getEdmsFacility);
		this.getTypeFacilities(facilities, boundingFacilities, PipeManager.ExitLight_Data, modelNode, getEdmsFacility);
		this.getTypeFacilities(facilities, boundingFacilities, PipeManager.Electric_Data, modelNode, getEdmsFacility);
		this.getTypeFacilities(facilities, boundingFacilities, PipeManager.Panel1_Data, modelNode, getEdmsFacility);
		this.getTypeFacilities(facilities, boundingFacilities, PipeManager.Panel2_Data, modelNode, getEdmsFacility);
	}

	getTypeFacilities(facilities, boundingFacilities, data, modelNode, getEdmsFacility) {
		const groupModel = PipeManager.getModel(modelNode, data.groupName, true);

		if (groupModel) {
			let boundingModels = {};

			for (const child of groupModel.children) {
				if (child.name === data.selectedTag) {
					boundingModels = PipePathManager.getFacilityBoundingModels(child, data.selectedBeginTag);
					break;
                }
			}

			const underbarCount = this.getUnderbarCount(data);

			for (const child of groupModel.children) {
				const edmsFacility = getEdmsFacility(child.name, null);

				if (edmsFacility) {
					child.userData.edmsFacility = edmsFacility;
                }

				const tokens = child.name.split('_');

				if (tokens.length >= 3) {
					// beginTag에 '_'가 포함된 경우도 고려한다.
					if (this.isBoundingBoxModel(tokens, data, underbarCount)) {
					//if ((tokens[0] + "_") === data.beginTag && PipePathManager.isNumeric(tokens[1])) {
						facilities[child.name] = PipePathManager.getPipeNames(data.beginTag, tokens);

						const boundingBoxModel = boundingModels[tokens[1]];

						if (boundingBoxModel) {
							boundingFacilities[child.name] = child;
							boundingFacilities[boundingBoxModel.name] = boundingBoxModel;

							child.userData.pair = boundingBoxModel;
							child.userData.boundingModel = false;

							boundingBoxModel.userData.pair = child;
							boundingBoxModel.visible = false;
							boundingBoxModel.userData.boundingModel = true;
                        }
					}
				}
			}
		}
	}

	isBoundingBoxModel(tokens, data, underbarCount) {
		const tokenCount = tokens.length;
		let beginTag = "";

		if (underbarCount > 0) {
			if (tokenCount <= underbarCount)
				return false;

			for (let i = 0; i <= underbarCount; i++) {
				if (i === 0)
					beginTag = tokens[i];
				else
					beginTag += "_" + tokens[i];
			}
		}
		else
			beginTag = tokens[0];

		beginTag += "_";

		if (beginTag !== data.beginTag)
			return false;

		if (tokenCount < underbarCount + 2 || PipePathManager.isNumeric(tokens[underbarCount + 1]) === false)
			return false;

		for (let i = 0; i < underbarCount; i++) {
			tokens[0] += "_" + tokens[1];
			tokens.splice(1, 1);
        }

		return true;
    }

	getUnderbarCount(data) {
		const beginTag = data.beginTag.endsWith('_') ? data.beginTag.substring(0, data.beginTag.length - 1) : data.beginTag;

		const newTokens = beginTag.split('_');

		if (newTokens.length > 1) {
			return newTokens.length - 1;
		}

		return 0;
    }

	static getFacilityBoundingModels(modelNode, selectedBeginTag) {
		const models = {};
		const tagLength = selectedBeginTag.length;

		for (const child of modelNode.children) {
			if (child.name.startsWith(selectedBeginTag)) {
				let num = "";
				const len = child.name.length;

				for (let i = tagLength; i < len; i++) {
					const ch = child.name[i];

					if (ch >= '0' && ch <= '9') {
						num += ch;
					}
					else
						break;
				}

				if (num.length > 0)
					models[num] = child;
            }
		}

		return models;
    }

	static getPipeNames(beginTag, tokens) {
		const tokenLength = tokens.length;
		const pipeNames = [];

		if (tokens[2] === "pipe") {
			for (let i = 3; i < tokenLength; i++) {
				const str = tokens[i].trim();

				if (str.length > 0 && PipePathManager.isNumeric(str)) {
					pipeNames.push(beginTag + "pipe_" + str);
                }
            }
		}

		return pipeNames;
    }

	static isNumeric(str) {
		const len = str.length;

		for (let i = 0; i < len; i++) {
			if (str[i] < '0' || str[i] > '9')
				return false;
		}

		return true;
    }

	getParentSphereModelPosition(modelNode, groupName, tagName) {
		const groupModel = PipeManager.getModel(modelNode, groupName, groupName.length > 0);

		if (groupModel) {
			const model = PipeManager.getModel(groupModel, tagName, false);

			if (model) {
				return PipePathManager.getAbsolutePosition(model);
			}
		}

		return new Vertex3D(0, 0, 0);
	}

	static getAbsolutePosition(modelNode) {
		const vPos = new Vertex3D(modelNode.position.x, modelNode.position.y, modelNode.position.z);

		while (modelNode.parent) {
			modelNode = modelNode.parent;

			vPos.x += modelNode.position.x;
			vPos.y += modelNode.position.y;
			vPos.z += modelNode.position.z;
		}

		return vPos;
    }

	initPath() {
		this.readPathData(PipePathManager.Outdoor_Path, PipePathManager.OutdoorColor, 1, 4);
		//this.readPathData(PipePathManager.zone8F_Path, PipePathManager.IndoorColor, 3, 0.2);

		// 외부모델 데이터를 임의로 바꿔준다.
		this.changeOutdoorData();
	}

	changeOutdoorData() {
		const zonePath = this.zonePaths[PipePathManager.OutdoorZoneID];

		if (zonePath) {
			for (const pipeName in zonePath) {
				if (pipeName === PipePathManager.PathDataModelsTag) {
					continue;
				}

				const pipeDatas = zonePath[pipeName];

				delete zonePath[pipeName];
				zonePath[PipeManager.OutdoorElectricPipeName] = pipeDatas;
				zonePath[PipePathManager.PathDataModelsTag] = [PipeManager.OutdoorElectricPipeName];
				break;
            }
        }
    }

    readPathData(pathDatas, color, speed, radius) {
        const zonePathData = {};
        this.zonePaths[pathDatas.zoneID] = zonePathData;

        for (const pathData of pathDatas.pathData) {
            const [typeName, pipeName] = this.parseFacilityName(pathData.name);

            if (typeName === null)
				continue;

			let pathDataModelNames = zonePathData[PipePathManager.PathDataModelsTag];

			if (!pathDataModelNames) {
				pathDataModelNames = [];
				zonePathData[PipePathManager.PathDataModelsTag] = pathDataModelNames;
			}

			pathDataModelNames.push(pathData.name);

            const facilityData = {};
            zonePathData[pipeName] = facilityData;

            facilityData.pipeType = typeName;
			/*facilityData.sphereCount = 0;
			facilityData.spheres = new THREE.Object3D();
			this.contents3D.scene.add(this.spheres);
			facilityData.spheres.visible = false;*/

            const vertices = [];
            facilityData.vertices = vertices;

            for (const vertex of pathData.vertices) {
                vertices.push(vertex);
			}

			const times = [];
			facilityData.times = times;

			for (const time of pathData.times) {
				times.push(time);
            }

			this.setPipeBall(facilityData, pipeName, color, speed, radius, PipePathManager.OutdoorSphereCount);
        }
	}

	setPipeBall(facilityData, pipeName, color, speed, radius, _sphereCount) {
		const pipeLength = PipePathManager.getPathLength(facilityData.vertices);
		facilityData.pipeLength = pipeLength;

		let sphereCount = parseInt(pipeLength / _sphereCount);//parseInt(facilityData.vertices.length / 20);

		if (sphereCount < 1)
			sphereCount = 1;

		this.setPath(facilityData, speed, sphereCount);
		facilityData.spheres = this.addSpheres(sphereCount, color, pipeName, radius);
	}

	static getPathLength(vertices) {
		const vertexCount = vertices.length;
		let length = 0;

		for (let i = 1; i < vertexCount; i++) {
			const v1 = vertices[i - 1];
			const v2 = vertices[i];
			length += v1.getDistance(v2);
		}

		return length;
    }

	// 중간점을 넣어서 속도를 늦추게 한다.
	// speed는 1 또는 그보다 큰 정수이어야 하며, 소수점은 쓸수 없다.
	setSpeed(vertices, speed/*: integer*/) {
		if (speed === null || speed === undefined || speed === 1) {
			return vertices;
		}

		const pipePath = [];
		const pathCount = vertices.length;

		for (let i = 0; i < pathCount; i++) {
			const vPos1 = vertices[i];
			pipePath.push(vPos1);

			if (i < pathCount - 1) {
				const vPos2 = vertices[i + 1];
				const len = vPos1.getDistance(vPos2);

				for (let j = 1; j < speed; j++) {
					const vPos = vPos1.getLinearVertex(vPos2, len * j / speed);
					pipePath.push(vPos);
				}
			}
		}

		return pipePath;
	}

	setPath(facilityData, speed, sphereCount) {
		const vertices = this.setSpeed(facilityData.vertices, speed);

		facilityData.vertexCount = vertices.length;
		facilityData.sphereTimes = [];

		const timeCount = facilityData.times.length;
		let totalTime = 0;

		for (let i = 0; i < timeCount; i++) {
			totalTime += facilityData.times[i];
		}

		for (let i = 1; i <= sphereCount; i++) {
			facilityData.sphereTimes[i - 1] = totalTime / sphereCount * i;
        }

		facilityData.vertices = vertices;
		facilityData.sphereCount = sphereCount;
		facilityData.totalTimes = totalTime;
		facilityData.renderTime = 0;
	}

	addSpheres(sphereCount, color, pipeName, radius) {
		//sun object
		/*const color = new THREE.Color("#ff0000");*/
		const geometry = new THREE.IcosahedronGeometry(radius, 15);
		//const material = new THREE.MeshBasicMaterial({ color: color });

		const colorIndex = color.r * 256 * 256 + color.g * 256 + color.b;
		let material = this.colorMaterials[colorIndex];

		if (!material) {
			material = new THREE.MeshBasicMaterial({ color: color });
			this.colorMaterials[colorIndex] = material;
        }

		const spheres = new THREE.Object3D();
		spheres.layers.set(PipeManager.BLOOM_SCENE);
		spheres.name = pipeName + "_spheres";
		this.contents3D.scene.add(spheres);
		spheres.visible = false;

		for (let i = 1; i <= sphereCount; i++) {
			const sphere = new THREE.Mesh(geometry, material);
			//sphere.layers.set(PipeManager.BLOOM_SCENE);
			spheres.add(sphere);
		}

		return spheres;
	}

    parseFacilityName(name) {
        let type = "", pipeTag = "";

		if (name.startsWith("air")) {
			type = SDMSMainMenu.AirFan;
			pipeTag = "air_";
		}
		else if (name.startsWith("light")) {
			type = SDMSMainMenu.ExitLight_Sensor;
			pipeTag = "light_";
		}
		else if (name.startsWith("electric")) {
			type = SDMSMainMenu.Electric_Sensor;
			pipeTag = "electric_";
		}
		else if (name.startsWith("panel_1")) {
			type = SDMSMainMenu.Panel1;
			pipeTag = "panel_1_";
		}
		else if (name.startsWith("panel_2")) {
			type = SDMSMainMenu.Panel2;
			pipeTag = "panel_2_";
		}
		else if (name.startsWith("escape_s")) {
			type = SDMSMainMenu.Escape;

			const index1 = name.lastIndexOf('_');

			if (index1 > 0) {
				pipeTag = type + name.substring(index1);
				type = pipeTag;
			}
			else {
				pipeTag = "";
			}

			return [type, pipeTag];
		}

        const index = name.indexOf("pipe");

        if (index < 0)
            return [null, null];

        return [type, pipeTag + name.substring(index)];
	}

	setCurrentPath(zoneID) {
		if (zoneID === null)
			zoneID = PipePathManager.OutdoorZoneID;

		// 이전 Zone의 경로들은 모두 안보이게 한다.
		if (this.prevZoneID !== zoneID && this.prevZoneID !== null) {
			const pathDatas = this.zonePaths[this.prevZoneID];

			if (pathDatas) {
				for (const pipeName in pathDatas) {
					const pathData = pathDatas[pipeName];

					if (pathData.spheres) {
						pathData.spheres.visible = false;
					}
				}
			}
		}

		this.prevZoneID = zoneID;
	}

	clearPath() {
		// 이전 Zone의 경로들은 모두 안보이게 한다.
		if (this.prevZoneID !== null && this.prevZoneID !== undefined) {
			const pathDatas = this.zonePaths[this.prevZoneID];

			if (pathDatas) {
				for (const pipeName in pathDatas) {
					const pathData = pathDatas[pipeName];

					if (pathData.spheres) {
						pathData.spheres.visible = false;
					}
				}
			}
		}

		this.prevZoneID = null;
	}

	showEscape(visibleSensorTypes, zoneID, delta) {
		if (zoneID === null) {
			zoneID = PipePathManager.OutdoorZoneID;
		}

		const pathDatas = this.zonePaths[zoneID];
		const zonePathDatas = pathDatas ? pathDatas : {};

		for (const pipeName in zonePathDatas) {
			const pathData = zonePathDatas[pipeName];

			if (!pathData.pipeType) {
				continue;
			}

			if (pathData.pipeType.startsWith(SDMSMainMenu.Escape)) {
				const visible = visibleSensorTypes[pathData.pipeType];
				pathData.spheres.visible = visible;
            }
		}

		for (const pipeName in zonePathDatas) {
			const pathData = zonePathDatas[pipeName];

			if (pathData?.spheres?.visible) {
				this.setPosition(pathData, delta);
			}
		}
    }

	showPathDatas(visibleSensorTypes, zoneID, selectedSensorModel, selectedPOI, delta, pipeModels) {
		const refEscape = {
			visibleEscape: false,
			visiblePath: 0
        }

		const pathDatas = this.getPathDatas(visibleSensorTypes, zoneID, selectedSensorModel, refEscape);

		for (const pipeName in pathDatas) {
			const pathData = pathDatas[pipeName];

			if (pathData?.spheres?.visible) {
				this.setPosition(pathData, delta);
			}
		}

		const pipeLayer = this.getPipeLayer(zoneID, pipeModels);

		if (pipeLayer) {
			const visible = refEscape.visibleEscape === false || refEscape.visiblePath > 0;
			pipeLayer.visible = visible;

			for (const linkedLayer of pipeLayer.userData.linkedLayers) {
				linkedLayer.visible = visible;
            }
		}

		// 선택된 POI가 있으면 활성화된 Model은 모두 해제한다.
		if (selectedPOI && selectedPOI.length === 2) {
			if (this.selectedBoundingModels.length > 0) {
				this.clearBoundingBoxModels();
            }
        }
	}

	getPipeLayer(zoneID, pipeModels) {
		if (zoneID < 10000) {
			return pipeModels.indoors[zoneID]?.layer;
		}

		return pipeModels.outdoor.layer;
    }

	// this.selectedPipes에 유효한 값이 들어있는지 확인한다.
	checkSelectedModel(selectedSensorModel) {
		if (selectedSensorModel) {
			for (const pipeName in this.selectedPipes) {
				const pipe = this.selectedPipes[pipeName];
				const facilities = pipe.userData?.facilities;

				if (facilities) {
					for (const facility of facilities) {
						if (facility.name === selectedSensorModel.name) {
							return;
                        }
                    }
                }
			}
		}

		this.selectedPipes = {};
		this.clearBoundingBoxModels();
    }

	getPathDatas(visibleSensorTypes, zoneID, selectedSensorModel, refEscape) {
		let isOutdoor = false;

		if (zoneID === null) {
			zoneID = PipePathManager.OutdoorZoneID;
			isOutdoor = true;
		}

		const pathDatas = this.zonePaths[zoneID];
		const zonePathDatas = pathDatas ? pathDatas : {};

		for (const pipeName in zonePathDatas) {
			const pathData = zonePathDatas[pipeName];

			if (!pathData.pipeType) {
				continue;
            }

			let visible = visibleSensorTypes[pathData.pipeType];

			if (visible) {
				// 대피로는 무조건 표시한다.
				if (pathData.pipeType.startsWith(SDMSMainMenu.Escape) === false) {
					if ((!isOutdoor && !selectedSensorModel) || !this.selectedPipes[pipeName]) {
						visible = false;
					}
					else {
						refEscape.visiblePath++;
                    }
				}
				else {
					refEscape.visibleEscape = true;
                }
			}

			pathData.spheres.visible = visible;
        }

		return zonePathDatas;
	}

	setPosition(pathData, delta) {
		pathData.renderTime += delta;

		if (pathData.renderTime >= pathData.totalTimes)
			pathData.renderTime -= pathData.totalTimes;

		for (let i = 0; i < pathData.sphereCount; i++) {
			let time = pathData.sphereTimes[i] + pathData.renderTime;

			if (time >= pathData.totalTimes) {
				time -= pathData.totalTimes;
			}

			const sphere = pathData.spheres.children[i];
			const vPos = this.getPosition(pathData, time);

			sphere.position.x = vPos.x;
			sphere.position.y = vPos.y;
			sphere.position.z = vPos.z;
		}
	}

	getPosition(pathData, time) {
		let prevTime = 0;
		const timeCount = pathData.times.length;

		for (let i = 0; i < timeCount; i++) {
			const currentTime = prevTime + pathData.times[i];

			if (currentTime >= time) {
				const _time = time - prevTime;
				const vPrev = i === 0 ? pathData.vertices[i] : pathData.vertices[i - 1];
				const vNext = pathData.vertices[i];

				return vPrev.getLinearVertex(vNext, vPrev.getDistance(vNext) * _time / pathData.times[i]);
			}

			prevTime = currentTime;
		}

		if (pathData.vertexCount <= 0) {
			return new Vertex3D(null, null, null);
        }

		return pathData.vertices[pathData.vertexCount-1];
    }

	hideAnimationModels(zoneID, modelNode) {
		const zonePathData = this.zonePaths[zoneID];

		if (!zonePathData) {
			return;
		}

		const pathDataModelNames = zonePathData[PipePathManager.PathDataModelsTag];

		if (pathDataModelNames) {
			const mapModelNames = {};

			for (const modelName of pathDataModelNames) {
				mapModelNames[modelName] = 1;
			}

			this.hideModels(modelNode, mapModelNames);
        }
	}

	hideModels(modelNode, mapModelNames) {
		for (const child of modelNode.children) {
			if (mapModelNames[child.name]) {
				child.visible = false;
			}
			else {
				this.hideModels(child, mapModelNames);
			}
        }
	}

	onClick(event, contents3D, _intersects, xrayMode) {
		let currentModel = contents3D.currentModel;

		if (!currentModel) {
			return null;
		}

		if (currentModel.userData.pair) {
			if (!currentModel.userData.xrayMode) {
				currentModel = currentModel.userData.pair;
            }
        }

		let zoneID = contents3D.props.currentView?.zoneID;

		if (zoneID === null) {
			zoneID = PipePathManager.OutdoorZoneID;

			// 외부모델에서 활성화 상태인 배관이 있으면 무조건 "LG02"를 선택하도록 한다.
			if (this.isRunningPipes()) {
				return this.getOutdoorNonSensorModel(this.selectedPipes, contents3D.etcSensorManager, zoneID, xrayMode);
            }
		}

		const x = event.nativeEvent.offsetX;
		const y = event.nativeEvent.offsetY;
		const mouse = new THREE.Vector2((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);

		const raycaster = new THREE.Raycaster();
		raycaster.setFromCamera(mouse, contents3D.camera);

		const intersects = raycaster.intersectObjects(currentModel.children, true);
		const intersectCount = intersects.length;

		if (intersectCount > 0) {
			for (let i = 0; i < intersectCount; i++) {
				const obj = intersects[i];
				_intersects.push(obj);
			}

			const zonePath = this.zonePaths[zoneID];

			if (zonePath) {
				const boundingFacilities = zonePath[PipePathManager.BoundingFacilityTag];

				contents3D.sortIntersects(intersects, intersectCount);

				for (let i = 0; i < intersectCount; i++) {
					const obj = intersects[i];

					//if (obj.object.visible) {
					if (boundingFacilities[obj.object.name]) {
						let modelNode = null;

						if (obj.object.visible === false && obj.object.userData.pair) {
							if (xrayMode) {
								modelNode = this.showFacilities(obj.object.userData.pair, boundingFacilities);
							}
							else {
								modelNode = this.getFacilityModel(obj.object.userData.pair);
							}
						}
						else {
							if (xrayMode) {
								modelNode = this.showFacilities(obj.object, boundingFacilities);
							}
							else {
								modelNode = this.getFacilityModel(obj.object);
                            }
						}

						if (modelNode) {
							return modelNode;
						}
						else {
							// 뒤에 나오는 모델은 show/hide 설정을 건너뛰고 모델만 찾아서 리턴하도록 한다.
							// xrayMode는 그래서 일부러 바꾼다.
							xrayMode = false;
                        }
					}
				}
			}
		}

		return null;
	}

	pickModel(event, contents3D, _intersects, xrayMode) {
		let currentModel = contents3D.currentModel;

		if (!currentModel) {
			return null;
		}

		if (currentModel.userData.pair) {
			if (!currentModel.userData.xrayMode) {
				currentModel = currentModel.userData.pair;
			}
		}

		let zoneID = contents3D.props.currentView?.zoneID;

		if (zoneID === null) {
			// 실내모델만 Pick한다.
			//zoneID = PipePathManager.OutdoorZoneID;
			return null;
		}

		const x = event.nativeEvent.offsetX;
		const y = event.nativeEvent.offsetY;
		const mouse = new THREE.Vector2((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);

		const raycaster = new THREE.Raycaster();
		raycaster.setFromCamera(mouse, contents3D.camera);

		const intersects = raycaster.intersectObjects(currentModel.children, true);
		const intersectCount = intersects.length;

		if (intersectCount > 0) {
			for (let i = 0; i < intersectCount; i++) {
				const obj = intersects[i];
				_intersects.push(obj);
			}

			const zonePath = this.zonePaths[zoneID];

			if (zonePath) {
				const boundingFacilities = zonePath[PipePathManager.BoundingFacilityTag];

				contents3D.sortIntersects(intersects, intersectCount);

				for (let i = 0; i < intersectCount; i++) {
					const obj = intersects[i];

					//if (obj.object.visible) {
					if (boundingFacilities[obj.object.name]) {
						let modelNode = null;

						if (obj.object.visible === false && obj.object.userData.pair) {
							modelNode = this.getFacilityModel(obj.object.userData.pair);
						}
						else {
							modelNode = this.getFacilityModel(obj.object);
						}

						if (modelNode) {
							return modelNode;
						}
					}
				}
			}
		}

		return null;
    }

	getOutdoorNonSensorModel(pipes, etcSensorManager, zoneID, xrayMode) {
		const zoneSensors = etcSensorManager?.zoneSensors;

		if (!zoneSensors) {
			return null;
		}

		const zonePath = this.zonePaths[zoneID];

		if (!zonePath) {
			return null;
		}

		const boundingFacilities = zonePath[PipePathManager.BoundingFacilityTag];
		const outdoorZoneSensors = {};
		
		for (const zoneID in zoneSensors) {
			// 10000보다 작으면 실내
			if (parseInt(zoneID) < 10000) {
				continue;
			}

			const sensors = zoneSensors[zoneID];

			for (const sensorName in sensors) {
				outdoorZoneSensors[sensorName] = sensors[sensorName];
            }
		}

		for (const pipeName in pipes) {
			const pipe = pipes[pipeName];
			const facilities = pipe.userData.facilities;

			if (facilities) {
				for (const facility of facilities) {
					if (facility.userData.boundingModel) {
						continue;
					}

					if (!outdoorZoneSensors[facility.name]) {
						if (xrayMode) {
							return this.showFacilities(facility.userData.pair, boundingFacilities);
						}
						else {
							return facility;
						}
					}
				}
            }
		}

		return null;
	}

	isRunningPipes() {
		for (const pipeName in this.selectedPipes) {
			return true;
		}

		return false;
    }

	getFacilityModel(modelNode) {
		if (modelNode.userData.pipes) {
			return modelNode;
        }

		return null;
	}

	showAllFacilities(zoneID) {
		if (zoneID === null) {
			zoneID = PipePathManager.OutdoorZoneID;
		}

		const zonePath = this.zonePaths[zoneID];

		if (zonePath) {
			const boundingFacilities = zonePath[PipePathManager.BoundingFacilityTag];

			if (boundingFacilities) {
				for (const facilityName in boundingFacilities) {
					const facility = boundingFacilities[facilityName];

					if (facility?.userData?.boundingModel === false) {
						facility.visible = true;
						facility.userData.enable = true;
					}

					if (facility?.userData?.pipes) {
						for (const pipe of facility.userData.pipes) {
							pipe.visible = true;
							pipe.userData.enable = true;
						}
					}
				}
			}
		}
    }

	showFacilities(modelNode, boundingFacilities) {
		this.clearBoundingBoxModels();

		const enabled = modelNode.userData.boundingModel;
		const pipeList = modelNode.userData.pipes ? modelNode.userData.pipes : modelNode.userData?.pair?.userData?.pipes;

		// 선택되지 않은 모델들은 모두 안보이도록 한다.
		for (const facilityName in boundingFacilities) {
			const facility = boundingFacilities[facilityName];

			if (facility?.userData?.boundingModel === false) {
				facility.visible = enabled;
				facility.userData.enable = enabled;
			}

			if (pipeList && facility?.userData?.pipes) {
				for (const pipe of facility.userData.pipes) {
					if (enabled) {
						pipe.visible = enabled;
						pipe.userData.enable = enabled;
					}
					else {
						if (pipeList.includes(pipe)) {
							pipe.visible = true;
							pipe.userData.enable = true;
						}
						else {
							pipe.visible = enabled;
							pipe.userData.enable = enabled;
                        }
                    }
                }
            }
		}

		const pipes = modelNode.userData.pipes;
		const selectedModels = [];
		const selectedPipes = {};

		if (pipes) {
			for (const pipe of pipes) {
				for (const facility of pipe.userData.facilities) {
					if (facility.userData.pair) {
						const model = facility.userData.boundingModel ? facility : facility.userData.pair;
						model.visible = true;
						model.userData.enable = true;

						if (enabled === false && model.userData?.pair) {
							model.userData.pair.visible = true;
							model.userData.pair.enable = true;
                        }

						if (selectedModels.includes(model) === false)
							selectedModels.push(model);
                    }
				}

				selectedPipes[pipe.name] = pipe;
			}

			this.selectedBoundingModels = selectedModels;
			this.selectedPipes = selectedPipes;
			return modelNode;
		}

		return null;
	}

	clearBoundingBoxModels() {
		const models = [...this.selectedBoundingModels];

		for (const model of models) {
			model.visible = false;
		}

		this.selectedBoundingModels = [];
		this.selectedPipes = {};
	}

	clearTypeBoundingBoxModels(type, zoneID) {
		if (zoneID === null)
			zoneID = PipePathManager.OutdoorZoneID;

		const zonePathData = this.zonePaths[zoneID];

		if (zonePathData) {
			for (const pipeName in zonePathData) {
				const pipe = zonePathData[pipeName];

				if (pipe?.pipeType === type) {
					const models = [...this.selectedBoundingModels];

					for (const model of models) {
						let facility = model.userData.pipes ? model : model.userData.pair;

						if (facility?.userData?.pipes) {
							for (const pipeModel of facility.userData.pipes) {
								if (pipeModel.name === pipeName) {
									model.visible = false;
									delete this.selectedPipes[pipeName];
									break;
                                }
							}
                        }
					}

					const boundingModels = [];

					for (const model of models) {
						if (model.visible) {
							boundingModels.push(model);
                        }
                    }

					this.selectedBoundingModels = boundingModels;
					//break;
                }
			}
		}
    }
}