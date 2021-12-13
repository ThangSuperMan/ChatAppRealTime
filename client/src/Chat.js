import react, { useState, useEffect, useRef } from "react";
import "./Chat.css";

const Chat = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [listMessages, setListMessages] = useState([]);

  // Query selectors
  const bodyContentMessageRef = useRef();

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        author: username,
        room: room,
        message: currentMessage,
        time: new Date().getHours() + ":" + new Date().getMinutes(),
      };
      await socket.emit("send_message", messageData);

      // Save the current message and display on the app
      setListMessages((list) => [...list, messageData]);
    }

    // Clean the current message after user send message
    setCurrentMessage("");
  };

  useEffect(() => {
    // Always listenning the event when backend trigger the event emit
    socket.on("receive_message", (data) => {
      // Get all value of list messages and add new message to the old array
      setListMessages((list) => [...list, data]);
    });
  }, []);

  return (
    <div className="Chat">
      <div className="Chat-header">
        <h3>Live Chat</h3>
      </div>
      <div className="Chat-body" ref={bodyContentMessageRef}>
        {listMessages.map((messageContent) => {
          return (
            <div
              className="message-container"
              id={username === messageContent.author ? "your" : "other"}
            >
              <span
                className="message-content"
                id={username === messageContent.author ? "your" : "other"}
              >
                {messageContent.message}
              </span>
              <div>
                <time className="message-time">{messageContent.time}</time>
                <h4 className="message-author">{messageContent.author}</h4>
              </div>
            </div>
          );
        })}
      </div>
      <div className="Chat-footer">
        <input
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          value={currentMessage}
          type="text"
          placeholder="Hey..."
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
};

export default Chat;
