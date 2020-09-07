import * as THREE from 'three'
import React, { useMemo, useRef } from 'react'
import { useFrame, useThree } from 'react-three-fiber'

import { dpi } from '../config'

export default function SceneController({ children }) {
  const {
    size: { width, height },
    camera,
  } = useThree();

  const [ fpsCount, lastTime, lastReportTime]  = useMemo(
    () => {
      return [ { value: 0 }, { value: performance.now() }, { value: performance.now() } ]
    }, []
  );
  const sceneRef = useRef();
  const mainLight = useRef();
  useFrame(() => {
    let curTime = performance.now();
    lastTime.value = curTime;
    fpsCount.value++;
    if(curTime > lastReportTime.value + 1000.0) {
        // console.log('fps', fpsCount.value);
        lastReportTime.value = curTime;
        fpsCount.value = 0;
    }

    let scrollTop = 0;  // document.scrollingElement.scrollTop;

    camera.position.x = width / 2;
    camera.position.y = -height / 2;

    // mainLight.current.position.x = width / 2 + 200;
    // mainLight.current.position.y = -height / 2 + 100;
    mainLight.current.position.y = -scrollTop;

    sceneRef.current.position.y = Math.round(scrollTop * dpi) / dpi
  });

  return (
      <scene ref={sceneRef}>
        <ambientLight intensity={0.5} />
        <directionalLight intensity={0.6} position={[0, 0, 1000]} rotation={new THREE.Euler(0, 0, 0)} castShadow ref={mainLight} />
        {/* <spotLight intensity={0.7} position={[0, 0, 1000]} rotation={new THREE.Euler(0, 0, 0)} angle={Math.PI / 2} penumbra={1} castShadow ref={mainLight} /> */}
        {children}
      </scene>
  );
}
