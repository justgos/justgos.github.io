import * as THREE from 'three'
import ReactDOM from 'react-dom'
import React, { useEffect, useState, useMemo, useRef } from 'react'
import { Canvas } from 'react-three-fiber'
import FontAwesome from 'react-fontawesome'
import './App.scss';

import { dpi } from './config'
import { store } from './core/state'
import { sleep } from './util/time'
import { ProjectData } from './data/ProjectData'
import SceneController from './components/SceneController'
import RenderHTML from './components/RenderHTML'
import ProjectPreview from './components/ProjectPreview'
import PixelSwarm from './components/PixelSwarm'
import SwarmTarget from './components/SwarmTarget'
import ProjectInfo from './components/ProjectInfo'

// const gpu = new GPU({mode: "gpu"});

function App() {
  const [ locked, setLocked ] = useState(true);

  const [ revealStage, setRevealStage ] = useState(0);
  useEffect(
    () => {
      const reveal = async() => {
        await sleep(2000);
        setRevealStage(1);
        await sleep(2000);
        setRevealStage(2);
        // await sleep(1000);
        setLocked(false);
      };
      reveal();
      // // document.documentElement.className = "locked";
      // setTimeout(() => {
      //   // document.documentElement.className = "";
      //   setLocked(false);
      // }, 1000);
    }, []
  );

  return (
    <div className="App">
      <div className="main-canvas">
        <Canvas
          id="gl-canvas"
          camera={{
            fov: 75,
            near: 1.0,
            far: 10000,
            position: [0, 0, 1000],
            rotation: new THREE.Euler(0, 0, 0)
          }}
          orthographic={true}
          pixelRatio={window.devicePixelRatio || 1}
          onCreated={({ gl }) => { gl.shadowMap.enabled = true; gl.shadowMap.type = THREE.PCFSoftShadowMap; }}>
          <SceneController>
          <PixelSwarm position={[0, 0, 0]} />
            {/* <mesh 
              position={new THREE.Vector3(0, -200, 0)}
              rotation={new THREE.Euler(0, 0, 0)} 
              castShadow 
              receiveShadow>
              <boxGeometry attach="geometry" args={[200, 200, 200]} />
              <meshStandardMaterial attach="material" />
            </mesh> */}
            {/* <Text opacity={1} position={new THREE.Vector3(0, 10, 0)} color="black">
              Hello, dear traveller
            </Text> */}
            {/* <RenderHTML opacity={1} position={top.interpolate(top => [0, Math.round(top * dpi) / dpi, 0])} color="black">
              <div className="welcome">
                <div className="welcome-line">
                  Hello, dear traveller
                </div>
                <div className="welcome-line">
                  i'm GoS, and here's stuff i love and do
                </div>
              </div>
            </RenderHTML> */}
            {/* {projectData.map((project, i) => 
              <ProjectPreview key={i} i={i} project={project} />
            )} */}
          </SceneController>
        </Canvas>
      </div>
      <div className="content">
        {/* <div style={{ height: '525vh' }} /> */}
        <div className="hero">
          <div className="welcome">
            <SwarmTarget id="logo" type="content" size={[ 200, 200 ]} scale={4} image="/textures/logo.png"/>
            <div className={"welcome-line" + (revealStage < 1 ? " hidden" : "")}>
              Hello, dear traveller
            </div>
            <div className={"welcome-line" + (revealStage < 2 ? " hidden" : "")}>
              i'm GoS, and here's stuff i love and do
            </div>
          </div>
        </div>
        <div className={"delayed-content" + (locked ? " locked" : "")}>
          <div className="container">
            {ProjectData.inProgress.map((project, i) => 
              <ProjectInfo key={i} project={project} />
            )}
            <div className="project-group-header">
              Archive
            </div>
            {ProjectData.archive.map((project, i) => 
              <ProjectInfo key={i} project={project} />
            )}
          </div>
          <div className="footer">
            <a href="https://twitter.com/just_gos" target="_blank" rel="noopener noreferrer">
              <FontAwesome name="twitter" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
