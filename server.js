const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let countdownInterval;
let countdownValue = 15;

app.use(express.static('public'));

io.on('connection', (socket) => {
  // Emit the initial countdown value to the client
  socket.emit('countdown', countdownValue);
  
  // Handle button click from admin
  socket.on('startCountdown', () => {
    clearInterval(countdownInterval); // Clear any existing countdown
    countdownValue = 15; // Reset countdown value
    countdownInterval = setInterval(() => {
      countdownValue--;
      io.emit('countdown', countdownValue); // Emit countdown value to all clients
      if (countdownValue <= 0) {
        clearInterval(countdownInterval);
      }
    }, 1000);
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
