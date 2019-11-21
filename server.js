/**
 * Handles setting up and starting the server.
 * Sessions, Routing, and Web Sockets
 */

//Create the server
const express = require("express");
const app = express();
const server = require("http").createServer(app);

//Session Setup
const session = require("express-session");
const LokiStore = require("connect-loki")(session);
const lokiOptions = {};
const secret = process.env.SESSION_SECRET || "@d$f4%ggGG4_*7FGkdkjlk";
const fullSession = session({
    store: new LokiStore(lokiOptions),
    secret,
    resave: false,
    saveUninitialized: false
});

app.use(fullSession); //App has access to sessions
app.use(express.urlencoded({ extended: true })); //parses data and puts into req.body

//Server Routing
//TODO: Use middleware or reverse proxy to serve static files -> aka, anything with res.sendFile()
app.use("/", require("./server/router"));
app.use(express.static(__dirname + "/client/build"));

//Socket Setup
const io = require("socket.io")(server);
io.use(require("express-socket.io-session")(fullSession)); //Socket has access to sessions
const socketSetup = require("./server/socketSetup");
io.sockets.on("connection", socket => {
    socketSetup(socket);
});

//Start the server
const port = process.env.PORT || 80;
server.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
