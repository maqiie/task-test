import React from 'react';
import PropTypes from 'prop-types';

const Message = ({ message, currentUser }) => {
  const isSent = message.user_id === currentUser.id;
  return (
    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-xs px-4 py-2 rounded-lg text-white ${isSent ? 'bg-blue-500' : 'bg-gray-300'}`}
      >
        <p>{message.content}</p>
      </div>
    </div>
  );
};

Message.propTypes = {
  message: PropTypes.shape({
    content: PropTypes.string.isRequired,
    user_id: PropTypes.number.isRequired,
  }).isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
};

export default Message;
