import * as THREE from 'three'
import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import ReactDOM from 'react-dom'
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import { apply as applySpring, useSpring, a, interpolate } from 'react-spring/three'

import HTMLRenderer from '../util/HTMLRenderer'

export default function ProjectPreview({ children, i, project }) {
  const {
    gl,
    size: { width, height },
    camera,
  } = useThree();

  const refElementId = "project-image-" + i;

  const videoMat_eso = useRef();
  const videoEsoRef = useRef();

  const [ elSize, setElSize ] = useState([ 1, 1 ]);
  
  useEffect(() => {
    // console.log('videoMat_eso.current', videoMat_eso.current)
    // videoMat_eso.current.map = new THREE.VideoTexture(document.getElementById("video-eso"));
    const loader = new THREE.TextureLoader();
    videoMat_eso.current.map = loader.load(project.image);
    videoMat_eso.current.map.magFilter = THREE.NearestFilter;
    videoMat_eso.current.map.minFilter = THREE.NearestFilter;
  }, []);

  const position = useMemo(
    () => {
      let refEl = document.getElementById(refElementId);
      setElSize([ refEl.offsetWidth, refEl.offsetHeight ]);
      return new THREE.Vector3(width / 2, -refEl.offsetTop - refEl.offsetHeight / 2, 0);
    },
    [width, height]
  );

  useFrame(() => {
    // videoMat_eso.current.map.needsUpdate = true;
  });
  
  return (
    <>
      <mesh 
        position={position}
        rotation={new THREE.Euler(0, 0, 0)} 
        castShadow 
        receiveShadow>
        <boxGeometry attach="geometry" args={[elSize[0], elSize[1], 100]} />
        <meshStandardMaterial attach="material" ref={videoMat_eso} color="#888888">
          {/* <texture sourceFile={project.image} /> */}
        </meshStandardMaterial>
      </mesh>
    </>  
  );
};
  