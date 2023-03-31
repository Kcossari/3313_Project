const express = require('express');
const app = express();
const PORT = 4000;

//New imports
const http = require('http').Server(app);
const cors = require('cors');

app.use(cors());

//Next, add Socket.io to the project to create a real-time connection. 
const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});



//establishes a connection with the React app
//then creates a unique ID for each socket and logs the ID to the console whenever a user visits the web page.
socketIO.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  //sends the message to all the users on the server
  socket.on('message', (data) => {
    socketIO.emit('messageResponse', data);
  });

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Hello world',
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});