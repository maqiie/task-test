
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import consumer from "../actionCableConsumer"; // Ensure correct path to actionCableConsumer
import { FaCheck, FaTimes, FaCalendarAlt } from "react-icons/fa";

const Invitations = ({ currentUser }) => {
  const [invitations, setInvitations] = useState([]);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    const fetchInvitations = async () => {
      try {
        const response = await axios.get("http://localhost:3001/invitations", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setInvitations(response.data);
      } catch (error) {
        console.error("Error fetching invitations:", error);
        toast.error("Error fetching invitations");
      }
    };

    fetchInvitations();

    const subscription = consumer.subscriptions.create(
      { channel: "InvitationsChannel", user_id: currentUser.id },
      {
        received(data) {
          console.log("Received data from invitations channel:", data);
          if (data.invitation) {
            setInvitations((prevInvitations) => [
              ...prevInvitations,
              data.invitation,
            ]);
          }
        },
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [currentUser.id]);

  const handleAccept = async (invitationId) => {
    try {
      await updateInvitationStatus(invitationId, "accept");
      setInvitations((prevInvitations) =>
        prevInvitations.filter((invitation) => invitation.id !== invitationId)
      );
      toast.success("Invitation accepted");
    } catch (error) {
      console.error("Error accepting invitation:", error);
      toast.error("Error accepting invitation");
    }
  };

  const handleDecline = async (invitationId) => {
    try {
      await updateInvitationStatus(invitationId, "decline");
      setInvitations((prevInvitations) =>
        prevInvitations.filter((invitation) => invitation.id !== invitationId)
      );
      toast.success("Invitation declined");
    } catch (error) {
      console.error("Error declining invitation:", error);
      toast.error("Error declining invitation");
    }
  };

  const handleReschedule = async (invitationId) => {
    toast.info("Reschedule functionality not yet implemented");
    // Implement reschedule logic here
  };

  const updateInvitationStatus = async (invitationId, action) => {
    const authToken = localStorage.getItem("authToken");
    try {
      await axios.post(
        `http://localhost:3001/invitations/${invitationId}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
    } catch (error) {
      throw new Error(`Error ${action}ing invitation: ${error.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Invitations</h2>
      {invitations.length === 0 ? (
        <p className="text-gray-600">No invitations</p>
      ) : (
        invitations.map((invitation) => (
          <div
            key={invitation.id}
            className="bg-white shadow-md rounded-lg border border-gray-200 p-4 mb-4"
          >
            <div className="mb-4">
              <p className="text-lg font-semibold">From: {invitation.sender.name}</p>
              <p className="text-sm text-gray-500">Email: {invitation.sender.email}</p>
            </div>
            <div className="mb-4">
              <p className="text-lg font-semibold">Title: {invitation.reminder.title}</p>
              <p className="text-sm text-gray-500">Location: {invitation.reminder.location}</p>
              <p className="text-sm text-gray-500">Description: {invitation.reminder.description}</p>
              <p className="text-sm text-gray-500">Due Date: {invitation.reminder.due_date}</p>
            </div>
            <div className="flex space-x-4">
              <button
                className="button-accept"
                onClick={() => handleAccept(invitation.id)}
              >
                <FaCheck className="mr-2" />
                Accept
              </button>
              <button
                className="button-decline"
                onClick={() => handleDecline(invitation.id)}
              >
                <FaTimes className="mr-2" />
                Decline
              </button>
              <button
                className="button-reschedule"
                onClick={() => handleReschedule(invitation.id)}
              >
                <FaCalendarAlt className="mr-2" />
                Reschedule
              </button>
            </div>
          </div>
        ))
      )}
      <ToastContainer />
    </div>
  );
};

export default Invitations;
