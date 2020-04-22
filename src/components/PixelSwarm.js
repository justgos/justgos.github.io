import * as THREE from 'three';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import { a } from 'react-spring/three';

import { dpi } from '../config'
import { store, updateSwarmState } from '../core/state'
import GPUComputationRenderer from '../compute/GPUComputationRenderer';
import PixelSwarmShader from '../shaders/PixelSwarmShader';
import { PixelSwarmTargetPositionShader, PixelSwarmVelocityShader, PixelSwarmPositionShader, PixelSwarmColorShader} from '../shaders/PixelSwarmComputeShaders';

export default function PixelSwarm({ children, position }) {
  const computeTexSize = 128;
  const n = computeTexSize * computeTexSize;
  
  const {
    gl,
    size: { width, height },
  } = useThree();

  const [ target, setTarget ] = useState(null);
  const [ targets, setTargets ] = useState(store.getState().swarmTargets);
  const updateTargets = () => {
    setTargets(store.getState().swarmTargets);
  };
  store.subscribe(() => {
    updateTargets();
  })

  // const ascii2coeff = new Map([..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"].map((c, i) => [c, (-1.2 + i * 0.1).toFixed(1)]));
  // console.log('coeffs', [..."RMGOLOGUGIKKAQUNYYWPNQOPVIXLCONAYGJIROPFQBFMOREQJOOUBXDIVOLY"].map(c => ascii2coeff.get(c)).join(', '));

  // gl.precision = "mediump";

  // const { gl } = useThree();
  
  // Setup point attribute buffers
  const positions = useMemo(
    () => {
      var arr = [];
      for(let i = 0; i < n * 3; i+=3) {
        arr.push(
          Math.random() * width,
          Math.random() * -height,
          0
        );
      }
      return new Float32Array(arr);
    },
    [n]
  );
  const references = useMemo(
    () => {
      var arr = [];
      for(let i = 0; i < n * 2; i+=2)
        arr.push(
          (i / 2) % computeTexSize / computeTexSize, 
          Math.floor(i / 2 / computeTexSize) / computeTexSize,
          // (i / 2 + 1) % computeTexSize / computeTexSize, 
          // Math.floor((i / 2 + 1) / computeTexSize) / computeTexSize
        );
      return new Float32Array(arr);
    },
    [n]
  );

  // const pack2HalfToRGBA = (v) => {
  //   let r = [ v[0], ( v[0] * 255.0 ) % 1, v[1], ( v[1] * 255.0 ) % 1];
  //   return [ r[0] - r[1] / 255.0, r[1], r[2] - r[3] / 255.0, r[3]];
  // }

  // Compute texture intialization
  const fillPositionTex = (tex) => {
    let texData = tex.image.data;
    for(var i=0; i<texData.length; i+=4) {
      texData[i] = positions[i / 4 * 3];
      texData[i + 1] = positions[i / 4 * 3 + 1];
      texData[i + 2] = positions[i / 4 * 3 + 2];
    }
    // for(var i=0; i<texData.length; i+=8) {
    //   let xy = pack2HalfToRGBA([positions[i / 8 * 3], positions[i / 8 * 3 + 1]]);
    //   let zz = pack2HalfToRGBA([positions[i / 8 * 3 + 2], positions[i / 8 * 3 + 2]]);
    //   texData[i] = xy[0];
    //   texData[i + 1] = xy[1];
    //   texData[i + 2] = xy[2];
    //   texData[i + 3] = xy[3];
    //   texData[i + 4] = zz[0];
    //   texData[i + 5] = zz[1];
    // }
  }
  const fillZeroTex = (tex) => {
    let texData = tex.image.data;
    for(var i=0; i<texData.length; i+=4) {
      texData[i] = 0.0;
      texData[i + 1] = 0.0;
      texData[i + 2] = 0.0;
      texData[i + 3] = 1.0;
    }
  }

  // Setup compute shaders
  const [ gpuCompute, targetPositionVariable, positionVariable, targetPositionTex, velocityVariable, colorVariable, targetColorTex ] = useMemo(
    () => {
      let gpuCompute = new GPUComputationRenderer(computeTexSize, computeTexSize, gl);
      var positionTex = gpuCompute.createTexture();
      var targetPositionTex = gpuCompute.createTexture();
      var velocityTex = gpuCompute.createTexture();
      fillPositionTex(positionTex);
      fillPositionTex(targetPositionTex);
      fillZeroTex(velocityTex);
      var colorTex = gpuCompute.createTexture();
      var targetColorTex = gpuCompute.createTexture();
      fillZeroTex(colorTex);
      fillZeroTex(targetColorTex);

      let targetPositionVariable = gpuCompute.addVariable("targetPositionTex", PixelSwarmTargetPositionShader, targetPositionTex);
      targetPositionVariable.material.uniforms["time"] = { value: 0 };
      targetPositionVariable.material.uniforms["delta"] = { value: 0 };
      targetPositionVariable.material.uniforms["targetType"] = { value: 0 };
      targetPositionVariable.material.uniforms["targetPositionTex"] = { value: targetPositionTex };

      let velocityVariable = gpuCompute.addVariable("velocityTex", PixelSwarmVelocityShader, velocityTex);
      velocityVariable.material.uniforms["time"] = { value: 0 };
      velocityVariable.material.uniforms["delta"] = { value: 0 };
      velocityVariable.material.uniforms["targetPositionTex"] = { value: targetPositionTex };
      velocityVariable.material.uniforms["targetScale"] = { value: [0, 0] };
      velocityVariable.material.uniforms["targetPositionOffset"] = { value: [0, 0] };
      velocityVariable.material.uniforms["dTargetOffset"] = { value: [0, 0] };
      velocityVariable.material.uniforms["velocityNoiseScale"] = { value: 0 };

      let positionVariable = gpuCompute.addVariable("positionTex", PixelSwarmPositionShader, positionTex);
      positionVariable.material.uniforms["delta"] = { value: 0 };
      positionVariable.material.uniforms["dTargetOffset"] = { value: [0, 0] };
      
      gpuCompute.setVariableDependencies(targetPositionVariable, [ targetPositionVariable ]);
      gpuCompute.setVariableDependencies(velocityVariable, [ positionVariable, velocityVariable, targetPositionVariable ]);
      gpuCompute.setVariableDependencies(positionVariable, [ positionVariable, velocityVariable ]);

      let colorVariable = gpuCompute.addVariable("colorTex", PixelSwarmColorShader, colorTex);
      colorVariable.material.uniforms["targetColorTex"] = { value: targetColorTex };
      colorVariable.material.uniforms["delta"] = { value: 0 };
      gpuCompute.setVariableDependencies(colorVariable, [ colorVariable ]);

      var error = gpuCompute.init();
      if ( error !== null ) {
          console.error( error );
      }
      store.dispatch(updateSwarmState({ positionTex }));
      return [ gpuCompute, targetPositionVariable, positionVariable, targetPositionTex, velocityVariable, colorVariable, targetColorTex ];
    },
    []
  );

  // Update compute buffers with new target data
  useEffect(
    () => {
      if(!target)
        return;
      if(target.type === "content" && target.positions.length > 0) {
        let texData = targetPositionTex.image.data;
        for(let i=0; i<texData.length; i+=4) {
          texData[i] = target.positions[(i / 4 * 3) % target.positions.length];
          texData[i + 1] = target.positions[(i / 4 * 3 + 1) % target.positions.length];
          texData[i + 2] = target.positions[(i / 4 * 3 + 2) % target.positions.length];
        }
  
        // for(var i=0; i<texData.length; i+=8) {
        //   let xy = pack2HalfToRGBA([target.positions[i / 8 * 3], target.positions[i / 8 * 3 + 1]]);
        //   let zz = pack2HalfToRGBA([target.positions[i / 8 * 3 + 2], target.positions[i / 8 * 3 + 2]]);
        //   texData[i] = xy[0];
        //   texData[i + 1] = xy[1];
        //   texData[i + 2] = xy[2];
        //   texData[i + 3] = xy[3];
        //   texData[i + 4] = zz[0];
        //   texData[i + 5] = zz[1];
        // }
        targetPositionTex.needsUpdate = true;
        texData = targetColorTex.image.data;
        for(let i=0; i<texData.length; i+=4) {
          texData[i] = target.colors[i];
          texData[i + 1] = Math.random() < 0.95 ? target.colors[i + 1] : 1.0;
          texData[i + 2] = target.colors[i + 2];
          texData[i + 3] = target.colors[i + 3];
        }
        targetColorTex.needsUpdate = true;
      } else {
        let texData = targetPositionTex.image.data;
        for(let i=0; i<texData.length; i+=4) {
          texData[i] = (Math.random() - 0.5);
          texData[i + 1] = (Math.random() - 0.5);
          texData[i + 2] = 0.0;
        }

        texData = targetColorTex.image.data;
        for(let i=0; i<texData.length; i+=4) {
          texData[i] = 0;
          texData[i + 1] = 0;
          texData[i + 2] = 0;
          texData[i + 3] = 0.4 + 0.6 * Math.random();
        }
        targetColorTex.needsUpdate = true;
      }
  
      gpuCompute.renderTexture(targetPositionTex, gpuCompute.getCurrentRenderTarget(targetPositionVariable));
    }, [target]
  );

  const [swarmShader] = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const swarmShader = new PixelSwarmShader({
      pointTexture: loader.load('/textures/box-shadow-16px.png'),
      posOffset: [0, 0],
      time: 0,
      targetType: 0,
    });
    return [swarmShader]
  }, []);

  const [ lastTime, lastTargetOffset ] = useMemo(
    () => {
      return [ 
        { value: performance.now() },
        { value: [ 0, 0 ] },
       ]
    }, []
  );
  useFrame(() => {
    let curTime = performance.now();
    let dtime = Math.min((curTime - lastTime.value) / 1000, 0.1);
    lastTime.value = performance.now();
    // console.log('dtime', dtime * 1000.0);
    // setLastTime(curTime);

    // Update time-related variables
    targetPositionVariable.material.uniforms["time"].value = curTime / 1000.0;
    targetPositionVariable.material.uniforms["delta"].value = dtime;
    velocityVariable.material.uniforms["time"].value = curTime / 1000.0;
    velocityVariable.material.uniforms["delta"].value = dtime;
    positionVariable.material.uniforms["delta"].value = dtime;
    colorVariable.material.uniforms["delta"].value = dtime;
    swarmShader.uniforms.time.value = curTime / 1000.0;

    // Find the most appropriate `SwarmTarget`
    let intendedTarget;
    let scrollTop = document.scrollingElement.scrollTop;
    // Ref: https://stackoverflow.com/a/8876069
    var viewport = [
      Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
      Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    ];
    let maxPriority = 0;
    let targetIds = Object.keys(targets);
    for(let i=0; i<targetIds.length; i++) {
      let el = document.getElementById(targets[targetIds[i]].id);
      // Is target inside the viewport?
      if(el.offsetTop + el.offsetHeight > scrollTop && el.offsetTop < scrollTop + viewport[1]) {
        let visibleHeight = Math.min(scrollTop + viewport[1], el.offsetTop + el.offsetHeight)
                          - Math.max(scrollTop, el.offsetTop);
        let priority = visibleHeight;
        // Still has a part below the viewport's edge?
        if(el.offsetTop + el.offsetHeight > scrollTop + viewport[1])
          priority *= 2.0;
        if(priority > maxPriority) {
          maxPriority = priority;
          intendedTarget = targets[targetIds[i]];
        }
      }
    }
    if(intendedTarget && intendedTarget !== target) {
      setTarget(intendedTarget);
    }

    // Update target's size and position in compute shader
    if(target) {
      let targetEl = document.getElementById(target.id);
      let targetSize = [
        targetEl.offsetWidth,
        targetEl.offsetHeight
      ];
      let targetOffset = [
        targetEl.offsetLeft + targetSize[0] / 2, 
        -targetEl.offsetTop - targetSize[1] / 2
      ];

      // Keep compute values near [0,0] to preserve the precision on mobile
      let dTargetOffset = [ 
        targetOffset[0] - lastTargetOffset.value[0],
        targetOffset[1] - lastTargetOffset.value[1]
      ];
      velocityVariable.material.uniforms["dTargetOffset"].value = dTargetOffset;
      velocityVariable.material.uniforms["targetScale"].value = targetSize;
      positionVariable.material.uniforms["dTargetOffset"].value = dTargetOffset;
      lastTargetOffset.value = targetOffset;

      // Which type of dynamics should the shader compute?
      let targetType = 0;
      let velocityNoiseScale = 1.0;
      switch(target.type) {
        case "content":
          targetType = 0;
          break;
        case "generative-thomas":
          targetType = 1;
          break;
        case "generative-sprott":
          targetType = 2;
          break;
        case "generative-van-der-pol":
          targetType = 3;
          break;
        case "generative-excog":
          targetType = 4;
          velocityNoiseScale = 0.0;
          break;
        default:
          targetType = 0;
      }
      targetPositionVariable.material.uniforms["targetType"].value = targetType;
      velocityVariable.material.uniforms["velocityNoiseScale"].value = velocityNoiseScale;

      swarmShader.uniforms.targetType.value = targetType;
      swarmShader.uniforms.pointScale.value = target.scale / 2 * dpi;
      swarmShader.uniforms.posOffset.value = targetOffset;
    } else {
      velocityVariable.material.uniforms["dTargetOffset"].value = [ 0, 0 ];
      positionVariable.material.uniforms["dTargetOffset"].value = [ 0, 0 ];
    }
    // let t1 = Date.now();
    // let time = Date.now() * 0.0005;
    // let pos = posAttr.current.array;
    // let alpha = alphaAttr.current.array;
    // posAttr.current.needsUpdate = true;
    // alphaAttr.current.needsUpdate = true;

    gpuCompute.compute();
    swarmShader.uniforms.positionTex.value = gpuCompute.getCurrentRenderTarget(positionVariable).texture;
    swarmShader.uniforms.colorTex.value = gpuCompute.getCurrentRenderTarget(colorVariable).texture;
    // console.log('itertime', performance.now() - curTime);
  });
  return (
    <>
      <a.points position={position} frustumCulled={false}>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attachObject={['attributes', 'position']}
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attachObject={['attributes', 'reference']}
            count={references.length / 2}
            array={references}
            itemSize={2}
          />
        </bufferGeometry>
        <shaderMaterial
          attach="material"
          args={[swarmShader]}
        />
      </a.points>
    </>
  );
};
