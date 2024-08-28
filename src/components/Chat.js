/* eslint-disable */

// import React, { useEffect, useState, useCallback } from 'react';
// import apiClient from '../services/apiService'; // Adjust path as needed
// import { createChatSubscription } from '../actionCableConsumer'; // Adjust path as needed
// // import './Chat.css'; // Ensure Tailwind CSS is included

// const Chat = ({ currentUser }) => {
//   const [messages, setMessages] = useState([]);
//   const [acceptedFriends, setAcceptedFriends] = useState([]);
//   const [selectedFriend, setSelectedFriend] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [chatroomId, setRoomId] = useState(null);
//   const [messageInput, setMessageInput] = useState('');
//   const [chatChannel, setChatChannel] = useState(null);
//   const [loadingMessages, setLoadingMessages] = useState(false);
//   const [loadingFriends, setLoadingFriends] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchAcceptedFriends = useCallback(async () => {
//     if (!currentUser) return;

//     setLoadingFriends(true);
//     setError(null);

//     try {
//       const response = await apiClient.get(`/friend_requests/${currentUser.id}/accepted`);
//       setAcceptedFriends(response.data || []);
//     } catch (error) {
//       setError('Error fetching accepted friends.');
//       console.error('Error fetching accepted friends:', error.message);
//     } finally {
//       setLoadingFriends(false);
//     }
//   }, [currentUser]);

//   const initializeChatSubscription = useCallback((roomId) => {
//     if (chatChannel) {
//       chatChannel.unsubscribe();
//     }

//     const newChatChannel = createChatSubscription(roomId, {
//       received(data) {
//         setMessages((prevMessages) => [...prevMessages, data.message]);
//         if (Notification.permission === 'granted') {
//           new Notification('New message', { body: data.message.content });
//         }
//       }
//     });

//     setChatChannel(newChatChannel);
//   }, [chatChannel]);

//   const handleFriendClick = async (friend) => {
//     try {
//       const response = await apiClient.get(`/chatrooms/check_or_create`, {
//         params: { user2_id: friend.id },
//       });

//       if (response.status === 200) {
//         const chatroom = response.data;
//         setRoomId(chatroom.id);
//         setSelectedFriend(friend);
//         setMessages([]); // Clear messages state when opening a new chatroom
//         setSidebarOpen(false);

//         initializeChatSubscription(chatroom.id);
//       } else {
//         setError('Error fetching or creating chatroom.');
//       }
//     } catch (error) {
//       setError('Error handling friend click.');
//     }
//   };

//   useEffect(() => {
//     if (!chatroomId) return;

//     const fetchMessages = async () => {
//       setLoadingMessages(true);
//       setError(null);

//       try {
//         const response = await apiClient.get(`/chatrooms/${chatroomId}/messages`);
//         setMessages(response.data || []);
//       } catch (error) {
//         setError('Error fetching messages.');
//       } finally {
//         setLoadingMessages(false);
//       }
//     };

//     fetchMessages();
//   }, [chatroomId]);

//   useEffect(() => {
//     fetchAcceptedFriends();
//   }, [fetchAcceptedFriends]);

//   useEffect(() => {
//     return () => {
//       if (chatChannel) {
//         chatChannel.unsubscribe();
//       }
//     };
//   }, [chatChannel]);

//   const handleNewUserMessage = () => {
//     if (!chatroomId || !messageInput.trim()) return;

