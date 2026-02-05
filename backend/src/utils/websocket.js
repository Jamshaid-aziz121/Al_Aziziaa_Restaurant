const http = require('http');
const socketIo = require('socket.io');

let io = null;

const initializeWebSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle incoming messages
    socket.on('message', (data) => {
      try {
        const parsedData = JSON.parse(data);

        if (parsedData.type === 'join-order-room') {
          // Join order tracking room using the tracking ID
          // The frontend sends the actual tracking ID, so we need to join "tracking-{trackingId}" room
          const roomName = `tracking-${parsedData.orderId}`;
          socket.join(roomName);
          console.log(`User joined order room: ${roomName}`);
        } else if (parsedData.type === 'join-reservation-room') {
          socket.join(parsedData.reservationId);
          console.log(`User joined reservation room: ${parsedData.reservationId}`);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    // Handle order status updates
    socket.on('join-order-room', (orderId) => {
      socket.join(`order-${orderId}`);
      console.log(`User joined order room: ${orderId}`);
    });

    // Handle reservation updates
    socket.on('join-reservation-room', (reservationId) => {
      socket.join(`reservation-${reservationId}`);
      console.log(`User joined reservation room: ${reservationId}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

const emitOrderStatusUpdate = (orderId, statusData) => {
  if (io) {
    // Emit to specific order room (using the same format as frontend expects)
    io.to(`tracking-${orderId}`).emit('message', JSON.stringify({
      type: 'order-status-update',
      status: statusData.status,
      timestamp: statusData.timestamp,
      notes: statusData.notes,
      updatedBy: statusData.updatedBy
    }));

    // Also emit to the legacy room name for compatibility
    io.to(`order-${orderId}`).emit('order-status-update', statusData);
    io.emit('global-order-update', { orderId, ...statusData });
  }
};

const emitReservationUpdate = (reservationId, reservationData) => {
  if (io) {
    io.to(`reservation-${reservationId}`).emit('reservation-update', reservationData);
  }
};

module.exports = {
  initializeWebSocket,
  emitOrderStatusUpdate,
  emitReservationUpdate,
};