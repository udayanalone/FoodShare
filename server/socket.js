const socketIo = require('socket.io');

const initializeSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-location', (location) => {
      const roomName = `location-${Math.round(location.lat)}-${Math.round(location.lng)}`;
      console.log(roomName);
      socket.join(roomName);
    });

    socket.on('food-posted', (data) => {
      const roomName = `location-${Math.round(data.location.coordinates[1])}-${Math.round(data.location.coordinates[0])}`;
      socket.to(roomName).emit('new-food-available', data);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

module.exports = initializeSocket;