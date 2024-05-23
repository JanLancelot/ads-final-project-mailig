// Chat.js
import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../firebase';
import { ref, push, onValue, serverTimestamp } from "firebase/database";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const messagesRef = ref(db, 'messages');
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const fetchedMessages = [];
      for (let id in data) {
        fetchedMessages.push({ id, ...data[id] });
      }
      fetchedMessages.sort((a, b) => a.createdAt - b.createdAt);
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages update
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (message.trim() !== "") {
      try {
        await push(ref(db, 'messages'), {
          text: message,
          sender: auth.currentUser.uid, // Assuming you have user authentication
          createdAt: serverTimestamp()
        });
        setMessage(""); // Clear the input field
      } catch (error) {
        console.error("Error adding message: ", error);
      }
    }
  };

  return (
    <div className="flex h-screen antialiased text-gray-800">
      <div className="flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-gray-100 flex items-center justify-between py-3 px-5 border-b-2 border-gray-200">
          <h2 className="text-lg font-medium">Chat with Admin</h2>
        </div>
        <div className="flex flex-col flex-grow h-0 p-4 overflow-auto">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${
                message.sender === auth.currentUser.uid ? 'justify-end' : 'justify-start'
              } mb-4`}
            >
              <div
                className={`relative max-w-xs px-4 py-2 rounded-lg shadow-md text-sm ${
                  message.sender === auth.currentUser.uid ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                }`}
              >
                <span>{message.text}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} /> {/* Empty div for scrolling to bottom */}
        </div>
        <form onSubmit={handleSubmit} className="bg-gray-100 py-3 px-5 border-t-2 border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-blue-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-0 items-center justify-center h-full w-10 text-blue-500"
            >
              <svg
                className="w-6 h-6 transform rotate-90"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
