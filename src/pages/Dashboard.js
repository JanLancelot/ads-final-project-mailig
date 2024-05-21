import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('messages');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const messagesRef = firebase.firestore().collection('messages');
    const unsubscribe = messagesRef.onSnapshot((snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);
    });

    return unsubscribe;
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="bg-gray-800 text-gray-100 w-64 p-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold">Dashboard</h2>
        </div>
        <nav>
          <a
            href="#"
            className={`block py-2 px-4 rounded ${
              activeTab === 'messages' ? 'bg-gray-700' : ''
            }`}
            onClick={() => setActiveTab('messages')}
          >
            Messages
          </a>
          <a
            href="#"
            className={`block py-2 px-4 rounded ${
              activeTab === 'content' ? 'bg-gray-700' : ''
            }`}
            onClick={() => setActiveTab('content')}
          >
            Content
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        {activeTab === 'messages' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Messages</h2>
            {messages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="bg-white shadow-md rounded-md p-4"
                  >
                    <h3 className="text-lg font-bold">{message.name}</h3>
                    <p className="text-gray-600">{message.email}</p>
                    <p className="mt-2">{message.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No messages found.</p>
            )}
          </div>
        )}
        {activeTab === 'content' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Content</h2>
            {/* Add your content tab logic here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;