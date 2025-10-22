import type { Group, Params } from './types';

export const stepPhysics = (
  groups: Group[], 
  params: Params, 
  dt: number
): void => {
  const damping = params.damping;
  for (const g of groups) {
    if (!g.isActive) continue;
    
    // Apply gravity
    g.vel.y -= params.gravity * dt;
    
    // Apply damping
    g.vel.x *= damping;
    g.vel.y *= damping;
    g.angVel *= damping;
    
    // Acceleration effect for shattered shards
    if (g.isShattered && g.age > params.accelerationDelay) {
      const accelerationTime = g.age - params.accelerationDelay;
      const accelerationFactor = Math.min(accelerationTime * params.acceleration, 2.0); // Cap at 2x speed
      
      // Apply acceleration in the direction of current velocity
      const currentSpeed = Math.sqrt(g.vel.x * g.vel.x + g.vel.y * g.vel.y);
      if (currentSpeed > 0.01) { // Avoid division by zero
        const accelerationStrength = accelerationFactor * 0.5; // Adjust strength
        g.vel.x += (g.vel.x / currentSpeed) * accelerationStrength * dt;
        g.vel.y += (g.vel.y / currentSpeed) * accelerationStrength * dt;
      }
    }
    
    // Safety mechanism: if shard is shattered but moving too slowly, give it a boost
    if (g.isShattered && g.age > 0.5) {
      const speed = Math.sqrt(g.vel.x * g.vel.x + g.vel.y * g.vel.y);
      if (speed < 0.5) {
        // Give stuck shards a random boost toward screen edge
        const angle = Math.random() * Math.PI * 2;
        const boostStrength = 1.0;
        g.vel.x += Math.cos(angle) * boostStrength;
        g.vel.y += Math.sin(angle) * boostStrength;
      }
    }
    
    // Update position
    g.pos.x += g.vel.x * dt;
    g.pos.y += g.vel.y * dt;
    g.ang += g.angVel * dt;
    g.age += dt;
    
    // Brightness animation for new layers
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
  // Dim all non-shattered, active layers that are not the target layer
  for (const g of groups) {
    if (g.isActive && !g.isShattered && g.layerId !== targetLayer) {
      g.brightness = 0.1;
    }
  }
  for (const g of groups) {
    if (!g.isActive || g.isShattered || g.layerId !== targetLayer) continue;
    const dx = g.pos.x - cx;
    const dy = g.pos.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // Improved falloff calculation - ensures minimum force for all shards
    const maxRadius = params.impulseRadius * 2;
    const falloff = Math.max(0.3, 1 - dist / maxRadius); // Minimum 30% force
    const strength = params.impulse * falloff;
    
    // Calculate direction away from explosion center
    let nxv, nyv;
    if (dist > 1e-5) {
      nxv = dx / dist;
      nyv = dy / dist;
    } else {
      // For shards at explosion center, use random direction
      const angle = Math.random() * Math.PI * 2;
      nxv = Math.cos(angle);
      nyv = Math.sin(angle);
    }
    
    // Add random variation but ensure minimum velocity
    const randomFactor = 0.7 + 0.6 * Math.random(); // Increased range
    const minVelocity = 2.0; // Minimum velocity to guarantee offscreen movement
    
    g.vel.x += nxv * strength * randomFactor;
    g.vel.y += nyv * strength * randomFactor;
    
    // Ensure minimum velocity magnitude
    const currentSpeed = Math.sqrt(g.vel.x * g.vel.x + g.vel.y * g.vel.y);
    if (currentSpeed < minVelocity) {
      const scale = minVelocity / currentSpeed;
      g.vel.x *= scale;
      g.vel.y *= scale;
    }
    
    // Add angular velocity
    g.angVel += (Math.random() - 0.5) * 3.0 * strength;
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


