import * as THREE from "three/build/three.module.js";
import { MathUtil } from "./mathUtil";

export class POI {
    // 배경 이미지는 아주 멀리 떨어진 곳에 있다고 가정한다.
    static longDistance = 1000000;

    // horzAngle : radian
    // vertAngle : radian
    // vCenter : Vector3
    // vCameraInit : Vector3
    constructor(name, horzAngle, vertAngle, vCenter, vCameraInit) {
        this.originAngleHorz = horzAngle;
        this.originAngleVert = vertAngle;
        this.vCenter = vCenter;
        this.vCameraInit = vCameraInit;

        this.originPoint = this.calcOriginPoint();
        this.endPoint = this.calcEndPoint();

        this.prevCameraRotationHorz = null;
        this.prevCameraRotationVert = null;
        this.prevTargetPosition = null;
        this.prevScale = null;

        this.name = name;
        this.sprite = null;
    }

    calcOriginPoint() {
        const r = MathUtil.getDistance3(this.vCenter, this.vCameraInit);
        const theta = Math.PI - 2 * this.originAngleHorz;
        const len = Math.sqrt(2 * r * r - 2 * r * r * Math.cos(theta));

        const vCameraInit2D = new THREE.Vector2(this.vCameraInit.x, this.vCameraInit.z);
        const vCameraOpposite = new THREE.Vector2(this.vCenter.x * 2 - this.vCameraInit.x, this.vCenter.z * 2 - this.vCameraInit.z);
        const vTemp = MathUtil.getLinear2(vCameraInit2D, vCameraOpposite, len * Math.cos(this.originAngleHorz));
        const vTargetH = MathUtil.getRight(vTemp, vCameraInit2D, len * Math.sin(this.originAngleHorz));

        const vRight = new THREE.Vector3(vTargetH.x, 0, vTargetH.y);
        const vBottom = new THREE.Vector3(this.vCameraInit.x, -len, this.vCameraInit.z);
        const vBottomRight = MathUtil.getTopRight3(vBottom, this.vCameraInit, vRight);

        const vTemp1 = MathUtil.getLinear3(this.vCameraInit, vRight, len * Math.cos(this.originAngleVert));
        const vTemp2 = MathUtil.getLinear3(vRight, vBottomRight, len * Math.sin(this.originAngleVert));
        const vTarget = MathUtil.getTopRight3(vTemp2, vRight, vTemp1);

        return vTarget;
    }

    calcEndPoint() {
        const r = MathUtil.getDistance3(this.vCenter, this.vCameraInit);
        const R = POI.longDistance;
        const alpha = MathUtil.getAngle3(this.originPoint, this.vCameraInit, this.vCenter);
        const theta = Math.PI - alpha;

        const a = -2 * r * Math.cos(theta);
        const b = r * r - R * R;

        const l1 = (-a + Math.sqrt(a * a - 4 * b)) / 2;
        const l2 = (-a - Math.sqrt(a * a - 4 * b)) / 2;
        const len = l1 > 0 ? l1 : l2;

        const endPoint = MathUtil.getLinear3(this.vCameraInit, this.originPoint, MathUtil.getDistance3(this.vCameraInit, this.originPoint) + len);
        return endPoint;
    }

    // cameraRotationHorz : degree
    // cameraRotationVert : degree
    getPosition(cameraRotationHorz, cameraRotationVert) {
        cameraRotationHorz = this.normalizeAngle(cameraRotationHorz);
        cameraRotationVert = this.normalizeAngle(cameraRotationVert);

        const r = MathUtil.getDistance3(this.vCenter, this.vCameraInit);

        if (this.prevCameraRotationHorz === null || this.prevCameraRotationHorz === null ||
            this.prevCameraRotationHorz !== cameraRotationHorz || this.prevCameraRotationVert !== cameraRotationVert) {
            this.prevCameraRotationHorz = cameraRotationHorz;
            this.prevCameraRotationVert = cameraRotationVert;

            const thetaHorz = THREE.MathUtils.degToRad(cameraRotationHorz);
            const thetaVert = THREE.MathUtils.degToRad(cameraRotationVert);

            let vS2 = null;
            
            if (thetaHorz <= MathUtil.CoordTolerance || thetaHorz >= Math.PI * 2 - MathUtil.CoordTolerance) {
                if (thetaVert <= MathUtil.CoordTolerance || thetaVert >= Math.PI * 2 - MathUtil.CoordTolerance) {
                    this.prevTargetPosition = this.originPoint;

                    const len = MathUtil.getDistance3(this.vCameraInit, this.originPoint);
                    const scale = len / 2 / r;
                    this.prevScale = scale;

                    return [this.prevTargetPosition, scale];
                }
                else {
                    const x = this.vCenter.x;
                    const y = r * Math.sin(thetaVert) + this.vCenter.y;
                    const z = r * Math.cos(thetaVert) + this.vCenter.z;
                    vS2 = new THREE.Vector3(x, y, z);
                }
            }
            else {
                const cosData = Math.cos(thetaVert);
                const x = r * cosData * Math.sin(thetaHorz);
                const y = r * Math.sin(thetaVert);
                const z = r * cosData * Math.cos(thetaHorz);
                vS2 = new THREE.Vector3(x, y, z);
            }

            const angle1 = MathUtil.getAngle3(this.vCameraInit, vS2, this.endPoint);
            const angle2 = MathUtil.getAngle3(this.vCenter, vS2, this.vCameraInit);

            // this.vCenter, vS2, vT가 이루는 각
            const angle = angle1 - angle2;
            // vS2, this.vCenter, vT가 이루는 각
            const k = Math.PI - 2 * angle;

            // vS2와 vT 사이의 거리
            const len = Math.sqrt(2 * r * r - 2 * r * r * Math.cos(k));
            const vT = MathUtil.getLinear3(vS2, this.endPoint, len);
            this.prevTargetPosition = vT;

            const scale = len / 2 / r;
            this.prevScale = scale;
            return [vT, scale];
        }

        return [this.prevTargetPosition, this.prevScale];
    }

    normalizeAngle(angle) {
        if (angle < 0) {
            angle += 360;
        }
        else if (angle >= 360) {
            angle -= 360;
        }

        return angle;
    }
}