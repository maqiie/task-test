/* eslint-disable */



// import React, { useEffect, useState, useCallback } from 'react';
// import { MessageBox, Button } from 'react-chat-elements';
// import 'react-chat-elements/dist/main.css';
// import apiClient from '../services/apiService';
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

//   // Fetch accepted friends
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

//   // Initialize WebSocket subscription
//   const initializeChatSubscription = useCallback((roomId) => {
//     console.log('Initializing chat subscription for room:', roomId);
    
//     if (chatChannel) {
//       console.log('Unsubscribing from previous chat channel');
//       chatChannel.unsubscribe();
//     }

//     const newChatChannel = createChatSubscription(roomId, {
//       received(data) {
//         console.log('Received message:', data.message); // Log the received message
//         setMessages((prevMessages) => [...prevMessages, data.message]);
//       }
//     });

//     setChatChannel(newChatChannel);
//   }, [chatChannel]);

//   // Handle friend click
//   const handleFriendClick = async (friend) => {
//     try {
//       const response = await apiClient.get(`/chatrooms/check_or_create`, {
//         params: { user2_id: friend.id },
//       });

//       if (response.status === 200) {
//         const chatroom = response.data;
//         setRoomId(chatroom.id);
//         setSelectedFriend(friend);
//         setMessages([]); // Clear previous messages for the new chat
//         setSidebarOpen(false);

//         initializeChatSubscription(chatroom.id); // Initialize chat subscription when roomId changes
//       } else {
//         setError('Error fetching or creating chatroom.');
//         console.error('Error fetching or creating chatroom:', response.data.error);
//       }
//     } catch (error) {
//       setError('Error handling friend click.');
//       console.error('Error handling friend click:', error.message);
//     }
//   };

//   // Fetch messages on roomId change
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
//         console.error('Error fetching messages:', error.message);
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
//         console.log('Cleaning up chat channel');
//         chatChannel.unsubscribe();
//       }
//     };
//   }, [chatChannel]);

//   // Handle new user message
//   const handleNewUserMessage = () => {
//     if (!chatroomId || !messageInput.trim()) return;
  
//     if (chatChannel) {
//       console.log('Sending message:', messageInput); // Log message being sent
//       chatChannel.perform('send_message', {
//         chatroom_id: chatroomId,
//         content: messageInput,
//         sender_id: currentUser.id // Ensure you include sender_id
//       });
//       setMessageInput(''); // Clear the input after sending
//     } else {
//       console.error('Chat channel not found');
//     }
//   };
  

//   // Handle file upload
//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       if (chatChannel) {
//         chatChannel.perform('send_message', {
//           room: chatroomId,
//           content: reader.result,
//           file_name: file.name,
//           file_type: file.type,
//           sender_id: currentUser.id, // Include sender_id
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
//       <div className="md:hidden flex justify-between items-center bg-indigo-600 text-white p-4 shadow-md">
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

//       <div className="flex flex-1">
//         {/* Sidebar for Friends */}
//         <div
//           className={`fixed inset-y-0 left-0 transform ${
//             sidebarOpen ? 'translate-x-0' : '-translate-x-full'
//           } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out w-80 bg-indigo-800 text-white flex flex-col shadow-lg z-50`}
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
//               <p className="text-center">Loading friends...</p>
//             ) : error ? (
//               <p className="text-red-500 text-center">{error}</p>
//             ) : (
//               acceptedFriends.map((friend) => (
//                 <div
//                   key={friend.id}
//                   className="cursor-pointer p-2 hover:bg-indigo-700 rounded-md"
//                   onClick={() => handleFriendClick(friend)}
//                 >
//                   <p>{friend.name}</p>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>

//         {/* Chat Area */}
//         <div className="flex-1 flex flex-col">
//           <div className="flex-1 overflow-y-auto p-4">
//             {chatroomId ? (
//               <>
//                 {loadingMessages && <p className="text-center">Loading messages...</p>}
//                 {error && <p className="text-red-500 text-center">{error}</p>}
//                 {messages.map((message, index) => (
//                   <MessageBox
//                     key={index}
//                     position={message.sender_id === currentUser.id ? 'right' : 'left'}
//                     type={message.file_name ? 'photo' : 'text'}
//                     text={message.content}
//                     date={new Date(message.created_at)}
//                   />
//                 ))}
//               </>
//             ) : (
//               <p className="text-center mt-8">Select a friend to start chatting.</p>
//             )}
//           </div>

