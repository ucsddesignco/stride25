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
// Color control uniforms
uniform vec3 u_iceTopColor;
uniform vec3 u_iceMiddleColor;
uniform vec3 u_iceBottomColor;
uniform vec3 u_iceDeepColor;
uniform float u_colorTemperature;
uniform float u_metallicAmount;
uniform float u_highlightIntensity;

varying vec2 vUv;
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
varying float vColorShift;
varying float vRoughness;
varying float vReflectivity;
varying float vMaterialType;
varying float vLayerId;
varying float vBrightness;

uniform float u_layerOpacity; // layer opacity for blending
// Color control uniforms
uniform vec3 u_iceTopColor;
uniform vec3 u_iceMiddleColor;
uniform vec3 u_iceBottomColor;
uniform vec3 u_iceDeepColor;
uniform float u_colorTemperature;
uniform float u_metallicAmount;
uniform float u_highlightIntensity;

// Simplified ice color system with easy-to-manipulate parameters
vec3 getShardColor(vec2 uv, float colorShift, float roughness, float reflectivity, float materialType) {
  // Use uniform colors for easy manipulation
  vec3 iceTop = u_iceTopColor;
  vec3 iceMiddle = u_iceMiddleColor;
  vec3 iceBottom = u_iceBottomColor;
  vec3 iceDeep = u_iceDeepColor;
  
  // Create vertical gradient based on UV position
  float gradient = 1.0 - uv.y;
  
  // Mix colors based on gradient position
  vec3 baseColor;
  if (gradient < 0.25) {
    baseColor = mix(iceDeep, iceBottom, gradient * 4.0);
  } else if (gradient < 0.5) {
    baseColor = mix(iceBottom, iceMiddle, (gradient - 0.25) * 4.0);
  } else if (gradient < 0.75) {
    baseColor = mix(iceMiddle, iceTop, (gradient - 0.5) * 4.0);
  } else {
    baseColor = iceTop;
  }
  
  // Apply color temperature shift (warmer/cooler)
  float tempShift = u_colorTemperature + (colorShift - 0.5) * 0.3;
  baseColor.r += tempShift * 0.1;
  baseColor.b -= tempShift * 0.1;
  
  // Apply material type variation (metallic vs matte)
  float metallic = materialType * u_metallicAmount;
  baseColor = mix(baseColor, baseColor * 1.2, metallic);
  
  // Apply subtle surface variation based on roughness
  float surfaceVariation = roughness * 0.2;
  baseColor *= (0.9 + surfaceVariation);
  
  // Apply reflectivity highlights
  float highlight = reflectivity * u_highlightIntensity;
  baseColor += vec3(highlight);
  
  return baseColor;
}

void main() {
  vec3 color = getShardColor(vUv, vColorShift, vRoughness, vReflectivity, vMaterialType);
  color *= vBrightness;
  gl_FragColor = vec4(color, u_layerOpacity);
}
`;


