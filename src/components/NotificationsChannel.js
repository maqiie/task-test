

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
