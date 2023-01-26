import {
  hash,
  isCursorVisible,
  logError,
  off,
  on,
  Player,
  showCursor,
  toggleGameControls,
  toggleRmlControls,
  Utils,
} from "alt-client";
import ObjectEditor from "../client/objectEditor";
import { getXyInFrontOf } from "../client/helpers";
import { createObject } from "natives";

let editor: ObjectEditor;

// You can set webview url globally
ObjectEditor.WEBVIEW_URL = "http://resource/html/index.html";

on("consoleCommand", async (name, ...args) => {
  if (name == "edit-object") {
    if (!args || args.length < 1) {
      logError("SYNTAX: edit-object [propName]");
      return;
    }

    const propHash = hash(args[0]);
    const frontPosition = getXyInFrontOf(
      Player.local.pos,
      Player.local.rot.toDegrees(),
      1
    );

    await Utils.requestModel(propHash);
    const obj = createObject(
      propHash,
      frontPosition.x,
      frontPosition.y,
      frontPosition.z,
      false,
      false,
      false
    );

    if (editor) {
      editor.stop();
      editor = undefined;
    }

    editor = new ObjectEditor(obj, false, true);
    editor.on("cancel", () => {
      // on cancel (backspace)
      editor.stop();
      editor = undefined;
    });

    editor.on("save", () => {
      // on save (enter)
      // you can get position here for example:
      // editor.Entity.Position
      // editor.Entity.Rotation
      // or
      // editor.actualPosition;
      // editor.actualRotation
      editor.stop();
      editor = undefined;
    });

    editor.on("dataChange", (pos, rot) => {
      // on data change
    });

    editor.start();
  }
});
