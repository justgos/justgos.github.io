import * as THREE from 'three'

export default class DynamicCanvasShader extends THREE.ShaderMaterial {
  constructor(options) {
    super({
      vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv; 
          vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * modelViewPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D texture;
        varying vec2 vUv;

        void main() {
          gl_FragColor = texture2D(texture, vUv);
          // gl_FragColor.w = min(gl_FragColor.w, 0.999);
        }
      `,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.OneMinusSrcColorFactor,
      blending: THREE.CustomBlending,
      // blendEquation: THREE.AddEquation,
      // blending: THREE.AdditiveBlending,
      // blending: THREE.SubtractiveBlending,
      // blending: THREE.NormalBlending,
      // depthTest: false,
      transparent: true,
      // vertexColors: true,
    });

    this.uniforms = {
      texture: { value: options.texture },
    }
  }
}
