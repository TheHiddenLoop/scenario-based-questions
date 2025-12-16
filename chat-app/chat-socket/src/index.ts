import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    socket: WebSocket,
    room: string
}

let userCount = 0;

let allSocket: User[] = [];

wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message.toString());

        if (parsedMessage.type === "join") {
            allSocket.push({
                socket,
                room: parsedMessage.payload.roomId
            });
            return;
        }

        if (parsedMessage.type === "chat") {
            const currentUser = allSocket.find(e => e.socket === socket);

            if (!currentUser) return;

            allSocket.forEach(e => {
                if (e.room === currentUser.room) {
                    if(e.socket !== socket){
                        e.socket.send(
                        JSON.stringify({
                            type: "chat",
                            payload: parsedMessage.payload
                        })
                    );
                    }
                }
            });
        }
    });

    
});