//     if (chatChannel) {
//       chatChannel.perform('send_message', {
//         chatroom_id: chatroomId,
//         content: messageInput,
//         sender_id: currentUser.id
//       });
//       setMessageInput('');
//     } else {
//       console.error('Chat channel not found');
//     }
//   };

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       if (chatChannel) {
//         chatChannel.perform('send_message', {
//           chatroom_id: chatroomId,
//           content: reader.result,
//           file_name: file.name,
//           file_type: file.type,
//           sender_id: currentUser.id,
//         });
//       } else {
//         console.error('Chat channel not found');
//       }
//     };
//     reader.readAsDataURL(file);
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gray-100">
//       {/* Header for Small Screens */}
//       <div className="md:hidden flex justify-between items-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 shadow-md">
//         <button
//           className="text-white focus:outline-none"
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//         >
//           <svg
//             className="w-6 h-6"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
//           </svg>
//         </button>
//         <h1 className="text-lg font-semibold">Chat</h1>
//       </div>

//       <div className="flex flex-1 overflow-hidden">
//         {/* Sidebar for Friends */}
//         <div
//           className={`fixed inset-y-0 left-0 transform ${
//             sidebarOpen ? 'translate-x-0' : '-translate-x-full'
//           } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out w-80 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex flex-col shadow-lg z-50`}
//         >
//           <div className="p-4 border-b border-indigo-700 flex items-center justify-between">
//             <h2 className="text-2xl font-bold">Friends</h2>
//             <button
//               className="md:hidden text-white focus:outline-none"
//               onClick={() => setSidebarOpen(false)}
//             >
//               <svg
//                 className="w-6 h-6"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
//               </svg>
//             </button>
//           </div>
//           <div className="p-4 flex-1 overflow-y-auto">
//             {loadingFriends ? (
//               <p className="text-center text-gray-400">Loading friends...</p>
//             ) : (
//               <ul>
//                 {acceptedFriends.length > 0 ? (
//                   acceptedFriends.map((friend) => (
//                     <li
//                       key={friend.id}
//                       className="cursor-pointer p-3 hover:bg-indigo-700 rounded transition duration-300 ease-in-out"
//                       onClick={() => handleFriendClick(friend)}
//                     >
//                       {friend.name}
//                     </li>
//                   ))
//                 ) : (
//                   <p className="text-center text-gray-400">No friends available.</p>
//                 )}
//               </ul>
//             )}
//             {error && <p className="text-red-500 text-center mt-2">{error}</p>}
//           </div>
//         </div>

//         {/* Chat Area */}
//         <div className="flex-1 flex flex-col">
//           {/* Chat Header */}
//           <div className="hidden md:flex bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 shadow-md">
//             <h1 className="text-lg font-semibold">{selectedFriend ? selectedFriend.name : 'Select a friend'}</h1>
//           </div>

//           {/* Messages Display */}
//           <div className="flex-1 p-4 overflow-y-auto">
//             {loadingMessages ? (
//               <p className="text-center text-gray-400">Loading messages...</p>
//             ) : (
//               <div>
//                 {messages.length > 0 ? (
//                   messages.map((msg) => (
//                     <div
//                       key={msg.id}
//                       className={`flex ${msg.user_id === currentUser.id ? 'justify-end' : 'justify-start'} mb-2`}
//                     >
//                       {msg.user_id !== currentUser.id && (
//                         <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 mr-2">
//                           {selectedFriend && <span>{selectedFriend.name.charAt(0)}</span>}
//                         </div>
//                       )}
//                       <div
//                         className={`p-3 rounded-lg ${
//                           msg.user_id === currentUser.id
//                             ? 'bg-purple-500 text-white'
//                             : 'bg-gray-200 text-gray-800'
//                         }`}
//                       >
//                         <p>{msg.content}</p>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-center text-gray-400">No messages yet.</p>
//                 )}
//               </div>
//             )}
//             {error && <p className="text-red-500 text-center mt-2">{error}</p>}
//           </div>

//           {/* Message Input Area */}
//           <div className="bg-white p-4 flex items-center border-t border-gray-200">
//             <input
//               type="file"
//               accept="image/*,video/*,audio/*"
//               className="hidden"
//               id="fileUpload"
//               onChange={handleFileUpload}
//             />
//             <label
//               htmlFor="fileUpload"
//               className="text-blue-500 cursor-pointer mr-4"
//             >
//               <svg
//                 className="w-6 h-6"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7h16M4 12h16m-7 6h7"></path>
//               </svg>
//             </label>
//             <input
//               type="text"
//               value={messageInput}
//               onChange={(e) => setMessageInput(e.target.value)}
//               placeholder="Type a message..."
//               className="flex-1 p-2 border border-gray-300 rounded-lg mr-2"
//             />
//             <button
//               onClick={handleNewUserMessage}
//               className="bg-blue-500 text-white p-2 rounded-lg"
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chat;

// import React, { useEffect, useState, useRef, useCallback } from 'react';
// import apiClient from '../services/apiService'; // Adjust path as needed
// import { createChatSubscription } from '../actionCableConsumer'; // Adjust path as needed

// const Chat = ({ currentUser }) => {
//   const [messages, setMessages] = useState([]);
//   const [acceptedFriends, setAcceptedFriends] = useState([]);
//   const [selectedFriend, setSelectedFriend] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [chatroomId, setRoomId] = useState(null);
//   const [messageInput, setMessageInput] = useState('');
//   const [chatChannel, setChatChannel] = useState(null);
//   const [loadingMessages, setLoadingMessages] = useState(false);
//   const [loadingFriends, setLoadingFriends] = useState(false);
//   const [error, setError] = useState(null);

//   const messagesEndRef = useRef(null);

//   // Formats timestamps for display
//   const formatTimestamp = (timestamp) => {
//     const date = new Date(timestamp);
//     const now = new Date();
//     const daysDifference = Math.floor((now - date) / (1000 * 60 * 60 * 24));
//     const options = { hour: '2-digit', minute: '2-digit' };

//     if (daysDifference === 0) {
//       return date.toLocaleTimeString([], options);
//     } else if (daysDifference === 1) {
//       return `Yesterday ${date.toLocaleTimeString([], options)}`;
//     } else if (daysDifference < 7) {
//       return `${date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} ${date.toLocaleTimeString([], options)}`;
//     } else {
//       return `${date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })} ${date.toLocaleTimeString([], options)}`;
//     }
//   };

//   // Groups messages by date
//   const groupMessagesByDate = (messages) => {
//     const groupedMessages = {};
//     messages.forEach((message) => {
//       const messageDate = new Date(message.created_at).toDateString();
//       if (!groupedMessages[messageDate]) {
//         groupedMessages[messageDate] = [];
//       }
//       groupedMessages[messageDate].push(message);
//     });
//     return groupedMessages;
//   };

//   // Fetches accepted friends for the current user
//   const fetchAcceptedFriends = useCallback(async () => {
//     if (!currentUser) return;

//     setLoadingFriends(true);
//     setError(null);

//     try {
//       const response = await apiClient.get(`/friend_requests/${currentUser.id}/accepted`);
//       setAcceptedFriends(response.data || []);
//     } catch (error) {
//       setError('Error fetching accepted friends.');
//     } finally {
//       setLoadingFriends(false);
//     }
//   }, [currentUser]);

//   // Initializes chat subscription and handles incoming messages
//   const initializeChatSubscription = useCallback((roomId) => {
//     if (chatChannel) {
//       chatChannel.unsubscribe();
//     }

//     const newChatChannel = createChatSubscription(roomId, {
//       received(data) {
//         if (data.message) {
//           const formattedMessage = {
//             ...data.message,
//             isSentByCurrentUser: data.message.sender_id === currentUser.id,
//             timestamp: formatTimestamp(data.message.created_at),
//           };
//           setMessages((prevMessages) => [...prevMessages, formattedMessage]);
//         }
//       }
//     });

//     setChatChannel(newChatChannel);
//   }, [chatChannel, currentUser.id]);

//   // Handles the click on a friend to start or open a chat
//   const handleFriendClick = async (friend) => {
//     try {
//       const response = await apiClient.get(`/chatrooms/check_or_create`, { params: { user2_id: friend.id } });

//       if (response.status === 200) {
//         const chatroom = response.data;
//         setRoomId(chatroom.id);
//         setSelectedFriend(friend);
//         setMessages([]);
//         setSidebarOpen(false);
//         initializeChatSubscription(chatroom.id);
//       } else {
//         setError('Error fetching or creating chatroom.');
//       }
//     } catch (error) {
//       setError('Error handling friend click.');
//     }
//   };

//   // Fetches messages when chatroomId changes
//   useEffect(() => {
//     if (!chatroomId) return;

//     const fetchMessages = async () => {
//       setLoadingMessages(true);
//       setError(null);

//       try {
//         const response = await apiClient.get(`/chatrooms/${chatroomId}/messages`);
//         const formattedMessages = response.data.map((msg) => ({
//           ...msg,
//           isSentByCurrentUser: msg.user_id === currentUser.id,
//           timestamp: formatTimestamp(msg.created_at),
//         }));
//         setMessages(formattedMessages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))); // Sort messages by date
//       } catch (error) {
//         setError('Error fetching messages.');
//       } finally {
//         setLoadingMessages(false);
//       }
//     };

//     fetchMessages();
//   }, [chatroomId, currentUser.id]);

//   useEffect(() => {
//     fetchAcceptedFriends();
//   }, [fetchAcceptedFriends]);

//   // Automatically scrolls to the bottom of the chat
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // Cleans up chat subscription on unmount
//   useEffect(() => {
//     return () => {
//       if (chatChannel) {
//         chatChannel.unsubscribe();
//       }
//     };
//   }, [chatChannel]);

//   // Sends a new user message
//   const handleNewUserMessage = () => {
//     if (!chatroomId || !messageInput.trim()) return;

//     if (chatChannel) {
//       chatChannel.perform('send_message', {
//         chatroom_id: chatroomId,
//         content: messageInput,
//         sender_id: currentUser.id,
//       });
//       setMessageInput('');
//     }
//   };

//   // Handles file upload
//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       if (chatChannel) {
//         chatChannel.perform('send_message', {
//           chatroom_id: chatroomId,
//           content: reader.result,
//           file_name: file.name,
//           file_type: file.type,
//           sender_id: currentUser.id,
//         });
//       }
//     };
//     reader.readAsDataURL(file);
//   };

//   const groupedMessages = groupMessagesByDate(messages);

//   return (
//     <div className="flex flex-col h-screen bg-gray-100">
//       {/* Header for Small Screens */}
//       <div className="md:hidden flex justify-between items-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 shadow-md">
//         <button
//           className="text-white focus:outline-none"
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//         >
//           <svg
//             className="w-6 h-6"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
//           </svg>
//         </button>
//         <h1 className="text-lg font-semibold">Chat</h1>
//       </div>

//       <div className="flex flex-1 overflow-hidden">
//         {/* Sidebar for Friends */}
//         <div
//           className={`fixed inset-y-0 left-0 transform ${
//             sidebarOpen ? 'translate-x-0' : '-translate-x-full'
//           } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out bg-gradient-to-b from-purple-100 to-blue-100 shadow-lg md:w-80 w-64 border-r border-gray-200 z-10`}
//         >
//           <div className="p-4 h-full flex flex-col">
//             <h2 className="text-2xl font-bold mb-4 text-gray-800">Friends</h2>
//             {loadingFriends ? (
//               <p className="text-center text-gray-600">Loading friends...</p>
//             ) : (
//               <ul className="flex-1 overflow-y-auto space-y-2">
//                 {acceptedFriends.map((friend) => (
//                   <li
//                     key={friend.id}
//                     className={`flex justify-between items-center p-3 rounded-lg bg-white shadow-md hover:bg-blue-50 cursor-pointer transition-colors duration-150 ease-in-out ${
//                       selectedFriend?.id === friend.id ? 'bg-blue-100' : ''
//                     }`}
//                     onClick={() => handleFriendClick(friend)}
//                   >
//                     <span className="text-blue-800 font-semibold">{friend.name}</span>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>

//         {/* Chat Container */}
//         <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-100 to-white">
//           {/* Chat Messages */}
//           <div className="flex-1 p-4 overflow-y-auto">
//             {loadingMessages && <p className="text-center text-gray-600">Loading messages...</p>}
//             {error && <p className="text-center text-red-600">{error}</p>}
//             {Object.keys(groupedMessages).length === 0 && !loadingMessages && !error && (
//               <p className="text-center text-gray-600">Start a conversation by selecting a friend.</p>
//             )}
//             {Object.keys(groupedMessages).map((date) => (
//               <div key={date} className="mb-4">
//                 <div className="text-center text-gray-600 font-semibold mb-2">{date}</div>
//                 {groupedMessages[date].map((message) => (
//                   <div
//                     key={message.id}
//                     className={`flex items-start mb-2 ${message.isSentByCurrentUser ? 'justify-end' : 'justify-start'}`}
//                   >
//                     <div
//                       className={`p-3 rounded-xl max-w-xs text-sm ${
//                         message.isSentByCurrentUser
//                           ? 'bg-blue-500 text-white shadow-md'
//                           : 'bg-gray-200 text-gray-800 shadow-md'
//                       }`}
//                     >
//                       {message.content}
//                       {message.file_url && (
//                         <div className="mt-2">
//                           <a
//                             href={message.file_url}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-blue-400 underline"
//                           >
//                             {message.file_name}
//                           </a>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ))}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Message Input */}
//           <div className="bg-white p-4 border-t border-gray-200 flex items-center space-x-4">
//             <input
//               type="file"
//               accept="image/*,video/*,audio/*"
//               className="hidden"
//               id="file-upload"
//               onChange={handleFileUpload}
//             />
//             <label htmlFor="file-upload" className="cursor-pointer text-blue-500">
//               <svg
//                 className="w-6 h-6"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9l4 4m0 0l-4 4m4-4H3"></path>
//               </svg>
//             </label>
//             <input
//               type="text"
//               value={messageInput}
//               onChange={(e) => setMessageInput(e.target.value)}
//               placeholder="Type a message..."
//               className="flex-1 p-2 border rounded-lg outline-none"
//               onKeyDown={(e) => e.key === 'Enter' && handleNewUserMessage()}
//             />
//             <button
//               onClick={handleNewUserMessage}
//               className="bg-blue-500 text-white p-2 rounded-lg"
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Chat;

// import React, { useEffect, useState, useRef, useCallback } from "react";
// import apiClient from "../services/apiService"; // Adjust path as needed
// import { createChatSubscription } from "../actionCableConsumer"; // Adjust path as needed
// import "./Chat.css"; // Ensure you have any additional styling here

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
//   const [replyingTo, setReplyingTo] = useState(null); // State for replying to a message

//   const messagesEndRef = useRef(null);

//   // Formats timestamps for display
//   const formatTimestamp = (timestamp) => {
//     const date = new Date(timestamp);
//     const now = new Date();
//     const hours = date.getHours().toString().padStart(2, "0");
//     const minutes = date.getMinutes().toString().padStart(2, "0");

//     if (now.toDateString() === date.toDateString()) {
//       return `${hours}:${minutes}`;
//     }

//     return (
//       date.toLocaleDateString([], {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//       }) +
//       " " +
//       `${hours}:${minutes}`
//     );
//   };

//   // Groups messages by date
//   const groupMessagesByDate = (messages) => {
//     const groupedMessages = {};
//     messages.forEach((message) => {
//       const messageDate = new Date(message.created_at).toDateString();
//       if (!groupedMessages[messageDate]) {
//         groupedMessages[messageDate] = [];
//       }
//       groupedMessages[messageDate].push(message);
//     });
//     return groupedMessages;
//   };

//   // Fetches accepted friends for the current user
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
//     } finally {
//       setLoadingFriends(false);
//     }
//   }, [currentUser]);

//   // Initializes chat subscription and handles incoming messages
//   const initializeChatSubscription = useCallback(
//     (roomId) => {
//       if (chatChannel) {
//         chatChannel.unsubscribe();
//       }

//       const newChatChannel = createChatSubscription(roomId, {
//         received(data) {
//           if (data.message) {
//             const formattedMessage = {
//               ...data.message,
//               isSentByCurrentUser: data.message.sender_id === currentUser.id,
//               timestamp: formatTimestamp(data.message.created_at),
//             };
//             setMessages((prevMessages) => [...prevMessages, formattedMessage]);
//           }
//         },
//       });

//       setChatChannel(newChatChannel);
//     },
//     [chatChannel, currentUser.id]
//   );

//   // Handles the click on a friend to start or open a chat
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
//       setError("Error handling friend click.");
//     }
//   };

//   // Fetches messages when chatroomId changes
//   useEffect(() => {
//     if (!chatroomId) return;

//     const fetchMessages = async () => {
//       setLoadingMessages(true);
//       setError(null);

//       try {
//         const response = await apiClient.get(
//           `/chatrooms/${chatroomId}/messages`
//         );
//         const formattedMessages = response.data.map((msg) => ({
//           ...msg,
//           isSentByCurrentUser: msg.user_id === currentUser.id,
//           timestamp: formatTimestamp(msg.created_at),
//         }));
//         setMessages(
//           formattedMessages.sort(
//             (a, b) => new Date(a.created_at) - new Date(b.created_at)
//           )
//         ); // Sort messages by date
//       } catch (error) {
//         setError("Error fetching messages.");
//       } finally {
//         setLoadingMessages(false);
//       }
//     };

//     fetchMessages();
//   }, [chatroomId, currentUser.id]);

//   useEffect(() => {
//     fetchAcceptedFriends();
//   }, [fetchAcceptedFriends]);

//   // Automatically scrolls to the bottom of the chat
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Cleans up chat subscription on unmount
//   useEffect(() => {
//     return () => {
//       if (chatChannel) {
//         chatChannel.unsubscribe();
//       }
//     };
//   }, [chatChannel]);

//     // Sends a new user message
//     const handleNewUserMessage = () => {
//       if (!chatroomId || !messageInput.trim()) return;

//       if (chatChannel) {
//         chatChannel.perform("send_message", {
//           chatroom_id: chatroomId,
//           content: messageInput,
//           sender_id: currentUser.id,
//           replying_to: replyingTo ? replyingTo.messageId : null, // Link to replied message
//         });
//         setMessageInput("");
//         setReplyingTo(null); // Clear replying state after sending
//       }
//     };

//     return (
//       <div className="flex flex-col h-screen bg-gray-100">
//         {/* Header for Small Screens */}
//         <div className="md:hidden flex justify-between items-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 shadow-md">
//           <button
//             className="text-white focus:outline-none"
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//           >
//             {/* SVG Icon */}
//           </button>
//           <h1 className="text-lg font-semibold">Chat</h1>
//         </div>

//         <div className="flex flex-1 overflow-hidden">
//           {/* Sidebar for Friends */}
//           <div
//             className={`fixed inset-y-0 left-0 transform ${
//               sidebarOpen ? "translate-x-0" : "-translate-x-full"
//             } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out bg-gradient-to-b from-purple-100 to-blue-100 shadow-lg md:w-80 w-64 border-r border-gray-200 z-10`}
//           >
//             {/* Sidebar Content */}
//           </div>

//           {/* Main Chat Area */}
//           <div className="flex-1 p-4 overflow-hidden flex flex-col">
//             {/* Chat Messages */}
//             <div className="flex-1 p-4 overflow-y-auto">
//               {error && <p className="text-center text-red-500">{error}</p>}
//               <div>
//                 {Object.keys(groupedMessages).map((date) => (
//                   <div key={date} className="mb-8">
//                     <div className="text-center text-gray-500 font-semibold mb-4 text-xs">
//                       {date === new Date().toDateString() ? "Today" : date}
//                     </div>
//                     {groupedMessages[date].map((message) => (
//                       <div
//                         key={message.id}
//                         className={`flex items-start mb-4 ${
//                           message.isSentByCurrentUser
//                             ? "justify-end"
//                             : "justify-start"
//                         }`}
//                       >
//                         <div
//                           className={`relative p-4 max-w-md text-sm rounded-xl ${
//                             message.isSentByCurrentUser
//                               ? "bg-blue-600 text-white shadow-md"
//                               : "bg-white text-gray-800 border border-gray-200 shadow-md"
//                           }`}
//                         >
//                           {message.replying_to && (
//                             <div className="p-2 mb-2 bg-gray-200 border-l-4 border-blue-500 rounded-lg">
//                               <p className="text-xs text-gray-600">
//                                 Replying to:
//                               </p>
//                               <p className="text-sm font-semibold">
//                                 {message.reply_content}
//                               </p>
//                             </div>
//                           )}
//                           {message.content}
//                           {message.file_url && (
//                             <div className="mt-2">
//                               <a
//                                 href={message.file_url}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="text-blue-400 hover:underline"
//                               >
//                                 {message.file_name}
//                               </a>
//                             </div>
//                           )}
//                           <div
//                             className={`text-xs ${
//                               message.isSentByCurrentUser
//                                 ? "text-blue-200"
//                                 : "text-gray-600"
//                             } mt-2`}
//                           >
//                             {message.timestamp}
//                           </div>
//                           <div
//                             className={`absolute w-0 h-0 ${
//                               message.isSentByCurrentUser
//                                 ? "border-t-blue-600 border-l-8 border-l-blue-600 right-[-8px] top-4"
//                                 : "border-t-white border-l-8 border-l-gray-200 left-[-8px] top-4"
//                             } border-transparent`}
//                           />
//                           {!message.isSentByCurrentUser && (
//                             <button
//                               className="absolute bottom-0 right-0 text-blue-500 p-1"
//                               onClick={() =>
//                                 setReplyingTo({
//                                   messageId: message.id,
//                                   content: message.content,
//                                 })
//                               }
//                             >
//                               Reply
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ))}
//               </div>
//               <div ref={messagesEndRef} />
//             </div>

