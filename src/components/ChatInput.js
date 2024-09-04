import React, { useState } from "react";
import { FaPaperclip, FaMicrophone } from 'react-icons/fa';
import { MdSend } from 'react-icons/md';

const ChatInput = ({ handleFileUpload, handleVoiceMessage, handleNewUserMessage, messageInput, setMessageInput, handleTyping }) => {
  const [recording, setRecording] = useState(false);

  const startRecording = () => {
    setRecording(true);
    // Logic to start recording
  };

  const stopRecording = () => {
    setRecording(false);
    // Logic to stop recording and handle the recorded audio
  };

  return (
    <div className="bg-gray-200 p-4 border-t border-gray-300 flex items-center space-x-2">
      {/* File Upload */}
      <label htmlFor="file-upload" className="cursor-pointer">
        <FaPaperclip className="w-6 h-6 text-gray-600 hover:text-gray-800" />
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleFileUpload}
        />
      </label>

      {/* Voice Message */}
      <div className="relative">
        <button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          className={`p-2 rounded-full bg-red-500 text-white ${recording ? 'bg-red-700' : 'hover:bg-red-600'}`}
        >
          <FaMicrophone className="w-6 h-6" />
        </button>
      </div>

      {/* Text Input */}
      <input
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleNewUserMessage();
          } else {
            handleTyping();
          }
        }}
        placeholder="Type a message..."
        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 ml-2 focus:outline-none focus:border-blue-500"
      />

      {/* Send Button */}
      <button
        onClick={handleNewUserMessage}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        <MdSend className="w-6 h-6" />
      </button>
    </div>
  );
};

export default ChatInput;






// import React, { useEffect, useState, useCallback, useRef } from "react";
// import apiClient from "../services/apiService"; // Adjust path as needed
// import { createChatSubscription } from "../actionCableConsumer"; // Adjust path as needed
// import moment from "moment"; // For handling date and time formatting
// import { debounce } from "lodash"; // Make sure to install lodash if not already


// const ChatHeader = ({ onSidebarToggle, sidebarOpen, selectedFriend }) => (
//   <div className="flex justify-between items-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 shadow-md">
//     <button className="text-white focus:outline-none" onClick={onSidebarToggle}>
//       <svg
//         className="w-6 h-6"
//         fill="none"
//         stroke="currentColor"
//         viewBox="0 0 24 24"
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth="2"
//           d="M4 6h16M4 12h16m-7 6h7"
//         ></path>
//       </svg>
//     </button>
//     <h1 className="text-lg font-semibold truncate">
//       {selectedFriend ? ` ${selectedFriend.name}` : "Chat"}
//     </h1>
//   </div>
// );

// const Sidebar = ({ open, friends, onFriendClick, onClose }) => (
//   <div
//     className={`fixed inset-y-0 left-0 transform ${
//       open ? "translate-x-0" : "-translate-x-full"
//     } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out w-80 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex flex-col shadow-lg z-50`}
//   >
//     <div className="p-4 border-b border-indigo-700 flex items-center justify-between">
//       <h2 className="text-2xl font-bold">Friends</h2>
//       <button
//         className="md:hidden text-white focus:outline-none"
//         onClick={onClose}
//       >
//         <svg
//           className="w-6 h-6"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth="2"
//             d="M6 18L18 6M6 6l12 12"
//           ></path>
//         </svg>
//       </button>
//     </div>
//     <div className="flex-1 overflow-y-auto p-4">
//       {friends.length > 0 ? (
//         <ul>
//           {friends.map((friend) => (
//             <li
//               key={friend.id}
//               className="cursor-pointer p-2 mb-2 bg-gray-700 hover:bg-gray-600 rounded-md"
//               onClick={() => onFriendClick(friend)}
//             >
//               {friend.name}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p className="text-center text-gray-300">No friends found.</p>
//       )}
//     </div>
//   </div>
// );

// const MessageList = ({ messages, currentUser }) => {
//   // Group messages by date
//   const groupedMessages = messages
//     .slice()
//     .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
//     .reduce((acc, message) => {
//       const date = moment(message.created_at)
//         .startOf("day")
//         .format("YYYY-MM-DD");
//       if (!acc[date]) {
//         acc[date] = [];
//       }
//       acc[date].push(message);
//       return acc;
//     }, {});

//   // Function to render the date label
//   const renderDateLabel = (date) => {
//     if (moment(date).isSame(moment(), "day")) {
//       return "Today";
//     } else if (moment(date).isSame(moment().subtract(1, "day"), "day")) {
//       return "Yesterday";
//     } else {
//       return moment(date).format("MMMM D, YYYY");
//     }
//   };

