import { io, Socket } from "socket.io-client";

let socket = null;

/**
 * Connect to the Socket.IO server
 * @param serverUrl - The URL of the Socket.IO server
 * @returns {Socket} - The connected Socket instance
 */
export const connectSocket = () => {
  socket = io("http://10.0.70.188:5000/");

  socket.on("connect", () => {
    console.log("Connected to the socket server");
  });

  socket.on("disconnect", () => {
    // console.log('Disconnected from the socket server');
  });

  return socket;
};

/**
 * Get the current Socket.IO instance
 * @returns {Socket | null} - The Socket instance or null if not connected
 */
export const getSocket = () => socket;
