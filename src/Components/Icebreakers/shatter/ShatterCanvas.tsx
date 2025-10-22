"use client";

import { useRef, useEffect, useCallback } from 'react';
import type { Params, Vec2, Triangle, Group } from './types';
import { useWebGLRenderer } from './useWebGLRenderer';
import { buildMesh } from './mesh';
import { stepPhysics, explodeAt } from './physics';

interface ShatterCanvasProps {
  params: Params;
  onParamsChange: (updates: Partial<Params>) => void;
}

export const ShatterCanvas: React.FC<ShatterCanvasProps> = ({ params, onParamsChange }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef<Vec2>({ x: 0.5, y: 0.5 });
  const globalIdCounterRef = useRef<number>(0);

  const {
    glRef,
    setupGL,
    uploadGeometry,
    bindAttributes,
    resizeCanvas,
    syncBuffersFromTriangles,
    setTriangles,
    setGroups,
    getTriangles,
    getGroups,
  } = useWebGLRenderer();

  const rebuildMesh = useCallback(() => {
    const { triangles, groups } = buildMesh(6, 3, params.layerCount, params);

    const maxId = groups.length > 0 ? Math.max(...groups.map(g => g.id)) : -1;
    globalIdCounterRef.current = maxId + 1;

    setTriangles(triangles);
    setGroups(groups);

    const gl = glRef.current;
    if (gl) {
      uploadGeometry(gl);
      bindAttributes(gl);
    }
  }, [params.layerCount, params.layerSpacing, setTriangles, setGroups, uploadGeometry, bindAttributes, glRef]);

  const adjustLayerDepths = useCallback((groups: Group[]) => {
    const activeLayers = groups
      .filter(g => g.isActive && !g.isShattered)
      .sort((a, b) => a.layerId - b.layerId);

    return groups.map(group => {
      if (group.isActive && !group.isShattered) {
        const layerIndex = activeLayers.findIndex(l => l.layerId === group.layerId);
        return {
          ...group,
          depth: layerIndex * params.layerSpacing
        };
      } else if (group.isShattered) {
        return {
          ...group,
          depth: -0.1
        };
      }
      return group;
    });
  }, [params.layerSpacing]);

  const handleRemoveLayer = useCallback((layerId: number) => {
    const currentGroups = getGroups();
    const currentTriangles = getTriangles();

    const remainingGroups = currentGroups.filter(g => g.layerId !== layerId);
    const remainingTriangles = currentTriangles.filter(t => 
      remainingGroups.some(g => g.id === t.groupId)
    );

    if (remainingGroups.length !== currentGroups.length) {
      const adjustedGroups = adjustLayerDepths(remainingGroups);

      setGroups(adjustedGroups);
      setTriangles(remainingTriangles);

      const gl = glRef.current;
      if (gl) {
        uploadGeometry(gl);
        bindAttributes(gl);
      }
    }
  }, [getGroups, getTriangles, setGroups, setTriangles, uploadGeometry, bindAttributes, glRef, adjustLayerDepths]);

  const handleAddNewLayer = useCallback((newTriangles: Triangle[], newGroups: Group[]) => {
    if (newTriangles.length === 0 && newGroups.length === 0) {
      const currentGroups = getGroups();
      const maxLayerId = Math.max(...currentGroups.map(g => g.layerId));
      const newLayerId = maxLayerId + 1;

      const { triangles: generatedTriangles, groups: generatedGroups } = buildMesh(6, 3, 1, params);

      const groupIdMapping = new Map<number, number>();

      const updatedNewGroups = generatedGroups.map(group => {
        const newId = globalIdCounterRef.current++;
        groupIdMapping.set(group.id, newId);
        return {
          ...group,
          id: newId,
          layerId: newLayerId,
          depth: currentGroups.length * params.layerSpacing,
          brightness: 1.0,
          isActive: true,
          isShattered: false
        };
      });

      const updatedNewTriangles = generatedTriangles.map(triangle => ({
        ...triangle,
        groupId: groupIdMapping.get(triangle.groupId) || triangle.groupId
      }));

      const currentTriangles = getTriangles();
      const updatedTriangles = [...currentTriangles, ...updatedNewTriangles];
      const updatedGroups = [...currentGroups, ...updatedNewGroups];

      const adjustedGroups = adjustLayerDepths(updatedGroups);

      setTriangles(updatedTriangles);
      setGroups(adjustedGroups);

      const gl = glRef.current;
      if (gl) {
        uploadGeometry(gl);
        bindAttributes(gl);
      }
    } else {
      const currentTriangles = getTriangles();
      const currentGroups = getGroups();

      const updatedTriangles = [...currentTriangles, ...newTriangles];
      const updatedGroups = [...currentGroups, ...newGroups];

      setTriangles(updatedTriangles);
      setGroups(updatedGroups);

      const gl = glRef.current;
      if (gl) {
        uploadGeometry(gl);
        bindAttributes(gl);
      }
    }
  }, [getTriangles, getGroups, setTriangles, setGroups, uploadGeometry, bindAttributes, glRef, params, adjustLayerDepths]);

  const handleClick = useCallback((e: MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    pointerRef.current.x = nx;
    pointerRef.current.y = ny;

    const groups = getGroups();
    const targetLayer = explodeAt(nx, ny, groups, params, handleAddNewLayer, handleRemoveLayer);
    onParamsChange({ currentActiveLayer: targetLayer });
  }, [getGroups, onParamsChange, handleAddNewLayer, handleRemoveLayer, params]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === "Space") {
      onParamsChange({ currentActiveLayer: 0 });
      rebuildMesh();
    }
  }, [rebuildMesh, onParamsChange]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      resizeCanvas(canvas, params);
    }
  }, [resizeCanvas, params]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = setupGL(canvas);
    if (!gl) return;

    rebuildMesh();

    const onResize = () => handleResize();
    const onClick = (ev: MouseEvent) => handleClick(ev);
    const onKey = (ev: KeyboardEvent) => handleKeyDown(ev);

    window.addEventListener("resize", onResize);
    canvas.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);

    handleResize();

    let last = performance.now();
    let raf = 0;
    const render = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const groups = getGroups();
      stepPhysics(groups, params, dt);

      syncBuffersFromTriangles(gl);
      gl.clearColor(3/255, 16/255, 25/255, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      const tris = getTriangles().length;
      gl.drawArrays(gl.TRIANGLES, 0, tris * 3);

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
      cancelAnimationFrame(raf);
    };
  }, [setupGL, rebuildMesh, handleResize, handleClick, handleKeyDown, params, syncBuffersFromTriangles, getTriangles, getGroups, setTriangles, setGroups, uploadGeometry, bindAttributes]);

  return (
    <canvas
      ref={canvasRef}
      className="canvas-absolute"
      style={{ width: '100%', height: '100%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 0 }}
      role="img"
      aria-label="Low poly shatter canvas"
      tabIndex={0}
    />
  );
};