//           {/* Message Input */}
//           <div className="p-4 bg-gray-200 border-t border-gray-300">
//             <input
//               type="file"
//               accept="image/*,video/*"
//               onChange={handleFileUpload}
//               className="mb-2"
//             />
//             <input
//               type="text"
//               value={messageInput}
//               onChange={(e) => setMessageInput(e.target.value)}
//               className="w-full p-2 border border-gray-300 rounded-md"
//               placeholder="Type a message..."
//             />
//             <button
//               onClick={handleNewUserMessage}
//               className="mt-2 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
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


// import React, { useEffect, useState, useCallback } from 'react';
// import {
//   MessageBox,
//   MessageList,
//   Input,
//   Button,
//   Avatar,
//   SideBar,
// } from 'react-chat-elements';
// import 'react-chat-elements/dist/main.css';
// import apiClient from '../services/apiService';
// import { createChatSubscription } from '../actionCableConsumer'; // Adjust path as needed

// const Chat = ({ currentUser }) => {
//   const [messages, setMessages] = useState([]);
//   const [acceptedFriends, setAcceptedFriends] = useState([]);
//   const [selectedFriend, setSelectedFriend] = useState(null);
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
//       console.log(`Unsubscribing from chatroom ${chatroomId}`);
//       chatChannel.unsubscribe();
//     }

//     console.log(`Subscribing to chatroom ${roomId}`);
//     const newChatChannel = createChatSubscription(roomId, {
//       received(data) {
//         console.log('Received message:', data.message);
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
//         initializeChatSubscription(chatroom.id);
//       } else {
//         setError('Error fetching or creating chatroom.');
//         console.error('Error fetching or creating chatroom:', response.data.error);
//       }
//     } catch (error) {
//       setError('Error handling friend click.');
//       console.error('Error handling friend click:', error.message);
//     }
//   };

//   useEffect(() => {
//     if (!chatroomId) return;

//     const fetchMessages = async () => {
//       setLoadingMessages(true);
//       setError(null);

//       try {
//         const response = await apiClient.get(`/chatrooms/${chatroomId}/messages`);
//         setMessages(response.data || []); // Update messages state with fetched data
//       } catch (error) {
//         setError('Error fetching messages.');
//         console.error('Error fetching messages:', error.message);
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
//           room: chatroomId,
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
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className="w-64 bg-white border-r border-gray-200">
//         <SideBar
//           top={
//             <div className="p-4">
//               <input
//                 type="text"
//                 placeholder="Search friends..."
//                 className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
//               />
//             </div>
//           }
//           center={
//             loadingFriends ? (
//               <p className="text-center text-gray-500">Loading friends...</p>
//             ) : error ? (
//               <p className="text-red-500 text-center">{error}</p>
//             ) : (
//               acceptedFriends.map((friend) => (
//                 <div
//                   key={friend.id}
//                   className="flex items-center p-2 mb-2 cursor-pointer rounded-md hover:bg-indigo-100 transition"
//                   onClick={() => handleFriendClick(friend)}
//                 >
//                   <Avatar src={friend.avatar || undefined} size="40" alt={friend.name} className="mr-3" />
//                   <p className="text-gray-700">{friend.name}</p>
//                 </div>
//               ))
//             )
//           }
//         />
//       </div>

//       {/* Chat Area */}
//       <div className="flex-1 flex flex-col">
//         {selectedFriend ? (
//           <>
//             {/* Chat Header */}
//             <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow">
//               <div className="flex items-center">
//                 <Avatar src={selectedFriend.avatar || undefined} size="40" alt={selectedFriend.name} className="mr-3" />
//                 <h2 className="text-lg font-semibold text-gray-700">{selectedFriend.name}</h2>
//               </div>
//             </div>

//             {/* Messages */}
//             <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
//               <MessageList
//                 className="message-list"
//                 lockable={true}
//                 toBottomHeight={"100%"}
//                 dataSource={messages.map((message) => ({
//                   position: message.sender_id === currentUser.id ? 'right' : 'left',
//                   type: 'text',
//                   text: message.content,
//                   date: new Date(message.timestamp),
//                 }))}
//               />
//             </div>

