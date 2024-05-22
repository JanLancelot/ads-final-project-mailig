import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import styles from './ChatWindow.module.css';

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const db = getDatabase();

  useEffect(() => {
    const messagesRef = ref(db, 'messages');
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      setMessages(data ? Object.values(data) : []);
    });
  }, [db]);

  return (
    <div className={styles.chatWindow}>
      <h2 className="text-lg font-semibold mb-2">Chat</h2>
      <div className={styles.chatMessages}>
        {messages.map((message, index) => (
          <div key={index} className="mb-2">
            <span className="font-semibold">{message.name}:</span> {message.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatWindow;