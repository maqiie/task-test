// actionCableConsumer.js

// import { createConsumer } from "@rails/actioncable";

// const cable = createConsumer();

// cable.subscriptions.create("NotificationsChannel", {
//   connected() {
//     console.log("Connected to notifications channel.");
//   },
//   disconnected() {
//     console.log("Disconnected from notifications channel.");
//   },
//   received(data) {
//     console.log("Received data from notifications channel:", data);
//     // Add logic to update your UI here
//   }
// });

// export default cable;
import { createConsumer } from "@rails/actioncable";

// Ensure the URL is correct and uses wss:// for secure connections
const consumer = createConsumer("wss://task-test-backend.onrender.com/cable");

export default consumer;
