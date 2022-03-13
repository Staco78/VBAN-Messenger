import { Server, ServerInfos } from "./vban/server";
import os from "os";
import "./main";

const infos: ServerInfos = {
    bitType: 0,
    bitFeature: 0,
    bitFeatureExt: 0,
    preferedRate: 0,
    minRate: 0,
    maxRate: 0,
    version: 0,
    GPSPosition: "",
    UserPosition: "",
    langCode: "fr-fr",
    deviceName: os.hostname(),
    manufacturerName: "",
    applicationName: "VBAN-Messenger",
    userName: "Staco",
    userComment: "",
};

const server = new Server({ port: 6980 }, infos);
server.on("message", (packet, sender, isUTF8) => {
    console.log(`message received (${packet.data.toString(isUTF8 ? "utf8" : "ascii")}) from ${sender.infos?.userName}`);
});
