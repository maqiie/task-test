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

const consumer = createConsumer("ws://https://tasked-f9aa59675043.herokuapp.com/cable"); // Ensure this URL is correct

export default consumer;

