import { ipcRenderer } from "electron";
import React from "react";

export const Broadcast: React.FC = () => {
  const connectToDolphin = () => {
    ipcRenderer.send("start-broadcast", "");
  };
  return (
    <div>
      <h1>Broadcast</h1>
      <button onClick={() => connectToDolphin()}>connect to dolphin</button>
    </div>
  );
};
