/* eslint-disable */


// import { createConsumer } from "@rails/actioncable";

// const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
// const backendHost = 'task-test-backend.onrender.com';
// const cableUrl = `${protocol}://${backendHost}/cable`;

// const consumer = createConsumer(cableUrl);

// // Replace "NotificationsChannel" with the name of your channel
// const subscription = consumer.subscriptions.create("NotificationsChannel", {
//   connected() {
//     console.log("Connected to NotificationsChannel.");
//   },
//   disconnected() {
//     console.warn("Disconnected from NotificationsChannel.");
//     // Attempt to reconnect
//     setTimeout(() => {
//       consumer.subscriptions.create("NotificationsChannel"); // Recreate subscription
//     }, 5000);
//   },
//   received(data) {
//     console.log("Received data:", data);
//   },
//   rejected() {
//     console.warn("Subscription rejected");
//   }
// });

// export default consumer;



// import { createConsumer } from "@rails/actioncable";

// // Determine the protocol and set the backend host
// const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
// const backendHost = 'localhost:3001';
// const cableUrl = `${protocol}://${backendHost}/cable`;

// // Create a consumer instance for ActionCable
// const consumer = createConsumer(cableUrl);

// // Function to handle reconnection logic
// const attemptReconnect = (channelName, subscription) => {
//   console.log(`Attempting to reconnect to ${channelName}...`);
//   setTimeout(() => {
//     // Recreate the subscription with the same params
//     createSubscription(channelName, subscription.params); 
//   }, 5000); // Reconnect after 5 seconds
// };

// // Function to create a subscription to a specific channel
// const createSubscription = (channelName, params, callbacks = {}) => {
//   console.log(`Creating subscription to ${channelName} with params:`, params);
  
//   // Create and return the subscription
//   return consumer.subscriptions.create(
//     { channel: channelName, ...params },
//     {
//       connected() {
//         console.log(`Connected to ${channelName}.`);
//       },
//       disconnected() {
//         console.warn(`Disconnected from ${channelName}.`);
//         // Attempt to reconnect if disconnected
//         attemptReconnect(channelName, this);
//       },
//       received(data) {
//         console.log(`Received data from ${channelName}:`, data);
//         if (callbacks.received) {
//           console.log(`Handling received data for ${channelName}`);
//           callbacks.received(data);
//         }
//       },
//       rejected() {
//         console.warn(`Subscription to ${channelName} was rejected.`);
//       }
//     }
//   );
// };

// // Create and export the notifications subscription
// export const notificationsSubscription = createSubscription("NotificationsChannel", {}, {
//   received(data) {
//     console.log("Received notification data:", data);
//     // Handle notification data (e.g., show toast notification)
//   }
// });

// // Create and export the chat subscription
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


import { createConsumer } from "@rails/actioncable";

const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
const backendHost = 'localhost:3001'; // Adjust as needed
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
