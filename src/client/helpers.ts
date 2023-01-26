import { Vector3 } from "alt-client";

export const clamp = (value: number, min: number, max: number) => {
  return Math.max(min, Math.min(max, value));
};

export function getXyInFrontOf(
  position: Vector3,
  rotation: Vector3,
  distance: number
) {
  const x = position.x + Math.sin(degToRad(-rotation.z)) * distance;
  const y = position.y + Math.cos(degToRad(-rotation.z)) * distance;

  return new Vector3(x, y, position.z);
}

export const rotationToDirection = (rot: Vector3) => {
  const z = degToRad(rot.z);
  const x = degToRad(rot.x);
  const num = Math.abs(Math.cos(x));

  const x1 = -Math.sin(z) * num;
  const y1 = Math.cos(z) * num;
  const z1 = Math.sin(x);
  return new Vector3(x1, y1, z1);
};

export const getVector3Length = (vector: Vector3) => {
  return Math.sqrt(
    vector.x * vector.x + vector.y * vector.y + vector.z * vector.z
  );
};

export const degToRad = (deg: number) => {
  return (deg * Math.PI) / 180.0;
};

export const crossProducts = (a: Vector3, b: Vector3) => {
  const ax = a.x,
    ay = a.y,
    az = a.z;
  const bx = b.x,
    by = b.y,
    bz = b.z;

  const x = ay * bz - az * by;
  const y = az * bx - ax * bz;
  const z = ax * by - ay * bx;

  return new Vector3(x, y, z);
};

export const dotProducts = (v1: Vector3, v2: Vector3) => {
  return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
};
