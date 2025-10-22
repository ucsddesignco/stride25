import type { Group, Params } from './types';

export const stepPhysics = (
  groups: Group[], 
  params: Params, 
  dt: number
): void => {
  const damping = params.damping;
  for (const g of groups) {
    if (!g.isActive) continue;
    g.vel.y -= params.gravity * dt;
    g.vel.x *= damping;
    g.vel.y *= damping;
    g.angVel *= damping;
    g.pos.x += g.vel.x * dt;
    g.pos.y += g.vel.y * dt;
    g.ang += g.angVel * dt;
    g.age += dt;
    if (g.layerId > 0 && g.brightness < 1.0) {
      const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
      const maxAge = 2.5;
      const normalizedAge = Math.min(g.age / maxAge, 1.0);
      const targetBrightness = 0.1 + (0.9 * easeInOutCubic(normalizedAge));
      const lerpSpeed = 2.5;
      g.brightness = g.brightness + (targetBrightness - g.brightness) * lerpSpeed * dt;
    }
  }
};

export const scheduleLayerRemoval = (
  _groups: Group[], 
  layerId: number, 
  delayMs: number,
  onRemoveLayer: (layerId: number) => void
): void => {
  setTimeout(() => {
    onRemoveLayer(layerId);
  }, delayMs);
};

export const explodeAt = (
  nx: number, 
  ny: number, 
  groups: Group[], 
  params: Params,
  onAddNewLayer?: (newTriangles: any[], newGroups: Group[]) => void,
  onRemoveLayer?: (layerId: number) => void
): number => {
  const cx = (nx - 0.5) * 2;
  const cy = (0.5 - ny) * 2;
  let targetLayer = -1;
  let minLayerId = Infinity;
  for (const g of groups) {
    if (!g.isActive || g.isShattered) continue;
    const distanceFromOrigin = Math.sqrt(g.pos.x * g.pos.x + g.pos.y * g.pos.y);
    if (distanceFromOrigin < 0.5 && g.layerId < minLayerId) {
      minLayerId = g.layerId;
      targetLayer = g.layerId;
    }
  }
  if (targetLayer === -1) {
    for (const g of groups) {
      if (g.isActive && !g.isShattered && g.layerId < minLayerId) {
        minLayerId = g.layerId;
        targetLayer = g.layerId;
      }
    }
  }
  const nextLayer = targetLayer + 1;
  for (const g of groups) {
    if (g.isActive && !g.isShattered && g.layerId === nextLayer) {
      g.brightness = 0.1;
    }
  }
  for (const g of groups) {
    if (!g.isActive || g.isShattered || g.layerId !== targetLayer) continue;
    const dx = g.pos.x - cx;
    const dy = g.pos.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const falloff = Math.max(0, 1 - dist / (params.impulseRadius * 2));
    const strength = params.impulse * falloff;
    const nxv = dist > 1e-5 ? dx / dist : (Math.random() - 0.5);
    const nyv = dist > 1e-5 ? dy / dist : (Math.random() - 0.5);
    const randomFactor = 0.8 + 0.4 * Math.random();
    g.vel.x += nxv * strength * randomFactor;
    g.vel.y += nyv * strength * randomFactor;
    g.angVel += (Math.random() - 0.5) * 2.0 * strength;
    g.isShattered = true;
  }
  if (onRemoveLayer) {
    scheduleLayerRemoval(groups, targetLayer, 3000, onRemoveLayer);
  }
  if (onAddNewLayer) {
    onAddNewLayer([], []);
  }
  return targetLayer;
};


