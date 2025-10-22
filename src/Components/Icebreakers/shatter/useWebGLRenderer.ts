import { useRef, useCallback } from 'react';
import type { UniformLocations, AttribLocations, Triangle, Group, Params } from './types';
import { vertShaderSource, fragShaderSource } from './shaders';

const devicePixelRatioClamped = () => Math.min(window.devicePixelRatio || 1, 2);

export const useWebGLRenderer = () => {
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const uniformsRef = useRef<UniformLocations>({});
  const imageRef = useRef<HTMLImageElement | null>(null);

  const trianglesRef = useRef<Triangle[]>([]);
  const groupsRef = useRef<Group[]>([]);
  const interleavedRef = useRef<Float32Array | null>(null);
  const translateRef = useRef<Float32Array | null>(null);
  const angleRef = useRef<Float32Array | null>(null);

  const baseVboRef = useRef<WebGLBuffer | null>(null);
  const translateVboRef = useRef<WebGLBuffer | null>(null);
  const angleVboRef = useRef<WebGLBuffer | null>(null);
  const colorShiftVboRef = useRef<WebGLBuffer | null>(null);
  const roughnessVboRef = useRef<WebGLBuffer | null>(null);
  const reflectivityVboRef = useRef<WebGLBuffer | null>(null);
  const materialTypeVboRef = useRef<WebGLBuffer | null>(null);
  const depthVboRef = useRef<WebGLBuffer | null>(null);
  const layerIdVboRef = useRef<WebGLBuffer | null>(null);
  const brightnessVboRef = useRef<WebGLBuffer | null>(null);

  const attribLocations = useRef<AttribLocations>({ 
    pos: -1, uv: -1, translate: -1, angle: -1, colorShift: -1, 
    roughness: -1, reflectivity: -1, materialType: -1, depth: -1, layerId: -1, brightness: -1 
  });

  const setupGL = useCallback((canvas: HTMLCanvasElement): WebGLRenderingContext | null => {
    const gl = canvas.getContext("webgl");
    if (!gl) return null;
    glRef.current = gl;

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const createShader = (type: number, source: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const vs = createShader(gl.VERTEX_SHADER, vertShaderSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fragShaderSource);
    if (!vs || !fs) return null;
    const program = gl.createProgram();
    if (!program) return null;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return null;
    }
    gl.useProgram(program);
    programRef.current = program;

    const uniforms: UniformLocations = {};
    const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number;
    for (let i = 0; i < count; i++) {
      const info = gl.getActiveUniform(program, i);
      if (!info) continue;
      uniforms[info.name] = gl.getUniformLocation(program, info.name);
    }
    uniformsRef.current = uniforms;

    attribLocations.current.pos = gl.getAttribLocation(program, "a_position");
    attribLocations.current.uv = gl.getAttribLocation(program, "a_uv");
    attribLocations.current.translate = gl.getAttribLocation(program, "a_translate");
    attribLocations.current.angle = gl.getAttribLocation(program, "a_angle");
    attribLocations.current.colorShift = gl.getAttribLocation(program, "a_colorShift");
    attribLocations.current.roughness = gl.getAttribLocation(program, "a_roughness");
    attribLocations.current.reflectivity = gl.getAttribLocation(program, "a_reflectivity");
    attribLocations.current.materialType = gl.getAttribLocation(program, "a_materialType");
    attribLocations.current.depth = gl.getAttribLocation(program, "a_depth");
    attribLocations.current.layerId = gl.getAttribLocation(program, "a_layerId");
    attribLocations.current.brightness = gl.getAttribLocation(program, "a_brightness");

    gl.enableVertexAttribArray(attribLocations.current.pos);
    gl.enableVertexAttribArray(attribLocations.current.uv);
    gl.enableVertexAttribArray(attribLocations.current.translate);
    gl.enableVertexAttribArray(attribLocations.current.angle);
    gl.enableVertexAttribArray(attribLocations.current.colorShift);
    gl.enableVertexAttribArray(attribLocations.current.roughness);
    gl.enableVertexAttribArray(attribLocations.current.reflectivity);
    gl.enableVertexAttribArray(attribLocations.current.materialType);
    gl.enableVertexAttribArray(attribLocations.current.depth);
    gl.enableVertexAttribArray(attribLocations.current.layerId);
    gl.enableVertexAttribArray(attribLocations.current.brightness);

    return gl;
  }, []);

  const uploadGeometry = useCallback((gl: WebGLRenderingContext) => {
    const tris = trianglesRef.current;
    const VERTS = tris.length * 3;
    const STRIDE = 2 + 2;
    const interleaved = new Float32Array(VERTS * STRIDE);
    const translate = new Float32Array(VERTS * 2);
    const angle = new Float32Array(VERTS * 1);
    const colorShift = new Float32Array(VERTS * 1);
    const roughness = new Float32Array(VERTS * 1);
    const reflectivity = new Float32Array(VERTS * 1);
    const materialType = new Float32Array(VERTS * 1);
    const depth = new Float32Array(VERTS * 1);
    const layerId = new Float32Array(VERTS * 1);
    const brightness = new Float32Array(VERTS * 1);

    let vi = 0;
    for (const t of tris) {
      const g = groupsRef.current.find((gg) => gg.id === t.groupId)!;
      interleaved[vi * STRIDE + 0] = t.a.x;
      interleaved[vi * STRIDE + 1] = t.a.y;
      interleaved[vi * STRIDE + 2] = t.au.x;
      interleaved[vi * STRIDE + 3] = t.au.y;
      translate[vi * 2 + 0] = g.pos.x;
      translate[vi * 2 + 1] = g.pos.y;
      angle[vi] = g.ang;
      colorShift[vi] = g.colorShift;
      roughness[vi] = g.roughness;
      reflectivity[vi] = g.reflectivity;
      materialType[vi] = g.materialType;
      depth[vi] = g.depth;
      layerId[vi] = g.layerId;
      brightness[vi] = g.brightness;
      vi++;
      interleaved[vi * STRIDE + 0] = t.b.x;
      interleaved[vi * STRIDE + 1] = t.b.y;
      interleaved[vi * STRIDE + 2] = t.bu.x;
      interleaved[vi * STRIDE + 3] = t.bu.y;
      translate[vi * 2 + 0] = g.pos.x;
      translate[vi * 2 + 1] = g.pos.y;
      angle[vi] = g.ang;
      colorShift[vi] = g.colorShift;
      roughness[vi] = g.roughness;
      reflectivity[vi] = g.reflectivity;
      materialType[vi] = g.materialType;
      depth[vi] = g.depth;
      layerId[vi] = g.layerId;
      brightness[vi] = g.brightness;
      vi++;
      interleaved[vi * STRIDE + 0] = t.c.x;
      interleaved[vi * STRIDE + 1] = t.c.y;
      interleaved[vi * STRIDE + 2] = t.cu.x;
      interleaved[vi * STRIDE + 3] = t.cu.y;
      translate[vi * 2 + 0] = g.pos.x;
      translate[vi * 2 + 1] = g.pos.y;
      angle[vi] = g.ang;
      colorShift[vi] = g.colorShift;
      roughness[vi] = g.roughness;
      reflectivity[vi] = g.reflectivity;
      materialType[vi] = g.materialType;
      depth[vi] = g.depth;
      layerId[vi] = g.layerId;
      brightness[vi] = g.brightness;
      vi++;
    }

    interleavedRef.current = interleaved;
    translateRef.current = translate;
    angleRef.current = angle;

    if (!baseVboRef.current) baseVboRef.current = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, baseVboRef.current);
    gl.bufferData(gl.ARRAY_BUFFER, interleaved, gl.DYNAMIC_DRAW);

    if (!translateVboRef.current) translateVboRef.current = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, translateVboRef.current);
    gl.bufferData(gl.ARRAY_BUFFER, translate, gl.DYNAMIC_DRAW);

    if (!angleVboRef.current) angleVboRef.current = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, angleVboRef.current);
    gl.bufferData(gl.ARRAY_BUFFER, angle, gl.DYNAMIC_DRAW);

    if (!colorShiftVboRef.current) colorShiftVboRef.current = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorShiftVboRef.current);
    gl.bufferData(gl.ARRAY_BUFFER, colorShift, gl.DYNAMIC_DRAW);

    if (!roughnessVboRef.current) roughnessVboRef.current = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, roughnessVboRef.current);
    gl.bufferData(gl.ARRAY_BUFFER, roughness, gl.DYNAMIC_DRAW);

    if (!reflectivityVboRef.current) reflectivityVboRef.current = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, reflectivityVboRef.current);
    gl.bufferData(gl.ARRAY_BUFFER, reflectivity, gl.DYNAMIC_DRAW);

    if (!materialTypeVboRef.current) materialTypeVboRef.current = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, materialTypeVboRef.current);
    gl.bufferData(gl.ARRAY_BUFFER, materialType, gl.DYNAMIC_DRAW);

    if (!depthVboRef.current) depthVboRef.current = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, depthVboRef.current);
    gl.bufferData(gl.ARRAY_BUFFER, depth, gl.DYNAMIC_DRAW);

    if (!layerIdVboRef.current) layerIdVboRef.current = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, layerIdVboRef.current);
    gl.bufferData(gl.ARRAY_BUFFER, layerId, gl.DYNAMIC_DRAW);

    if (!brightnessVboRef.current) brightnessVboRef.current = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, brightnessVboRef.current);
    gl.bufferData(gl.ARRAY_BUFFER, brightness, gl.DYNAMIC_DRAW);
  }, []);

  const bindAttributes = useCallback((gl: WebGLRenderingContext) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, baseVboRef.current);
    gl.vertexAttribPointer(attribLocations.current.pos, 2, gl.FLOAT, false, 16, 0);
    gl.vertexAttribPointer(attribLocations.current.uv, 2, gl.FLOAT, false, 16, 8);

    gl.bindBuffer(gl.ARRAY_BUFFER, translateVboRef.current);
    gl.vertexAttribPointer(attribLocations.current.translate, 2, gl.FLOAT, false, 8, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, angleVboRef.current);
    gl.vertexAttribPointer(attribLocations.current.angle, 1, gl.FLOAT, false, 4, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorShiftVboRef.current);
    gl.vertexAttribPointer(attribLocations.current.colorShift, 1, gl.FLOAT, false, 4, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, roughnessVboRef.current);
    gl.vertexAttribPointer(attribLocations.current.roughness, 1, gl.FLOAT, false, 4, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, reflectivityVboRef.current);
    gl.vertexAttribPointer(attribLocations.current.reflectivity, 1, gl.FLOAT, false, 4, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, materialTypeVboRef.current);
    gl.vertexAttribPointer(attribLocations.current.materialType, 1, gl.FLOAT, false, 4, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, depthVboRef.current);
    gl.vertexAttribPointer(attribLocations.current.depth, 1, gl.FLOAT, false, 4, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, layerIdVboRef.current);
    gl.vertexAttribPointer(attribLocations.current.layerId, 1, gl.FLOAT, false, 4, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, brightnessVboRef.current);
    gl.vertexAttribPointer(attribLocations.current.brightness, 1, gl.FLOAT, false, 4, 0);
  }, []);

  const resizeCanvas = useCallback((canvas: HTMLCanvasElement, params: Params) => {
    const gl = glRef.current;
    const uniforms = uniformsRef.current;
    if (!gl) return;
    const DPR = devicePixelRatioClamped();
    const rect = canvas.getBoundingClientRect();
    const fullWidth = rect.width;
    const fullHeight = rect.height;
    canvas.width = Math.floor(fullWidth * DPR);
    canvas.height = Math.floor(fullHeight * DPR);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform1f(uniforms["u_ratio"], fullWidth / (fullHeight || 1));
    gl.uniform1f(uniforms["u_img_ratio"], 1.0);
    gl.uniform2f(uniforms["u_resolution"], canvas.width, canvas.height);
    gl.uniform1f(uniforms["u_layerOpacity"], params.layerOpacity);
  }, []);

  const syncBuffersFromTriangles = useCallback((gl: WebGLRenderingContext) => {
    const tris = trianglesRef.current;
    const translate = translateRef.current!;
    const angle = angleRef.current!;
    const brightness = new Float32Array(tris.length * 3);
    let vi = 0;
    for (const t of tris) {
      const g = groupsRef.current.find((gg) => gg.id === t.groupId);
      if (!g) {
        vi += 3;
        continue;
      }
      for (let k = 0; k < 3; k++) {
        translate[vi * 2 + 0] = g.pos.x;
        translate[vi * 2 + 1] = g.pos.y;
        angle[vi] = g.ang;
        brightness[vi] = g.brightness;
        vi++;
      }
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, translateVboRef.current);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, translate);
    gl.bindBuffer(gl.ARRAY_BUFFER, angleVboRef.current);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, angle);
    gl.bindBuffer(gl.ARRAY_BUFFER, brightnessVboRef.current);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, brightness);
  }, []);

  const setTriangles = useCallback((triangles: Triangle[]) => {
    trianglesRef.current = triangles;
  }, []);

  const setGroups = useCallback((groups: Group[]) => {
    groupsRef.current = groups;
  }, []);

  const getTriangles = useCallback(() => trianglesRef.current, []);
  const getGroups = useCallback(() => groupsRef.current, []);

  return {
    glRef,
    programRef,
    uniformsRef,
    imageRef,
    trianglesRef,
    groupsRef,
    interleavedRef,
    translateRef,
    angleRef,
    baseVboRef,
    translateVboRef,
    angleVboRef,
    colorShiftVboRef,
    roughnessVboRef,
    reflectivityVboRef,
    materialTypeVboRef,
    depthVboRef,
    layerIdVboRef,
    brightnessVboRef,
    attribLocations,
    setupGL,
    uploadGeometry,
    bindAttributes,
    resizeCanvas,
    syncBuffersFromTriangles,
    setTriangles,
    setGroups,
    getTriangles,
    getGroups,
  };
};


