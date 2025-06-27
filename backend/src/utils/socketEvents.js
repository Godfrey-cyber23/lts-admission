module.exports = (io) => {
  const emitToRoom = (room, event, data) => {
    io.to(room).emit(event, data);
  };

  const emitToAll = (event, data) => {
    io.emit(event, data);
  };

  return {
    emitToRoom,
    emitToAll
  };
};

const socketEvents = (io) => {
  const emitToRoom = (room, event, data) => {
    io.to(room).emit(event, data);
  };

  const emitToAll = (event, data) => {
    io.emit(event, data);
  };

  return {
    emitToRoom,
    emitToAll
  };
};

export default socketEvents;