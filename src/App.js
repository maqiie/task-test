

/* eslint-disable */

import React, { useState, useEffect } from "react";
import apiClient from "./services/apiService";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import CreateTask from "./components/CreateTask";
import Calendar from "./components/Calendar";
import Login from "./components/Login";
import Task from "./components/Task";
import SpecialEvents from "./components/SpecialEvents";
import UserProfile from "./components/UserProfile";
import Notifications from "./components/Notification";
import Footer from "./components/Footer";
import FriendSearch from "./components/Friend";
import Invitations from "./components/Invitations";
import Loader from "./components/Loader";
import { ActionCableProvider } from '@thrash-industries/react-actioncable-provider';
import Chat from "./components/Chat";
import './App.css'
import ChatWindow from "./components/ChatWindow";
import FriendList from "./components/FriendList";
import Message from "./components/Message";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedToken = localStorage.getItem("authToken");
      const isLoggedIn = !!storedToken;

      if (isLoggedIn) {
        try {
          const response = await apiClient.get("/auth/validate_token");
          setCurrentUser(response.data.data);
          setAuthToken(storedToken);
        } catch (error) {
          console.error("Error fetching user data:", error);
          alert("Error fetching user data. Please try again.");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchInvitations = async () => {
      if (currentUser && authToken) {
        try {
          const response = await apiClient.get("/invitations");
          setInvitations(response.data);
        } catch (error) {
          console.error("Error fetching invitations:", error);
          alert("Error fetching invitations. Please try again.");
        }
      }
    };

    fetchInvitations();
  }, [currentUser, authToken]);

  const invitationsCount = invitations.length;

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setCurrentUser(null);
    setAuthToken(null); // Ensure authToken is also cleared
  };

  return (
    <ActionCableProvider url="wss://localhost:3001/cable">
      <Router>
        {/* <Navbar currentUser={currentUser} onLogout={handleLogout} invitationsCount={invitationsCount} /> */}
        <Notifications currentUser={currentUser} />
        {loading ? (
          <Loader />
        ) : (
          <Routes>
            <Route path="/" element={<Home currentUser={currentUser} />} />
            <Route path="/create/*" element={currentUser ? <CreateTask /> : <Navigate to="/login" />} />
            <Route path="/calendar/*" element={<Calendar />} />
            <Route path="/login/*" element={<Login />} />
            <Route path="/tasks" element={currentUser ? <Task /> : <Navigate to="/login" />} />
            <Route path="/special" element={<SpecialEvents />} />
            <Route path="/profile" element={<UserProfile userData={currentUser} onLogout={handleLogout} />} />
            <Route path="/friend" element={<FriendSearch userData={currentUser} />} />
            <Route path="/invitations" element={<Invitations currentUser={currentUser} />} />
            <Route path="/loader" element={<Loader />} />
            <Route path="/chat" element={<Chat currentUser={currentUser} authToken={authToken} />} />
            </Routes>
        )}
        {/* <Footer /> */}
      </Router>
    </ActionCableProvider>
  );
}

export default App;
