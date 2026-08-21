import * as THREE from "three/build/three.module.js";

export class MathUtil {
    static CoordTolerance = 0.0000001;

    // THREE.Vector2
    static getDistance2(v1, v2) {
        const width = v1.x - v2.x;
        const height = v1.y - v2.y;
        return Math.sqrt(width * width + height * height);
    }

    // THREE.Vector3
    static getDistance3(v1, v2) {
        const width = v1.x - v2.x;
        const height = v1.y - v2.y;
        const depth = v1.z - v2.z;
        return Math.sqrt(width * width + height * height + depth * depth);
    }

    // THREE.Vector2
    static getLinear2(v1, v2, length) {
        const len = MathUtil.getDistance2(v1, v2);

        if (len <= MathUtil.CoordTolerance) {
            return new THREE.Vector2(v1.x, v1.y);
        }

        const x = v1.x + (v2.x - v1.x) * length / len;
        const y = v1.y + (v2.y - v1.y) * length / len;
        return new THREE.Vector2(x, y);
    }

    // THREE.Vector3
    static getLinear3(v1, v2, length) {
        const len = MathUtil.getDistance3(v1, v2);

        if (len <= MathUtil.CoordTolerance) {
            return new THREE.Vector3(v1.x, v1.y, v1.z);
        }

        const x = v1.x + (v2.x - v1.x) * length / len;
        const y = v1.y + (v2.y - v1.y) * length / len;
        const z = v1.z + (v2.z - v1.z) * length / len;
        return new THREE.Vector3(x, y, z);
    }

    // v1과 v2를 지나는 직선과 수직이며 v1을 지나는 직선이 있다.
    // 이 직선상에 존재하며 v1으로부터 거리 dDistance 만큼 오른쪽(XY 좌표계에서 v2를 원점,
    // v1을 양의 Y축에 놓았을 경우)으로 떨어진 거리의 점을 구한다.
    // only THREE.Vector2
    static getRight(v1, v2, distance) {
        const len = MathUtil.getDistance2(v1, v2);

        if (len === 0.0) {
            return new THREE.Vector2(v1.x, v1.y);
        }

        const x = v1.x + (v1.y - v2.y) * distance / len;
        const y = v1.y + (v2.x - v1.x) * distance / len;
        return new THREE.Vector2(x, y);
    }

    // v1과 vCenter가 이루는 직선과 vCenter와 v2가 이루는 직선이 서로 만나 이루는 각을 리턴한다.
    // v1, vCenter, v3는 THREE.Vector2
    static getAngle2(v1, vCenter, v2) {
        // 코사인 제2법칙
        // C²= A²+ B²- 2ABcosΘ
        const a = MathUtil.getDistance2(v1, vCenter);
        const b = MathUtil.getDistance2(v2, vCenter);
        const c = MathUtil.getDistance2(v1, v2);

        let cosData = (a * a + b * b - c * c) / 2 / a / b;

        if (cosData < -1.0)
            cosData = -1.0;
        else if (cosData > 1.0)
            cosData = 1.0;

        return Math.acos(cosData);
    }

    // v1과 vCenter가 이루는 직선과 vCenter와 v2가 이루는 직선이 서로 만나 이루는 각을 리턴한다.
    // v1, vCenter, v3는 THREE.Vector3
    static getAngle3(v1, vCenter, v2) {
        // 코사인 제2법칙
        // C²= A²+ B²- 2ABcosΘ
        const a = MathUtil.getDistance3(v1, vCenter);
        const b = MathUtil.getDistance3(v2, vCenter);
        const c = MathUtil.getDistance3(v1, v2);

        let cosData = (a * a + b * b - c * c) / 2 / a / b;

        if (cosData < -1.0)
            cosData = -1.0;
        else if (cosData > 1.0)
            cosData = 1.0;

        return Math.acos(cosData);
    }

    static getTopRight2(vTL, vBL, vBR) {
        const x = vBR.x - vBL.x + vTL.x;
        const y = vBR.y - vBL.y + vTL.y;
        return new THREE.Vector2(x, y);
    }

    static getTopRight3(vTL, vBL, vBR) {
        const x = vBR.x - vBL.x + vTL.x;
        const y = vBR.y - vBL.y + vTL.y;
        const z = vBR.z - vBL.z + vTL.z;
        return new THREE.Vector3(x, y, z);
    }
}