import {
  everyTick,
  Vector3,
  WebView,
  clearEveryTick,
  on,
  off,
  showCursor,
  isCursorVisible,
  toggleGameControls,
} from "alt-client";
import {
  getGameplayCamCoord,
  getGameplayCamFov,
  getGameplayCamRot,
} from "natives";
import { rotationToDirection } from "./helpers";
import Object3D from "./object3D";
import { ObjectEditorEvent, IObjectEditorEvent } from "./objectEditorEvent";

export default class ObjectEditor {
  // Identyfikator encji
  private entity: Object3D;

  // Webview url
  public static WEBVIEW_URL = "http://resource/html/index.html";

  // Pozycja startowa
  public startPosition: Vector3;

  // Rotacja startowa
  public startRotation: Vector3;

  // Aktualna pozycja
  public actualPosition: Vector3;

  // Aktualna rotacja
  public actualRotation: Vector3;

  private everyTickHandler: number;

  private camPos: Vector3;
  private camRot: Vector3;

  private webView: WebView;

  public get StartRotation() {
    return this.startRotation;
  }

  public get StartPosition() {
    return this.startPosition;
  }

  public get Entity() {
    return this.entity;
  }

  private dontUpdate = false;
  private isLocal = false;
  private boneIndex: any;

  private keybindHandlerArrow = (key: number) => {
    this.keybindHandler(key);
  };

  // Subskrybowane eventy
  private subscribedEvents: ObjectEditorEvent<keyof IObjectEditorEvent>[] = [];

  constructor(entityId: number, dontUpdate = false, isLocal: boolean) {
    this.entity = new Object3D(entityId);
    this.startPosition = this.entity.Position;
    this.startRotation = this.entity.Rotation;
    this.actualPosition = this.startPosition;
    this.actualRotation = this.startRotation;

    this.dontUpdate = dontUpdate;
    this.isLocal = isLocal;
  }

  public stop() {
    if (this.webView) {
      this.webView.destroy();
    }

    if (this.everyTickHandler) {
      clearEveryTick(this.everyTickHandler);
    }

    off("keydown", this.keybindHandlerArrow);
  }

  public start() {
    this.webView = new WebView(ObjectEditor.WEBVIEW_URL, false);

    this.webView.on("oe:change", (pos: Vector3, rot: Vector3) => {
      if (this.entity && !this.dontUpdate) {
        this.entity.Position = pos;
        this.entity.Rotation = rot;
      }

      if (
        this.actualPosition.x !== pos.x ||
        this.actualPosition.y !== pos.y ||
        this.actualPosition.z !== pos.z
      ) {
        this.executeEvent(
          "positionChange",
          new Vector3(this.actualPosition),
          new Vector3(pos)
        );
        this.actualPosition = pos;
      }

      if (
        this.actualRotation.x !== rot.x ||
        this.actualRotation.y !== rot.y ||
        this.actualRotation.z !== rot.z
      ) {
        this.executeEvent(
          "rotationChange",
          new Vector3(this.actualRotation),
          new Vector3(rot)
        );
        this.actualRotation = rot;
      }

      this.executeEvent("dataChange", new Vector3(pos), new Vector3(rot));
    });

    this.webView.on("oe:ready", () => {
      const fov = getGameplayCamFov();
      const camPos = getGameplayCamCoord();
      const camRot = getGameplayCamRot(2);
      const lookAt = camPos.add(rotationToDirection(camRot).mul(100));

      this.webView.emit(
        "oe:start",
        fov,
        camPos,
        lookAt,
        this.startPosition,
        this.startRotation,
        this.isLocal
      );
      this.webView.focus();
    });

    this.everyTickHandler = everyTick(() => this.render());
    on("keydown", this.keybindHandlerArrow);
    this.executeEvent("ready");
  }

  private keybindHandler(key: number) {
    if (!this.webView) {
      return;
    }

    switch (key) {
      case 87: {
        this.webView.emit("oe:change", "position");
        break;
      }

      case 69: {
        this.webView.emit("oe:change", "rotation");
        break;
      }

      case 13: {
        this.executeEvent("save");
        break;
      }

      case 8: {
        this.executeEvent("cancel");
        break;
      }

      case 75: {
        showCursor(!isCursorVisible());
        toggleGameControls(!isCursorVisible());
        break;
      }
    }
  }

  private render() {
    const camPos = getGameplayCamCoord();
    const camRot = getGameplayCamRot(2);

    if (this.webView && (this.camPos !== camPos || this.camRot !== camRot)) {
      this.camPos = camPos;
      this.camRot = camRot;

      const lookAt = camPos.add(rotationToDirection(camRot).mul(100));

      this.webView.emit("oe:camera", camPos, lookAt);
    }
  }

  public on<K extends keyof IObjectEditorEvent>(
    name: K,
    callback: IObjectEditorEvent[K]
  ) {
    this.subscribedEvents.push({
      name,
      callback,
    });
  }

  private executeEvent<K extends keyof IObjectEditorEvent>(
    event: K,
    ...args: any[]
  ) {
    const events = this.subscribedEvents.filter((t) => t.name === event);
    if (events && events.length > 0) {
      events.forEach((event) => {
        event.callback.apply(void 0, args);
      });
    }
  }
}
