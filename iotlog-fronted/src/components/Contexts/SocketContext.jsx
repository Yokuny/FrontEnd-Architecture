import React, { createContext, useContext, useEffect, useState } from 'react';
import SocketIOClient from "socket.io-client";
const baseUserURLSocket = process.env.REACT_APP_URI_SOCKET;

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    const newSocket = SocketIOClient(baseUserURLSocket, {
      auth: { token },
      withCredentials: true,
      reconnection: true, // Habilitar reconexão automática
      reconnectionAttempts: 5, // Aumentar tentativas de reconexão
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
    });

    newSocket.on('connect_error', (error) => {
      // Lógica para lidar com falhas (ex.: renovar token)
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
