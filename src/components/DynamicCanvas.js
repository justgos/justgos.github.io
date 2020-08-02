import { WebGLMultisampleRenderTarget as MSRT, WebGLRenderTarget, RGBFormat, RGBAFormat, UnsignedByteType, OrthographicCamera, Scene, Mesh, Color } from 'three'
import * as THREE from 'three';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useFrame, useThree, extend } from 'react-three-fiber';
import { a } from 'react-spring/three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader'

import { dpi } from '../config'
import { store, updateSwarmState } from '../core/state'
import GPUComputationRenderer from '../compute/GPUComputationRenderer';
import PixelSwarmShader from '../shaders/PixelSwarmShader';
import { PixelSwarmTargetPositionShader, PixelSwarmVelocityShader, PixelSwarmPositionShader, PixelSwarmColorShader} from '../shaders/PixelSwarmComputeShaders';
import SceneController from '../components/SceneController'
import PixelSwarm from '../components/PixelSwarm'
import DynamicCanvasShader from '../shaders/DynamicCanvasShader';

// extend({ EffectComposer, ShaderPass, RenderPass })

export default function DynamicCanvas({ children }) {
  // const computeTexSize = 128;
  // const n = computeTexSize * computeTexSize;
  
  // const {
  //   gl,
  //   size: { width, height },
  // } = useThree();

  // const [ swarmState, setSwarmState ] = useState(store.getState().swarmState);
  // const updateSwarmState = () => {
  //   setSwarmState(store.getState().swarmState);
  // };
  // store.subscribe(() => {
  //   updateSwarmState();
  // })

  // const fillZeroTex = (tex) => {
  //   let texData = tex.image.data;
  //   for(var i=0; i<texData.length; i+=4) {
  //     texData[i] = 0.0;
  //     texData[i + 1] = 0.0;
  //     texData[i + 2] = 0.0;
  //     texData[i + 3] = 0.0;
  //   }
  // }

  // // Setup compute shaders
  // const [ gpuCompute, targetPositionVariable, positionVariable, targetPositionTex, velocityVariable, colorVariable, targetColorTex ] = useMemo(
  //   () => {
  //     let gpuCompute = new GPUComputationRenderer(computeTexSize, computeTexSize, gl);
  //     var positionTex = gpuCompute.createTexture();
  //     var targetPositionTex = gpuCompute.createTexture();
  //     var velocityTex = gpuCompute.createTexture();
  //     fillPositionTex(positionTex);
  //     fillPositionTex(targetPositionTex);
  //     fillZeroTex(velocityTex);
  //     var colorTex = gpuCompute.createTexture();
  //     var targetColorTex = gpuCompute.createTexture();
  //     fillZeroTex(colorTex);
  //     fillZeroTex(targetColorTex);

  //     let targetPositionVariable = gpuCompute.addVariable("targetPositionTex", PixelSwarmTargetPositionShader, targetPositionTex);
  //     targetPositionVariable.material.uniforms["time"] = { value: 0 };
  //     targetPositionVariable.material.uniforms["delta"] = { value: 0 };
  //     targetPositionVariable.material.uniforms["targetType"] = { value: 0 };
  //     targetPositionVariable.material.uniforms["targetPositionTex"] = { value: targetPositionTex };

  //     let velocityVariable = gpuCompute.addVariable("velocityTex", PixelSwarmVelocityShader, velocityTex);
  //     velocityVariable.material.uniforms["time"] = { value: 0 };
  //     velocityVariable.material.uniforms["delta"] = { value: 0 };
  //     velocityVariable.material.uniforms["targetPositionTex"] = { value: targetPositionTex };
  //     velocityVariable.material.uniforms["targetScale"] = { value: [0, 0] };
  //     velocityVariable.material.uniforms["targetPositionOffset"] = { value: [0, 0] };
  //     velocityVariable.material.uniforms["dTargetOffset"] = { value: [0, 0] };
  //     velocityVariable.material.uniforms["velocityNoiseScale"] = { value: 0 };

  //     let positionVariable = gpuCompute.addVariable("positionTex", PixelSwarmPositionShader, positionTex);
  //     positionVariable.material.uniforms["delta"] = { value: 0 };
  //     positionVariable.material.uniforms["dTargetOffset"] = { value: [0, 0] };
      
  //     gpuCompute.setVariableDependencies(targetPositionVariable, [ targetPositionVariable ]);
  //     gpuCompute.setVariableDependencies(velocityVariable, [ positionVariable, velocityVariable, targetPositionVariable ]);
  //     gpuCompute.setVariableDependencies(positionVariable, [ positionVariable, velocityVariable ]);

  //     let colorVariable = gpuCompute.addVariable("colorTex", PixelSwarmColorShader, colorTex);
  //     colorVariable.material.uniforms["targetColorTex"] = { value: targetColorTex };
  //     colorVariable.material.uniforms["delta"] = { value: 0 };
  //     gpuCompute.setVariableDependencies(colorVariable, [ colorVariable ]);

  //     var error = gpuCompute.init();
  //     if ( error !== null ) {
  //         console.error( error );
  //     }
  //     return [ gpuCompute, targetPositionVariable, positionVariable, targetPositionTex, velocityVariable, colorVariable, targetColorTex ];
  //   },
  //   []
  // );

  // // Update compute buffers with new target data
  // useEffect(
  //   () => {
  //     if(!target)
  //       return;

  //       texData = targetColorTex.image.data;
  //       for(let i=0; i<texData.length; i+=4) {
  //         texData[i] = 0;
  //         texData[i + 1] = 0;
  //         texData[i + 2] = 0;
  //         texData[i + 3] = 0.4 + 0.6 * Math.random();
  //       }
  //       targetColorTex.needsUpdate = true;
      
  
  //     gpuCompute.renderTexture(targetPositionTex, gpuCompute.getCurrentRenderTarget(targetPositionVariable));
  //   }, [target]
  // );

  // const [swarmShader] = useMemo(() => {
  //   const loader = new THREE.TextureLoader();
  //   const swarmShader = new PixelSwarmShader({
  //     pointTexture: loader.load('/textures/box-shadow-16px.png'),
  //     posOffset: [0, 0],
  //     time: 0,
  //     targetType: 0,
  //   });
  //   return [swarmShader]
  // }, []);

  // const [ lastTime, lastTargetOffset ] = useMemo(
  //   () => {
  //     return [ 
  //       { value: performance.now() },
  //       { value: [ 0, 0 ] },
  //      ]
  //   }, []
  // );
  // useFrame(() => {
  //   let curTime = performance.now();
  //   let dtime = Math.min((curTime - lastTime.value) / 1000, 0.1);
  //   lastTime.value = performance.now();
  //   // console.log('dtime', dtime * 1000.0);
  //   // setLastTime(curTime);

  //   // Update time-related variables
  //   targetPositionVariable.material.uniforms["time"].value = curTime / 1000.0;
  //   targetPositionVariable.material.uniforms["delta"].value = dtime;
  //   velocityVariable.material.uniforms["time"].value = curTime / 1000.0;
  //   velocityVariable.material.uniforms["delta"].value = dtime;
  //   positionVariable.material.uniforms["delta"].value = dtime;
  //   colorVariable.material.uniforms["delta"].value = dtime;
  //   swarmShader.uniforms.time.value = curTime / 1000.0;

  //   // Find the most appropriate `SwarmTarget`
  //   let intendedTarget;
  //   let scrollTop = document.scrollingElement.scrollTop;
  //   // Ref: https://stackoverflow.com/a/8876069
  //   var viewport = [
  //     Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
  //     Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  //   ];
  //   let maxPriority = 0;
  //   let targetIds = Object.keys(targets);
  //   for(let i=0; i<targetIds.length; i++) {
  //     let el = document.getElementById(targets[targetIds[i]].id);
  //     // Is target inside the viewport?
  //     if(el.offsetTop + el.offsetHeight > scrollTop && el.offsetTop < scrollTop + viewport[1]) {
  //       let visibleHeight = Math.min(scrollTop + viewport[1], el.offsetTop + el.offsetHeight)
  //                         - Math.max(scrollTop, el.offsetTop);
  //       let priority = visibleHeight;
  //       // Still has a part below the viewport's edge?
  //       if(el.offsetTop + el.offsetHeight > scrollTop + viewport[1])
  //         priority *= 2.0;
  //       if(priority > maxPriority) {
  //         maxPriority = priority;
  //         intendedTarget = targets[targetIds[i]];
  //       }
  //     }
  //   }
  //   if(intendedTarget && intendedTarget !== target) {
  //     setTarget(intendedTarget);
  //   }

  //   // Update target's size and position in compute shader
  //   if(target) {
  //     let targetEl = document.getElementById(target.id);
  //     let targetSize = [
  //       targetEl.offsetWidth,
  //       targetEl.offsetHeight
  //     ];
  //     let targetOffset = [
  //       targetEl.offsetLeft + targetSize[0] / 2, 
  //       -targetEl.offsetTop - targetSize[1] / 2
  //     ];

  //     // Keep compute values near [0,0] to preserve the precision on mobile
  //     let dTargetOffset = [ 
  //       targetOffset[0] - lastTargetOffset.value[0],
  //       targetOffset[1] - lastTargetOffset.value[1]
  //     ];
  //     velocityVariable.material.uniforms["dTargetOffset"].value = dTargetOffset;
  //     velocityVariable.material.uniforms["targetScale"].value = targetSize;
  //     positionVariable.material.uniforms["dTargetOffset"].value = dTargetOffset;
  //     lastTargetOffset.value = targetOffset;

  //     targetPositionVariable.material.uniforms["targetType"].value = targetType;
  //     velocityVariable.material.uniforms["velocityNoiseScale"].value = velocityNoiseScale;

  //     swarmShader.uniforms.targetType.value = targetType;
  //     swarmShader.uniforms.pointScale.value = target.scale / 2 * dpi;
  //     swarmShader.uniforms.posOffset.value = targetOffset;
  //   } else {
  //     velocityVariable.material.uniforms["dTargetOffset"].value = [ 0, 0 ];
  //     positionVariable.material.uniforms["dTargetOffset"].value = [ 0, 0 ];
  //   }
  //   // let t1 = Date.now();
  //   // let time = Date.now() * 0.0005;
  //   // let pos = posAttr.current.array;
  //   // let alpha = alphaAttr.current.array;
  //   // posAttr.current.needsUpdate = true;
  //   // alphaAttr.current.needsUpdate = true;

  //   gpuCompute.compute();
  //   swarmShader.uniforms.positionTex.value = gpuCompute.getCurrentRenderTarget(positionVariable).texture;
  //   swarmShader.uniforms.colorTex.value = gpuCompute.getCurrentRenderTarget(colorVariable).texture;
  //   // console.log('itertime', performance.now() - curTime);
  // });


  const rttScene = useRef();
  const rttGroup = useRef();
  const rttBg = useRef();
  const realScene = useRef();
  const realBg = useRef();
  const { gl, scene, camera, size } = useThree()
  const devicePixelRatio = dpi;
  const { width, height } = { width: size.width * devicePixelRatio, height: size.height * devicePixelRatio }
  const composer = useRef()
  const [ renderTargets, rttCamera ] = useMemo(() => {
    const targetOptions = {
      format: RGBAFormat,
      type: UnsignedByteType,
      magFilter: THREE.NearestFilter,
      minFilter: THREE.NearestFilter,
      depthBuffer: false,
      stencilBuffer: false,
      generateMipmaps: false,
    };
    const target1 = new WebGLRenderTarget(width, height, targetOptions);
    const target2 = new WebGLRenderTarget(width, height, targetOptions);
    // target.samples = 8
    const rttCamera = new OrthographicCamera( camera.left, camera.right, camera.top, camera.bottom, camera.near, camera.far );
    return [ [ target1, target2 ], rttCamera ]
  }, [width, height])
  // useEffect(() => void composer.current.setSize(width, height), [width, height])
  useFrame(() => {
    rttCamera.position.x = camera.position.x;
    rttCamera.position.y = camera.position.y;
    rttCamera.position.z = camera.position.z;
    // rttGroup.current.position.x = Math.sin(Date.now() / 1000) * 100;

    // gl.autoClear = false;
    rttBg.current.material.map = renderTargets[0].texture;
    // canvasShader.uniforms.texture.value = renderTargets[0].texture;
    gl.setClearColor(new Color('#000'), 0.0);
    gl.setRenderTarget( renderTargets[1] );
    gl.clear();
    gl.render( rttScene.current, rttCamera );
    [ renderTargets[0], renderTargets[1] ] = [ renderTargets[1], renderTargets[0] ];
    realBg.current.material.map = renderTargets[0].texture;

    // gl.setClearColor(new Color('#fff'), 1.0);
    gl.setRenderTarget( null );
    gl.clear();
    gl.render( realScene.current, camera );
  }, 1)  // 

  // console.log('renderTarget', renderTarget)

  const [canvasShader] = useMemo(() => {
    const canvasShader = new DynamicCanvasShader({
      //
    });
    return [canvasShader]
  }, []);

  return (
    <>
      {/* <effectComposer ref={composer} args={[gl, renderTarget]} renderToScreen={false}>
        <renderPass attachArray="passes" args={[scene, camera]} />
        <shaderPass attachArray="passes" args={CopyShader} />
      </effectComposer> */}
      <scene ref={rttScene}>
        <SceneController>
          {/* <mesh frustumCulled={false} position={[width / dpi / 2, -height / dpi / 2, -100]}>
            <planeBufferGeometry attach="geometry" args={[width / dpi, height / dpi]} />
            <meshStandardMaterial attach="material" color="#fff" opacity={1.0} />
          </mesh> */}
          <mesh ref={rttBg} frustumCulled={false} position={[width / dpi / 2, -height / dpi / 2, -100]}>
            <planeBufferGeometry attach="geometry" args={[width / dpi, height / dpi]} />
            <meshBasicMaterial attach="material" transparent opacity={0.9 /*0.97*/} />
            {/* <shaderMaterial attach="material" args={[canvasShader]} /> */}
          </mesh>
          <group ref={rttGroup}>
            {children}
          </group>
          {/* <mesh 
            position={new THREE.Vector3(0, -200, 0)}
            rotation={new THREE.Euler(0, 0, 0)} 
            castShadow 
            receiveShadow>
            <boxGeometry attach="geometry" args={[200, 200, 200]} />
            <meshStandardMaterial attach="material" />
          </mesh> */}
          {/* <RenderText opacity={1} position={new THREE.Vector3(0, 10, 0)} color="black">
            Hello, dear traveller
          </RenderText> */}
        </SceneController>
        {/* <mesh frustumCulled={false} position={[600, -600, 100]}>
          <planeBufferGeometry attach="geometry" args={[400, 400]} />
          <meshStandardMaterial attach="material" color="#000" />
        </mesh> */}
      </scene>
      
      <scene ref={realScene}>
        <SceneController>
          <mesh ref={realBg} frustumCulled={false} position={[width / dpi / 2, -height / dpi / 2, -0]}>
            <planeBufferGeometry attach="geometry" args={[width / dpi, height / dpi]} />
            <meshStandardMaterial attach="material" opacity={1.0} />
          </mesh>
          {/* <mesh frustumCulled={false} position={[width / dpi / 2, -height / dpi / 2, -100]}>
            <planeBufferGeometry attach="geometry" args={[width / dpi, height / dpi]} />
            <meshStandardMaterial attach="material" color="#fff" opacity={1.0} />
          </mesh> */}
          {/* <PixelSwarm position={[0, 0, 0]} /> */}
          {/* <PixelSwarm position={[0, 0, 0]} /> */}
          {/* <mesh frustumCulled={false} position={[600, -600, 100]}>
            <planeBufferGeometry attach="geometry" args={[400, 400]} />
            <meshStandardMaterial attach="material" color="#000" />
          </mesh> */}
          {/* <PixelSwarm position={[0, 0, 0]} /> */}
          {/* <mesh 
            position={new THREE.Vector3(0, -200, 0)}
            rotation={new THREE.Euler(0, 0, 0)} 
            castShadow 
            receiveShadow>
            <boxGeometry attach="geometry" args={[200, 200, 200]} />
            <meshStandardMaterial attach="material" />
          </mesh> */}
          {/* <RenderText opacity={1} position={new THREE.Vector3(0, 10, 0)} color="black">
            Hello, dear traveller
          </RenderText> */}
        </SceneController>
        {/* <mesh frustumCulled={false} position={[600, -600, 100]}>
          <planeBufferGeometry attach="geometry" args={[400, 400]} />
          <meshStandardMaterial attach="material" color="#000" />
        </mesh> */}
      </scene>
    </>
  );
};
