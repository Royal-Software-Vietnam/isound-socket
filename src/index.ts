import express = require("express")
import { Request, Response, NextFunction } from "express";
import __cache__ from "./services/cache.service"
require('dotenv').config();
import cors = require("cors")
import bodyParser = require('body-parser')
import http = require("http")
import { Server } from "socket.io"
import multer = require("multer")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/files/')
    },
    filename: function (req, file, cb) {
        let [type, extend] = file.mimetype.split("/")
        let random_file_name = `file-${Math.floor((Math.random() * 888888888))}.${extend}`
        cb(null, random_file_name)
    }
})

const upload = multer({ storage: storage })

// Declare zone
declare global {
    var __cache__: any
    namespace Express {
        interface Request {
            user: any
        }
    }
}
// ===========>

const app = express()
app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST']
    }
})

async function main() {

}; main()

let build_time = new Date()

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
    `)
})

app.post(`/upload`, upload.single('file'), (req: Request, res: Response) => {
    let info = {
        protocol: req.protocol,
        host: req.get('host'),
        pathname: req.originalUrl
    }
    res.json(`${info.protocol}://${info.host}/files/${req?.file?.filename}`)
})

io.on("connection", (socket) => {

    console.log(`success:connect to client`)

    socket.on("ping", (message) => {
        socket.emit("_ping_", {
            msg: "Hello, I am isound socket server",
            yourdata: message
        })
    })

    socket.on("disconect", () => {
        console.log("User disconnected")
    })

    socket.on("message", (message) => {
        console.log(`message: ${message}`);
        io.emit("message", message);
    })
})



let PORT = process.env.PORT || 8888;
server.listen(PORT, () => { console.log(`Server is running on port ${PORT}`) })