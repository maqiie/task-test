/* eslint-disable */


import { createConsumer } from "@rails/actioncable";

const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
const backendHost = 'localhost:3001'; // Adjust as needed
// const backendHost = 'task-test-backend.onrender.com';

const cableUrl = `${protocol}://${backendHost}/cable`;

const consumer = createConsumer(cableUrl);

const attemptReconnect = (channelName, subscription) => {
  console.log(`Attempting to reconnect to ${channelName}...`);
  setTimeout(() => {
    createSubscription(channelName, subscription.params);
  }, 5000); // Reconnect after 5 seconds
};

const createSubscription = (channelName, params, callbacks = {}) => {
  console.log(`Creating subscription to ${channelName} with params:`, params);
  
  return consumer.subscriptions.create(
    { channel: channelName, ...params },
    {
      connected() {
        console.log(`Connected to ${channelName}.`);
      },
      disconnected() {
        console.warn(`Disconnected from ${channelName}.`);
        attemptReconnect(channelName, this);
      },
      received(data) {
        console.log(`Received data from ${channelName}:`, data);
        if (callbacks.received) {
          callbacks.received(data);
        }
      },
      rejected() {
        console.warn(`Subscription to ${channelName} was rejected.`);
      }
    }
  );
};

export const notificationsSubscription = createSubscription("NotificationsChannel", {}, {
  received(data) {
    console.log("Received notification data:", data);
    // Handle notification data (e.g., show toast notification)
  }
});

export const createChatSubscription = (chatroomId, callbacks) => {
  return createSubscription("ChatChannel", { chatroom_id: chatroomId }, {
    received(data) {
      console.log(`Received chat message data for chatroom ${chatroomId}:`, data);
      if (callbacks.received) {
        callbacks.received(data);
      }
    }
  });
};

export default consumer;


// import { createConsumer } from "@rails/actioncable";

// const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
// const backendHost = 'localhost:3001'; // Adjust as needed
// // const backendHost = 'task-test-backend.onrender.com';

// const cableUrl = `${protocol}://${backendHost}/cable`;

// const consumer = createConsumer(cableUrl);

// const maxReconnectAttempts = 10; // Maximum number of reconnect attempts
// let reconnectAttempts = 0;

// const attemptReconnect = (channelName, subscription) => {
//   if (reconnectAttempts < maxReconnectAttempts) {
//     console.log(`Attempting to reconnect to ${channelName}...`);
//     reconnectAttempts++;
//     setTimeout(() => {
//       createSubscription(channelName, subscription.params);
//     }, 5000); // Reconnect after 5 seconds
//   } else {
//     console.error(`Max reconnect attempts reached for ${channelName}.`);
//   }
// };

// const createSubscription = (channelName, params, callbacks = {}) => {
//   console.log(`Creating subscription to ${channelName} with params:`, params);
  
//   return consumer.subscriptions.create(
//     { channel: channelName, ...params },
//     {
//       connected() {
//         console.log(`Connected to ${channelName}.`);
//         reconnectAttempts = 0; // Reset attempts on successful connection
//       },
//       disconnected() {
//         console.warn(`Disconnected from ${channelName}.`);
//         attemptReconnect(channelName, this);
//       },
//       received(data) {
//         console.log(`Received data from ${channelName}:`, data);
//         if (callbacks.received) {
//           callbacks.received(data);
//         }
//       },
//       rejected() {
//         console.warn(`Subscription to ${channelName} was rejected.`);
//       }
//     }
//   );
// };

// export const notificationsSubscription = createSubscription("NotificationsChannel", {}, {
//   received(data) {
//     console.log("Received notification data:", data);
//     // Handle notification data (e.g., show toast notification)
//   }
// });

// export const createChatSubscription = (chatroomId, callbacks) => {
//   return createSubscription("ChatChannel", { chatroom_id: chatroomId }, {
//     received(data) {
//       console.log(`Received chat message data for chatroom ${chatroomId}:`, data);
//       if (callbacks.received) {
//         callbacks.received(data);
//       }
//     }
//   });
// };

// export default consumer;
