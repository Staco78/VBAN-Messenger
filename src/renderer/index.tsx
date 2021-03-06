import React from "react";
import ReactDom from "react-dom";
import { HashRouter, Routes, Route } from "react-router-dom";
import App from "@/renderer/pages/app";
import Home from "@@/pages/home";
import VBAN_MessengerDMChannel from "@/renderer/pages/channel/VBANMessengerDMChannel";
import Server from "./data/server";

Server.on("message", async msg => {
    const author = await msg.getAuthor();
    console.log(`${author.name} has sent : ${msg.content}`);
});

ReactDom.render(
    <React.StrictMode>
        <HashRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route index element={<Home />} />
                    <Route path="channel">
                        <Route path="user">
                            <Route path=":userId" element={<VBAN_MessengerDMChannel />} />
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </HashRouter>
    </React.StrictMode>,
    document.getElementById("root")
);
