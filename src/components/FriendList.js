import React from 'react';

const FriendList = ({ friends, loading, onFriendClick, error }) => {
  return (
    <div className="w-full md:w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-xl font-semibold">Friends</h2>
      </div>
      <div>
        {loading ? (
          <p className="text-center text-gray-500">Loading friends...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <ul>
            {friends.map((friend) => (
              <li
                key={friend.id}
                className="cursor-pointer p-3 hover:bg-gray-100 flex justify-between items-center"
                onClick={() => onFriendClick(friend)}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 mr-3">
                    {friend.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{friend.name}</p>
                    <p className="text-gray-500 text-sm">{friend.latestMessage}</p>
                  </div>
                </div>
                <span className="text-gray-400 text-xs">{friend.lastMessageTime}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FriendList;
