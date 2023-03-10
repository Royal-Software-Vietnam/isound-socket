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
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/files/');
    },
    filename: function (req, file, cb) {
        let [type, extend] = file.mimetype.split("/");
        let random_file_name = `file-${Math.floor((Math.random() * 888888888))}.${extend}`;
        cb(null, random_file_name);
    }
});
const upload = multer({ storage: storage });
// ===========>
const app = express();
app.use(cors());
app.use(express.static('public'));
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
    res.send(`
        <h1>Test upload</h1>
        <form>
            <input type="file" name="file">
            <button type="submit">Tải lên</button>
        </form>
        <p class="result"></p>
        <script>
        const form = document.querySelector('form');
        form.addEventListener('submit', uploadFile);

        function uploadFile(event) {
            event.preventDefault();

            const fileInput = document.querySelector('input[type="file"]');
            const file = fileInput.files[0];

            const formData = new FormData();
            formData.append('file', file);

            fetch('/upload', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    document.querySelector('.result').innerHTML = 'Link: ' + data
                })
                .catch(error => {
                    console.error('Lỗi khi tải lên tệp', error);
                });
        }
    </script>
    `);
});
app.post(`/upload`, upload.single('file'), (req, res) => {
    var _a;
    let info = {
        protocol: req.protocol,
        host: req.get('host'),
        pathname: req.originalUrl
    };
    res.json(`${info.protocol}://${info.host}/files/${(_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.filename}`);
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
