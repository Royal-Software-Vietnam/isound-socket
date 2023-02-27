"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
require('dotenv').config();
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const socket_io_1 = require("socket.io");
// ===========>
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const server = http.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST']
    }
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
;
main();
let build_time = new Date();
app.get("/", (req, res) => {
    res.json(`Last build :: ${build_time}`);
});
io.on("connection", (socket) => {
    console.log(`success:connect to client`);
    socket.on("ping", (message) => {
        socket.emit("_ping_", {
            msg: "Hello, I am isound socket server",
            yourdata: message
        });
    });
    socket.on("disconect", () => {
        console.log("User disconnected");
    });
    socket.on("message", (message) => {
        console.log(`message: ${message}`);
        io.emit("message", message);
    });
});
let PORT = process.env.PORT || 8888;
server.listen(PORT, () => { console.log(`Server is running on port ${PORT}`); });
