import react, { useState } from "react";
import socketClient from "socket.io-client";
import "./App.css";
import Chat from "./Chat";

// Conecct socket io client to the server backend
const socket = socketClient.connect("http://localhost:3001");

const App = () => {
  const [username, setUsername] = useState("");
  const [roomChat, setRoomChat] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && roomChat !== "") {
      socket.emit("join_room", roomChat);

      // Open the room chat and turn off the form login room
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="App-form">
          <h3 className="App-logo">Thang Chat Chit</h3>
          <div className="App-content">
            <div className="App-content-textfield">
              <input
                type="text"
                placeholder="User name"
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>
            <div className="App-content-textfield">
              <input
                type="text"
                placeholder="Name room"
                onChange={(event) => setRoomChat(event.target.value)}
              />
            </div>
            <button onClick={joinRoom} type="button">
              Join Room
            </button>
          </div>
        </div>
      ) : (
        <Chat room={roomChat} socket={socket} username={username} />
      )}
    </div>
  );
};

export default App;