//   return (
//     <div className="space-y-4">
//       {Object.keys(groupedMessages).map((date) => (
//         <div key={date}>
//           <p className="text-center text-gray-500 mb-4 text-sm font-semibold">
//             {renderDateLabel(date)}
//           </p>
//           {groupedMessages[date].map((message) => {
//             const isSentByCurrentUser = message.user_id === currentUser.id;
//             return (
//               <div
//                 key={message.id}
//                 className={`flex mb-3 ${
//                   isSentByCurrentUser ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 <div
//                   className={`relative max-w-xs md:max-w-md p-4 rounded-lg shadow-lg ${
//                     isSentByCurrentUser
//                       ? "bg-indigo-600 text-white"
//                       : "bg-gray-200 text-black"
//                   } ${
//                     isSentByCurrentUser ? "ml-2" : "mr-2"
//                   } transition-transform transform hover:scale-105`}
//                 >
//                   <p className="mb-1">{message.content}</p>
//                   <span
//                     className={`absolute text-xs ${
//                       isSentByCurrentUser
//                         ? "right-2 bottom-1"
//                         : "left-2 bottom-1"
//                     }`}
//                   >
//                     {moment(message.created_at).format("h:mm A")}
//                   </span>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       ))}
//     </div>
//   );
// };

// const TypingIndicator = ({ typingUsers }) => (
//   <div className="text-gray-500 italic">
//     {typingUsers.length > 0
//       ? `${typingUsers.join(", ")} ${
//           typingUsers.length > 1 ? "are" : "is"
//         } typing...`
//       : ""}
//   </div>
// );

// const Chat = ({ currentUser }) => {
//   const [messages, setMessages] = useState([]);
//   const [acceptedFriends, setAcceptedFriends] = useState([]);
//   const [selectedFriend, setSelectedFriend] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [chatroomId, setRoomId] = useState(null);
//   const [messageInput, setMessageInput] = useState("");
//   const [chatChannel, setChatChannel] = useState(null);
//   const [loadingMessages, setLoadingMessages] = useState(false);
//   const [loadingFriends, setLoadingFriends] = useState(false);
//   const [error, setError] = useState(null);
//   const [typingUsers, setTypingUsers] = useState([]);
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   };

//   const fetchAcceptedFriends = useCallback(async () => {
//     if (!currentUser) return;

//     setLoadingFriends(true);
//     setError(null);

//     try {
//       const response = await apiClient.get(
//         `/friend_requests/${currentUser.id}/accepted`
//       );
//       setAcceptedFriends(response.data || []);
//     } catch (error) {
//       setError("Error fetching accepted friends.");
//       console.error("Error fetching accepted friends:", error.message);
//     } finally {
//       setLoadingFriends(false);
//     }
//   }, [currentUser]);

//   const fetchMessages = useCallback(async () => {
//     if (!chatroomId) return;

//     setLoadingMessages(true);
//     setError(null);

//     try {
//       const response = await apiClient.get(`/messages`, {
//         params: { chatroom_id: chatroomId },
//       });
//       setMessages(response.data || []);
//       scrollToBottom();
//     } catch (error) {
//       setError("Error fetching messages.");
//       console.error("Error fetching messages:", error.message);
//     } finally {
//       setLoadingMessages(false);
//     }
//   }, [chatroomId]);

//   // const initializeChatSubscription = useCallback(
//   //   (roomId) => {
//   //     if (chatChannel) {
//   //       chatChannel.unsubscribe();
//   //     }

//   //     const newChatChannel = createChatSubscription(roomId, {
//   //       received(data) {
//   //         if (data.message) {
//   //           setMessages((prevMessages) => [...prevMessages, data.message]);
//   //           scrollToBottom();
//   //           if (Notification.permission === "granted") {
//   //             new Notification("New message", { body: data.message.content });
//   //           }
//   //         }
//   //         if (data.typing !== undefined) {
//   //           setTypingUsers((prevTyping) => [
//   //             ...new Set([...prevTyping, data.typing]),
//   //           ]);
//   //         }
//   //       },
//   //     });

//   //     setChatChannel(newChatChannel);
//   //   },
//   //   [chatChannel]
//   // );
//   const initializeChatSubscription = useCallback(
//     (roomId) => {
//       if (chatChannel) {
//         chatChannel.unsubscribe();
//       }
  
//       const newChatChannel = createChatSubscription(roomId, {
//         received(data) {
//           if (data.message) {
//             setMessages((prevMessages) => [...prevMessages, data.message]);
//             scrollToBottom();
//             if (Notification.permission === "granted") {
//               new Notification("New message", { body: data.message.content });
//             }
//           }
//           if (data.typing !== undefined) {
//             setTypingUsers((prevTyping) => {
//               const newTyping = [...prevTyping, data.typing];
//               return [...new Set(newTyping)]; // Remove duplicates
//             });
//           }
//         },
//       });
  
//       setChatChannel(newChatChannel);
//     },
//     []
//   );
  
  
//   useEffect(() => {
//     if (chatroomId) {
//       initializeChatSubscription(chatroomId);
//     }
    
//     return () => {
//       if (chatChannel) {
//         chatChannel.unsubscribe();
//       }
//     };
//   }, [chatroomId, initializeChatSubscription]);
  
