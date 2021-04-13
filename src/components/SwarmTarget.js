import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';

import { dpi } from '../config'
import { updateSwarmTarget, removeSwarmTarget } from '../core/state'
import { shuffle } from '../util/array';
import HTMLRenderer from '../util/HTMLRenderer';
import { sleep } from '../util/time';

function SwarmTarget({ children, id, size, image, targetData, updateSwarmTarget, removeSwarmTarget, type="content", scale=4 }) {
  // const [ size, setSize ] = useState([window.innerWidth, window.innerHeight]);

  // useEffect(() => {
  //   const onResize = () => { setSize([window.innerWidth, window.innerHeight]); console.log('onResize', window.innerHeight); };
  //   // window.addEventListener('orientationchange', onResize);
  //   window.addEventListener('resize', onResize);
  //   return () => {
  //     // window.removeEventListener('orientationchange', onResize);
  //     window.removeEventListener('resize', onResize);
  //   }
  // }, [])

  const el = useRef();
  useEffect(
    () => {
      async function renderContent() {
        let positions = [];
        let colors = [];
        
        let newTargetData = targetData;
        if(!newTargetData) {
          newTargetData = {
            id: id,
          };
        }
        newTargetData.type = type;
        newTargetData.scale = scale;
        if(type === "content" && !('positions' in newTargetData)) {
          // let canvas = await HTMLRenderer.render(children);
          // console.log('canvas.width', canvas.width)
          // let img = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
          // While image loads, set up a dummy target description
          updateSwarmTarget(id, { ...newTargetData, type: "generative-excog" });
          //await sleep(3000);
          let img = await HTMLRenderer.renderImage(image, size);
          for(let i = 0; i < img.length / 4; i++) {
            let pix = [img[i*4], img[i*4+1], img[i*4+2], img[i*4+3]];
            if(pix[3] > 0.0) {
              positions.push(
                ((i % (size[0] * dpi)) / dpi + 0.25) / size[0] - 0.5, 
                (-Math.floor(i / (size[0] * dpi)) / dpi + 0.25) / size[1] + 0.5, 
                0
              );
              colors.push(
                pix[0] / 255.0,
                pix[1] / 255.0,
                pix[2] / 255.0,
                pix[3] / 255.0 * (0.4 + 0.6 * Math.random())
                // Math.min(1.0 - (pix[0] + pix[1] + pix[2]) / 3 / 255.0 , pix[3] / 255.0) * (0.4 + 0.6 * Math.random())
              );
            }
          }
          let shuffleIndices = shuffle(positions, 3);
          shuffle(colors, 4, shuffleIndices, 3);
          
          // console.log('newShape.length', newShape.length)
          // while(newShape.length < positions.length)
          //   newShape.push(0, 0, 0);
          // while(newAlphas.length < alphas.length)
          //   newAlphas.push(0);

          newTargetData.positions = positions;
          newTargetData.colors = colors;
        }
      
        // if(newShape.length > 0)
          updateSwarmTarget(id, newTargetData);
        // else
        //   setTimeout(renderContent, 500);
      };
      // // Wait for Three.js to intialize, otherwise the rendering can fail
      // let waitForGL = setInterval(() => {
      //   if(document.getElementById("gl-canvas")) {
      //     setTimeout(renderContent, 100);
      //     // renderContent();
      //     clearInterval(waitForGL);
      //   }
      // }, 100);
      renderContent();

      return () => {
        removeSwarmTarget(id);
      }
    }, [el, type, scale]
  );

  return (
    <div id={id} className="swarm-target" ref={el}>
      <div style={{width: size[0]+'px', height: size[1]+'px'}}></div>
      {/* {children} */}
    </div>
  );
}

const mapStateToProps = (state, ownProps) => {
  if(ownProps.id in state.swarmTargets) {
    return {
      targetData: state.swarmTargets[ownProps.id]
    };
  }
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    updateSwarmTarget: (target, payload) => {
      dispatch(updateSwarmTarget(target, payload));
    },
    removeSwarmTarget: (target) => {
      dispatch(removeSwarmTarget(target));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SwarmTarget);