//             {/* Input Area */}
//             <div className="p-4 bg-white border-t border-gray-200 flex items-center">
//               <Input
//                 placeholder="Type a message..."
//                 defaultValue={messageInput}
//                 multiline={false}
//                 onChange={(value) => setMessageInput(value)}
//                 rightButtons={
//                   <Button
//                     text="Send"
//                     onClick={handleNewUserMessage}
//                     title="Send"
//                     type="primary"
//                   />
//                 }
//               />
//               <input
//                 type="file"
//                 onChange={handleFileUpload}
//                 className="ml-2"
//                 id="file-upload"
//                 style={{ display: 'none' }}
//               />
//               <label htmlFor="file-upload" className="ml-2 cursor-pointer text-blue-500">
//                 <svg
//                   className="w-6 h-6"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 17l6-6 4 4 8-8"></path>
//                 </svg>
//               </label>
//             </div>
//           </>
//         ) : (
//           <div className="flex items-center justify-center flex-1 bg-gray-50">
//             <p className="text-lg font-semibold text-gray-500">Select a friend to start chatting</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Chat;



import React, { useEffect, useState, useCallback } from 'react';
import apiClient from '../services/apiService'; // Adjust path as needed
import { createChatSubscription } from '../actionCableConsumer'; // Adjust path as needed
import './Chat.css'; // Ensure Tailwind CSS is included
import ChatBubble from 'react-chat-bubble';


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
        setMessages((prevMessages) => [...prevMessages, data.message]);
        if (Notification.permission === 'granted') {
          new Notification('New message', { body: data.message.content });
        }
      }
    });

    setChatChannel(newChatChannel);
  }, [chatChannel]);

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
        console.error('Error fetching or creating chatroom:', response.data.error);
      }
    } catch (error) {
      setError('Error handling friend click.');
      console.error('Error handling friend click:', error.message);
    }
  };

  useEffect(() => {
    if (!chatroomId) return;

    const fetchMessages = async () => {
      setLoadingMessages(true);
      setError(null);

      try {
        const response = await apiClient.get(`/chatrooms/${chatroomId}/messages`);
        setMessages(response.data || []); // Update messages state with fetched data
      } catch (error) {
        setError('Error fetching messages.');
        console.error('Error fetching messages:', error.message);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [chatroomId]);

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
        sender_id: currentUser.id
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
    <div className="flex flex-col bg-gray-100">
      {/* Header for Small Screens */}
      <div className="md:hidden flex justify-between items-center bg-indigo-600 text-white p-4 shadow-md">
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
  
      <div className="flex flex-1">
        {/* Sidebar for Friends */}
        <div
          className={`fixed inset-y-0 left-0 transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out w-80 bg-indigo-800 text-white flex flex-col shadow-lg z-50`}
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
                {acceptedFriends.map((friend) => (
                  <li
                    key={friend.id}
                    className="cursor-pointer p-3 hover:bg-indigo-700 rounded transition duration-300 ease-in-out"
                    onClick={() => handleFriendClick(friend)}
                  >
                    {friend.name}
                  </li>
                ))}
              </ul>
            )}
            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
          </div>
        </div>
  
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
  {/* Messages Container */}
   <div className="flex-1 overflow-y-auto p-4 bg-white shadow-md">
    {loadingMessages ? (
      <p className="text-center text-gray-400">Loading messages...</p>
    ) : (
      <div className="space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-xs ${
              msg.sender_id === currentUser.id
                ? 'bg-indigo-600 text-white self-end align-self-end'
                : 'bg-gray-100 text-black self-start'
            }`}
          >
            <p className={`break-words ${msg.sender_id === currentUser.id ? 'text-right' : 'text-left'}`}>
              {msg.content}
            </p>
            <div className={`text-xs text-gray-500 mt-1 ${
              msg.sender_id === currentUser.id ? 'text-right' : 'text-left'
            }`}>
              {msg.timestamp}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>

  {/* Message Input and Actions */}
  <div className="p-4 bg-gray-200 border-t flex flex-col">
    <div className="flex items-center space-x-2">
      <input
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        className="flex-1 p-2 border rounded"
        placeholder="Type a message..."
      />
      <button
        onClick={handleNewUserMessage}
        className="ml-2 bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition"
      >
        Send
      </button>
    </div>
    <input
      type="file"
      onChange={handleFileUpload}
      className="mt-2 border rounded"
    />
  </div> 



</div>

      </div>
    </div>
  );
  
};

export default Chat;
