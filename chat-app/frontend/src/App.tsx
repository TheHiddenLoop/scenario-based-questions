import { useEffect, useRef, useState } from "react";

type Message = {
  type: "chat" | "join";
  payload: {
    message?: string;
    roomId?: string;
  };
  sender?: "self" | "other";
};

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [roomId, setRoomId] = useState("");
  const [chatRoom, setChatRoom] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (!chatRoom) return;

    const ws = new WebSocket("ws://localhost:8080");
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: { roomId },
        })
      );
    };

    ws.onmessage = (event) => {
      const parsed: Message = JSON.parse(event.data);
      setMessages((prev) => [
        ...prev,
        parsed.sender === "self" ? parsed : { ...parsed, sender: "other" },
      ]);
    };

    wsRef.current = ws;

    return () => ws.close();
  }, [chatRoom]);

  const joinRoom = () => {
    if (!roomId.trim()) return;
    setChatRoom(true);
  };

  const sendMessage = () => {
    if (!input.trim() || !wsRef.current) return;

    const message: Message = {
      type: "chat",
      payload: { message: input },
      sender: "self",
    };

    wsRef.current.send(JSON.stringify(message));
    setMessages((prev) => [...prev, message]);
    setInput("");
  };

  return (
    <>
      {!chatRoom && (
        <div className="h-screen bg-black flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-white text-xl font-semibold mb-4 text-center">
              Join Room
            </h2>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Enter room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && joinRoom()}
                className="flex-1 bg-gray-800 text-white px-4 py-2 rounded outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
              <button
                onClick={joinRoom}
                className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded font-medium transition"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      )}

      {chatRoom && (
        <div className="h-screen bg-black text-white flex justify-center items-center">
          <div className="flex flex-col w-[95%] sm:[85%] md:w-[70%] lg:w-[60%] h-[90%]">
            <div className="flex-1 bg-gray-900 p-4 overflow-y-auto rounded-lg">
              {messages.map((mess, index) => (
                <div
                  key={index}
                  className={`mb-2 flex ${mess.sender === "self" ? "justify-end" : "justify-start"
                    }`}
                >
                  <div
                    className={`inline-block max-w-[70%] px-4 py-2 rounded-lg break-words ${mess.sender === "self"
                        ? "bg-blue-600 text-right"
                        : "bg-gray-800 text-left"
                      }`}
                  >
                    {mess.payload.message}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex items-center gap-2 p-3 border-t border-gray-700 bg-black mt-2 rounded-lg">
              <input
                type="text"
                placeholder="Enter your message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 bg-gray-800 text-white px-3 py-2 rounded outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded font-medium transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

export default App;
