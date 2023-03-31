import React, { useState } from 'react';
import '../index.css'

const ChatFooter = ({ socket }) => {
  const [message, setMessage] = useState('');

  //send the message to the Node.js server.
  //function checks if the text field is empty and
  //if the username exists in the local storage (sign-in from the Home page) before sending the message event containing the user input,
  // username, the message ID generated, and the socket or client ID to the Node.js server.
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && localStorage.getItem('userName')) {
      socket.emit('message', {
        text: message,
        name: localStorage.getItem('userName'),
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id,
      });
    }
    setMessage('');
  };
  return <div className="chat__footer">...</div>;
};

export default ChatFooter;