
// // export default cable;
// import { createConsumer } from "@rails/actioncable";

// // Ensure the URL is correct and uses wss:// for secure connections
// const consumer = createConsumer("wss://task-test-backend.onrender.com/cable");

// export default consumer;

import { createConsumer } from "@rails/actioncable";

// Determine the protocol to use for WebSocket connections
const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
// Use the appropriate host for your backend
const backendHost = 'task-test-backend.onrender.com';
// Construct the full WebSocket URL
const cableUrl = `${protocol}://${backendHost}/cable`;

const consumer = createConsumer(cableUrl);

export default consumer;
