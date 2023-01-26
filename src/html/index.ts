import {
  Object3D,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Vector3,
  MathUtils,
} from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";

let renderer: WebGLRenderer;
let camera: PerspectiveCamera;
let scene: Scene;
let mesh: Object3D;
let transformControls: TransformControls;
let transformMode: "position" | "rotation";

const transformOrder = "YXZ";

let objectPosition: Vector3;
let objectRotation: Vector3;

const createScene = (
  fov: number,
  camPos: Vector3,
  camLookAt: Vector3,
  objPos: Vector3,
  objRot: Vector3,
  isLocal: boolean
) => {
  renderer = new WebGLRenderer({
    canvas: document.getElementById("oe-canvas"),
    alpha: true,
  });
  renderer.setPixelRatio(1);
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera = new PerspectiveCamera(
    fov,
    window.innerWidth / window.innerHeight,
    0.01,
    50000
  );
  scene = new Scene();
  mesh = new Object3D();
  transformControls = new TransformControls(camera, renderer.domElement);

  transformControls.setMode("translate");
  transformControls.setSpace(isLocal ? "local" : "world");

  mesh.position.set(objPos.x, objPos.z, -objPos.y);
  mesh.rotation.set(
    MathUtils.degToRad(objRot.x),
    MathUtils.degToRad(objRot.z),
    MathUtils.degToRad(-objRot.y),
    transformOrder
  );

  objectPosition = objPos;
  objectRotation = objRot;

  scene.add(mesh);
  transformControls.attach(mesh);
  scene.add(transformControls);

  transformMode = "position";
  transformControls.addEventListener("change", render);
  transformControls.addEventListener(
    "objectChange",
    transformControlsEventChange
  );

  setCamera(camPos, camLookAt);
  render();
};

const transformControlsEventChange = () => {
  if (mesh) {
    const pos = new Vector3(mesh.position.x, -mesh.position.z, mesh.position.y);
    const rot = new Vector3(
      MathUtils.radToDeg(mesh.rotation.x),
      MathUtils.radToDeg(-mesh.rotation.z),
      MathUtils.radToDeg(mesh.rotation.y)
    );

    objectPosition = pos;
    objectRotation = rot;

    if ("alt" in window) {
      alt.emit("oe:change", pos, rot);
    }
  }
};

const render = () => {
  if (renderer) {
    renderer.render(scene, camera);
  }
};

const setCamera = (pos: Vector3, lookAt: Vector3) => {
  if (camera) {
    camera.position.set(pos.x, pos.z, -pos.y);
    camera.lookAt(new Vector3(lookAt.x, lookAt.z, -lookAt.y));
  }
};

if ("alt" in window) {
  alt.on(
    "oe:start",
    (
      fov: number,
      camPos: Vector3,
      lookAt: Vector3,
      objPos: Vector3,
      objRot: Vector3,
      isLocal: boolean
    ) => {
      createScene(fov, camPos, lookAt, objPos, objRot, isLocal);
    }
  );

  alt.on("oe:camera", (camPos: Vector3, lookAt: Vector3) => {
    if (camera) {
      setCamera(camPos, lookAt);
      render();
    }
  });
  alt.on("oe:change", (type: "position" | "rotation") => {
    if (type === transformMode) {
      return;
    }

    transformMode = type;

    switch (type) {
      case "position": {
        transformControls.setMode("translate");
        break;
      }

      case "rotation": {
        transformControls.setMode("rotate");
        break;
      }
    }
  });
  alt.emit("oe:ready");
} else {
  // for debug
  createScene(
    60,
    new Vector3(-20, -20, 10),
    new Vector3(),
    new Vector3(),
    new Vector3(0, 0, 0),
    true
  );
}
