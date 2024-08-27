import consumer from "./consumer";

/**
 * Create a chat channel subscription for a given room ID.
 * @param {number} roomId - The ID of the chat room to subscribe to.
 * @param {function} onReceived - Callback function to handle incoming data.
 */
const createChatChannel = (roomId, onReceived) => {
  return consumer.subscriptions.create(
    { channel: "ChatChannel", room_id: roomId },
    {
      connected() {
        console.log(`Connected to ChatChannel for room ${roomId}.`);
      },

      disconnected() {
        console.warn(`Disconnected from ChatChannel for room ${roomId}.`);
      },

      received(data) {
        console.log("Received data:", data);
        if (onReceived) {
          onReceived(data);
        }
      },

      sendMessage(message) {
        this.perform('send_message', { message: message });
      }
    }
  );
};

export default createChatChannel;
