import { createContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const [socket, setSocket] = useState(null);

  // Check User Authentication
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      // console.log(data);
      
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      console.log(error.message);
      // toast.error(error.message);
    }
  };

  // login function
  const login = async (state, credential) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credential);
      if (data.success) {
        setAuthUser(data.userData);
        connectSocket(data.userData);
        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  // Logout function
  const logout = async () => {
    localStorage.removeItem("token");
    setAuthUser(null);
    setToken(null);
    setOnlineUser([]);
    axios.defaults.headers.common["token"] = null;
    toast.success("Logged out successfully");
    socket.disconnect();
  };

  // update function
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put(`/api/auth/update-profile`, body);
      console.log({Data:data,Body:body});
      
      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile Updated");
      }
    } catch (error) {
      console.log(error.message,"Error");
      toast.error(error.message);
    }
  };

  // Connect Socket
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;
    const newSocket = io(backendUrl, {
      query: {
        userId: userData._id,
      },
    });
    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userId) => {
      setOnlineUser(userId);
    });
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
    }
    checkAuth();
  }, []);
  const value = { axios, authUser, onlineUser, socket, login,logout,updateProfile };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
