import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import firebase from 'firebase/app';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const unsubscribe = firestore
      .collection('messages')
      .orderBy('createdAt')
      .onSnapshot(snapshot => {
        const messages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMessages(messages);
      });

    return () => unsubscribe();
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    await firestore.collection('messages').add({
      text: newMessage,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-auto p-4">
        {messages.map(message => (
          <div key={message.id} className="mb-2">
            <div className="bg-blue-500 text-white p-2 rounded">
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="flex p-4 bg-white">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded"
        />
        <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
