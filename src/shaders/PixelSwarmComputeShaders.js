import { SimplexNoise2D, SimplexNoise3D } from './SimplexNoise'

export const PixelSwarmTargetPositionShader = `
  // precision highp float;
  uniform float time;
  uniform float delta;
  uniform int targetType;

  ${SimplexNoise3D}

  float odeO3(float x, float y, float z, 
              float a1, float a2, float a3, float a4, float a5, 
              float a6, float a7, float a8, float a9, float a10, 
              float a11, float a12, float a13, float a14, float a15, 
              float a16, float a17, float a18, float a19, float a20) {
    return a1*0.0 + a2*x + a3*x*x + a4*x*x*x + a5*x*x*y \
          + a6*x*x*z + a7*x*y + a8*x*y*y + a9*x*y*z + a10*x*z \
          + a11*x*z*z + a12*y + a13*y*y + a14*y*y*y + a15*y*y*z \
          + a16*y*z + a17*y*z*z + a18*z + a19*z*z + a20*z*z*z;
  }

  #define odeO3Full(x, y, z, \
                    a1, a2, a3, a4, a5, a6, a7, a8, a9, a10,  \
                    a11, a12, a13, a14, a15, a16, a17, a18, a19, a20,  \
                    a21, a22, a23, a24, a25, a26, a27, a28, a29, a30,  \
                    a31, a32, a33, a34, a35, a36, a37, a38, a39, a40,  \
                    a41, a42, a43, a44, a45, a46, a47, a48, a49, a50,  \
                    a51, a52, a53, a54, a55, a56, a57, a58, a59, a60) vec3( \
    odeO3(x, y, z, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10,  \
          a11, a12, a13, a14, a15, a16, a17, a18, a19, a20), \
    odeO3(x, y, z, a21, a22, a23, a24, a25, a26, a27, a28, a29, a30,  \
          a31, a32, a33, a34, a35, a36, a37, a38, a39, a40), \
    odeO3(x, y, z, a41, a42, a43, a44, a45, a46, a47, a48, a49, a50,  \
          a51, a52, a53, a54, a55, a56, a57, a58, a59, a60) \
  )

  #define rescale(scale) \
    scaleFactor = scale; \
    rescaled = (target - offset) * scaleFactor; \
    float x = rescaled.x; \
    float y = rescaled.y; \
    float z = rescaled.z;

  void main()	{
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec3 target = texture2D(targetPositionTex, uv).xyz;
    // target.x += delta * 10.0;

    float speed = 5.0;
    float scaleFactor = 10.0;
    vec3 offset = vec3(0.0, 0.0, 0.0);
    vec3 rescaled = (target - offset) * scaleFactor;
    float localTime = time + gl_FragCoord.x * 10.0 + gl_FragCoord.y * 25.0;

    vec3 dtdt;

    // // Sprott's D=3 O=3 flows
    // dtdt = odeO3Full(rescaled.x, rescaled.y, rescaled.z,
    //                   0.5, 0.0, -0.6, 0.2, -0.1, 0.2, -0.6, 0.8, -0.6, -0.4, -0.2, -0.2, -1.2, 0.4, 0.8, 0.1, 1.2, 1.2, 1.0, 0.3, 0.1, 0.4, 0.2, 0.3, 0.9, -0.4, 1.1, -0.1, -1.0, 0.2, 0.1, -1.2, 1.2, -0.6, -0.3, -0.4, 0.5, 0.2, 0.3, -0.7, 0.4, -1.1, -0.7, 0.0, 0.2, 0.5, -0.8, 0.4, -0.3, 0.2, 0.2, 0.8, -1.1, 1.1, -0.9, -0.4, 0.9, 0.2, -0.1, 1.2);

    if(targetType == 1) {
      // Thomas' cyclically symmetric attractor
      float b = 0.208186;
      dtdt.x = sin(rescaled.y) - b * rescaled.x;
      dtdt.y = sin(rescaled.z) - b * rescaled.y;
      dtdt.z = sin(rescaled.x) - b * rescaled.z;
    } else if(targetType == 2) {
      // Sprott's simplest chaotic flow, Case A
      speed = 4.0;
      rescale(1.0 / 120.0);
      dtdt.x = rescaled.y;
      dtdt.y = -rescaled.x + rescaled.y * rescaled.z;
      dtdt.z = 1.0 - rescaled.y * rescaled.y;

      // speed = 4.0;
      // rescale(1.0 / 80.0);
      // dtdt.x = y;
      // dtdt.y = y*z - x;
      // dtdt.z = 1.0 - y*y;
    } else if(targetType == 3) {
      // van der Pol oscillator
      speed = 1.0;
      rescale(4.0);
      float A = 0.9;
      float omega = 0.5;
      float v = rescaled.y;
      float dv = A * sin(omega * localTime) - (x*x - 1.0) * v - x;
      dtdt.x = v;
      dtdt.y = dv;
    } else if(targetType == 4) {
      // float maxInteractionDist = 0.01;
      // for(float i=0.0; i<resolution.x; i++) {
      //   for(float j=0.0; j<resolution.y; j++) {
      //     vec3 otherTarget = texture2D(targetPositionTex, vec2(i, j) / resolution.xy).xyz;
      //     if(abs(otherTarget.x - target.x) > maxInteractionDist
      //       || abs(otherTarget.y - target.y) > maxInteractionDist)
      //       continue;
      //     dtdt.x -= otherTarget.x - target.x;
      //     dtdt.y -= otherTarget.y - target.y;
      //   }
      // }

      speed = 8.0;
      rescale(10.0);
      float rPhase = pow(abs(sin(time * 0.2 + gl_FragCoord.y / resolution.y * 0.2)), 2.0);
      float r = 5.0 * rPhase + 0.1;
      // gl_FragCoord.x / resolution.x * 2.0 * 3.14159
      float a = atan(y, x) + 0.5 * pow(1.0 - rPhase, 2.0) * time * (gl_FragCoord.x / resolution.x + 0.01);

      float noiseScale = 2.0;
      vec3 noiseSource = vec3(x, y, z) * 1.0 + time * 0.2;
      // vec3 noiseSource = vec3(1.0, 1.0, 1.0) * 1.0 + time * 0.2;
      vec3 noiseV = vec3(
        snoise(noiseSource + vec3(527.234, 65.34, 982.873)),
        snoise(noiseSource + vec3(42.45, 22.644, 863.386)),
        0
      );
      noiseV = vec3(
        snoise(noiseSource + 0.5 * noiseV + vec3(35.642, 64.266, 3.656)),
        snoise(noiseSource + 0.5 * noiseV + vec3(763.135, 7.2367, 62.8465)),
        0
      );
      r += noiseV.x * 1.1;
      // noiseV *= noiseScale;
      noiseV *= 0.0;

      dtdt.x += r * cos(a) - x + noiseV.x;
      dtdt.y += r * sin(a) - y + noiseV.y;
    }

    vec3 newTarget = (rescaled + dtdt * delta * speed) / scaleFactor + offset;
    
    // Prevent pixel loss from chaotic blowups
    if(abs(newTarget.x) > 10000.0 || abs(newTarget.y) > 10000.0 || abs(newTarget.z) > 10000.0)
      newTarget = vec3(0.0, 0.0, 0.0);

    gl_FragColor = vec4(newTarget, 1.0);
}
`;

