import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./Friend.css";
import { Transition } from "@headlessui/react";

const FriendSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [relationshipCategory, setRelationshipCategory] = useState("friend");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false); // New state to manage dropdown visibility
  const [selectedFriendId, setSelectedFriendId] = useState(null); // New state to track selected friend ID
  const authToken = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      handleSearch();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchSentRequests(userId);
    fetchReceivedRequests(userId);
    fetchAcceptedRequests(userId);
  }, [userId]);

  const addNotification = (message) => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      { id: Date.now(), message },
    ]);
  };

  // Function to remove a notification after a delay
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (notifications.length > 0) {
        setNotifications((prevNotifications) => prevNotifications.slice(1));
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [notifications]);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const response = await fetch(
        `http://localhost:3001/users/search?email=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const data = await response.json();
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error searching for friends:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const fetchSentRequests = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/friend_requests/${userId}/sent`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const data = await response.json();
      setSentRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching sent requests:", error);
      setSentRequests([]);
    }
  };

  const fetchReceivedRequests = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/friend_requests/${userId}/received`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const data = await response.json();
      const pendingRequests = data.filter((request) => request.status === null);
      setReceivedRequests(pendingRequests);
    } catch (error) {
      console.error("Error fetching received requests:", error);
      setReceivedRequests([]);
    }
  };

  const fetchAcceptedRequests = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/friend_requests/${userId}/accepted`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Make sure authToken is defined
          },
        }
      );
      const data = await response.json();
      console.log("Received data:", data); // Add this console log to see the data received
      setAcceptedRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching accepted requests:", error);
      setAcceptedRequests([]);
    }
  };

  // const fetchAcceptedRequests = async (userId) => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:3001/friend_requests/${userId}/accepted`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${authToken}`, // Make sure authToken is defined
  //         },
  //       }
  //     );
  //     const data = await response.json();
  //     setAcceptedRequests(Array.isArray(data) ? data : []);

  //     // Logging accepted users and their relationship categories
  //     console.log("Accepted Requests:", data);
  //   } catch (error) {
  //     console.error("Error fetching accepted requests:", error);
  //     setAcceptedRequests([]);
  //   }
  // };
  useEffect(() => {
    fetchAcceptedRequests(userId);
  }, [userId]); // Fetch data whenever userId changes

  const isFriend = (userId) => {
    return acceptedRequests.some(
      (request) =>
        request.sender_id === userId || request.receiver_id === userId
    );
  };

  const isRequestSent = (userId) => {
    return sentRequests.some((request) => request.receiver_id === userId);
  };

  const handleSendRequest = async () => {
    if (!selectedFriendId) return;
    try {
      const response = await fetch("http://localhost:3001/friend_requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          receiver_id: selectedFriendId,
          relationship_category: relationshipCategory, // Use the selected relationship category
        }),
      });
      if (response.ok) {
        fetchSentRequests(userId);
        setShowCategoryDropdown(false); // Hide dropdown after sending request
        setSelectedFriendId(null); // Reset selected friend ID
      } else {
        console.error("Failed to send friend request:", response.statusText);
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
    addNotification("Friend request sent!");
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/friend_requests/${requestId}/accept`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.ok) {
        const acceptedRequest = receivedRequests.find(
          (request) => request.id === requestId
        );
        setReceivedRequests(
          receivedRequests.filter((request) => request.id !== requestId)
        );
        setAcceptedRequests([...acceptedRequests, acceptedRequest]);
      } else {
        console.error("Failed to accept friend request:", response.statusText);
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleDeclineRequest = async (requestId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/friend_requests/${requestId}/decline`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.ok) {
        setReceivedRequests(
          receivedRequests.filter((request) => request.id !== requestId)
        );
      } else {
        console.error("Failed to decline friend request:", response.statusText);
      }
    } catch (error) {
      console.error("Error declining friend request:", error);
    }
    addNotification("Friend request declined!");
  };

  const SentFriendRequests = ({ sentRequests }) => {
    const [showAll, setShowAll] = useState(false);

    const pendingRequests = sentRequests.filter(
      (request) => request.status === null
    );
    const otherRequests = sentRequests.filter(
      (request) => request.status !== null
    );

    const handleToggle = () => {
      setShowAll(!showAll);
    };

    return (
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3 text-indigo-700">
          Sent Friend Requests
        </h2>
        {pendingRequests.length === 0 && otherRequests.length === 0 ? (
          <p className="text-gray-500">No sent friend requests</p>
        ) : (
          <>
            {pendingRequests.map((request) => (
              <div key={request.id} className="border-b border-gray-300 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-gray-700 font-semibold">
                      {request.receiver.name
                        ? request.receiver.name
                        : "Name not available"}
                    </span>
                    <br />
                    <span className="text-gray-600">
                      {request.receiver.email}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-yellow-500 font-semibold">
                      Pending
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {showAll && (
              <>
                {otherRequests.map((request) => (
                  <div
                    key={request.id}
                    className="border-b border-gray-300 py-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-700 font-semibold">
                          {request.receiver.name
                            ? request.receiver.name
                            : "Name not available"}
                        </span>
                        <br />
                        <span className="text-gray-600">
                          {request.receiver.email}
                        </span>
                      </div>
                      <div className="mt-2">
                        {request.status === "accepted" && (
                          <span className="text-green-500 font-semibold">
                            Accepted
                          </span>
                        )}
                        {request.status === "declined" && (
                          <span className="text-red-500 font-semibold">
                            Declined
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
            <button
              onClick={handleToggle}
              className="mt-3 text-blue-500 hover:underline"
            >
              {showAll ? "Show less" : "Show all"}
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col space-y-6 max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <div>
        <h1 className="text-2xl font-bold text-center mb-4 text-indigo-700">
          Friend Search
        </h1>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search by email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="p-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-3 text-indigo-700">
          Search Results
        </h2>
        {searchResults.length === 0 ? (
          <p className="text-gray-500">No users found</p>
        ) : (
          <ul className="divide-y divide-gray-300">
            {searchResults.map((user) => (
              <li
                key={user.id}
                className="py-3 flex justify-between items-center"
              >
                <div>
                  <p className="text-gray-700 font-semibold">{user.name}</p>
                  <p className="text-gray-600">{user.email}</p>
                </div>
                {isFriend(user.id) ? (
                  <p className="text-green-500 font-semibold">Friend</p>
                ) : isRequestSent(user.id) ? (
                  <p className="text-yellow-500 font-semibold">Request Sent</p>
                ) : (
                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowCategoryDropdown(true);
                        setSelectedFriendId(user.id); // Set selected friend ID
                      }}
                      className="p-2 cursor-pointer text-white font-bold relative text-[14px] w-[9em] h-[3em] text-center bg-gradient-to-r from-violet-500 from-10% via-sky-500 via-30% to-pink-500 to-90% bg-[length:400%] rounded-[30px] z-10 hover:animate-gradient-xy hover:bg-[length:100%] before:content-[''] before:absolute before:-top-[5px] before:-bottom-[5px] before:-left-[5px] before:-right-[5px] before:bg-gradient-to-r before:from-violet-500 before:from-10% before:via-sky-500 before:via-30% before:to-pink-500 before:bg-[length:400%] before:-z-10 before:rounded-[35px] before:hover:blur-xl before:transition-all before:ease-in-out before:duration-[1s] before:hover:bg-[length:10%] active:bg-violet-700 focus:ring-violet-700text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
                    >
                      Add Friend
                    </button>
                    {showCategoryDropdown && selectedFriendId === user.id && (
                      <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                        <div
                          className="py-1"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="options-menu"
                        >
                          <button
                            className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${
                              relationshipCategory === "friend"
                                ? "bg-gray-100"
                                : ""
                            }`}
                            onClick={() => setRelationshipCategory("friend")}
                          >
                            <div className="flex items-center">
                              <span className="mr-2">
                                <FontAwesomeIcon
                                  icon={faCheck}
                                  className={
                                    relationshipCategory === "friend"
                                      ? "text-gray-700"
                                      : "text-transparent"
                                  }
                                />
                              </span>
                              Friend
                            </div>
                          </button>
                          <button
                            className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${
                              relationshipCategory === "family"
                                ? "bg-gray-100"
                                : ""
                            }`}
                            onClick={() => setRelationshipCategory("family")}
                          >
                            <div className="flex items-center">
                              <span className="mr-2">
                                <FontAwesomeIcon
                                  icon={faCheck}
                                  className={
                                    relationshipCategory === "family"
                                      ? "text-gray-700"
                                      : "text-transparent"
                                  }
                                />
                              </span>
                              Family
                            </div>
                          </button>
                          <button
                            className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${
                              relationshipCategory === "colleague"
                                ? "bg-gray-100"
                                : ""
                            }`}
                            onClick={() => setRelationshipCategory("colleague")}
                          >
                            <div className="flex items-center">
                              <span className="mr-2">
                                <FontAwesomeIcon
                                  icon={faCheck}
                                  className={
                                    relationshipCategory === "colleague"
                                      ? "text-gray-700"
                                      : "text-transparent"
                                  }
                                />
                              </span>
                              Colleague
                            </div>
                          </button>
                        </div>
                        <div className="border-t border-gray-200">
                          <button
                            onClick={handleSendRequest}
                            className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 focus:outline-none"
                          >
                            Send Request
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      {notifications.map((notification) => (
        <Transition
          key={notification.id}
          show={true}
          enter="transition ease-out duration-300"
          enterFrom="transform opacity-0 translate-y-4"
          enterTo="transform opacity-100 translate-y-0"
          leave="transition ease-in duration-300"
          leaveFrom="transform opacity-100 translate-y-0"
          leaveTo="transform opacity-0 translate-y-4"
        >
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-md">
            {notification.message}
          </div>
        </Transition>
      ))}

      <div>
        <h2 className="text-lg font-semibold mb-3 text-indigo-700">
          Received Friend Requests
        </h2>
        {receivedRequests.length === 0 ? (
          <p className="text-gray-500">No friend requests</p>
        ) : (
          <ul className="divide-y divide-gray-300">
            {receivedRequests.map((request) => (
              <li
                key={request.id}
                className="py-3 flex justify-between items-center"
              >
                <div>
                  <p className="text-gray-700 font-semibold">
                    {request.sender.name}
                  </p>
                  <p className="text-gray-600">{request.sender.email}</p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleAcceptRequest(request.id)}
                    className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleDeclineRequest(request.id)}
                    className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
                  >
                    Decline
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <SentFriendRequests sentRequests={sentRequests} />
      </div>
      <div className="accepted-friends-box">
        <h2 className="text-lg font-semibold mb-3 text-indigo-700">
          Accepted Friends
        </h2>
        {acceptedRequests.length === 0 ? (
          <p className="text-gray-500">No accepted friends</p>
        ) : (
          acceptedRequests.map((request) => (
            <div key={request.id} className="border-b border-gray-300 py-3">
              <div className="flex flex-col sm:flex-row items-center justify-between">
                <div className="flex items-center mb-2 sm:mb-0">
                  <div className="bg-gray-200 rounded-full h-12 w-12 flex items-center justify-center mr-4">
                    {/* You can customize the avatar/icon here */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v3m0 0v3m0-3h3m-3 0H9m-7 8a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">
                      Friend: {request.name || "Unknown"}
                    </span>
                    <br />
                    <span className="text-gray-600">
                      Email: {request.email || "Unknown"}
                    </span>
                  </div>
                </div>
                <span className="text-gray-500">
                  Relationship: {request.relationship || "Unknown"}
                </span>
              </div>
              <div className="flex justify-end mt-2">
                {request.relationship === "friend" && (
                  <span className="text-green-500 mr-2">Friend</span>
                )}
                {request.relationship === "family" && (
                  <span className="text-blue-500 mr-2">Family</span>
                )}
                {request.relationship === "colleague" && (
                  <span className="text-purple-500 mr-2">Colleague</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FriendSearch;
