import { Vector3 } from "alt-client";

export class ObjectEditorEvent<K extends keyof IObjectEditorEvent> {
  name: K;
  callback: IObjectEditorEvent[K];
}

export interface IObjectEditorEvent {
  positionChange: (oldPosition: Vector3, newPosition: Vector3) => void;
  rotationChange: (oldRotation: Vector3, newRotation: Vector3) => void;
  ready: () => void;
  cancel: () => void;
  save: () => void;
  dataChange: (position: Vector3, rotation: Vector3) => void;
}
