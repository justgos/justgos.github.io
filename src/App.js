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
import RenderText from './components/RenderText'
import ProjectPreview from './components/ProjectPreview'
import PixelSwarm from './components/PixelSwarm'
import SwarmTarget from './components/SwarmTarget'
import ProjectInfo from './components/ProjectInfo'
import DynamicCanvas from './components/DynamicCanvas'

// const gpu = new GPU({mode: "gpu"});

function App() {
  const [ locked, setLocked ] = useState(true);

  const [ logoShape, setLogoShape ] = useState("content");
  const [ logoPointSize, setLogoPointSize ] = useState(2);
  const [ revealStage, setRevealStage ] = useState(0);
  useEffect(
    () => {
      const reveal = async() => {
        if(window.location.hash.length < 1) {
          await sleep(4000);
          setRevealStage(1);
          await sleep(2000);
          setRevealStage(2);
          await sleep(1500);
          setLogoShape("generative-excog");
          setLogoPointSize(2);
          await sleep(1000);
        } else {
          setRevealStage(2);
          setLogoPointSize(2);
          setLogoShape("generative-excog");
        }
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

  const [ shouldRender, setShouldRender ] = useState(true);

  useEffect(() => {
    const onScroll = e => {
      if(e.target.documentElement.scrollTop > window.innerHeight) {
        if(shouldRender) {
          console.log('shouldRender false', shouldRender, false)
          setShouldRender(false);
        }
      } else {
        if(!shouldRender) {
          console.log('shouldRender true', shouldRender, true)
          setShouldRender(true);
        }
      }
    };
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [shouldRender]);

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
            rotation: new THREE.Euler(0, 0, 0),
            // zoom: 2.5,
          }}
          orthographic={true}
          pixelRatio={dpi}
          invalidateFrameloop={!shouldRender}
          // onCreated={({ gl }) => { gl.shadowMap.enabled = true; gl.shadowMap.type = THREE.PCFSoftShadowMap; }}
          // gl2={true}
        >
          <DynamicCanvas>
            {/* <mesh frustumCulled={false} position={[300, -300, 0]}>
              <planeBufferGeometry attach="geometry" args={[400, 400]} />
              <meshStandardMaterial attach="material" color="#000" />
            </mesh> */}
            <PixelSwarm position={[0, 0, 0]} />
          </DynamicCanvas>

          {/* <SceneController>
            <PixelSwarm position={[0, 0, 0]} />
          </SceneController> */}
          
          {/* <mesh frustumCulled={false} position={[300, -300, 100]}>
            <planeBufferGeometry attach="geometry" args={[400, 400]} />
            <meshStandardMaterial attach="material" color="#000" />
          </mesh> */}
        </Canvas>
      </div>
      <div className="content">
        {/* <div style={{ height: '525vh' }} /> */}
        <div className="hero">
          <div className="welcome">
            <SwarmTarget id="logo" type={logoShape} size={[ 200, 200 ]} scale={logoPointSize} image="/textures/logo.png"/>
            {/* <SwarmTarget id="logo" type="generative-thomas" size={[ 400, 400 ]} scale={4} /> */}
            <div className={"welcome-line" + (revealStage < 1 ? " hidden" : "")}>
              Hello, dear traveller
            </div>
            <div className={"welcome-line" + (revealStage < 2 ? " hidden" : "")}>
              i'm GoS, and here's stuff i love and do
            </div>
          </div>
          <div className={"proceed" + (locked ? " hidden" : "")}>
            <FontAwesome name="caret-down" />
          </div>
        </div>
        <div className={"delayed-content" + (locked ? " locked" : "")}>
          {/* <div className="container"> */}
            {ProjectData.inProgress.map((project, i) => 
              <ProjectInfo key={i} project={project} />
            )}
            <div className="container">
              <div className="project-group-header">
                Archive
              </div>
            </div>
            {ProjectData.archive.map((project, i) => 
              <ProjectInfo key={i} project={project} />
            )}
            {/* <SwarmTarget id="epilogue" type="generative-thomas" size={[ 400, 400 ]} scale={4} /> */}
            <div className="container">
              <div className="footer">
                <a href="https://twitter.com/just_gos" target="_blank" rel="noopener noreferrer">
                  <FontAwesome name="twitter" />
                </a>
              </div>
            </div>
          </div>
        {/* </div> */}
      </div>
    </div>
  );
}

export default App;
