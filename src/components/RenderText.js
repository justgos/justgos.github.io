import React, { useMemo } from 'react'
import * as THREE from 'three'

import { dpi } from '../config'

export default function RenderText({ children, position, opacity, color = 'white', fontSize = 16 }) {
  const dpi = window.devicePixelRatio || 1
  const texSize = 512
  const scale = texSize / dpi
  const canvas = useMemo(
    () => {
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = texSize;
      const context = canvas.getContext('2d')
      context.font = `400 ${fontSize*dpi}px 'Lora', serif`
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.fillStyle = color
      context.fillText(children, texSize / 2, texSize / 2 - fontSize * dpi / 2)
      return canvas
    },
    [children, color, fontSize, dpi]  // , width, height
  );
  return (
    <sprite scale={[scale, scale, 1]} position={position}>
      <spriteMaterial attach="material" transparent opacity={opacity}>
        <canvasTexture attach="map" image={canvas} premultiplyAlpha onUpdate={s => (s.needsUpdate = true)} />
      </spriteMaterial>
    </sprite>
  );
}
