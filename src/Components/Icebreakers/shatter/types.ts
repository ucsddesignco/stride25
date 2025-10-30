// webgl types: Shared types for renderer, mesh, physics, and UI. Centralized to avoid
// duplication and cycles. Includes geometry, groups/shards, uniforms/attributes, and params.
export type UniformLocations = Record<string, WebGLUniformLocation | null>;

export type Params = {
  gravity: number;
  damping: number;
  impulse: number;
  impulseRadius: number;
  wireframe: boolean;
  // Layer control parameters
  layerCount: number;
  layerOpacity: number;
  layerSpacing: number;
  enableBlending: boolean;
  currentActiveLayer: number;
  // Physics enhancement parameters
  acceleration: number;                     // Acceleration multiplier for shattered shards (0-1)
  accelerationDelay: number;                // Delay before acceleration starts (seconds)
  // Color control parameters
  iceTopColor: [number, number, number];     // RGB values for top of ice (0-1)
  iceMiddleColor: [number, number, number];  // RGB values for middle of ice (0-1)
  iceBottomColor: [number, number, number];  // RGB values for bottom of ice (0-1)
  iceDeepColor: [number, number, number];    // RGB values for deep ice (0-1)
  colorTemperature: number;                  // Color temperature shift (-1 to 1)
  metallicAmount: number;                    // Metallic appearance (0-1)
  highlightIntensity: number;                // Highlight intensity (0-1)
};

export type Vec2 = { x: number; y: number };

export type Triangle = {
  // geometry in clip space, centered around its group's centroid
  a: Vec2;
  b: Vec2;
  c: Vec2;
  // uv in 0..1
  au: Vec2;
  bu: Vec2;
  cu: Vec2;
  // linkage
  groupId: number;
};

export type Group = {
  id: number;
  pos: Vec2; // translation in clip space
  vel: Vec2; // velocity in clip space/sec
  ang: number; // rotation radians
  angVel: number; // angular vel radians/sec
  mass: number;
  uvCentroid: Vec2; // 0..1 centroid for visibility checks
  // Unique properties for each shard
  colorShift: number; // 0-1, affects color temperature
  roughness: number; // 0-1, affects surface variation
  reflectivity: number; // 0-1, affects highlights
  materialType: number; // 0-1, affects overall appearance
  // Layer properties for multiple shard sets
  layerId: number; // which layer this shard belongs to
  depth: number; // Z-depth for proper layering
  // Physics state
  isActive: boolean; // whether this group is currently active
  isShattered: boolean; // whether this group has been shattered
  age: number; // age of the group in seconds
  originalPos: Vec2; // original position for reset functionality
  // Visual state
  brightness: number; // brightness multiplier for newly revealed layers (0.0 to 1.0)
  fadeAge: number; // timer for brightness easing, resets when dimming/brightening starts
};

export type AttribLocations = {
  pos: number;
  uv: number;
  translate: number;
  angle: number;
  colorShift: number;
  roughness: number;
  reflectivity: number;
  materialType: number;
  depth: number;
  layerId: number;
  brightness: number;
};


