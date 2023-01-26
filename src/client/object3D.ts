import { Vector3 } from "alt-client";
import {
  deleteEntity,
  getEntityCoords,
  getEntityRotation,
  setEntityCoords,
  setEntityRotation,
} from "natives";

export default class Object3D {
  private entityId: number;

  constructor(entityId: number) {
    this.entityId = entityId;
  }

  public get Position() {
    return getEntityCoords(this.entityId, false);
  }

  public get Rotation() {
    return getEntityRotation(this.entityId, 2);
  }

  public set Position(v: Vector3) {
    setEntityCoords(this.entityId, v.x, v.y, v.z, false, false, false, false);
  }

  public set Rotation(v: Vector3) {
    setEntityRotation(this.entityId, v.x, v.y, v.z, 2, true);
  }

  public delete() {
    deleteEntity(this.entityId);
  }
}