//             {/* Message Input */}
//             <div className="p-4 border-t border-gray-200 flex items-center">
//               {replyingTo && (
//                 <div className="mb-2 w-full bg-gray-200 p-2 rounded">
//                   <span className="text-xs text-gray-600">Replying to:</span>
//                   <span className="text-sm font-semibold">
//                     {replyingTo.content}
//                   </span>
//                   <button
//                     onClick={() => setReplyingTo(null)}
//                     className="text-red-500 text-xs ml-2"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               )}
//               <input
//                 type="text"
//                 placeholder="Type a message..."
//                 value={messageInput}
//                 onChange={(e) => setMessageInput(e.target.value)}
//                 className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 onKeyPress={(e) => e.key === "Enter" && handleNewUserMessage()}
//               />
//               <button
//                 onClick={handleNewUserMessage}
//                 className="ml-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 focus:outline-none"
//               >
//                 Send
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   export default Chat;



import React, { useEffect, useState, useRef, useCallback } from "react";
import apiClient from "../services/apiService"; // Adjust path as needed
import { createChatSubscription } from "../actionCableConsumer"; // Adjust path as needed
import './Chat.css';

const Chat = ({ currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [acceptedFriends, setAcceptedFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatroomId, setRoomId] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [chatChannel, setChatChannel] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [error, setError] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);

  const messagesEndRef = useRef(null);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    if (now.toDateString() === date.toDateString()) {
      return `Today ${hours}:${minutes}`;
    }

    return (
      date.toLocaleDateString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
      }) +
      " " +
      `${hours}:${minutes}`
    );
  };

  const groupMessagesByDate = (messages) => {
    const groupedMessages = {};
    messages.forEach((message) => {
      const messageDate = new Date(message.created_at).toDateString();
      if (!groupedMessages[messageDate]) {
        groupedMessages[messageDate] = [];
      }
      groupedMessages[messageDate].push(message);
    });
    return groupedMessages;
  };

  const fetchAcceptedFriends = useCallback(async () => {
    if (!currentUser) return;

    setLoadingFriends(true);
    setError(null);

    try {
      const response = await apiClient.get(
        `/friend_requests/${currentUser.id}/accepted`
      );
      setAcceptedFriends(response.data || []);
    } catch (error) {
      setError("Error fetching accepted friends.");
    } finally {
      setLoadingFriends(false);
    }
  }, [currentUser]);

  const initializeChatSubscription = useCallback(
    (roomId) => {
      if (chatChannel) {
        chatChannel.unsubscribe();
      }
  
      const newChatChannel = createChatSubscription(roomId, {
        received(data) {
          if (data.message) {
            const formattedMessage = {
              ...data.message,
              isSentByCurrentUser: data.message.sender_id === currentUser.id,
              timestamp: formatTimestamp(data.message.created_at),
            };
  
            setMessages((prevMessages) => [...prevMessages, formattedMessage]);
  
            // Update latestMessage for the sender
            setAcceptedFriends((prevFriends) =>
              prevFriends.map((friend) =>
                friend.id === data.message.sender_id
                  ? {
                      ...friend,
                      latestMessage: {
                        content: data.message.content,
                        created_at: data.message.created_at,
                      },
                    }
                  : friend
              )
            );
          }
        },
      });
  
      setChatChannel(newChatChannel);
    },
    [chatChannel, currentUser.id]
  );
  
  

  const handleFriendClick = async (friend) => {
    try {
      const response = await apiClient.get(`/chatrooms/check_or_create`, {
        params: { user2_id: friend.id },
      });

      if (response.status === 200) {
        const chatroom = response.data;
        setRoomId(chatroom.id);
        setSelectedFriend(friend);
        setMessages([]);
        setSidebarOpen(false);
        initializeChatSubscription(chatroom.id);
      } else {
        setError("Error fetching or creating chatroom.");
      }
    } catch (error) {
      setError("Error handling friend click.");
    }
  };

  useEffect(() => {
    if (!chatroomId) return;

    const fetchMessages = async () => {
      setLoadingMessages(true);
      setError(null);
    
      try {
        const response = await apiClient.get(`/chatrooms/${chatroomId}/messages`);
        const formattedMessages = response.data.map((msg) => ({
          ...msg,
          isSentByCurrentUser: msg.user_id === currentUser.id,
          timestamp: formatTimestamp(msg.created_at),
        }));
        
        setMessages(
          formattedMessages.sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at)
          )
        );
    
        // Update latestMessage for each friend
        setAcceptedFriends((prevFriends) =>
          prevFriends.map((friend) => {
            const lastMessage = formattedMessages
              .filter((msg) => msg.user_id === friend.id)
              .pop(); // Get the last message for this friend
    
            return {
              ...friend,
              latestMessage: lastMessage || friend.latestMessage,
            };
          })
        );
      } catch (error) {
        setError("Error fetching messages.");
      } finally {
        setLoadingMessages(false);
      }
    };
    
    

    fetchMessages();
  }, [chatroomId, currentUser.id]);

  useEffect(() => {
    fetchAcceptedFriends();
  }, [fetchAcceptedFriends]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (chatChannel) {
        chatChannel.unsubscribe();
      }
    };
  }, [chatChannel]);

  const handleNewUserMessage = () => {
    if (!chatroomId || !messageInput.trim()) return;

    if (chatChannel) {
      chatChannel.perform("send_message", {
        chatroom_id: chatroomId,
        content: messageInput,
        sender_id: currentUser.id,
        replying_to: replyingTo ? replyingTo.messageId : null,
      });
      setMessageInput("");
      setReplyingTo(null);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (chatChannel) {
        chatChannel.perform("send_message", {
          chatroom_id: chatroomId,
          content: reader.result,
          file_name: file.name,
          file_type: file.type,
          sender_id: currentUser.id,
          replying_to: replyingTo ? replyingTo.messageId : null,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header for Small Screens */}
      <div className="md:hidden flex justify-between items-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 shadow-md">
        <button
          className="text-white focus:outline-none"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
        <h1 className="text-lg font-semibold">Chat</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for Friends */}
        <div className="p-4 h-full flex flex-col bg-gray-100">
  <h2 className="text-2xl font-bold mb-4">Friends</h2>
  {loadingFriends && <p>Loading friends...</p>}
  {error && <p className="text-red-500">{error}</p>}
  <div className="flex-1 overflow-y-auto">
    {acceptedFriends.length === 0 && <p>No friends available.</p>}
    {acceptedFriends.map((friend) => (
      <div
        key={friend.id}
        className="flex items-center p-2 mb-2 cursor-pointer hover:bg-gray-200 rounded"
        onClick={() => handleFriendClick(friend)}
      >
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center mr-3">
          {friend.profile_picture ? (
            <img
              src={friend.profile_picture}
              alt={friend.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xl font-bold text-white">
              {friend.name[0]}
            </span>
          )}
        </div>
        <div className="flex-1">
          <p className="font-semibold">{friend.name}</p>
          <p className="text-sm text-gray-500 truncate">
            {friend.latestMessage?.content || "No messages yet"}
          </p>
        </div>
        {friend.latestMessage && (
          <span className="text-xs text-gray-400 ml-2">
            {formatTimestamp(friend.latestMessage.created_at)}
          </span>
        )}
      </div>
    ))}
  </div>
</div>


        {/* Chat Area */}
        <div className="flex-1 md:ml-80 bg-white flex flex-col">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 shadow-md">
            <h2 className="text-lg font-semibold">
              {selectedFriend ? selectedFriend.name : "Select a friend"}
            </h2>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {loadingMessages && <p>Loading messages...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <div>
              {Object.keys(groupedMessages).map((date) => (
                <div key={date} className="mb-4">
                  <p className="text-center text-gray-500 font-semibold mb-2">{date}</p>
                  {groupedMessages[date].map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.isSentByCurrentUser ? "justify-end" : "justify-start"
                      } mb-2`}
                    >
                      <div
                        className={`p-3 rounded-lg ${
                          msg.isSentByCurrentUser
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-black"
                        }`}
                      >
                        {msg.content}
                        {msg.file_name && (
                          <div className="mt-2">
                            <a
                              href={msg.content}
                              className="text-blue-500 underline"
                              download={msg.file_name}
                            >
                              {msg.file_name}
                            </a>
                          </div>
                        )}
                        <p className="text-xs text-gray-400 mt-1">{msg.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Chat Input */}
          <div className="bg-gray-100 p-4 border-t border-gray-200">
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              id="fileInput"
            />
            <div className="flex items-center">
              <button
                className="bg-gray-300 p-2 rounded-full hover:bg-gray-400"
                onClick={() => document.getElementById("fileInput").click()}
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2 4 4 8-8 4 4"
                  ></path>
                </svg>
              </button>
              <textarea
                className="flex-1 border border-gray-300 p-2 rounded-lg ml-2"
                rows="2"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
              <button
                className="bg-blue-500 text-white p-2 rounded-lg ml-2 hover:bg-blue-600"
                onClick={handleNewUserMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
