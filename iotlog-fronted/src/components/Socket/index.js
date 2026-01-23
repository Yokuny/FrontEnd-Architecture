import SocketIOClient from "socket.io-client";
const baseUserURLSocket = process.env.REACT_APP_URI_SOCKET;

export const CreateSocket = () => {
  const token = localStorage.getItem("token");
  return SocketIOClient(baseUserURLSocket, {
    auth: { token },
    withCredentials: true,
    reconnectionAttempts: 1,
  });
};

