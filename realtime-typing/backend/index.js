import { WebSocketServer } from "ws";
import crypto from "crypto";

const wss = new WebSocketServer({ port: 8080 });

console.log("WS server running on ws://localhost:8080");

wss.on("connection", (socket) => {

  socket.on("message", (data) => {
    let msg;
    try {
      msg = JSON.parse(data.toString());
    } catch {
      return; 
    }

    if (msg.type === "join") {
      socket.roomId = msg.payload.roomId;
      socket.userId = msg.payload.userId || crypto.randomUUID();

      return;
    }

    if (!socket.roomId) return;

    if (msg.type === "typing") {
      wss.clients.forEach(client => {
        if (
          client !== socket &&
          client.readyState === 1 &&
          client.roomId === socket.roomId
        ) {
          client.send(JSON.stringify({
            type: "typing",
            payload: {
              text: msg.payload.text,
              from: socket.userId
            }
          }));
        }
      });
      return;
    }

    if (msg.type === "typing:start") {
      wss.clients.forEach(client => {
        if (
          client !== socket &&
          client.readyState === 1 &&
          client.roomId === socket.roomId
        ) {
          client.send(JSON.stringify({
            type: "typing-indicator",
            payload: {
              userId: socket.userId,
              isTyping: true
            }
          }));
        }
      });
      return;
    }

    if (msg.type === "typing:stop") {
      wss.clients.forEach(client => {
        if (
          client !== socket &&
          client.readyState === 1 &&
          client.roomId === socket.roomId
        ) {
          client.send(JSON.stringify({
            type: "typing-indicator",
            payload: {
              userId: socket.userId,
              isTyping: false
            }
          }));
        }
      });
      return;
    }
  });

  socket.on("close", () => {
    wss.clients.forEach(client => {
      if (
        client.readyState === 1 &&
        client.roomId === socket.roomId
      ) {
        client.send(JSON.stringify({
          type: "typing-indicator",
          payload: {
            userId: socket.userId,
            isTyping: false
          }
        }));
      }
    });
  });
});
