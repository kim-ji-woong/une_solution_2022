import * as THREE from "three/build/three.module.js";
import i18nUtil from "../../../../language/i18n";
import ProjectResource from "../../../../Root/resource/id";
import SDMSMainMenu from "../../sdmsMainMenu";
import { WorkerManager } from "./workerManager";

export class WorkerManagerNormal extends WorkerManager {
    constructor() {
        super();
        this.typeName = "normal";
    }

    addText(tag, text, zoneID, id, x, y, z, fontSize, backgroundColor, borderColor, textColor, borderThickness, textPOIManager, textLayer, isAlarm = false) {
        return WorkerManagerNormal._addText(tag, text, zoneID, id, x, y, z, fontSize, backgroundColor, borderColor, textColor, borderThickness, textPOIManager, textLayer, isAlarm);
    }

    static _addText(tag, text, zoneID, id, x, y, z, fontSize, backgroundColor, borderColor, textColor, borderThickness, textPOIManager, textLayer, isAlarm = false) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (context === null) {
            return null;
        }

        // .TODO: 폰트 사이즈 테스트
        canvas.width = 600;   // v2
        //canvas.width = 200;
        //const widthSize = 40 * text.length;
        //canvas.width = widthSize + 40;

        //const fontFace = 'malgun gothic';
        const fontFace = 'Arial';

        //let _fontSize = fontSize * 6; // v2
        let _fontSize = fontSize * 6; // v2
        //let _fontSize = fontSize * 5;

        // .TODO: 폰트 사이즈 테스트
        //context.font = fontSize + "px " + fontFace;
        context.font = _fontSize + "px " + fontFace;


        //context.font = "Bold " + fontSize + "px " + fontFace;
        context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
        // border color
        context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";
        context.lineWidth = borderThickness;

        const metrics = context.measureText(i18nUtil.convertText(text));

        // .TODO: 폰트 사이즈 테스트
        //const width = metrics.width + 10;
        const width = metrics.width + 40; // v2
        //const width = metrics.width + 10;

        let w = width + borderThickness;

        const originWidth = w;

        //if (tag === SDMSMainMenu.BuildingGroupNameText) {
        //    if (text.length === 2) {
        //        if (!textPOIManager._2TextWidth) {
        //            textPOIManager._2TextWidth = w + 10;
        //        }

        //        w = textPOIManager._2TextWidth;
        //    }
        //    else if (text.length < 2) {
        //        w = textPOIManager._2TextWidth;
        //    }
        //}

        // .TODO: 폰트 사이즈 테스트
        //const h = fontSize * 1.4 + borderThickness;
        const h = _fontSize * 1.4 + borderThickness;

        //const rectX = (canvas.width - w - borderThickness) / 2;
        //const rectY = (canvas.height - h - borderThickness) / 2;
        const rectX = (canvas.width - w - borderThickness) / 2;
        const rectY = (canvas.height - h - borderThickness) / 2;

        // .TODO: 폰트 사이즈 테스트
        //textPOIManager.roundRect(context, rectX, rectY, w, h, 6);
        textPOIManager.roundRect(context, rectX, rectY, w, h, 24);    // v2
        //textPOIManager.roundRect(context, rectX, rectY, w, h, 12);


        //Contents3D.roundRect(context, borderThickness / 2, borderThickness / 2, width + borderThickness, fontSize * 1.4 + borderThickness, 6);

        // text color
        context.fillStyle = "rgba(" + textColor.r + "," + textColor.g + "," + textColor.b + "," + textColor.a + ")";
        //context.fillStyle = "rgba(0, 0, 0, 1.0)";

        //const textY = rectY + borderThickness;
        // metrics.width보다 10만큼 크게 잡았으니 5만큼 띄워서 시작한다.
        //context.fillText(i18nUtil.convertText(text), rectX + 5 + (w - originWidth) / 2, rectY + fontSize);
        // .TODO: 폰트 사이즈 테스트
        // metrics.width보다 40만큼 크게 잡았으니 20만큼 띄워서 시작한다.
        context.fillText(i18nUtil.convertText(text), rectX + 20 + (w - originWidth) / 2, rectY + _fontSize);  // v2
        //context.fillText(i18nUtil.convertText(text), rectX + 5 + (w - originWidth) / 2, rectY + _fontSize);

        //context.fillText(text, borderThickness + 5, fontSize + borderThickness);

        // canvas contents will be used for a texture
        const texture = new THREE.Texture(canvas)
        texture.needsUpdate = true;

        // const spriteAlignment = THREE.SpriteAlignment.topLeft;

        const spriteMaterial = new THREE.SpriteMaterial(
            { map: texture/*, useScreenCoordinates: false, alignment: spriteAlignment*/ });
        const sprite = new THREE.Sprite(spriteMaterial);
        
        // .TODO: 폰트 사이즈 테스트
        //sprite.scale.set(16, 8, 1.0);
        //sprite.scale.set(3, 1, 1.0);
        //sprite.scale.set(6, 2, 1.0);  // v2
        sprite.scale.set(4, 1, 1.0);  // v2
        //sprite.scale.set(2, 1, 1.0);

        //sprite.material.depthWrite = false;
        //sprite.material.depthTest = false;
        sprite.position.x = x;
        sprite.position.y = y;
        sprite.position.z = z;
        sprite.name = tag + "_" + zoneID + "_" + id;

        sprite.userData.boundingBox = {
            tl: {
                x: x - rectX / 80,
                z: z - rectY / 80
            },
            br: {
                x: x + rectX / 80,
                z: z + rectY / 80
            }
        };

        sprite.userData.uvArea = {
            top: 0.5 + (h / sprite.scale.x) / 2,
            bottom: 0.5 - (h / sprite.scale.x) / 2,
            left: 0.5 - rectX / rectY * (h / sprite.scale.x) / 2,
            right: 0.5 + rectX / rectY * (h / sprite.scale.x) / 2
        };

        sprite.userData.text = text;
        sprite.userData.isAlarm = isAlarm;

        if (textLayer !== null) {
            textLayer.add(sprite);
        }

        return sprite;
    }

    static getOriginTextWidth(text, context, borderThickness, tag, textPOIManager) {
        const metrics = context.measureText(text);
        const width = metrics.width + 10;

        let w = width + borderThickness;

        if (tag === SDMSMainMenu.BuildingGroupNameText) {
            if (text.length === 2) {
                if (!textPOIManager._2TextWidth) {
                    textPOIManager._2TextWidth = w + 10;
                }

                w = textPOIManager._2TextWidth;
            }
            else if (text.length < 2) {
                w = textPOIManager._2TextWidth;
            }
        }

        return w;
    }
}
