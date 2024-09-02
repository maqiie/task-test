import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const ChatWindow = ({ currentUser, chatRoomId, messages, onNewUserMessage, loading, error, messagesEndRef }) => {
  const [messageInput, setMessageInput] = useState('');

  // Scroll to the bottom of the chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (messageInput.trim()) {
      onNewUserMessage(messageInput);
      setMessageInput('');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-100">
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Display loading or error messages */}
        {loading && <p>Loading messages...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Display messages */}
        <div className="flex flex-col space-y-2">
          {messages && messages.length > 0 ? (
            messages.map((msg) => {
              if (!msg || !msg.user || !msg.user.id) {
                return null; // Skip if message is not well-defined
              }

              const isSent = msg.user.id === currentUser.id;

              return (
                <div
                  key={msg.id}
                  className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-2`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${isSent ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'}`}
                  >
                    <p>{msg.content}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area for sending messages */}
      <div className="bg-white p-4 border-t border-gray-200">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type a message..."
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
        <button
          onClick={handleSendMessage}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

ChatWindow.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  chatRoomId: PropTypes.number.isRequired,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      content: PropTypes.string.isRequired,
      user: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      }).isRequired,
    })
  ).isRequired,
  onNewUserMessage: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  messagesEndRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
};

ChatWindow.defaultProps = {
  loading: false,
  error: null,
};

export default ChatWindow;