export const PixelSwarmVelocityShader = `
  // precision highp float;
  uniform float time;
  uniform float delta;
  uniform vec2 targetScale;
  uniform float velocityNoiseScale;
  // uniform vec2 targetPositionOffset;
  uniform vec2 dTargetOffset;

  ${SimplexNoise3D}

  void main()	{
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec3 pos = texture2D(positionTex, uv).xyz;
    pos.xy -= dTargetOffset;
    vec3 target = texture2D(targetPositionTex, uv).xyz;
    target.xy *= targetScale;
    // target.xy += targetPositionOffset - dTargetOffset;
    vec3 v = texture2D(velocityTex, uv).xyz;

    vec3 goTargetV = 2.0 * (target-pos);

    float noiseScale = 20.0 * (1.0 + 2.0 * pow(length(goTargetV), 0.5));
    vec3 noiseSource = vec3(1.0, 1.0, 1.0) + pos * 1.0 + time * 1.0;
    // noiseSource.x += uv.x * 1475.754;
    // noiseSource.y += uv.y * 286.46247;
    vec3 noiseV = vec3(
      snoise(noiseSource + vec3(43.521, 65.254, 982.143)),
      snoise(noiseSource + vec3(654.45, 22.644, 863.345)),
      0
    );
    noiseV = vec3(
      snoise(noiseSource + 0.5 * noiseV + vec3(35.642, 64.266, 3.656)),
      snoise(noiseSource + 0.5 * noiseV + vec3(763.135, 7.2367, 62.8465)),
      0
    );
    noiseV *= noiseScale * velocityNoiseScale;
    // noiseV *= 0.0;
    // vec3 noiseV = vec3(0.0, 0.0, 0.0);

    float decay = 0.8;
    // vec3 noiseSource = vec3(uv.x, uv.y, 0) * 1000.0 + time * 1.0;
    vec3 newV = decay * v + (1.0-decay) * (goTargetV + noiseV);
    // newV.z = 0.0;

    gl_FragColor = vec4(newV, 1.0);
}
`;

