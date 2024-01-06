import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';

import { Server } from 'socket.io';

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  // console.log(`User connected  ${socket.id}`);

  socket.on('join_room', (data) => {
    socket.join(data);
    console.log(`User with ID:${socket.id} Joined room: ${data}`);
  });

  socket.on('send_message', async (data) => {
    socket.to(data.room).emit('get_message', data);
  });

  socket.on('disconnect', () => {
    // console.log('User disconnected', socket.id);
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => console.log('server is running on port 5000'));
