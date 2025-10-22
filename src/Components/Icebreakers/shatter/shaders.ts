// Combined vertex and fragment shader sources.
export const vertShaderSource = `
precision mediump float;

attribute vec2 a_position; // base triangle vertices (clip space)
attribute vec2 a_uv;       // image uv
attribute vec2 a_translate; // per-triangle translation (clip space)
attribute float a_angle;    // per-triangle rotation
attribute float a_colorShift; // per-triangle color shift
attribute float a_roughness;  // per-triangle roughness
attribute float a_reflectivity; // per-triangle reflectivity
attribute float a_materialType; // per-triangle material type
attribute float a_depth;    // per-triangle depth for layering
attribute float a_layerId;  // per-triangle layer ID
attribute float a_brightness; // per-triangle brightness multiplier

uniform float u_ratio; // canvas width/height
uniform vec2 u_resolution; // screen resolution
uniform float u_layerOpacity; // layer opacity for blending

varying vec2 vUv;
varying vec2 vScreenPos; // screen position for grain
varying float vColorShift;
varying float vRoughness;
varying float vReflectivity;
varying float vMaterialType;
varying float vLayerId;
varying float vBrightness;

void main() {
  float c = cos(a_angle);
  float s = sin(a_angle);
  vec2 p = a_position;
  vec2 pr = vec2(c * p.x - s * p.y, s * p.x + c * p.y);
  vec2 pos = pr + a_translate;
  gl_Position = vec4(vec2(pos.x, pos.y), a_depth, 1.0);
  vUv = a_uv;
  vScreenPos = (gl_Position.xy * 0.5 + 0.5) * u_resolution;
  vColorShift = a_colorShift;
  vRoughness = a_roughness;
  vReflectivity = a_reflectivity;
  vMaterialType = a_materialType;
  vLayerId = a_layerId;
  vBrightness = a_brightness;
}
`;

export const fragShaderSource = `
precision highp float;

varying vec2 vUv;
varying vec2 vScreenPos; // screen position for grain
varying float vColorShift;
varying float vRoughness;
varying float vReflectivity;
varying float vMaterialType;
varying float vLayerId;
varying float vBrightness;

uniform float u_layerOpacity; // layer opacity for blending

// Generate bluish gradient colors based on UV position and shard properties
vec3 getShardColor(vec2 uv, float colorShift, float roughness, float reflectivity, float materialType) {
  float topGradient = 1.0 - uv.y;
  float noiseScale = 8.0 + roughness * 20.0;
  float patternScale = 2.0 + roughness * 8.0;
  float noise1 = fract(sin(dot(uv * noiseScale, vec2(12.9898, 78.233))) * 43758.5453);
  float noise2 = fract(sin(dot(uv * (noiseScale * 2.0), vec2(23.1407, 2.6651))) * 43758.5453);
  float noise3 = fract(sin(dot(uv * (noiseScale * 0.7), vec2(7.1234, 3.4567))) * 43758.5453);
  float pattern1 = 0.5 + 0.5 * sin(uv.x * patternScale + uv.y * (patternScale * 0.6));
  float pattern2 = 0.5 + 0.5 * sin(uv.x * (patternScale * 0.5) + uv.y * (patternScale * 1.2));
  float pattern3 = 0.5 + 0.5 * sin(uv.x * (patternScale * 2.0) + uv.y * (patternScale * 0.3));
  float surfaceVariation = (pattern1 * 0.4 + pattern2 * 0.3 + pattern3 * 0.3) * (0.2 + roughness * 0.4);
  surfaceVariation += (noise1 * 0.4 + noise2 * 0.3 + noise3 * 0.3) * (0.1 + roughness * 0.3);
  vec3 almostWhite = vec3(0.949, 0.949, 0.949);
  vec3 lightGrayBlue = vec3(0.659, 0.780, 0.812);
  vec3 lightSkyBlue = vec3(0.392, 0.561, 0.604);
  vec3 mediumDustyBlue = vec3(0.094, 0.333, 0.392);
  vec3 deepTeal = vec3(0.0, 0.216, 0.275);
  float tempShift = (colorShift - 0.5) * 0.1;
  almostWhite = mix(almostWhite, almostWhite * 1.05, tempShift);
  lightGrayBlue = mix(lightGrayBlue, lightGrayBlue * 1.05, tempShift);
  lightSkyBlue = mix(lightSkyBlue, lightSkyBlue * 1.05, tempShift);
  mediumDustyBlue = mix(mediumDustyBlue, mediumDustyBlue * 1.05, tempShift);
  deepTeal = mix(deepTeal, deepTeal * 1.05, tempShift);
  float metallic = materialType;
  almostWhite = mix(almostWhite, almostWhite * 1.1, metallic * 0.3);
  lightGrayBlue = mix(lightGrayBlue, lightGrayBlue * 1.05, metallic * 0.2);
  lightSkyBlue = mix(lightSkyBlue, lightSkyBlue * 1.08, metallic * 0.25);
  mediumDustyBlue = mix(mediumDustyBlue, mediumDustyBlue * 1.05, metallic * 0.2);
  deepTeal = mix(deepTeal, deepTeal * 1.03, metallic * 0.15);
  vec3 color1 = mix(deepTeal, mediumDustyBlue, smoothstep(0.0, 0.3, topGradient));
  vec3 color2 = mix(mediumDustyBlue, lightSkyBlue, smoothstep(0.1, 0.5, topGradient));
  vec3 color3 = mix(lightSkyBlue, lightGrayBlue, smoothstep(0.3, 0.7, topGradient));
  vec3 color4 = mix(lightGrayBlue, almostWhite, smoothstep(0.5, 0.9, topGradient));
  vec3 finalColor = mix(color1, color2, smoothstep(0.0, 1.0, topGradient));
  finalColor = mix(finalColor, color3, smoothstep(0.2, 1.0, topGradient));
  finalColor = mix(finalColor, color4, smoothstep(0.4, 1.0, topGradient));
  float brightnessVariation = 0.8 + 0.4 * surfaceVariation;
  finalColor *= brightnessVariation;
  finalColor = mix(finalColor, finalColor * vec3(1.1, 1.05, 0.95), surfaceVariation * 0.3);
  float luminance = dot(finalColor, vec3(0.299, 0.587, 0.114));
  finalColor = mix(vec3(luminance), finalColor, 1.4);
  float highlight = smoothstep(0.6, 1.0, surfaceVariation) * (0.1 + reflectivity * 0.2);
  finalColor += vec3(highlight);
  float shadow = smoothstep(0.0, 0.4, 1.0 - surfaceVariation) * (0.1 + (1.0 - reflectivity) * 0.15);
  finalColor *= (1.0 - shadow);
  float grain = fract(sin(dot(vScreenPos * 0.5, vec2(12.9898, 78.233))) * 43758.5453);
  grain = (grain - 0.5) * 0.02;
  finalColor = mix(finalColor, finalColor + vec3(grain), 0.1 + roughness * 0.15);
  return finalColor;
}

void main() {
  vec3 color = getShardColor(vUv, vColorShift, vRoughness, vReflectivity, vMaterialType);
  color *= vBrightness;
  gl_FragColor = vec4(color, u_layerOpacity);
}
`;


