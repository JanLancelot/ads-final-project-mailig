import React, { useState, useEffect } from 'react';
import { database } from '../firebase';
import { ref, onValue, push } from 'firebase/database';
import Message from './Message';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase'; 

const ChatRoom = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]); 
  const [user] = useAuthState(auth);

  useEffect(() => {
    const messagesRef = ref(database, 'messages/'); // Reference to your database path
    onValue(messagesRef, (snapshot) => {
      const messageData = snapshot.val();
      if (messageData) {
        const messageList = Object.entries(messageData).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setMessages(messageList);
      }
    });

    // Clean up listener on unmount
    return () => onValue(messagesRef, () => {});
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const messagesRef = ref(database, 'messages/');
    push(messagesRef, {
      text: message,
      sender: user?.email || 'Guest', // Get sender (user email or 'Guest')
      timestamp: Date.now(),
    });

    setMessage('');
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow p-4 bg-gray-100 overflow-y-auto"> 
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex p-4 bg-white">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow px-4 py-2 mr-2 rounded border focus:outline-none focus:ring focus:border-blue-300"
        />
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;