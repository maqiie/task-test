// import React, { useEffect, useState } from 'react';
// import { ActionCableConsumer } from '@thrash-industries/react-actioncable-provider';

// const NotificationsChannel = ({ currentUser, onNotificationReceived }) => {
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     if (currentUser) {
//       setMessages([]);
//     }
//   }, [currentUser]);

//   const handleReceivedMessage = (message) => {
//     setMessages((prevMessages) => [...prevMessages, message]);
//     if (onNotificationReceived) {
//       onNotificationReceived(message);
//     }
//   };

//   return (
//     currentUser && (
//       <ActionCableConsumer
//         channel={{ channel: 'NotificationsChannel', user_id: currentUser.id }}
//         onReceived={handleReceivedMessage}
//       >
//         {() => null} {/* Render a no-op function */}
//       </ActionCableConsumer>
//     )
//   );
// };

// export default NotificationsChannel;
// import React, { useEffect, useState } from 'react';
// import { ActionCableConsumer } from '@thrash-industries/react-actioncable-provider';

// const NotificationsChannel = ({ currentUser, onNotificationReceived }) => {
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     setMessages([]);
//   }, [currentUser]); // Reset messages when currentUser changes

//   const handleReceivedMessage = (message) => {
//     setMessages((prevMessages) => [...prevMessages, message]);
//     if (onNotificationReceived) {
//       onNotificationReceived(message);
//     }
//   };

//   return (
//     currentUser && (
//       <ActionCableConsumer
//         channel={{ channel: 'NotificationsChannel', user_id: currentUser.id }}
//         onReceived={handleReceivedMessage}
//         onDisconnected={() => {
//           console.log('Disconnected from NotificationsChannel');
//           // Implement reconnect or error handling logic here
//         }}
//       >
//         {() => null} {/* Render a no-op function */}
//       </ActionCableConsumer>
//     )
//   );
// };

// export default NotificationsChannel;
// import React, { useEffect, useState } from 'react';
// import { ActionCableConsumer } from '@thrash-industries/react-actioncable-provider';
// import consumer from './action_cable';

// const NotificationsChannel = ({ currentUser, onNotificationReceived }) => {
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     setMessages([]);
//   }, [currentUser]);

//   const handleReceivedMessage = (message) => {
//     setMessages((prevMessages) => [...prevMessages, message]);
//     if (onNotificationReceived) {
//       onNotificationReceived(message);
//     }
//   };

//   return (
//     currentUser && (
//       <ActionCableConsumer
//         consumer={consumer}
//         channel={{ channel: 'NotificationsChannel', user_id: currentUser.id }}
//         onReceived={handleReceivedMessage}
//         onDisconnected={() => {
//           console.log('Disconnected from NotificationsChannel');
//         }}
//       >
//         {() => null}
//       </ActionCableConsumer>
//     )
//   );
// };

// export default NotificationsChannel;
// import React, { useEffect, useState } from 'react';
// import { ActionCableConsumer } from '@thrash-industries/react-actioncable-provider';
// import consumer from '../actionCable'; // Ensure this consumer setup matches your backend

// const NotificationsChannel = ({ currentUser }) => {
//   const [notifications, setNotifications] = useState([]);

//   useEffect(() => {
//     if (currentUser) {
//       const cable = consumer.subscriptions.create(
//         { channel: 'NotificationsChannel', user_id: currentUser.id },
//         {
//           received: (data) => {
//             console.log('Received notification:', data);
//             setNotifications(prevNotifications => [...prevNotifications, data]);
//           },
//           connected: () => console.log('Connected to NotificationsChannel'),
//           disconnected: () => console.log('Disconnected from NotificationsChannel'),
//           rejected: () => console.log('Connection rejected from NotificationsChannel'),
//         }
//       );

//       return () => {
//         cable.unsubscribe();
//       };
//     }
//   }, [currentUser]);

//   return (
//     <div>
//       <h2>Notifications</h2>
//       <ul>
//         {notifications.map((notification, index) => (
//           <li key={index}>{notification.message}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default NotificationsChannel;
// app/javascript/channels/notifications_channel.js

import consumer from "./consumer";

consumer.subscriptions.create({ channel: "NotificationsChannel" }, {
  connected() {
    console.log("Connected to NotificationsChannel");
    // Additional initialization logic if needed
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    console.log("Received:", data);
    // Handle received data here, update UI, etc.
  }
});
