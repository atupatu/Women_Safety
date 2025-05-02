import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userStr = await AsyncStorage.getItem("userData");
        const userData = JSON.parse(userStr);
        if (userData && userData.name) {
          setUserName(userData.name);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();

    const newSocket = io("https://normal-joint-hamster.ngrok-free.app");
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (socket && userName) {
      socket.emit("joinRoom", userName);
    }
  }, [socket, userName]); // Emit only after both socket and userName are ready

  return (
    <SocketContext.Provider value={{ socket, userName }}>
      {children}
    </SocketContext.Provider>
  );
};