
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import consumer from "../actionCableConsumer";
// import { FaCheck, FaTimes, FaCalendarAlt } from "react-icons/fa";

// const Invitations = ({ currentUser }) => {
//   const [pendingInvitations, setPendingInvitations] = useState([]);
//   const [invitationHistory, setInvitationHistory] = useState([]);
//   const [historyPage, setHistoryPage] = useState(1);
//   const [historyLimit] = useState(4);
//   const [hasMoreHistory, setHasMoreHistory] = useState(true);

//   const authToken = localStorage.getItem("authToken");

//   useEffect(() => {
//     if (!currentUser) {
//       console.error("Current user is not defined");
//       toast.error("Current user is not defined");
//       return;
//     }

//     fetchInvitations();
//     const subscription = consumer.subscriptions.create(
//       { channel: "InvitationsChannel", user_id: currentUser.id },
//       {
//         received(data) {
//           console.log("Received data from invitations channel:", data);
//           if (data.invitation) {
//             if (data.invitation.status === 'pending') {
//               setPendingInvitations((prevInvitations) => [
//                 ...prevInvitations,
//                 data.invitation,
//               ]);
//             } else {
//               setInvitationHistory((prevHistory) => [
//                 ...prevHistory,
//                 data.invitation,
//               ]);
//             }
//           }
//         },
//       }
//     );

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, [currentUser]);

//   const fetchInvitations = async () => {
//     try {
//       const response = await axios.get(`https://task-test-backend.onrender.com/invitations`, {
//         headers: { Authorization: `Bearer ${authToken}` },
//       });

//       const invitations = response.data;
//       setPendingInvitations(invitations.filter(invitation => invitation.status === 'pending'));
//       setInvitationHistory(invitations.filter(invitation => invitation.status === 'accepted' || invitation.status === 'declined'));
//     } catch (error) {
//       console.error("Error fetching invitations:", error);
//       toast.error("Error fetching invitations");
//     }
//   };

//   const handleAccept = async (invitationId) => {
//     try {
//       await updateInvitationStatus(invitationId, "accept");
//       moveToHistory(invitationId, "accepted");
//       toast.success("Invitation accepted");
//     } catch (error) {
//       console.error("Error accepting invitation:", error);
//       toast.error("Error accepting invitation");
//     }
//   };

//   const handleDecline = async (invitationId) => {
//     try {
//       await updateInvitationStatus(invitationId, "decline");
//       moveToHistory(invitationId, "declined");
//       toast.success("Invitation declined");
//     } catch (error) {
//       console.error("Error declining invitation:", error);
//       toast.error("Error declining invitation");
//     }
//   };

//   const handleReschedule = async (invitationId) => {
//     toast.info("Reschedule functionality not yet implemented");
//     // Implement reschedule logic here
//   };

//   const moveToHistory = (invitationId, status) => {
//     const movedInvitation = pendingInvitations.find((invitation) => invitation.id === invitationId);
//     if (movedInvitation) {
//       setPendingInvitations((prevInvitations) =>
//         prevInvitations.filter((invitation) => invitation.id !== invitationId)
//       );

//       const updatedHistory = [
//         ...invitationHistory,
//         { ...movedInvitation, status },
//       ];
//       setInvitationHistory(updatedHistory);
//       localStorage.setItem("invitationHistory", JSON.stringify(updatedHistory));
//     }
//   };

//   const updateInvitationStatus = async (invitationId, action) => {
//     try {
//       await axios.post(
//         `https://task-test-backend.onrender.com/invitations/${invitationId}/${action}`,
//         {},
//         { headers: { Authorization: `Bearer ${authToken}` } }
//       );
//     } catch (error) {
//       throw new Error(`Error ${action}ing invitation: ${error.message}`);
//     }
//   };

//   const handleLoadMoreHistory = () => {
//     const nextPage = historyPage + 1;
//     setHistoryPage(nextPage);
//     setHasMoreHistory(nextPage * historyLimit < invitationHistory.length);
//   };

