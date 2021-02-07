import { DolphinLaunchType, DolphinUseType } from "common/dolphin";
import { ipcMain, nativeImage } from "electron";
import log from "electron-log";
import { Counter } from "main/workers/counter";
import path from "path";
import { spawn, Thread, Worker } from "threads";

// import { Ports } from "@slippi/slippi-js";
// (process as any).dlopen = () => {
//   throw new Error("Load native module is not safe");
// };
import { DolphinManager, ReplayCommunication } from "./dolphinManager";
import { assertDolphinInstallations } from "./downloadDolphin";

export function setupListeners() {
  const dolphinManager = DolphinManager.getInstance();
  ipcMain.on("onDragStart", (event, filePath: string) => {
    event.sender.startDrag({
      file: filePath,
      icon: nativeImage.createFromPath(path.join(__static, "images", "file.png")),
    });
  });

  ipcMain.on("downloadDolphin", (_) => {
    assertDolphinInstallations();
  });

  ipcMain.on("viewReplay", (_, filePath: string) => {
    const replayComm: ReplayCommunication = {
      mode: "normal",
      replay: filePath,
    };
    dolphinManager.launchDolphin(DolphinUseType.PLAYBACK, -1, replayComm);
  });

  ipcMain.on("watchBroadcast", (_, filePath: string, mode: "normal" | "mirror", index: number) => {
    const replayComm: ReplayCommunication = {
      mode: mode,
      replay: filePath,
    };
    dolphinManager.launchDolphin(DolphinUseType.SPECTATE, index, replayComm);
  });

  ipcMain.on("playNetplay", () => {
    dolphinManager.launchDolphin(DolphinUseType.NETPLAY, -1);
  });

  ipcMain.on("configureDolphin", (_, dolphinType: DolphinLaunchType) => {
    dolphinManager.launchDolphin(DolphinUseType.CONFIG, -1, undefined, dolphinType);
  });

  ipcMain.on("start-broadcast", async (event, emojiName) => {
    const counter = await spawn<Counter>(new Worker("./workers/counter"));
    // const emoji = await getEmoji(emojiName);
    const res = await counter.connect("127.0.0.1", 51441);
    log.info(`received result: ${res} from counter worker`);
    // event.sender.send('get-emoji-response', emoji);
  });

  /*
  console.log("starting worker code");
  (async () => {
    // Try out some worker stuff
    const counter = await spawn<Counter>(new Worker("./workers/counter"));
    console.log(`Initial counter: ${await counter.getCount()}`);

    await counter.increment();
    console.log(`Updated counter: ${await counter.getCount()}`);

    await Thread.terminate(counter);
  })();
  console.log("end worker code");
  */
}
