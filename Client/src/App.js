import socketIO from 'socket.io-client';
const socket = socketIO.connect('http://localhost:4000'); //connecting react app to socket server 

function App() {
  return (
    <div>
      <p>Hello World!</p>
    </div>
  );
}

export default App;