import React, { useEffect, useState } from 'react';
import ChatBar from './ChatBar';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';
import '../index.css'

const ChatPage = ({ socket }) => {
  const [messages, setMessages] = useState([]);

  // listen to the message from the server and display it to all users.
  /**
   *  Socket.io listens to the messages sent via the messageResponse event and 
   * spreads the data into the messages array.
   *  The array of messages is passed into the ChatBody component for display on the UI.
   */
  useEffect(() => {
    socket.on('messageResponse', (data) => setMessages([...messages, data]));
  }, [socket, messages]);

  return (
    <div className="chat">
      <ChatBar socket={socket} />
      <div className="chat__main">
        <ChatBody messages={messages} />
        <ChatFooter socket={socket} />
      </div>
    </div>
  );
};

export default ChatPage;