//   const handleTyping = useCallback(
//     debounce(() => {
//       if (chatChannel) {
//         chatChannel.perform("user_typing", {
//           chatroom_id: chatroomId,
//           user_id: currentUser.id,
//         });
//       }
//     }, 500), // Adjust debounce delay as needed
//     [chatChannel, chatroomId, currentUser]
//   );
//   useEffect(() => {
//     const typingTimeout = setTimeout(() => {
//       setTypingUsers([]);
//     }, 5000); // Adjust timeout period as needed
  
//     return () => clearTimeout(typingTimeout);
//   }, [typingUsers]);
  

//   const handleFriendClick = async (friend) => {
//     try {
//       const response = await apiClient.get(`/chatrooms/check_or_create`, {
//         params: { user2_id: friend.id },
//       });

//       if (response.status === 200) {
//         const chatroom = response.data;
//         setRoomId(chatroom.id);
//         setSelectedFriend(friend);
//         setMessages([]);
//         setSidebarOpen(false);

//         initializeChatSubscription(chatroom.id);
//       } else {
//         setError("Error fetching or creating chatroom.");
//       }
//     } catch (error) {
//       console.error("Error checking or creating chatroom:", error.message);
//       setError("Error checking or creating chatroom.");
//     }
//   };

//   // const handleMessageSubmit = async (e) => {
//   //   e.preventDefault();

//   //   if (!messageInput.trim()) return;

//   //   try {
//   //     const newMessage = {
//   //       content: messageInput,
//   //       chatroom_id: chatroomId,
//   //       user_id: currentUser.id,
//   //       created_at: new Date().toISOString(),
//   //     };

//   //     // Optimistically update the local state
//   //     setMessages((prevMessages) => [...prevMessages, newMessage]);
//   //     setMessageInput("");

//   //     // Send the message to the backend
//   //     await apiClient.post("/messages", {
//   //       message: newMessage, // Adjust according to your backend expectations
//   //     });
//   //   } catch (error) {
//   //     setError("Error sending message.");
//   //     console.error("Error sending message:", error.message);
//   //   }
//   // };
//   const handleMessageSubmit = async (e) => {
//     e.preventDefault();
  
//     // Check if the message input is empty
//     if (!messageInput.trim()) return;
  
//     const newMessage = {
//       content: messageInput,
//       chatroom_id: chatroomId,
//       user_id: currentUser.id,
//       created_at: new Date().toISOString(),
//     };
  
//     // Optimistically update the local state
//     setMessages((prevMessages) => [...prevMessages, newMessage]);
//     setMessageInput("");
  
//     try {
//       // Send the message to the backend
//       await apiClient.post("/messages", { message: newMessage });
//     } catch (error) {
//       setError("Error sending message.");
//       console.error("Error sending message:", error.message);
  
//       // Rollback optimistic update if needed
//       setMessages((prevMessages) =>
//         prevMessages.filter((msg) => msg.created_at !== newMessage.created_at)
//       );
//     }
//   };
  
  

  
//   const handleSidebarToggle = () => setSidebarOpen(!sidebarOpen);
//   const handleSidebarClose = () => setSidebarOpen(false);

//   useEffect(() => {
//     if (currentUser) {
//       fetchAcceptedFriends();
//     }
//   }, [currentUser, fetchAcceptedFriends]);

//   useEffect(() => {
//     if (chatroomId) {
//       fetchMessages();
//     }
//   }, [chatroomId, fetchMessages]);

//   useEffect(() => {
//     if (selectedFriend && Notification.permission !== "granted") {
//       Notification.requestPermission().catch((error) =>
//         console.error("Notification permission request failed:", error)
//       );
//     }
//   }, [selectedFriend]);

//   return (
//     <div className="flex h-screen">
//       <Sidebar
//         open={sidebarOpen}
//         friends={acceptedFriends}
//         onFriendClick={handleFriendClick}
//         onClose={handleSidebarClose}
//       />
//       <div className="flex-1 flex flex-col bg-gray-100">
//         <ChatHeader
//           onSidebarToggle={handleSidebarToggle}
//           sidebarOpen={sidebarOpen}
//           selectedFriend={selectedFriend}
//         />
//         <div className="flex-1 p-4 overflow-y-auto">
//           {loadingMessages ? (
//             <p>Loading messages...</p>
//           ) : (
//             <MessageList messages={messages} currentUser={currentUser} />
//           )}
//           <div ref={messagesEndRef} />
//         </div>
//         <div className="px-4 pb-4">
//           <TypingIndicator typingUsers={typingUsers} />
//           {selectedFriend && (
//             <form
//               onSubmit={handleMessageSubmit}
//               className="mt-4 flex items-center"
//             >
//               <input
//                 type="text"
//                 value={messageInput}
//                 onChange={(e) => setMessageInput(e.target.value)}
//                 onKeyPress={handleTyping}
//                 className="flex-1 p-2 border border-gray-300 rounded-l-lg"
//                 placeholder="Type a message..."
//               />
//               <button
//                 type="submit"
//                 className="p-2 bg-indigo-600 text-white rounded-r-lg"
//               >
//                 Send
//               </button>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chat;


