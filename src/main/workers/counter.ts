// import { BroadcastManager } from "common/broadcast/broadcastManager";
import { ConnectionEvent, ConnectionStatus, DolphinConnection, Ports } from "@slippi/slippi-js";
import log from "electron-log";
import { expose } from "threads/worker";

let currentCount = 0;

const counter = {
  async connect(address: string, port: number) {
    log.info("received connection request");
    try {
      const dolphinConnection = new DolphinConnection();
      dolphinConnection.on(ConnectionEvent.STATUS_CHANGE, (status) => {
        log.info(`[Broadcast] Dolphin status change: ${status}`);
      });
      dolphinConnection.once(ConnectionEvent.MESSAGE, (message) => {
        log.info(`[Broadcast] Dolphin got message: ${JSON.stringify(message)}`);
      });
      dolphinConnection.on(ConnectionEvent.ERROR, (err) => {
        // Log the error messages we get from Dolphin
        log.error("[Broadcast] Dolphin connection error\n", err);
      });

      await dolphinConnection.connect(address, port);
    } catch (err) {
      log.error(err);
    }
    return currentCount;
  },
  disconnect() {
    return ++currentCount;
  },
  decrement() {
    return --currentCount;
  },
};

export type Counter = typeof counter;

expose(counter);
