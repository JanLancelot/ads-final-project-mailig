import React from 'react';

interface MessageProps {
  message: {
    text: string;
    sender: string;
    // timestamp: number; 
  };
}

const Message = ({ message }: MessageProps) => {
  const isUser = message.sender === 'admin@example.com'; // Replace with actual admin email

  return (
    <div className={`flex mb-2 ${isUser ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`px-4 py-2 rounded-lg ${
          isUser ? 'bg-gray-300 text-black' : 'bg-blue-500 text-white'
        }`}
      >
        <p className="font-medium">{message.text}</p>
        {/* <p className="text-xs text-gray-600">{formatTimestamp(message.timestamp)}</p> */}
      </div>
    </div>
  );
};

export default Message;