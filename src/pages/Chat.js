// chat.js
import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { getAuth } from "firebase/auth";
import { db } from "../firebase";

const auth = getAuth();


function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userRef = db.collection('users').doc(user.uid);
      const messagesRef = userRef.collection('messages');

      // Get all users
      db.collection('users')
        .get()
        .then((snapshot) => {
          const allUsers = snapshot.docs.map((doc) => ({
            id: doc.id,
            email: doc.data().email,
          }));
          setUsers(allUsers);
        });

      // Listen for new messages
      messagesRef.onSnapshot((snapshot) => {
        const allMessages = snapshot.docs.map((doc) => doc.data());
        setMessages(allMessages);
      });
    } else {
      // User is not logged in, redirect to login page
      window.location.href = '/login'; // Replace with your login page URL
    }
  }, []);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    const user = auth.currentUser;
    if (user) {
      const userRef = db.collection('users').doc(user.uid);
      const messagesRef = userRef.collection('messages');

      await messagesRef.add({
        text: newMessage,
        sender: 'user',
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });

      setNewMessage('');
    }
  };

  const handleAdminMessage = async () => {
    if (newMessage.trim() === '') return;

    if (selectedUser) {
      const userRef = db.collection('users').doc(selectedUser.id);
      const messagesRef = userRef.collection('messages');

      await messagesRef.add({
        text: newMessage,
        sender: 'admin',
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });

      setNewMessage('');
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-200 p-4">
        <h2 className="text-lg font-bold mb-4">Users</h2>
        <ul>
          {users.map((user) => (
            <li
              key={user.id}
              className={`cursor-pointer ${
                selectedUser?.id === user.id ? 'bg-blue-500 text-white' : ''
              }`}
              onClick={() => setSelectedUser(user)}
            >
              {user.email}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg shadow-lg p-4 h-full flex flex-col">
          <div className="flex-1 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-200 text-blue-800 self-start'
                    : 'bg-green-200 text-green-800 self-end'
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>
          <div className="mt-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full border-2 border-gray-300 p-2 rounded-lg"
              placeholder="Type your message..."
            />
            <div className="mt-2 flex justify-end">
              {auth.currentUser ? (
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Send
                </button>
              ) : (
                <button
                  onClick={handleAdminMessage}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg"
                >
                  Send as Admin
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;