//   const paginatedHistory = invitationHistory.slice(0, historyPage * historyLimit);

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8">
//       <h2 className="text-3xl font-bold mb-6 text-gray-900">Pending Invitations</h2>
//       {pendingInvitations.length === 0 ? (
//         <p className="text-gray-600">No pending invitations</p>
//       ) : (
//         pendingInvitations.map((invitation) => (
//           <div
//             key={invitation.id}
//             className="bg-white shadow-lg rounded-lg border border-gray-300 p-4 mb-6 transition-transform transform hover:scale-105 w-full md:w-96 mx-auto"
//           >
//             <div className="flex items-center mb-4">
//               <div className="flex-shrink-0 w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center mr-4">
//                 <FaCalendarAlt className="text-blue-500 text-xl" />
//               </div>
//               <div>
//                 <p className="text-lg font-semibold text-gray-900">{invitation.sender?.name || 'Unknown'}</p>
//                 <p className="text-sm text-gray-600">{invitation.sender?.email || 'Unknown'}</p>
//               </div>
//             </div>
//             <div className="mb-4">
//               <p className="text-lg font-semibold text-gray-800">Title: {invitation.reminder?.title || 'No Title'}</p>
//               <p className="text-sm text-gray-600">Location: {invitation.reminder?.location || 'No Location'}</p>
//               <p className="text-sm text-gray-600">Description: {invitation.reminder?.description || 'No Description'}</p>
//               <p className="text-sm text-gray-600">Due Date: {invitation.reminder?.due_date ? new Date(invitation.reminder.due_date).toLocaleDateString() : 'No Due Date'}</p>
//             </div>
//             <div className="flex space-x-4">
//               <button
//                 className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center"
//                 onClick={() => handleAccept(invitation.id)}
//               >
//                 <FaCheck className="mr-2" />
//                 Accept
//               </button>
//               <button
//                 className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center"
//                 onClick={() => handleDecline(invitation.id)}
//               >
//                 <FaTimes className="mr-2" />
//                 Decline
//               </button>
//             </div>
//           </div>
//         ))
//       )}

//       <h2 className="text-3xl font-bold mb-6 mt-8 text-gray-900">Invitation History</h2>
//       {paginatedHistory.length === 0 ? (
//         <p className="text-gray-600">No invitation history</p>
//       ) : (
//         paginatedHistory.map((invitation) => (
//           <div
//             key={invitation.id}
//             className="bg-gray-100 shadow-lg rounded-lg border border-gray-300 p-4 mb-6 transition-transform transform hover:scale-105 w-full md:w-96 mx-auto"
//           >
//             <div className="flex items-center mb-4">
//               <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4">
//                 <FaCalendarAlt className="text-gray-500 text-xl" />
//               </div>
//               <div>
//                 <p className="text-lg font-semibold text-gray-900">{invitation.sender?.name || 'Unknown'}</p>
//                 <p className="text-sm text-gray-600">{invitation.sender?.email || 'Unknown'}</p>
//               </div>
//             </div>
//             <div className="mb-4">
//               <p className="text-lg font-semibold text-gray-800">Title: {invitation.reminder?.title || 'No Title'}</p>
//               <p className="text-sm text-gray-600">Location: {invitation.reminder?.location || 'No Location'}</p>
//               <p className="text-sm text-gray-600">Description: {invitation.reminder?.description || 'No Description'}</p>
//               <p className="text-sm text-gray-600">Due Date: {invitation.reminder?.due_date ? new Date(invitation.reminder.due_date).toLocaleDateString() : 'No Due Date'}</p>
//               <p className="text-sm text-gray-600">Status: {invitation.status}</p>
//             </div>
//           </div>
//         ))
//       )}

//       {hasMoreHistory && (
//         <button
//           className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors mt-4 block mx-auto"
//           onClick={handleLoadMoreHistory}
//         >
//           Load More History
//         </button>
//       )}

//       <ToastContainer />
//     </div>
//   );
// };

// export default Invitations;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import consumer from "../actionCableConsumer";
import { FaCheck, FaTimes, FaCalendarAlt } from "react-icons/fa";

