/* eslint-disable */


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
