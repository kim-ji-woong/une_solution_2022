import * as THREE from "three/build/three.module.js";
import { Contents3D } from "./contents3D";
import { POI } from "./poi";

export class POIManager {
    static icon = {
        "etc": "etc.png"
    }

    static targetCenter = new THREE.Vector3(0, 0, 0);
    static basicScale = 0.7;

    constructor() {
        this.spriteMaterials = {};
        this.loadImages();
        this.pois = {};
    }

    loadImages() {
        for (const key in POIManager.icon) {
            this.loadImage(POIManager.icon[key]);
        }
    }

    loadImage(image) {
        const url = "resource/image/icon/" + image;
        const spriteMap = new THREE.TextureLoader().load(url);
        const spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap, color: 0xffffff });
        this.spriteMaterials[image] = spriteMaterial;
    }

    // horzAngle : 수평방향 각도(degree)
    // vertAngle : 수직방향 각도(degree)
    // cameraRotationHorz : 카메라의 수평방향 회전각(degree)
    // cameraRotationVert : 카메라의 수직방향 회전각(degree)
    addPOI(scene, iconType, name, horzAngle, vertAngle, cameraRotationHorz, cameraRotationVert, scale = 1) {
        const vCameraInit = new THREE.Vector3(0, 0, Contents3D.distance);
        const poi = new POI(name, THREE.MathUtils.degToRad(horzAngle), THREE.MathUtils.degToRad(vertAngle), POIManager.targetCenter, vCameraInit);

        if (poi) {
            this.pois[poi.name] = poi;
            const [position, _scale] = poi.getPosition(cameraRotationHorz, cameraRotationVert);

            poi.sprite = this._addPOI(scene, iconType, name, position.x, position.y, position.z, scale * _scale);
        }
    }

    _addPOI(scene, iconType, name, x, y, z, scale = 1) {
        const spriteMaterial = this.spriteMaterials[iconType];

        if (!spriteMaterial) {
            return null;
        }

        const sprite = new THREE.Sprite(spriteMaterial);

        sprite.scale.x *= POIManager.basicScale * scale;
        sprite.scale.y *= POIManager.basicScale * scale;
        sprite.scale.z *= POIManager.basicScale * scale;

        sprite.position.x = x;
        sprite.position.y = y;
        sprite.position.z = z;

        sprite.name = name;

        scene.add(sprite);
        return sprite;
    }

    removePOI(scene, poi) {
        if (poi.sprite) {
            scene.remove(poi.sprite);
            delete this.pois[poi.name];
        }
    }

    removeAll(scene) {
        const pois = { ...this.pois };

        for (const poiName in pois) {
            const poi = pois[poiName];
            this.removePOI(scene, poi);
        }

        this.pois = {};
    }

    rotateCamera(cameraRotationHorz, cameraRotationVert) {
        const pois = { ...this.pois };

        for (const poiName in pois) {
            const poi = pois[poiName];

            if (poi.sprite) {
                const [position, scale] = poi.getPosition(cameraRotationHorz, cameraRotationVert);
                const poiScale = POIManager.basicScale * scale;

                poi.sprite.position.set(position.x, position.y, position.z);
                poi.sprite.scale.set(poiScale, poiScale, poiScale);
            }
        }
    }

    getPoi(raycaster) {
        const pois = [];
        const _pois = { ...this.pois };

        for (const poiName in _pois) {
            const poi = _pois[poiName];

            if (poi.sprite) {
                pois.push(poi.sprite);
            }
        }

        const intersects = raycaster.intersectObjects(pois, true);
        const intersectCount = intersects.length;

        for (let i = 0; i < intersectCount; i++) {
            const intersect = intersects[i];

            if (intersect.object.visible === false) {
                continue;
            }

            if (intersect.object.name.length > 0) {
                return _pois[intersect.object.name];
            }
        }

        return null;
    }
}