const Invitations = ({ currentUser }) => {
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [invitationHistory, setInvitationHistory] = useState([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyLimit] = useState(4);
  const [hasMoreHistory, setHasMoreHistory] = useState(true);

  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    if (!currentUser) {
      console.error("Current user is not defined");
      toast.error("Current user is not defined");
      return;
    }

    fetchInvitations();
    const subscription = consumer.subscriptions.create(
      { channel: "InvitationsChannel", user_id: currentUser.id },
      {
        received(data) {
          console.log("Received data from invitations channel:", data);
          if (data.invitation) {
            if (data.invitation.status === 'pending') {
              setPendingInvitations((prevInvitations) => [
                ...prevInvitations,
                data.invitation,
              ]);
            } else {
              setInvitationHistory((prevHistory) => [
                ...prevHistory,
                data.invitation,
              ]);
            }
          }
        },
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [currentUser]);

  const fetchInvitations = async () => {
    try {
      const response = await axios.get(`https://task-test-backend.onrender.com/invitations`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const invitations = response.data;
      setPendingInvitations(invitations.filter(invitation => invitation.status === 'pending'));
      setInvitationHistory(invitations.filter(invitation => invitation.status === 'accepted' || invitation.status === 'declined'));
    } catch (error) {
      console.error("Error fetching invitations:", error);
      toast.error("Error fetching invitations");
    }
  };

  const handleAccept = async (invitationId) => {
    try {
      await updateInvitationStatus(invitationId, "accept");
      moveToHistory(invitationId, "accepted");
      toast.success("Invitation accepted");
    } catch (error) {
      console.error("Error accepting invitation:", error);
      toast.error("Error accepting invitation");
    }
  };

  const handleDecline = async (invitationId) => {
    try {
      await updateInvitationStatus(invitationId, "decline");
      moveToHistory(invitationId, "declined");
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

  const moveToHistory = (invitationId, status) => {
    const movedInvitation = pendingInvitations.find((invitation) => invitation.id === invitationId);
    if (movedInvitation) {
      setPendingInvitations((prevInvitations) =>
        prevInvitations.filter((invitation) => invitation.id !== invitationId)
      );

      const updatedHistory = [
        ...invitationHistory,
        { ...movedInvitation, status },
      ];
      setInvitationHistory(updatedHistory);
      localStorage.setItem("invitationHistory", JSON.stringify(updatedHistory));
    }
  };

  const updateInvitationStatus = async (invitationId, action) => {
    try {
      await axios.post(
        `https://task-test-backend.onrender.com/invitations/${invitationId}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
    } catch (error) {
      throw new Error(`Error ${action}ing invitation: ${error.message}`);
    }
  };

  const handleLoadMoreHistory = () => {
    const nextPage = historyPage + 1;
    setHistoryPage(nextPage);
    setHasMoreHistory(nextPage * historyLimit < invitationHistory.length);
  };

  const paginatedHistory = invitationHistory.slice(0, historyPage * historyLimit);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Pending Invitations</h2>
      {pendingInvitations.length === 0 ? (
        <p className="text-gray-600">No pending invitations</p>
      ) : (
        pendingInvitations.map((invitation) => (
          <div
            key={invitation.id}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg rounded-lg border border-gray-300 p-4 mb-6 transition-transform transform hover:scale-105 w-full md:w-96 mx-auto"
          >
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center mr-4">
                <FaCalendarAlt className="text-purple-500 text-xl" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white">{invitation.sender?.name || 'Unknown'}</p>
                <p className="text-sm text-gray-200">{invitation.sender?.email || 'Unknown'}</p>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-lg font-semibold text-white">Title: {invitation.reminder?.title || 'No Title'}</p>
              <p className="text-sm text-gray-200">Location: {invitation.reminder?.location || 'No Location'}</p>
              <p className="text-sm text-gray-200">Description: {invitation.reminder?.description || 'No Description'}</p>
              <p className="text-sm text-gray-200">Due Date: {invitation.reminder?.due_date ? new Date(invitation.reminder.due_date).toLocaleDateString() : 'No Due Date'}</p>
            </div>
            <div className="flex space-x-4">
              <button
                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center"
                onClick={() => handleAccept(invitation.id)}
              >
                <FaCheck className="mr-2" />
                Accept
              </button>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center"
                onClick={() => handleDecline(invitation.id)}
              >
                <FaTimes className="mr-2" />
                Decline
              </button>
            </div>
          </div>
        ))
      )}

      <h2 className="text-3xl font-bold mb-6 mt-8 text-gray-900">Invitation History</h2>
      {paginatedHistory.length === 0 ? (
        <p className="text-gray-600">No invitation history</p>
      ) : (
        paginatedHistory.map((invitation) => (
          <div
            key={invitation.id}
            className="bg-gray-100 shadow-lg rounded-lg border border-gray-300 p-4 mb-6 transition-transform transform hover:scale-105 w-full md:w-96 mx-auto"
          >
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                <FaCalendarAlt className="text-gray-500 text-xl" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">{invitation.sender?.name || 'Unknown'}</p>
                <p className="text-sm text-gray-600">{invitation.sender?.email || 'Unknown'}</p>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-lg font-semibold text-gray-800">Title: {invitation.reminder?.title || 'No Title'}</p>
              <p className="text-sm text-gray-600">Location: {invitation.reminder?.location || 'No Location'}</p>
              <p className="text-sm text-gray-600">Description: {invitation.reminder?.description || 'No Description'}</p>
              <p className="text-sm text-gray-600">Due Date: {invitation.reminder?.due_date ? new Date(invitation.reminder.due_date).toLocaleDateString() : 'No Due Date'}</p>
              <p className="text-sm text-gray-600">Status: {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}</p>
            </div>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
              onClick={() => handleReschedule(invitation.id)}
            >
              <FaCalendarAlt className="mr-2" />
              Reschedule
            </button>
          </div>
        ))
      )}

      {hasMoreHistory && (
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors mt-4"
          onClick={handleLoadMoreHistory}
        >
          Load More
        </button>
      )}
      <ToastContainer />
    </div>
  );
};

export default Invitations;
