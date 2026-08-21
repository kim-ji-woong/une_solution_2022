// 3D 모델(.glb)/텍스처 리소스에 대한 브라우저 캐시 무효화(cache-busting) 유틸리티.
//
// 문제: /resource/gltf/**.glb 는 파일명이 그대로 유지된 채 내용만 교체되는 방식으로 배포된다.
// 서버에서 Cache-Control: no-cache 헤더를 붙여도, 헤더가 적용되기 이전에 브라우저가
// 이미 저장해 둔 사본(휴리스틱 캐시)은 그대로 재사용되어 일반 새로고침으로는 갱신되지 않는다.
// 해결: 모델/텍스처 URL 뒤에 버전 쿼리스트링(?v=...)을 붙여, 모델이 교체될 때마다
// URL 자체가 달라지도록 만든다. 브라우저는 새 URL을 "다른 리소스"로 인식해 무조건 새로 받아온다.
//
// 반드시 다른 로더 생성부(contents3D.jsx 등)와 동일한 three.js 빌드 경로로 import해야
// 동일한 THREE.DefaultLoadingManager 싱글턴을 공유한다.
import * as THREE from "three/build/three.module.js";

// 서버에서 읽어온 현재 리소스 버전 (초기화 전에는 빈 문자열 → URL 변형 없음)
let resourceVersion = "";

/// 리소스 버전 파일을 읽어 THREE.DefaultLoadingManager 에 URL 모디파이어를 등록한다.
/// 앱에서 3D 모델을 로드하기 전에 한 번 호출되어야 한다(중복 호출해도 안전).
export async function initResourceVersion() {
    try {
        // 1. 버전 파일 자체도 캐시되지 않도록 no-store + 타임스탬프 쿼리로 요청한다.
        const res = await fetch('/resource/model-version.json?t=' + Date.now(), { cache: 'no-store' });

        if (res.ok) {
            const data = await res.json();
            resourceVersion = data && data.version ? String(data.version) : "";
        }
    } catch (e) {
        // 버전 파일을 못 읽어도 앱 동작에는 지장이 없도록 조용히 무시한다(버전 없이 기존 동작 유지).
        console.log(e);
    }

    // 2. 모든 GLTFLoader/TextureLoader/FBXLoader가 공유하는 DefaultLoadingManager에
    //    URL 모디파이어를 등록한다. 이후 모든 리소스 요청 URL이 이 함수를 거친다.
    THREE.DefaultLoadingManager.setURLModifier(appendVersion);
}

/// 리소스 경로(/resource/...)에만 버전 쿼리스트링을 붙이고, 그 외 URL은 그대로 반환한다.
function appendVersion(url) {
    if (!resourceVersion || !url) {
        return url; // 버전 미확보 상태면 기존 URL 그대로 사용
    }

    if (url.indexOf('data:') === 0 || url.indexOf('blob:') === 0) {
        return url; // 내장(embedded) 리소스는 변형하지 않음
    }

    if (url.indexOf('/resource/') === -1 && url.indexOf('resource/') !== 0) {
        return url; // 모델/텍스처 경로가 아니면(예: draco 디코더) 변형하지 않음
    }

    const sep = url.indexOf('?') === -1 ? '?' : '&';
    return url + sep + 'v=' + resourceVersion;
}
