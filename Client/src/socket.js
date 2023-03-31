import { io } from 'socket.io-client';


const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000';

export const socket = io(URL);

//During development, you need to enable CORS on your server: