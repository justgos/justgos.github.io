import React, { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { apply as applySpring, useSpring, a, interpolate } from 'react-spring/three'

import { dpi } from '../config'
import HTMLRenderer from '../util/HTMLRenderer'

export default function RenderHTML({ children, position, opacity, color = 'white', fontSize = 16 }) {
  // const {
  //   size: { width, height },
  //   viewport: { width: viewportWidth, height: viewportHeight }
  // } = useThree()
  // console.log('viewportWidth', viewportWidth, 'viewportHeight', viewportHeight, 'width', width, 'scale', scale)
  const [canvas, setCanvas] = useState(HTMLRenderer.getDummyCanvas())
  useEffect(
    () => {
      async function renderHTML() {
        setCanvas(await HTMLRenderer.render(children));
      };
      renderHTML();
    },
    [children]
  )
  return (
    <a.sprite scale={[canvas.width / dpi, canvas.height / dpi, 1]} position={position}>
      <spriteMaterial attach="material" transparent opacity={opacity}>
        <canvasTexture attach="map" image={canvas} minFilter={THREE.NearestFilter} premultiplyAlpha onUpdate={s => (s.needsUpdate = true)} />
      </spriteMaterial>
    </a.sprite>
  );
}

// function Text({ children, position, opacity, color = 'white', fontSize = 16 }) {
//   const dpi = window.devicePixelRatio || 1
//   const texSize = 512
//   const scale = texSize / dpi
//   const canvas = useMemo(
//     () => {
//       const canvas = document.createElement('canvas')
//       canvas.width = canvas.height = texSize;
//       const context = canvas.getContext('2d')
//       context.font = `400 ${fontSize*dpi}px 'Lora', serif`
//       context.textAlign = 'center'
//       context.textBaseline = 'middle'
//       context.fillStyle = color
//       context.fillText(children, texSize / 2, texSize / 2 - fontSize * dpi / 2)
//       return canvas
//     },
//     [children, color, fontSize, dpi]  // , width, height
//   );
//   return (
//     <a.sprite scale={[scale, scale, 1]} position={position}>
//       <spriteMaterial attach="material" transparent opacity={opacity}>
//         <canvasTexture attach="map" image={canvas} premultiplyAlpha onUpdate={s => (s.needsUpdate = true)} />
//       </spriteMaterial>
//     </a.sprite>
//   );
// }
