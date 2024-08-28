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

import React, { useEffect, useState, useCallback } from 'react';
import apiClient from '../services/apiService'; // Adjust path as needed
import { createChatSubscription } from '../actionCableConsumer'; // Adjust path as needed

const Chat = ({ currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [acceptedFriends, setAcceptedFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatroomId, setRoomId] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [chatChannel, setChatChannel] = useState(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [error, setError] = useState(null);

  const fetchAcceptedFriends = useCallback(async () => {
    if (!currentUser) return;

    setLoadingFriends(true);
    setError(null);

    try {
      const response = await apiClient.get(`/friend_requests/${currentUser.id}/accepted`);
      setAcceptedFriends(response.data || []);
    } catch (error) {
      setError('Error fetching accepted friends.');
      console.error('Error fetching accepted friends:', error.message);
    } finally {
      setLoadingFriends(false);
    }
  }, [currentUser]);

  const initializeChatSubscription = useCallback((roomId) => {
    if (chatChannel) {
      chatChannel.unsubscribe();
    }

    const newChatChannel = createChatSubscription(roomId, {
      received(data) {
        if (data.message) {
          const isSentByCurrentUser = data.message.sender_id === currentUser.id;
          const formattedMessage = {
            ...data.message,
            isSentByCurrentUser,
            timestamp: new Date(data.message.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          };
          setMessages((prevMessages) => [...prevMessages, formattedMessage]);

          if (Notification.permission === 'granted') {
            new Notification('New message', { body: data.message.content });
          }
        } else {
          console.error('Received data without a message:', data);
        }
      }
    });

    setChatChannel(newChatChannel);
  }, [chatChannel, currentUser.id]);

  const handleFriendClick = async (friend) => {
    try {
      const response = await apiClient.get(`/chatrooms/check_or_create`, {
        params: { user2_id: friend.id },
      });

      if (response.status === 200) {
        const chatroom = response.data;
        setRoomId(chatroom.id);
        setSelectedFriend(friend);
        setMessages([]); // Clear messages state when opening a new chatroom
        setSidebarOpen(false);

        initializeChatSubscription(chatroom.id);
      } else {
        setError('Error fetching or creating chatroom.');
      }
    } catch (error) {
      setError('Error handling friend click.');
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
          timestamp: new Date(msg.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error.message);
        setError('Error fetching messages.');
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
    return () => {
      if (chatChannel) {
        chatChannel.unsubscribe();
      }
    };
  }, [chatChannel]);

  const handleNewUserMessage = () => {
    if (!chatroomId || !messageInput.trim()) return;

    if (chatChannel) {
      chatChannel.perform('send_message', {
        chatroom_id: chatroomId,
        content: messageInput,
        sender_id: currentUser.id,
      });
      setMessageInput('');
    } else {
      console.error('Chat channel not found');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (chatChannel) {
        chatChannel.perform('send_message', {
          chatroom_id: chatroomId,
          content: reader.result,
          file_name: file.name,
          file_type: file.type,
          sender_id: currentUser.id,
        });
      } else {
        console.error('Chat channel not found');
      }
    };
    reader.readAsDataURL(file);
  };

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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
        <h1 className="text-lg font-semibold">Chat</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for Friends */}
        <div
          className={`fixed inset-y-0 left-0 transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out w-80 bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex flex-col shadow-lg z-50`}
        >
          <div className="p-4 border-b border-indigo-700 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Friends</h2>
            <button
              className="md:hidden text-white focus:outline-none"
              onClick={() => setSidebarOpen(false)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div className="p-4 flex-1 overflow-y-auto">
            {loadingFriends ? (
              <p className="text-center text-gray-400">Loading friends...</p>
            ) : (
              <ul>
                {acceptedFriends.length > 0 ? (
                  acceptedFriends.map((friend) => (
                    <li
                      key={friend.id}
                      className="cursor-pointer p-3 hover:bg-indigo-700 rounded transition duration-300 ease-in-out"
                      onClick={() => handleFriendClick(friend)}
                    >
                      {friend.name}
                    </li>
                  ))
                ) : (
                  <p className="text-center text-gray-400">No friends available.</p>
                )}
              </ul>
            )}
            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="hidden md:flex bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 shadow-md">
            <h1 className="text-lg font-semibold">{selectedFriend ? selectedFriend.name : 'Select a friend'}</h1>
          </div>

          {/* Messages Display */}
          <div className="flex-1 p-4 overflow-y-auto">
            {loadingMessages ? (
              <p className="text-center text-gray-400">Loading messages...</p>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.isSentByCurrentUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg shadow ${
                        message.isSentByCurrentUser
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs text-right mt-1 opacity-75">
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Message Input */}
          {chatroomId && (
            <div className="p-4 bg-gray-100 flex items-center">
              <input
                type="text"
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleNewUserMessage}
                className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition duration-300 ease-in-out"
              >
                Send
              </button>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition duration-300 ease-in-out"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
