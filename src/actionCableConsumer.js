
// // export default cable;
// import { createConsumer } from "@rails/actioncable";

// // Ensure the URL is correct and uses wss:// for secure connections
// const consumer = createConsumer("wss://task-test-backend.onrender.com/cable");

// export default consumer;

// actionCableConsumer.js
// actionCableConsumer.js
import { createConsumer } from "@rails/actioncable";

const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
const backendHost = 'task-test-backend.onrender.com';
const cableUrl = `${protocol}://${backendHost}/cable`;

const consumer = createConsumer(cableUrl);

consumer.connection.addEventListener('error', (error) => {
  console.error("WebSocket error:", error);
});

consumer.connection.addEventListener('close', (event) => {
  console.warn("WebSocket closed:", event);
  // Attempt to reconnect
  setTimeout(() => {
    consumer.connection.open();
  }, 5000);
});

export default consumer;


