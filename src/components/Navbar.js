
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import axios from "axios";
import actionCableConsumer from "../actionCableConsumer";

const Navbar = ({ currentUser }) => {
  const [tooltips, setTooltips] = useState({
    home: false,
    upload: false,
    chat: false,
    search: false,
    profile: false,
  });

  const [pendingInvitationsCount, setPendingInvitationsCount] = useState(0);

  const handleTooltip = (name, value) => {
    setTooltips((prevTooltips) => ({
      ...prevTooltips,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (currentUser) {
      const fetchPendingInvitations = async () => {
        try {
          const authToken = localStorage.getItem("authToken");
          const response = await axios.get(
            "https://task-test-backend.onrender.com/invitations",
            {
              headers: { Authorization: `Bearer ${authToken}` },
            }
          );
          // Filter invitations to count pending ones
          const pendingInvitations = response.data.filter(
            (invitation) => invitation.status === "pending"
          );
          setPendingInvitationsCount(pendingInvitations.length);
        } catch (error) {
          console.error("Error fetching invitations:", error);
        }
      };

      fetchPendingInvitations();
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      const cable = actionCableConsumer;

      if (!cable) {
        console.error("ActionCable consumer is not initialized.");
        return;
      }

      const channel = cable.subscriptions.create(
        { channel: "InvitationsChannel" },
        {
          received(data) {
            // Example: Update count when a new invitation arrives
            if (data.status === "pending") {
              setPendingInvitationsCount((prevCount) => prevCount + 1);
            }
          },
        }
      );

      return () => {
        channel.unsubscribe();
      };
    }
  }, [currentUser]);

  return (
    <div className="navbar-container">
      <Link
        to="/"
        className="navbar-icon"
        onMouseEnter={() => handleTooltip("home", true)}
        onMouseLeave={() => handleTooltip("home", false)}
      >
        <svg
          className="icon"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
        </svg>
        {tooltips.home && <span className="tooltip">Home</span>}
      </Link>
      <Link
        to="/create"
        className="navbar-icon"
        onMouseEnter={() => handleTooltip("upload", true)}
        onMouseLeave={() => handleTooltip("upload", false)}
      >
        <svg
          className="icon"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
            clipRule="evenodd"
          ></path>
        </svg>
        {tooltips.upload && <span className="tooltip">Upload</span>}
      </Link>
      {currentUser ? (
        <Link
          to="/invitations"
          className="navbar-icon"
          onMouseEnter={() => handleTooltip("chat", true)}
          onMouseLeave={() => handleTooltip("chat", false)}
        >
          <svg
            className="icon"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
              clipRule="evenodd"
            ></path>
          </svg>
          {pendingInvitationsCount > 0 && (
            <span className="badge-container">
              <span className="badge">{pendingInvitationsCount}</span>
            </span>
          )}
          {tooltips.chat && <span className="tooltip">Invitations</span>}
        </Link>
      ) : (
        <Link
          to="/login"
          className="navbar-icon"
          onMouseEnter={() => handleTooltip("login", true)}
          onMouseLeave={() => handleTooltip("login", false)}
        >
          <svg
            className="icon"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 9a3 3 0 11-6 0 3 3 0 016 0zm6 1a4 4 0 10-8 0 4 4 0 008 0zm4 1a2 2 0 100-4 2 2 0 000 4zm-2 2a6 6 0 100-12 6 6 0 000 12zm-5-5a1 1 0 10-2 0 1 1 0 002 0z"
              clipRule="evenodd"
            ></path>
          </svg>
          {tooltips.login && <span className="tooltip">Login/Signup</span>}
        </Link>
      )}
      <Link
        to="/friend"
        className="navbar-icon"
        onMouseEnter={() => handleTooltip("search", true)}
        onMouseLeave={() => handleTooltip("search", false)}
      >
        <svg
          className="icon"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          ></path>
        </svg>
        {tooltips.search && <span className="tooltip">Search</span>}
      </Link>
      <Link
        to="/profile"
        className="navbar-icon"
        onMouseEnter={() => handleTooltip("profile", true)}
        onMouseLeave={() => handleTooltip("profile", false)}
      >
        <svg
          className="icon"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
            clipRule="evenodd"
          ></path>
        </svg>
        {tooltips.profile && <span className="tooltip">Profile</span>}
      </Link>
    </div>
  );
};

export default Navbar;