export const PixelSwarmPositionShader = `
  // precision highp float;
  uniform float delta;
  uniform vec2 dTargetOffset;

  void main()	{
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec3 pos = texture2D(positionTex, uv).xyz;
    pos.xy -= dTargetOffset;
    vec3 v = texture2D(velocityTex, uv).xyz;

    // const float minDelta = 0.5;
    // vec3 dpos = v * min(2.0 * delta, 1.0) + (target-pos) * min(0.5 * delta, 1.0);
    // if(pos.x != target.x && abs(dpos.x) < minDelta)
    //   dpos.x = clamp(target.x - pos.x, -minDelta, minDelta);
    // if(pos.y != target.y && abs(dpos.y) < minDelta)
    //   dpos.y = clamp(target.y - pos.y, -minDelta, minDelta);

    gl_FragColor = vec4(pos + v * min(delta, 1.0), 1.0);
}
`;

// export const PixelSwarmPositionShader = `
//   precision highp float;
//   uniform float delta;
//   uniform sampler2D targetPositionTex;

//   vec4 pack2HalfToRGBA(vec2 v) {
//     vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ));
//     return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w);
//   }

//   vec2 unpack2HalfToRGBA(vec4 v) {
//     return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
//   }

//   void main()	{
//     vec2 uv = gl_FragCoord.xy / resolution.xy;

//     highpvec2 pos = unpack2HalfToRGBA(texture2D(positionTex, uv));
//     vec2 target = unpack2HalfToRGBA(texture2D(targetPositionTex, uv));

//     gl_FragColor = pack2HalfToRGBA(pos + (target-pos) * min(2.0 * delta, 1.0));

//     // vec3 pos = texture2D(positionTex, uv).xyz;
//     // vec3 target = texture2D(targetPositionTex, uv).xyz;

//     // gl_FragColor = vec4(pos + (target-pos) * min(0.5 * delta, 1.0), 1.0);
// }
// `;

export const PixelSwarmColorShader = `
  // precision highp float;
  uniform float delta;
  uniform sampler2D targetColorTex;

  void main()	{
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 color = texture2D(colorTex, uv);
    vec4 target = texture2D(targetColorTex, uv);

    const float minDelta = 0.1;
    vec4 dcolor = (target-color) * min(0.5 * delta, 1.0);
    // if(color.w != target.w && abs(dcolor.w) < minDelta)
    //   dcolor.w = clamp(target.w - color.w, -minDelta, minDelta);

    gl_FragColor = color + dcolor;
}
`;
