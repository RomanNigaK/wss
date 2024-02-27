const http = require("http");
const express = require("express");
const WebSocket = require("ws");
const path = require("path");
const uuid = require("uuid").v4;
const url = require("url");

const app = express();

app.use("/", express.static(path.join(__dirname, "client")));

app.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "client", "index.html"));
});

const server = http.createServer(app);

const webSocketServer = new WebSocket.Server({ server });

const connections = {};

const users = {};

const handleClose = () => {
 console.log("disconected");
};

const handleMessage=(data)=>{
  const message = JSON.parse(data);

  console.log("message",message);


  Object.values(connections).forEach((connection) => {
      connection.send(JSON.stringify(message));
  });


}

webSocketServer.on("connection", (connection, request) => {
  console.log("connection");
  const { id } = url.parse(request.url, true).query;
  const uuidConnection = uuid();

  connections[uuidConnection] = connection;

  connection.on("message", (message) =>
    handleMessage(message)
  );


  connection.on("close", () => handleClose());

  
});

server.listen(8000, () => console.log("Server started"));
