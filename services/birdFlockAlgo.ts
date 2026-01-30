export interface Boid {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface FlockConfig {
  visualRange: number;
  protectedRange: number;
  centeringFactor: number;
  matchingFactor: number;
  avoidFactor: number;
  turnFactor: number;
  minSpeed: number;
  maxSpeed: number;
  margin: number;
  width: number;
  height: number;
}

export const defaultConfig: FlockConfig = {
  visualRange: 40,
  protectedRange: 8,
  centeringFactor: 0.0005,
  matchingFactor: 0.05,
  avoidFactor: 0.05,
  turnFactor: 0.15,
  minSpeed: 3,
  maxSpeed: 6,
  margin: 100,
  width: 1000,
  height: 500,
};

export function updateBoid(
  boid: Boid,
  flock: Boid[],
  config: FlockConfig,
): void {
  const {
    visualRange,
    protectedRange,
    centeringFactor,
    matchingFactor,
    avoidFactor,
    turnFactor,
    minSpeed,
    maxSpeed,
    margin,
    width,
    height,
  } = config;

  const visualRangeSquared = visualRange * visualRange;
  const protectedRangeSquared = protectedRange * protectedRange;

  let xposAvg = 0;
  let yposAvg = 0;
  let xvelAvg = 0;
  let yvelAvg = 0;
  let neighboringBoids = 0;
  let closeDx = 0;
  let closeDy = 0;

  for (const other of flock) {
    if (other === boid) continue;

    const dx = boid.x - other.x;
    const dy = boid.y - other.y;

    if (Math.abs(dx) < visualRange && Math.abs(dy) < visualRange) {
      const squaredDistance = dx * dx + dy * dy;

      if (squaredDistance < protectedRangeSquared) {
        closeDx += dx;
        closeDy += dy;
      } else if (squaredDistance < visualRangeSquared) {
        xposAvg += other.x;
        yposAvg += other.y;
        xvelAvg += other.vx;
        yvelAvg += other.vy;
        neighboringBoids++;
      }
    }
  }

  if (neighboringBoids > 0) {
    xposAvg /= neighboringBoids;
    yposAvg /= neighboringBoids;
    xvelAvg /= neighboringBoids;
    yvelAvg /= neighboringBoids;

    boid.vx +=
      (xposAvg - boid.x) * centeringFactor +
      (xvelAvg - boid.vx) * matchingFactor;
    boid.vy +=
      (yposAvg - boid.y) * centeringFactor +
      (yvelAvg - boid.vy) * matchingFactor;
  }

  boid.vx += closeDx * avoidFactor;
  boid.vy += closeDy * avoidFactor;

  if (boid.y < margin) {
    boid.vy += turnFactor;
  }
  if (boid.y > height - margin) {
    boid.vy -= turnFactor;
  }
  if (boid.x > width - margin) {
    boid.vx -= turnFactor;
  }
  if (boid.x < margin) {
    boid.vx += turnFactor;
  }

  const speed = Math.sqrt(boid.vx * boid.vx + boid.vy * boid.vy);
  if (speed > 0) {
    if (speed < minSpeed) {
      boid.vx = (boid.vx / speed) * minSpeed;
      boid.vy = (boid.vy / speed) * minSpeed;
    } else if (speed > maxSpeed) {
      boid.vx = (boid.vx / speed) * maxSpeed;
      boid.vy = (boid.vy / speed) * maxSpeed;
    }
  }

  boid.x += boid.vx;
  boid.y += boid.vy;
}

export function updateFlock(flock: Boid[], config: FlockConfig): void {
  for (const boid of flock) {
    updateBoid(boid, flock, config);
  }
}

export function createBoid(x: number, y: number): Boid {
  return {
    x,
    y,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
  };
}

export function createFlock(
  count: number,
  width: number,
  height: number,
): Boid[] {
  const flock: Boid[] = [];
  for (let i = 0; i < count; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    flock.push(createBoid(x, y));
  }
  return flock;
}
