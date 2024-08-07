
// // export default cable;
// import { createConsumer } from "@rails/actioncable";

// // Ensure the URL is correct and uses wss:// for secure connections
// const consumer = createConsumer("wss://task-test-backend.onrender.com/cable");

// export default consumer;

// actionCableConsumer.js
// actionCableConsumer.js
// import { createConsumer } from "@rails/actioncable";

// const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
// const backendHost = 'task-test-backend.onrender.com';
// const cableUrl = `${protocol}://${backendHost}/cable`;

// const consumer = createConsumer(cableUrl);

// consumer.connection.addEventListener('error', (error) => {
//   console.error("WebSocket error:", error);
// });

// consumer.connection.addEventListener('close', (event) => {
//   console.warn("WebSocket closed:", event);
//   // Attempt to reconnect
//   setTimeout(() => {
//     consumer.connection.open();
//   }, 5000);
// });

// export default consumer;

import { createConsumer } from "@rails/actioncable";

const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
const backendHost = 'task-test-backend.onrender.com';
const cableUrl = `${protocol}://${backendHost}/cable`;

const consumer = createConsumer(cableUrl);

// Replace "NotificationsChannel" with the name of your channel
const subscription = consumer.subscriptions.create("NotificationsChannel", {
  connected() {
    console.log("Connected to NotificationsChannel.");
  },
  disconnected() {
    console.warn("Disconnected from NotificationsChannel.");
    // Attempt to reconnect
    setTimeout(() => {
      consumer.subscriptions.create("NotificationsChannel"); // Recreate subscription
    }, 5000);
  },
  received(data) {
    console.log("Received data:", data);
  },
  rejected() {
    console.warn("Subscription rejected");
  }
});

export default consumer;
