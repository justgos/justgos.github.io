import * as THREE from 'three'

export default class PixelSwarmShader extends THREE.ShaderMaterial {
  constructor(options) {
    super({
      vertexShader: `
        attribute vec2 reference;
        varying vec4 vColor;
        uniform float time;
        uniform sampler2D positionTex;
        uniform sampler2D colorTex;
        uniform float pointScale;
        uniform vec2 posOffset;
        uniform int targetType;

        vec2 unpack2HalfToRGBA(vec4 v) {
          return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
        }

        void main() {
            // vColor.xyz = color;
            // vColor.w = alpha;
            vColor = texture2D(colorTex, reference);
            // vColor = vec4(0.0, 0.0, 0.0, 1.0);

            if(targetType == 2) {
              vColor.w = pow(abs(sin(time * 0.5 + reference.x * 10.0)), 2.0);
            }

            vec4 pos = texture2D(positionTex, reference);
            pos.xy += posOffset;
            pos.z = 0.0;
            // vec2 pos1 = unpack2HalfToRGBA(texture2D(positionTex, reference.xy));
            // vec2 pos2 = unpack2HalfToRGBA(texture2D(positionTex, reference.zw));
            // vec4 pos = vec4(pos1.x, pos1.y, pos2.x, 1.0);
            vec4 mvPosition = modelViewMatrix * vec4( pos.xyz, 1.0 );
            gl_PointSize = pointScale;  //  * abs(texture2D(posTexture, vec2(position.x / 1000.0, 0.0)).x)
            gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D pointTexture;
        varying vec4 vColor;
        void main() {
          // gl_FragColor = vec4( vColor, 1.0 );
          gl_FragColor = vColor;
          // gl_FragColor = vec4(1.0, 1.0, 1.0, vColor.w) * texture2D(pointTexture, gl_PointCoord);
          gl_FragColor.w *= 0.4;
        }
      `,
      // blendSrc: THREE.SrcAlphaFactor,
      // blendDst: THREE.OneMinusSrcColorFactor,
      // blending: THREE.CustomBlending,
      // blendEquation: THREE.AddEquation,
      blending: THREE.AdditiveBlending,
      // blending: THREE.SubtractiveBlending,
      // blending: THREE.NormalBlending,
      depthTest: false,
      transparent: true,
      vertexColors: true,
    });

    this.uniforms = {
      time: { value: options.time },
      targetType: { value: options.targetType },
      positionTex: { value: options.positionTex },
      colorTex: { value: options.colorTex },
      pointTexture: { value: options.pointTexture },
      pointScale: { value: options.pointScale },
      posOffset: { value: options.posOffset }
    }
  }
}
